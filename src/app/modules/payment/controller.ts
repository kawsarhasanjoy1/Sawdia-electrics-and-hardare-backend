import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import config from "../../config/config";
import { paymentServices } from "./services";
const is_live = false
const SSLCommerzPayment = require('sslcommerz-lts')

const createPaymenController = catchAsync(async (req: Request, res: Response) => {
    const result = paymentServices.createPayment(req.body)
    const sslcz = new SSLCommerzPayment(config.store_id, config.store_pass, is_live)
    sslcz.init(result).then((apiResponse: any) => {
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.redirect(GatewayPageURL)
        console.log('Redirecting to: ', GatewayPageURL)
    });
})