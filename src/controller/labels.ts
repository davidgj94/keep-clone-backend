import { StatusCodes } from "http-status-codes";

import { operations } from "types/swagger";
import { Controller } from "./utils";

export const createLabelController: Controller<
  operations["createLabel"]
> = async ({ body, user }) => ({
  statusCode: 200,
  value: { _id: "", name: "" },
});
