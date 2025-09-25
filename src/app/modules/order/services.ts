import { startOfMonth, subMonths } from "date-fns";
import { ProductModel } from "../product/model";
import { ReviewModel } from "../review/model";
import { UserModel } from "../user/model";
import { OrderModel } from "./model";
import { Types } from "mongoose";
import QueryBuilders from "../../builders/queryBuilders";
import { StatusCodes } from "http-status-codes";
import AppError from "../../error/handleAppError";

const getOrder = async (query: any) => {
  const searchQuery = new QueryBuilders(
    OrderModel.find().populate("userId").populate("products.productId"),
    query
  )
    .search(["name"])
    .filter()
    .pagination()
    .sort();
  const data = await searchQuery.QueryModel;
  const meta = await searchQuery.countTotal();
  return { data, meta };
};

const getUserOrder = async ({ id, query }: any) => {
  const searchTerm = ["name", "number", "category"];
  const searchQuery = new QueryBuilders(
    OrderModel.find({ userId: id })
      .populate("userId")
      .populate("products.productId"),
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

const getStats = async () => {
  const revenue = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$subtotal" },
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

const monthlySale = async () => {
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
        totalSales: { $sum: "$subtotal" },
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

const getUserStats = async (userId: string) => {
  const revenueResult = await OrderModel.aggregate([
    {
      $match: { userId },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$subtotal" },
      },
    },
  ]);
  const revenue = revenueResult[0]?.totalRevenue || 0;
  const totalOrder = await OrderModel.countDocuments({ userId });

  const orders = await OrderModel.find({ userId });
  const totalProduct = orders?.reduce((sum, order) => {
    const orderProductCount = order.products?.reduce(
      (pSum, p) => pSum + (p.quantity || 1),
      0
    );
    return sum + orderProductCount;
  }, 0);

  const totalReview = await ReviewModel.countDocuments({ userId });

  return {
    totalOrder,
    revenue,
    totalProduct,
    totalReview,
  };
};

const getUserYearlyBuy = async (userId: string) => {
  const startDate = startOfMonth(subMonths(new Date(), 11));

  const stats = await OrderModel.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalAmount: { $sum: "$subtotal" },
        totalOrders: { $sum: 1 },
        totalProducts: { $sum: { $sum: "$products.quantity" } },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const result: {
    month: string;
    totalAmount: number;
    totalOrders: number;
    totalProducts: number;
  }[] = [];

  for (let i = 0; i < 12; i++) {
    const d = subMonths(new Date(), 11 - i);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    const found = stats.find(
      (s) => s._id.year === year && s._id.month === month
    );

    result.push({
      month: `${monthNames[month - 1]} ${year}`,
      totalAmount: found?.totalAmount || 0,
      totalOrders: found?.totalOrders || 0,
      totalProducts: found?.totalProducts || 0,
    });
  }

  return result;
};

const updateOrderStatus = async (status: string, id: string) => {
  const order = await OrderModel.findOne({ transactionId: id });
  if (!order) throw new AppError(StatusCodes.NOT_FOUND, "Order not found");

  const current = order?.status;

  const transitions: Record<string, string[]> = {
    PENDING: ["PAID", "FAILED", "CANCELLED"],
    PAID: ["REFUNDED"],
    FAILED: [],
    CANCELLED: [],
    REFUNDED: [],
  };

  if (!transitions[current]?.includes(status)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Invalid status change: ${current} → ${status}`
    );
  }

  order.status = status as any;
  await order.save();

  return order;
};

export const orderServices = {
  getOrder,
  getUserOrder,
  getStats,
  monthlySale,
  getUserStats,
  getUserYearlyBuy,
  updateOrderStatus,
};
