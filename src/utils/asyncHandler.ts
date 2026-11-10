import type { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

const asyncHandler = (handler: AsyncController): RequestHandler => (req, res, next) => {
  Promise.resolve()
    .then(() => handler(req, res, next))
    .catch(next);
};

export default asyncHandler;
