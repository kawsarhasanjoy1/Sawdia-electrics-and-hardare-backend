export interface TCoupon {
  code: string;
  discountType: "percentage";
  amount: number;
  expiryDate: Date;
  minPurchase: number;
  isActive: boolean;
}