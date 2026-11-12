import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import AppError from "../utils/AppError.js";

type RequestSource = 'body' | 'params' | 'query';

const validate = (schema: ZodType, source: RequestSource = 'body'):RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const error = result.error.issues.map((issue) => ({
        field: [source,...issue.path].join("."),
        message: issue.message
      }));
      return next(new AppError(400,"Validation failed",error))
    }

    if (source === 'body') {
      req.body=result.data
    } else {
      Object.assign(req[source], result.data);
    }
    return next();
  }
}
export default validate;
