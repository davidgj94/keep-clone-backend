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

export type INote = Omit<definitions["Note"], "labels" | "id"> & {
  labels: Types.ObjectId[];
  user: Types.ObjectId;
  empty: boolean;
  updatedAt: Date;
  createdAt: Date;
};

export type NoteDocument = HydratedDocument<INote, NoteInstanceMethods>;

interface NoteModel extends Model<INote, {}, NoteInstanceMethods> {
  findNotes(params: FindNotesParams): Promise<FindNotesOut>;
}

interface NoteInstanceMethods {}

const NotesSchema = new Schema<INote, NoteModel>(
  {
    content: String,
    title: String,
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
    empty: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const setEmpty = (doc: NoteDocument) =>
  (doc.empty = !doc.title && !doc.content);

NotesSchema.pre<NoteDocument>("save", function (this, next) {
  setEmpty(this);
  next();
});

type FindNotesParams = {
  labelId?: string;
  userId: string;
  cursor?: string;
  limit?: number;
  archived?: boolean;
};

type FindNotesOut = {
  data: NoteDocument[];
  cursor?: string;
  hasMore: boolean;
};

type FindNotesQuery =
  | {
      user: string;
      updatedAt?: { $lt: Date };
      archived: boolean;
    }
  | {
      labels: string;
      updatedAt?: { $lt: Date };
    };

NotesSchema.statics.findNotes = async function (
  this,
  {
    labelId: labels,
    userId: user,
    cursor,
    limit = 10,
    archived = false,
  }: FindNotesParams
): Promise<FindNotesOut> {
  let query: FindNotesQuery = labels ? { labels } : { user, archived };
  if (cursor) query = { ...query, updatedAt: { $lt: new Date(cursor) } };
  const notes = await this.find({ ...query, empty: { $ne: true } })
    .limit(limit + 1)
    .sort({ updatedAt: -1 });
  const hasMore = notes.length == limit + 1;
  const newCursor = hasMore
    ? new Date(notes[limit - 1].updatedAt).toISOString()
    : undefined;
  return { data: notes.slice(0, limit), hasMore, cursor: newCursor };
};

NotesSchema.set("toJSON", {
  virtuals: true,
});

const Note = model<INote, NoteModel>("Note", NotesSchema);

export default Note;
