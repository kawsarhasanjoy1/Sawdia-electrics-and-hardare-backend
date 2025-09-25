import { Request, Response } from "express";
import { z } from "zod";
import { paymentServices2 } from "./services";
import config from "../../config/config";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const result = await paymentServices2.createPayment({
    ...req.body,
    userId,
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Payment initiated",
    data: result,
  });
});

const paymentSuccess = async (req: Request, res: Response) => {
  const form = Object.keys(req.body || {}).length ? req.body : req.query;
  const redirectBase = config.frontend_url || "";
  const val_id = String(form.val_id || "");
  const tran_id = String(form.tran_id || "");

  if (!val_id || !tran_id) {
    return res.redirect(`${redirectBase}/fail?missing=1`);
  }
  try {
    const result = await paymentServices2.handleSuccess({ val_id, tran_id });

    if (result.status === "PAID") {
      return res.redirect(`${redirectBase}/success/${result.transactionId}`);
    }
    return res.redirect(`${redirectBase}/fail/${result.transactionId}`);
  } catch (e: any) {
    console.log(e);
    const redirectBase = config.frontend_url || "";
    return res.redirect(`${redirectBase}/fail`);
  }
};

const paymentFail = async (req: Request, res: Response) => {
  const result = await paymentServices2.handleFail(req.body);
  const redirectBase = config.frontend_url || "";
  return res.redirect(`${redirectBase}/fail/${result.transactionId}`);
};

const paymentCancel = async (req: Request, res: Response) => {
  const result = await paymentServices2.handleCancel(req.body);
  const redirectBase = config.frontend_url || "";
  return res.redirect(`${redirectBase}/cancel/${result.transactionId}`);
};

const paymentIpn = async (req: Request, res: Response) => {
  try {
    await paymentServices2.handleIPN(req.body);
    return res.status(200).send("IPN processed");
  } catch (e: any) {
    return res.status(500).send("IPN error");
  }
};

const getPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await paymentServices2.getPayment(query);
  sendResponse(res, {
    success: true,
    message: "payment fetched successful",
    statusCode: StatusCodes.OK,
    data: result,
  });
});
const getUserPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const {userId} = req.user;
  const result = await paymentServices2.getUserPayments({userId, query});
  sendResponse(res, {
    success: true,
    message: "payment fetched successful",
    statusCode: StatusCodes.OK,
    data: result,
  });
});
const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await paymentServices2.updatePaymentStatus(status, id);

  sendResponse(res, {
    statusCode: 200,
    message: "payment status updated successfully",
    data: result,
    success: true,
  });
});

export const paymentController2 = {
  createPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIpn,
  getPayment,
  updatePaymentStatus,
  getUserPayment,
};
