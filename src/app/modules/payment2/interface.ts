export type PaymentStatus = 'INITIATED' | 'VALID' | 'FAILED' | 'CANCELLED';

export interface TPayment {
  transactionId: string;
  valId?: string;
  bankTranId?: string;
  amount: number;
  currency: 'BDT';
  status: PaymentStatus;
  rawInit?: any;
  rawIpn?: any;
  rawValidation?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
