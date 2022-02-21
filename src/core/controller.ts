import { StatusCodes } from "http-status-codes";
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { pick } from "lodash";

export class ServerError extends Error {
  public errorCode: StatusCodes;

  constructor(errorCode: StatusCodes, message?: any) {
    super(message || "");
    this.errorCode = errorCode;
  }

  static isServerError = (err: ServerError | Error): err is ServerError =>
    (err as ServerError).errorCode !== undefined;
}

export interface ServerResult<T> {
  statusCode: StatusCodes;
  value: T;
}

export type Controller<Parameters, ReturnValueType> = (
  params: Parameters & { user?: { email: string } }
) => Promise<ServerResult<ReturnValueType>>;

export const controllerWrapper =
  <Parameters, ReturnValueType>(
    controller: Controller<Parameters, ReturnValueType>
  ): RequestHandler =>
  async (req, res, next) => {
    try {
      const valErrors = validationResult(req);
      if (!valErrors.isEmpty())
        throw new ServerError(StatusCodes.BAD_REQUEST, valErrors.array());
      const result = await controller({
        ...pick(req, ["query", "body", "user"]),
        path: req.params,
      } as unknown as Parameters);
      res.status(result.statusCode).json(result.value);
    } catch (error) {
      return next(error);
    }
  };
