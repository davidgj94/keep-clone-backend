import { StatusCodes } from "http-status-codes";
import { ErrorRequestHandler, RequestHandler } from "express";

import { ServerError } from "core/controller";

export const errorHandler: ErrorRequestHandler = (err: Error, req, res, _) => {
  res
    .status((err as ServerError).errorCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json(err.message);
  // tslint:disable-next-line: no-console
  console.log(err);
};

export const notFoundMiddleware: RequestHandler = async (req, res, next) => {
  const err = new ServerError(StatusCodes.NOT_FOUND, `${req.url} not found`);
  next(err);
};
