import { RequestHandler } from "express";
import { AnyZodObject } from "zod";

const validateRequest = (schema: AnyZodObject) =>
  (async (req, res, next) => {
    try {
      const parse = await schema.parseAsync(req.body);
      req.body = parse;

      next();
    } catch (err) {
      next(err);
    }
  }) as RequestHandler;

export default validateRequest;
