import { ObjectId } from "mongodb";
import config from "../../config/config";



//sslcommerz init

const createPayment = (payload: any) => {
    const tran_id = new ObjectId().toString()
    const data = {
        total_amount: payload.price,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${config.base_url}/success`,
        fail_url: `${config.base_url}/fail`,
        cancel_url: `${config.base_url}/cancel`,
        ipn_url: `${config.base_url}/ipn`,
        shipping_method: 'Courier',
        product_name:  payload.productId.name,
        product_category: payload.productId.category.name,
        product_profile: payload.productId.image[0],
        cus_name: payload.name,
        cus_email: payload.email,
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: payload.number,
        cus_fax: '01711111111',
        ship_name: payload.name,
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    return data
    
}

export const paymentServices = {
    createPayment
}