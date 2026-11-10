import type {  NextFunction,  Request,  Response } from 'express';
import AppError from '../utils/AppError.js';
import type { ZodType } from 'zod';

const validate = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const error = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }));
      return next(  new AppError(400, "Validation failed", error));
    }
    req.body = result.data;
    next();
  }
};


export default validate;

// import { Request, Response, NextFunction } from "express";
// import { ZodTypeAny } from "zod";

// // Define a structural interface for the schemas you want to pass in
// interface RequestValidationSchemas {
//   body?: ZodTypeAny;
//   query?: ZodTypeAny;
//   params?: ZodTypeAny;
// }

// export const validate = (schemas: RequestValidationSchemas) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const errors: { field: string; message: string }[] = [];

//     // 1. Validate Request Body
//     if (schemas.body) {
//       const result = schemas.body.safeParse(req.body);
//       if (!result.success) {
//         errors.push(...result.error.issues.map(issue => ({
//           field: `body.${issue.path.join(".")}`,
//           message: issue.message
//         })));
//       } else {
//         req.body = result.data; // Assign stripped/typed data
//       }
//     }

//     // 2. Validate Query Parameters
//     if (schemas.query) {
//       const result = schemas.query.safeParse(req.query);
//       if (!result.success) {
//         errors.push(...result.error.issues.map(issue => ({
//           field: `query.${issue.path.join(".")}`,
//           message: issue.message
//         })));
//       } else {
//         req.query = result.data;
//       }
//     }

//     // 3. Validate URL Route Parameters
//     if (schemas.params) {
//       const result = schemas.params.safeParse(req.params);
//       if (!result.success) {
//         errors.push(...result.error.issues.map(issue => ({
//           field: `params.${issue.path.join(".")}`,
//           message: issue.message
//         })));
//       } else {
//         req.params = result.data as any;
//       }
//     }

//     // If any validation failed, send all collected errors to your global error handler
//     if (errors.length > 0) {
//       return next(new AppError(400, "Validation failed", errors));
//     }

//     next();
//   };
// };
