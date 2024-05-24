import express, { Application, RequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// Application routes
app.use("/api", router);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running.",
    data: null,
  });
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found route
app.use(((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API not found!",
    errorDetails: {
      path: req.originalUrl,
      message: "Your requested path is not found.",
    },
  });
}) as RequestHandler);

export default app;
