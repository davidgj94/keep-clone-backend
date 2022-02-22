import { StatusCodes } from "http-status-codes";
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { pick } from "lodash";
import { Extract, ValueOf } from "core/types";

export class ServerError extends Error {
  public errorCode: StatusCodes;

  constructor(errorCode: StatusCodes, message?: any) {
    super(message || "");
    this.errorCode = errorCode;
  }

  static isServerError = (err: ServerError | Error): err is ServerError =>
    (err as ServerError).errorCode !== undefined;
}

export interface ServerResult<T, U> {
  statusCode: T;
  value: U;
}

type OperationParameters<Operation> = Extract<Operation, "parameters">;

type OperationResponses<Operation> = ValueOf<{
  [statusCode in keyof Extract<Operation, "responses">]: ServerResult<
    statusCode,
    Extract<Extract<Operation, "responses">[statusCode], "schema">
  >;
}>;

export type Controller<Operation> = (
  params: OperationParameters<Operation> & { user?: { _id: string } }
) => Promise<OperationResponses<Operation>>;

export const controllerWrapper =
  <Operation>(controller: Controller<Operation>): RequestHandler =>
  async (req, res, next) => {
    try {
      const valErrors = validationResult(req);
      if (!valErrors.isEmpty())
        throw new ServerError(StatusCodes.BAD_REQUEST, valErrors.array());
      const result = await controller({
        ...pick(req, ["query", "body", "user"]),
        path: req.params,
      } as unknown as OperationParameters<Operation>);
      return res.status(result.statusCode as StatusCodes).json(result.value);
    } catch (error) {
      return next(error);
    }
  };
