import axios from "axios";
import config from "../../config/config";
import {
  SSLInitPayload,
  SSLInitResponse,
  SSLValidationResponse,
} from "../../interface/sslCommerz";

const sslMode =
  (process.env.SSL_MODE as "sandbox" | "live" | undefined) ||
  (config.node_env === "production" ? "live" : "sandbox");

const BASE_URL =
  sslMode === "live"
    ? "https://securepay.sslcommerz.com"
    : "https://sandbox.sslcommerz.com";

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

export class SSLCommerzService {
  mode = sslMode;

  async init(payload: SSLInitPayload): Promise<SSLInitResponse> {
    const data = {
      store_id: config.store_id!,
      store_passwd: config.store_pass!,
      ...payload,
    };

    const body = new URLSearchParams(data as any).toString();

    const res = await api.post("/gwprocess/v4/api.php", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    
    if (res?.data?.status === "FAILED") {
      const reason = res?.data?.failedreason || "SSL init failed";
      throw new Error(reason);
    }

    return res.data;
  }

  async validate(valId: string): Promise<SSLValidationResponse> {
    const params = new URLSearchParams({
      val_id: valId,
      store_id: config.store_id!,
      store_passwd: config.store_pass!,
      format: "json",
    });

    const res = await api.get(
      `/validator/api/validationserverAPI.php?${params.toString()}`
    );
    return res.data;
  }
}

export const sslClient = new SSLCommerzService();
