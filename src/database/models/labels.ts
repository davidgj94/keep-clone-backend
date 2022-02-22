import { model, Schema, Model, Document, Types, SchemaTypes } from "mongoose";
import { validateRef } from "./utils";
import { definitions } from "types/swagger";

export type ILabel = Omit<definitions["Label"], "_id"> & {
  user: Types.ObjectId;
};

interface LabelModel extends Model<ILabel, {}, LabelInstanceMethods> {
  findUserLabels(user: Types.ObjectId): Promise<ILabel[]>;
}

interface LabelInstanceMethods {}

const LabelSchema = new Schema<ILabel, LabelModel>({
  name: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    validate: validateRef("User"),
    index: true,
  },
});

LabelSchema.statics.findUserLabels = async function (
  this,
  user: Types.ObjectId
): Promise<ILabel[]> {
  return await this.find({ user });
};

const Label = model<ILabel, LabelModel>("Product", LabelSchema);

export default Label;
