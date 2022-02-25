import { StatusCodes } from "http-status-codes";

import { operations } from "types/swagger";
import { Controller, ServerError } from "./utils";
import { NotesService } from "service/notes";

const getNotesController: Controller<operations["getNotes"]> = async ({
  query: { cursor, labelId, limit },
  user,
}) => {
  if (!user) throw new ServerError(StatusCodes.UNAUTHORIZED, "");
  const result = await NotesService.getNotes({
    userId: user._id,
    labelId,
    cursor,
    limit,
  });
  if (result.isErr()) {
    switch (result.error.errType) {
      case "UNAUTHORIZED_USER":
        throw new ServerError(StatusCodes.UNAUTHORIZED, "");
      default:
        break;
    }
  }
  // TODO: fix result types
  return { statusCode: StatusCodes.OK, value: result.value };
};

export class NotesController {
  static getNotes = getNotesController;
}
