import { some, omit } from "lodash";

import { definitions } from "types/swagger";
import { ServiceResult } from "./utils";
import { err, ok } from "core/result";
import { Label } from "database/models";
import Note, { NoteDocument } from "database/models/notes";

type GetNotesServiceParams = {
  userId: string;
  labelId?: string;
  cursor?: string;
  limit?: number;
};

type GetNotesServiceOut = {
  notes: definitions["Note"][];
  cursor?: string;
  hasMore: boolean;
};

const notesMapper = (note: NoteDocument): definitions["Note"] => {
  const noteJSON = note.toJSON();
  return {
    ...omit(noteJSON, ["_id", "__v"]),
    user: noteJSON.user.toString(),
    labels: noteJSON.labels.map((labelObjectId) => labelObjectId.toString()),
  };
};

const getNotesService = async ({
  userId,
  labelId,
  cursor,
  limit,
}: GetNotesServiceParams): Promise<
  ServiceResult<GetNotesServiceOut, "UNAUTHORIZED_USER">
> => {
  if (!labelId) {
    const userLabels = await Label.findUserLabels(userId);
    if (!some(userLabels, (userLabel) => userLabel._id.toString() === labelId))
      return err({
        errType: "UNAUTHORIZED_USER",
        error: new Error(
          `user not authorized to request notes for label with id: ${labelId}`
        ),
      });
  }
  const {
    data,
    hasMore,
    cursor: newCursor,
  } = await Note.findNotes({
    labelId,
    userId,
    cursor,
    limit,
  });

  return ok({ hasMore, cursor: newCursor, notes: data.map(notesMapper) });
};

export class NotesService {
  static getNotes = getNotesService;
}
