import { ObjectId } from "mongodb";
import config from "../../config/config";
import QueryBuilders from "../../builders/queryBuilders";
import { OrderModel } from "./model";
import { StatusCodes } from "http-status-codes";
import { ProductModel } from "../product/model";
import { UserModel } from "../user/model";
import { ReviewModel } from "../review/model";
import AppError from "../../error/handleAppError";

const createPayment = async (payload: any) => {
  if (!payload.price || isNaN(Number(payload.price))) {
    throw new Error("Invalid or missing price");
  }

  if (!payload.address) {
    throw new Error("Shipping address is required");
  }

  const tranId = payload.tran_id || new ObjectId().toString();

  const data = {
    total_amount: Number(payload.price),
    currency: "BDT",
    tran_id: tranId,
    success_url: `${config.frontend_url}/success/${tranId}`,
    fail_url: `${config.frontend_url}/fail/${tranId}`,
    cancel_url: `${config.frontend_url}/cancel/${tranId}`,
    ipn_url: `${config.base_url}/ipn`,

    shipping_method: "Courier",
    product_name: payload.productName || "Product",
    product_category: payload.productCategory || "General",
    product_profile: "general",

    cus_name: payload.name,
    cus_email: payload.email,
    cus_add1: payload.address.line1,
    cus_add2: payload.address.line2 || "",
    cus_city: payload.address.city || "Dhaka",
    cus_state: payload.address.state || "Dhaka",
    cus_postcode: payload.address.postcode || "1000",
    cus_country: payload.address.country || "Bangladesh",
    cus_phone: payload.address.phone,
    cus_fax: "N/A",

    ship_name: payload.name,
    ship_add1: payload.address.line1,
    ship_add2: payload.address.line2 || "",
    ship_city: payload.address.city || "Dhaka",
    ship_state: payload.address.state || "Dhaka",
    ship_postcode: payload.address.postcode || "1000",
    ship_country: payload.address.country || "Bangladesh",
  };

  return data;
};

const getPayments = async (query: Record<string, any>) => {
  const searchTerm = ["name", "category"];
  const searchQuery = new QueryBuilders(
    OrderModel.find().populate("userId").populate("products.productId"),
    query
  )
    .search(searchTerm)
    .filter()
    .sort()
    .pagination();
  const result = await searchQuery.QueryModel;
  return result;
};
const getUserPayments = async ({ id, query }: any) => {
  const searchTerm = ["name", "number", "category"];
  const searchQuery = new QueryBuilders(OrderModel.find({ userId: id }), query)
    .search(searchTerm)
    .filter()
    .pagination()
    .sort();
  const result = await searchQuery.QueryModel.populate("userId").populate(
    "products.productId"
  );

  return result;
};

const updateOrderStatus = async (status: any, transectionId: string) => {
  console.log(status);
  const order = await OrderModel.findOne({ tran_id: transectionId });
  if (!order) throw new AppError(StatusCodes.NOT_FOUND, "Order not found");

  if (order?.status == "pending" && status !== "paid") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cannot it an without pending to paid order"
    );
  }
  if (order?.status == "paid" && status !== "shipped") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cannot it an without paid to shipped order"
    );
  }
  if (order?.status == "shipped" && status !== "delivered") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cannot it an without shipped to delivered order"
    );
  }

  
  order.status = status;
  await order.save();
};

const getStats = async () => {
  const revenue = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);
  const totalOrder = await OrderModel.countDocuments();
  const totalProduct = await ProductModel.countDocuments();
  const totalUser = await UserModel.countDocuments();
  const totalReview = await ReviewModel.countDocuments();
  return {
    totalOrder,
    revenue,
    totalProduct,
    totalUser,
    totalReview,
  };
};

const weeklySale = async () => {
  const now = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(now.getFullYear() - 1);

  const monthlySales = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: lastYear, $lte: now },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $dateToString: { format: "%b", date: "$createdAt" } },
          monthNumber: { $month: "$createdAt" },
        },
        totalSales: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.monthNumber": 1 },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalSales: 1,
        orderCount: 1,
      },
    },
  ]);
  return monthlySales;
};

export const paymentServices = {
  createPayment,
  getPayments,
  getUserPayments,
  updateOrderStatus,
  getStats,
  weeklySale,
};
