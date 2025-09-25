import { Types } from "mongoose";

export interface TOrderProduct {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  name: string;
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface TOrder extends Document {
  userId: string;
  products: TOrderProduct[];
  shippingAddress: {
    line1: string;
    city: string;
    postcode: string;
    phone: string;
  };
  notes?: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalPayable: number;
  currency: string;
  couponCode?: string;
  transactionId: string;
  gateway: "SSLCommerz";
  status: OrderStatus;
  gatewayPayload?: any;
  redirectUrl?: string;
}
