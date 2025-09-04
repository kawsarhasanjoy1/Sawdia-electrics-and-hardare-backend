import { ObjectId } from "mongodb";
import config from "../../config/config";
import QueryBuilders from "../../builders/queryBuilders";
import { OrderModel } from "./model";

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
        success_url: `${config.base_url}/success/payment/${tranId}`,
        fail_url: `${config.base_url}/fail/payment/${tranId}`,
        cancel_url: `${config.base_url}/cancel/payment/${tranId}`,
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
    const searchQuery = new QueryBuilders(OrderModel.find(), query)
        .search(searchTerm)
        .filter()
        .sort()
        .pagination();
    const result = await searchQuery.QueryModel.populate("productId").populate(
        "userId"
    );
    return result;
};
const getUserPayments = async ({ id, query }: any) => {
    const searchTerm = ['name', 'number', 'category']
    const searchQuery = new QueryBuilders(OrderModel.find({ userId: id }), query).search(searchTerm).filter().pagination().sort();
    const result = await searchQuery.QueryModel.populate("userId").populate(
        "products.productId"
    );


    return result;
};


export const paymentServices = {
    createPayment,
    getPayments,
    getUserPayments,
};
