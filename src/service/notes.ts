import { some, omit, isEmpty } from "lodash";
import { Error } from "mongoose";

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
  ServiceResult<GetNotesServiceOut, "LABEL_NOT_FOUND">
> => {
  if (!labelId) {
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
  } = await Note.findNotes({
    labelId,
    userId,
    cursor,
    limit,
  });

  return ok({ hasMore, cursor: newCursor, notes: data.map(notesMapper) });
};

const upsertNoteService = async (
  noteFields: definitions["Note"]
): Promise<
  ServiceResult<
    definitions["Note"],
    "EMPTY_NOTE" | "VALIDATION_ERROR" | "NOTE_NOT_FOUND"
  >
> => {
  if (isEmpty(noteFields))
    return err({ errType: "EMPTY_NOTE", error: new Error("empty note") });
  try {
    let note: NoteDocument | null;
    if (noteFields.id) {
      note = await Note.findByIdAndUpdate(noteFields.id, noteFields);
      if (!note)
        return err({
          errType: "NOTE_NOT_FOUND",
          error: new Error(`note "${noteFields.id}" not found`),
        });
    } else {
      note = await Note.create(noteFields);
    }
    return ok(notesMapper(note));
  } catch (error) {
    if (error instanceof Error.ValidationError)
      return err({ errType: "VALIDATION_ERROR", error });
    throw error;
  }
};

export class NotesService {
  static getNotes = getNotesService;
  static upsertNote = upsertNoteService;
}
