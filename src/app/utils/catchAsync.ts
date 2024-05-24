import { RequestHandler } from "express";

const catchAsync = (handler: RequestHandler) => {
  return (async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  }) as RequestHandler;
};

export default catchAsync;
