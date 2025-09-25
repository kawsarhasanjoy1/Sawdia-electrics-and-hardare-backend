// src/interface/sslCommerz.ts
export type SSLInitPayload = {
  total_amount: number;
  currency: "BDT";
  tran_id: string;

  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url?: string;

  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_city: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
  ship_name?: string;
  ship_add1: string;
  ship_city: string;
  ship_postcode: number | string;
  ship_country: "Bangladesh";
  shipping_method: "YES" | "NO";
  product_name: string;
  product_category: string;
  product_profile:
    | "general"
    | "physical-goods"
    | "non-physical-goods"
    | "airline-tickets"
    | "travel-vertical"
    | "telecom-vertical";

  emi_option?: 0 | 1;
};

export type SSLInitResponse = {
  status: "SUCCESS" | "FAILED";
  failedreason?: string;
  GatewayPageURL?: string;
  sessionkey?: string;
  [k: string]: any;
};

export type SSLValidationResponse = {
  status: "VALID" | "VALIDATED" | "FAILED";
  bank_tran_id?: string;
  tran_id: string;
  val_id: string;
  amount: string | number;
  card_type?: string;
  currency?: string;
  [k: string]: any;
};

export type InitPaymentDTO = {
  userId: string;
  items: { sku: string; name: string; qty: number; price: number }[];
  amount: number;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postcode: string;
    country?: string;
    phone: string;
  };
};
