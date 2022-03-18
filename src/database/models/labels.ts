import {
  model,
  Schema,
  Model,
  Document,
  Types,
  SchemaTypes,
  HydratedDocument,
} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { validateRef } from "./utils";
import { definitions } from "types/swagger";

export type ILabel = Omit<definitions["Label"], "id"> & {
  user: Types.ObjectId;
};

export type LabelDocument = HydratedDocument<ILabel, LabelInstanceMethods>;

interface LabelModel extends Model<ILabel, {}, LabelInstanceMethods> {
  findUserLabels(userId: string): Promise<LabelDocument[]>;
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

LabelSchema.plugin(uniqueValidator);

LabelSchema.statics.findUserLabels = async function (
  this,
  userId: string
): Promise<LabelDocument[]> {
  return await this.find({ user: userId });
};

LabelSchema.set("toJSON", {
  virtuals: true,
});

const Label = model<ILabel, LabelModel>("Label", LabelSchema);

export default Label;
