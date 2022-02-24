import {
  model,
  Schema,
  Model,
  Document,
  Types,
  SchemaTypes,
  HydratedDocument,
} from "mongoose";
import { validateRef } from "./utils";
import { definitions } from "types/swagger";

export type INote = Omit<definitions["Note"], "_id" | "labels" | "user"> & {
  labels: Types.ObjectId[];
  user: Types.ObjectId;
};

type NoteDocument = HydratedDocument<INote>;

interface NoteModel extends Model<INote, {}, NoteInstanceMethods> {
  findNotes(params: FindNotesParams): Promise<NoteDocument[]>;
}

interface NoteInstanceMethods {}

const NotesSchema = new Schema<INote, NoteModel>({
  content: String,
  title: { type: String, required: true },
  labels: [
    {
      type: Schema.Types.ObjectId,
      ref: "Label",
      validate: validateRef("Label"),
      index: true,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    validate: validateRef("User"),
    index: true,
  },
  archived: { type: Boolean, required: false, default: false },
  binned: { type: Boolean, required: false, default: false },
});

type FindNotesParams = {
  labelId?: string;
  userId: string;
  cursor?: string;
  limit?: number;
};

type FindNotesQuery =
  | {
      user: string;
      _id?: { $gt: string };
    }
  | {
      label: string;
      _id?: { $gt: string };
    };

NotesSchema.statics.findNotes = async function (
  this,
  { labelId: label, userId: user, cursor, limit = 10 }: FindNotesParams
): Promise<NoteDocument[]> {
  let query: FindNotesQuery = label ? { label } : { user };
  if (cursor) query = { ...query, _id: { $gt: cursor } };
  return await this.find(query).limit(limit);
};

const Note = model<INote, NoteModel>("Note", NotesSchema);

export default Note;
