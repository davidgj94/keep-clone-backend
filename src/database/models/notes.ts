import { model, Schema, Model, Document, Types, SchemaTypes } from "mongoose";
import { validateRef } from "./utils";
import { definitions } from "types/swagger";
import { UnwrapArrayType } from "core/types";

type INote = Omit<definitions["Note"], "labels" | "user"> & {
  labels: Types.ObjectId[];
  user: Types.ObjectId;
};

interface NoteModel extends Model<INote, {}, NoteInstanceMethods> {
  findNotes(
    query: {
      label?: UnwrapArrayType<definitions["Note"]["labels"]>;
      user?: definitions["Note"]["user"];
    },
    cursor: Types.ObjectId,
    limit: number
  ): Promise<INote[]>;
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

NotesSchema.statics.findNotes = async function (
  this,
  query: {
    label?: UnwrapArrayType<definitions["Note"]["labels"]>;
    user?: definitions["Note"]["user"];
  },
  cursor: Types.ObjectId,
  limit: number
): Promise<INote[]> {};

const Product = model<INote, NoteModel>("Product", NotesSchema);

export default Product;
