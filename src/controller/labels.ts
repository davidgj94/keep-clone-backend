import { StatusCodes } from "http-status-codes";
import { omit } from "lodash";

import { operations } from "types/swagger";
import { Controller, ServerError } from "./utils";
import { LabelService } from "service/labels";

export const findLabelsController: Controller<
  operations["getLabels"]
> = async ({ user }) => {
  if (!user) throw new ServerError(StatusCodes.UNAUTHORIZED);
  const result = await LabelService.listLabels(user._id);
  if (result.isErr()) throw result.error.error;
  return { statusCode: StatusCodes.OK, value: { data: result.value } };
};

export const createLabelController: Controller<
  operations["createLabel"]
> = async ({ body: labelFields, user }) => {
  if (!user) throw new ServerError(StatusCodes.UNAUTHORIZED);
  const result = await LabelService.upsertLabel({
    ...omit(labelFields, "id"),
    user: user._id,
  });
  if (result.isErr()) {
    const { errType, error } = result.error;
    switch (errType) {
      case "VALIDATION_ERROR":
        throw new ServerError(StatusCodes.BAD_REQUEST, error?.message);
      default:
        throw error;
    }
  }

  return { statusCode: StatusCodes.CREATED, value: result.value };
};

export const modifyLabelController: Controller<
  operations["modifyLabel"]
> = async ({ body: labelFields, path: { labelId }, user }) => {
  if (!user) throw new ServerError(StatusCodes.UNAUTHORIZED);
  const result = await LabelService.upsertLabel({
    ...labelFields,
    id: labelId,
    user: user._id,
  });
  if (result.isErr()) {
    const { errType, error } = result.error;
    switch (errType) {
      case "VALIDATION_ERROR":
        throw new ServerError(StatusCodes.BAD_REQUEST, error?.message || "");
      case "NOT_FOUND":
        throw new ServerError(StatusCodes.NOT_FOUND, error?.message || "");
      default:
        throw error;
    }
  }

  return { statusCode: StatusCodes.CREATED, value: result.value };
};

export const deleteLabelController: Controller<
  operations["deleteLabel"]
> = async ({ path: { labelId }, user }) => {
  if (!user) throw new ServerError(StatusCodes.UNAUTHORIZED);
  const result = await LabelService.deleteLabel(labelId);
  if (result.isErr()) {
    const { errType, error } = result.error;
    switch (errType) {
      case "LABEL_NOT_FOUND":
        throw new ServerError(StatusCodes.NOT_FOUND, "Label not found");
      default:
        throw error;
    }
  }
  return { statusCode: StatusCodes.OK, value: result.value };
};

export class LabelController {
  static findLabels = findLabelsController;
  static createLabel = createLabelController;
  static modifyLabel = modifyLabelController;
  static deleteLabel = deleteLabelController;
}
