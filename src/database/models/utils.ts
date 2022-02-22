import { Types, model } from "mongoose";

export const validateRef =
  (ref: string) =>
  async (refId: Types.ObjectId): Promise<Boolean> => {
    const refModel = model(ref);
    return Boolean(await refModel.findById(refId));
  };
