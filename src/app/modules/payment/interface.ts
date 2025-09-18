import { Types } from "mongoose";

export interface TAddress {
  line1: string;
  city: string;
  postcode: string;
  phone: string;
}

export interface TOrderProduct {
  productId: Types.ObjectId;
  quantity: number;
}

export interface TOrder {
  userId: Types.ObjectId;
  tran_id: string;
  products: TOrderProduct[];
  totalAmount: number;
  shippingFee?: number;
  status:
    | "pending"
    | "paid"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  paymentStatus: "pending" | "success" | "failed" | "refunded";
  shippingAddress: TAddress;
  couponCode?: string;
  trackingNumber?: string;
  notes?: string;
  discount?: number;
  isDeleted: boolean;
}
