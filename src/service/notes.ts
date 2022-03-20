import { some, omit, isEmpty } from "lodash";
import { Error } from "mongoose";

import { definitions } from "types/swagger";
import { Mapper, ServiceResult } from "./utils";
import { err, ok } from "core/result";
import { Label } from "database/models";
import Note, { NoteDocument } from "database/models/notes";
import { upsertService } from "./common";

type GetNotesServiceParams = {
  userId: string;
  labelId?: string;
  cursor?: string;
  limit?: number;
  archived?: boolean;
};

type GetNotesServiceOut = {
  data: definitions["Note"][];
  cursor?: string;
  hasMore: boolean;
};

export const notesMapper: Mapper<NoteDocument, definitions["Note"]> = (
  note
) => {
  const noteJSON = note.toJSON();
  return {
    ...omit(noteJSON, ["_id", "__v", "user", "empty"]),
    labels: noteJSON.labels.map((labelObjectId) => labelObjectId.toString()),
  };
};

const getNotesService = async (
  getNotesParams: GetNotesServiceParams
): Promise<ServiceResult<GetNotesServiceOut, "LABEL_NOT_FOUND">> => {
  const { labelId, userId } = getNotesParams;
  if (labelId) {
    const userLabels = await Label.findUserLabels(userId);
    if (!some(userLabels, (userLabel) => userLabel._id.toString() === labelId))
      return err({
        errType: "LABEL_NOT_FOUND",
        error: new Error(
          `label "${labelId}" doesn't belong to user "${userId}"`
        ),
      });
  }
  const {
    data,
    hasMore,
    cursor: newCursor,
  } = await Note.findNotes(getNotesParams);

  return ok({ hasMore, cursor: newCursor, data: data.map(notesMapper) });
};

export class NotesService {
  static getNotes = getNotesService;
  static upsertNote = upsertService(Note, notesMapper);
}
