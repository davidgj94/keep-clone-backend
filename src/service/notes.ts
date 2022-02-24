import { Types } from "mongoose";

import { ServiceResult } from "./utils";
import { err, ok } from "core/result";
import { Label } from "database/models";
import Note, { INote } from "database/models/notes";
import { some } from "lodash";

type GetNotesServiceParams = {
  userId: string;
  labelId?: string;
  cursor: string;
  limit?: number;
};

export const getNotesService = async ({
  userId,
  labelId,
  cursor,
  limit,
}: GetNotesServiceParams): Promise<
  ServiceResult<INote[], "UNAUTHORIZED_USER">
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
  return ok(await Note.findNotes({ labelId, userId, cursor, limit }));
};
