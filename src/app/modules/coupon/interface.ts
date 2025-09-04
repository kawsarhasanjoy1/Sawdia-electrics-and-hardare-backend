export interface TCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  amount: number;
  expiryDate: Date;
  minPurchase: number;
  isActive: boolean;
}