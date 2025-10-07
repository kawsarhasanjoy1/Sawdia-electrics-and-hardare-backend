import express from "express";
import cors from "cors";
import router from "./app/route/router";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import helmet from "helmet";
import cookieParser from "cookie-parser";
export const app = express();

app.set("trust proxy", 1);
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.disable("x-powered-by");

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/v1", router);

// 404 then error
app.use(notFound);
app.use(globalErrorHandler);
