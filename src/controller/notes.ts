import { StatusCodes } from "http-status-codes";

import { operations } from "types/swagger";
import { Controller, ServerError } from "./utils";
import { NotesService } from "service/notes";
import { omit } from "lodash";

const getNotesController: Controller<operations["getNotes"]> = async ({
  query: queryFields,
  user,
}) => {
  if (!user) throw new ServerError(StatusCodes.UNAUTHORIZED);
  const result = await NotesService.getNotes({
    userId: user._id,
    ...queryFields,
  });
  if (result.isErr()) {
    const { errType, error } = result.error;
    switch (errType) {
      case "LABEL_NOT_FOUND":
        throw new ServerError(StatusCodes.NOT_FOUND, error.message);
      default:
        throw error;
    }
  }

  return { statusCode: StatusCodes.OK, value: result.value };
};

const createNoteController: Controller<operations["createNote"]> = async ({
  body: noteFields,
  user,
}) => {
  if (!user) throw new ServerError(StatusCodes.UNAUTHORIZED);
  const result = await NotesService.upsertNote({
    ...omit(noteFields, ["id"]),
    user: user._id,
  });
  if (result.isErr()) {
    const { errType, error } = result.error;
    switch (errType) {
      case "EMPTY_FIELDS":
      case "VALIDATION_ERROR":
        throw new ServerError(StatusCodes.BAD_REQUEST, error.message);
      default:
        throw error;
    }
  }
  return { statusCode: StatusCodes.CREATED, value: result.value };
};

const modifyNoteController: Controller<operations["modifyNote"]> = async ({
  body: noteFields,
  path: { noteId },
  user,
}) => {
  if (!user) throw new ServerError(StatusCodes.UNAUTHORIZED);
  const result = await NotesService.upsertNote({
    ...noteFields,
    id: noteId,
    user: user._id,
  });
  if (result.isErr()) {
    const { errType, error } = result.error;
    switch (errType) {
      case "EMPTY_FIELDS":
      case "VALIDATION_ERROR":
        throw new ServerError(StatusCodes.BAD_REQUEST, error.message);
      case "NOT_FOUND":
        throw new ServerError(StatusCodes.NOT_FOUND, error.message);
      default:
        throw error;
    }
  }

  return { statusCode: StatusCodes.CREATED, value: result.value };
};

export class NotesController {
  static getNotes = getNotesController;
  static createNote = createNoteController;
  static modifyNote = modifyNoteController;
}
