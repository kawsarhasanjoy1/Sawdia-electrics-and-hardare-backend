import { StatusCodes } from "http-status-codes";
import config from "../../config/config";
import { InitPaymentDTO } from "../../interface/sslCommerz";
import { OrderModel } from "../order/model";
import { sslClient } from "../sslCommerz/services";
import { UserModel } from "../user/model";
import { PaymentModel } from "./model";
import { couponServices } from "../coupon/services";
import { ProductModel } from "../product/model";
import AppError from "../../error/handleAppError";
import mongoose from "mongoose";
import QueryBuilders from "../../builders/queryBuilders";

const trimSlash = (s?: string) => (s ? s.replace(/\/$/, "") : "");
const createPayment = async (payload: any) => {
  console.log(payload)
  const { userId } = payload;
  const transactionId = `txn_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const user = await UserModel.findById(userId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  if (
    !payload.products ||
    !Array.isArray(payload.products) ||
    payload.products.length === 0
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Products are required");
  }

  let subtotal = 0;
  const orderProducts: any[] = [];

  for (const item of payload.products) {
    const product = await ProductModel.findById(item.productId).lean();
    if (!product) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        `Product not found: ${item.productId}`
      );
    }
    if (product.stock < item.quantity) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `${product.name} has only ${product.stock} items left`
      );
    }

    const unitPrice = Number(product.price) || 0;
    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;

    orderProducts.push({
      productId: item?.productId,
      name: item?.name,
      price: item?.price,
      quantity: item.quantity,
      variants: item?.variants
    });
  }

  let discount = 0;
  if (payload?.couponCode) {
    const couponResult = await couponServices.applyCoupon(
      payload.couponCode,
      subtotal
    );
    discount = couponResult.discount;
  }

  const shippingFee = 100;
  const totalPayable = Math.max(0, subtotal - discount + shippingFee);

  const session = await mongoose.startSession();
  let orderId: mongoose.Types.ObjectId | undefined;

  try {
    session.startTransaction();

    // Order create
    const orderDoc = await OrderModel.create(
      [
        {
          userId,
          products: orderProducts,
          shippingAddress: payload.shippingAddress,
          notes: payload.notes,
          subtotal,
          shippingFee,
          discount,
          totalPayable,
          currency: "BDT",
          couponCode: payload.couponCode,
          transactionId,
          gateway: "SSLCommerz",
          status: "PENDING",
        },
      ],
      { session }
    );
    const order = orderDoc[0];
    orderId = order._id;

    await PaymentModel.create(
      [
        {
          transactionId,
          orderId: order._id,
          userId,
          amount: totalPayable,
          currency: "BDT",
          status: "INITIATED",
        },
      ],
      { session }
    );

    for (const p of payload.products) {
      await ProductModel.updateOne(
        { _id: p.productId },
        { $inc: { stock: -p.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  const base = trimSlash(config.base_url)!;
  const success_url = `${base}/api/v1/Payment/success`;
  const fail_url = `${base}/api/v1/Payment/fail`;
  const cancel_url = `${base}/api/v1/Payment/cancel`;
  const ipn_url = `${base}/api/v1/Payment/ipn`;

  const cus_phone =
    (payload.shippingAddress?.phone || "").replace(/\D/g, "").slice(-15) ||
    "0000000000";

  const initRes = await sslClient.init({
    total_amount: totalPayable,
    currency: "BDT",
    tran_id: transactionId,
    success_url,
    fail_url,
    cancel_url,
    ipn_url,

    product_name: "Cart Payment",
    product_category: "General",
    product_profile: "general",
    shipping_method: "YES",

    cus_name: user.name,
    cus_email: user.email,
    cus_add1: payload.shippingAddress.line1,
    cus_city: payload.shippingAddress.city,
    cus_postcode: payload.shippingAddress.postcode,
    cus_country: "Bangladesh",
    cus_phone,

    ship_name: user?.name || "N/A",
    ship_add1: payload.shippingAddress.line1,
    ship_city: payload.shippingAddress.city,
    ship_postcode: payload.shippingAddress.postcode,
    ship_country: "Bangladesh",
    emi_option: 0,
  });

  if (!initRes?.GatewayPageURL) {
    // compensation updates
    await OrderModel.updateOne(
      { transactionId },
      {
        $set: {
          status: "FAILED",
          gatewayPayload: { initError: initRes || null },
        },
      }
    );
    await PaymentModel.updateOne(
      { transactionId },
      { $set: { status: "FAILED", rawInit: initRes || null } }
    );
    throw new Error(
      initRes?.failedreason || "Failed to get GatewayPageURL from SSLCommerz."
    );
  }

  // Save gateway snapshots after init
  await PaymentModel.updateOne(
    { transactionId },
    { $set: { rawInit: initRes } }
  );
  await OrderModel.updateOne(
    { transactionId },
    {
      $set: {
        redirectUrl: initRes.GatewayPageURL,
        gatewayPayload: { initRes },
      },
    }
  );

  return {
    transactionId,
    redirectUrl: initRes.GatewayPageURL,
    mode: sslClient.mode,
    orderId,
  };
};
const handleSuccess = async (formBody: any) => {
  const { val_id, tran_id } = formBody || {};
  console.log("tran_id,val_id", tran_id, val_id);

  const validation = await sslClient.validate(val_id);
  if (String(validation.status).toUpperCase() === "VALID") {
    await OrderModel.updateOne(
      { transactionId: tran_id },
      { $set: { status: "PAID" } }
    );
    await PaymentModel.updateOne(
      { transactionId: tran_id },
      {
        $set: {
          status: "VALID",
          valId: val_id,
          bankTranId: validation.bank_tran_id,
          rawValidation: validation,
        },
      }
    );
    return { status: "PAID", transactionId: tran_id };
  }

  await OrderModel.updateOne(
    { transactionId: tran_id },
    { $set: { status: "FAILED" } }
  );
  await PaymentModel.updateOne(
    { transactionId: tran_id },
    { $set: { status: "FAILED", valId: val_id, rawValidation: validation } }
  );
  return { status: "FAILED", transactionId: tran_id };
};

const handleFail = async (formBody: any) => {
  const { tran_id } = formBody || {};
  if (!tran_id) throw new Error("Missing tran_id");

  await OrderModel.updateOne(
    { transactionId: tran_id },
    { $set: { status: "FAILED" } }
  );
  await PaymentModel.updateOne(
    { transactionId: tran_id },
    { $set: { status: "FAILED", rawIpn: formBody } }
  );
  return { status: "FAILED", transactionId: tran_id };
};

const handleCancel = async (formBody: any) => {
  const { tran_id } = formBody || {};
  if (!tran_id) throw new Error("Missing tran_id");

  await OrderModel.updateOne(
    { transactionId: tran_id },
    { $set: { status: "CANCELLED" } }
  );
  await PaymentModel.updateOne(
    { transactionId: tran_id },
    { $set: { status: "CANCELLED", rawIpn: formBody } }
  );
  return { status: "CANCELLED", transactionId: tran_id };
};

const handleIPN = async (formBody: any) => {
  const transactionId = formBody?.tran_id as string | undefined;
  if (!transactionId) throw new Error("Missing tran_id");

  await PaymentModel.updateOne(
    { transactionId },
    { $set: { rawIpn: formBody } },
    { upsert: true }
  );

  if (formBody?.val_id) {
    const validation = await sslClient.validate(formBody.val_id);
    const status = String(validation.status).toUpperCase();

    await PaymentModel.updateOne(
      { transactionId },
      { $set: { valId: formBody.val_id, rawValidation: validation } }
    );

    if (status === "VALID") {
      await OrderModel.updateOne(
        { transactionId },
        { $set: { status: "PAID" } }
      );
      await PaymentModel.updateOne(
        { transactionId },
        { $set: { status: "VALID", bankTranId: validation.bank_tran_id } }
      );
      return {
        status: "PAID",
        transactionId,
        bankTranId: validation.bank_tran_id,
      };
    } else {
      await OrderModel.updateOne(
        { transactionId },
        { $set: { status: "FAILED" } }
      );
      await PaymentModel.updateOne(
        { transactionId },
        { $set: { status: "FAILED" } }
      );
      return { status: "FAILED", transactionId };
    }
  } else {
    // No val_id: treat as failed
    await OrderModel.updateOne(
      { transactionId },
      { $set: { status: "FAILED" } }
    );
    await PaymentModel.updateOne(
      { transactionId },
      { $set: { status: "FAILED" } }
    );
    return { status: "FAILED", transactionId };
  }
};

const getPayment = async (query: any) => {
  const searchQuery = new QueryBuilders(
    PaymentModel.find().populate("userId").populate("orderId"),
    query
  )
    .search(["name"])
    .filter()
    .pagination()
    .sort();
  const data = await searchQuery.QueryModel;
  const meta = await searchQuery.countTotal();
  return {
    data,
    meta,
  };
};

const getUserPayments = async ({ userId, query }: any) => {
  const searchTerm = ['transactionId'];
  const searchQuery = new QueryBuilders(
    PaymentModel.find({ userId })
      .populate("userId")
      .populate("orderId"),
    query
  )
    .search(searchTerm)
    .filter()
    .pagination()
    .sort();
  const data = await searchQuery.QueryModel;
  const meta = await searchQuery.countTotal();

  return { data, meta };
};

const updatePaymentStatus = async (status: any, id: string) => {
  const payment = await PaymentModel.findOne({ transactionId: id });
  if (!payment) throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  console.log(status);
  if (payment?.status == "INITIATED" && status !== "VALID") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cannot it an without initial to valid payment"
    );
  }

  payment.status = status;
  await payment.save();
};

export const paymentServices2 = {
  createPayment,
  handleSuccess,
  handleFail,
  handleCancel,
  handleIPN,
  getPayment,
  getUserPayments,
  updatePaymentStatus,
};
