import { model, Schema, Model, HydratedDocument } from "mongoose";
import { hashSync, compareSync } from "bcryptjs";

interface IUser {
  email: string;
  password: string;
}

interface UserModel extends Model<IUser, {}, UserInstanceMethods> {}

interface UserInstanceMethods {
  validatePassword(password: string): boolean;
}

export type UserDocument = HydratedDocument<IUser, UserInstanceMethods>;

const UserSchema = new Schema<IUser, UserModel>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

UserSchema.methods.validatePassword = function (
  this: UserDocument,
  password: string
) {
  return compareSync(password, this.password);
};

UserSchema.pre<UserDocument>("save", function (this, next) {
  this.password = hashSync(this.password, 10);
  next();
});

const User = model<IUser, UserModel>("User", UserSchema);

export default User;
