import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: Number(process.env.PORT) || (5000 as number),
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
  node_env: process.env.NODE_ENV,
  salt_rounds: process.env.SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  forget_password_link: process.env.FORGET_PASSWORD_LINK,
  app_pass: process.env.APP_PASS,
  app_email: process.env.APP_EMAIL,
  app_port: process.env.APP_PORT,
  host_email: process.env.HOST_EMAIL,
  store_id: process.env.STORE_ID,
  store_pass: process.env.STORE_PASS,
  base_url: process.env.BASE_URL,
  cloud_name: process.env.CLOUD_NAME,
  cloud_api_key: process.env.API_KEY,
  cloud_api_secret: process.env.API_SECRET,
};
