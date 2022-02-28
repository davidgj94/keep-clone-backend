import { Model } from "mongoose";
import { merge } from "lodash";

type DefaultFieldsFunc<T> = () => Promise<Partial<T>>;

function createFactory<T>(
  factoryModel: Model<T>,
  defaultFieldsFunc?: DefaultFieldsFunc<T>
) {
  return async (overwriteFields?: Partial<T>) => {
    const defaultFields = defaultFieldsFunc
      ? await defaultFieldsFunc()
      : ({} as Partial<T>);
    const document = new factoryModel(merge(defaultFields, overwriteFields));
    await document.save();
    return document;
  };
}

export default createFactory;
