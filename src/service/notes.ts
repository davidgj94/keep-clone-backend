import { Types } from "mongoose";

import { ServiceResult } from "./utils";
import { err } from "core/result";
import { Label } from "database/models";
import Note, { INote } from "database/models/notes";

export const getNotesService = async (
  userId: string,
  labelId?: string,
  cursor?: string,
  limit = 10
): Promise<ServiceResult<INote[], "LABEL_NOT_FOUND">> => {
    if(!labelId) return await Note.findNotes({user: new Types.ObjectId(userId}, )
  const userLabels = await Label.findUserLabels(new Types.ObjectId(userId));
};
