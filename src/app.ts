import express from "express";
import cors from "cors";
import router from "./app/route/router";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { secureApi } from "./app/middleware/secureApi";
export const app = express();

app.use(cookieParser());
app.use(cors({ origin: ["https://sawdia-electronics-and-hardware.vercel.app"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.disable("x-powered-by");
app.use(secureApi);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFound);
