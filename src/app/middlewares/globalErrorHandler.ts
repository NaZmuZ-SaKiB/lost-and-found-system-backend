import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError, ZodIssue } from "zod";
import AppError from "../errors/AppError";
import { Prisma } from "@prisma/client";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = err?.message || "Something went wrong!";

  if (err instanceof ZodError) {
    // Handling Zod Validation Error
    message = err.issues.map((issue: ZodIssue) => issue.message).join(" ");
    statusCode = httpStatus.FORBIDDEN;
  } else if (err instanceof AppError) {
    // Handling Custom App Error
    statusCode = err.statusCode;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handling Prisma Unique Error
    if (err.code === "P2002") {
      statusCode = httpStatus.FORBIDDEN;
      message = `${(err?.meta?.target as any)[0]} of ${
        err?.meta?.modelName
      } must be unique.`;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: err,
  });
};

export default globalErrorHandler;
