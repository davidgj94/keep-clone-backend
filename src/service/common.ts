import { Model, HydratedDocument, Error } from "mongoose";
import { isEmpty } from "lodash";

import { Mapper, ServiceResult } from "./utils";
import { err, ok } from "core/result";

export const upsertService =
  <DbType, DtoType>(
    model: Model<DbType>,
    mapper: Mapper<HydratedDocument<DbType>, DtoType>
  ) =>
  async (
    fields: Partial<DtoType> & { id?: string }
  ): Promise<
    ServiceResult<DtoType, "EMPTY_FIELDS" | "VALIDATION_ERROR" | "NOT_FOUND">
  > => {
    if (isEmpty(fields))
      return err({ errType: "EMPTY_FIELDS", error: new Error("empty fields") });
    try {
      let doc: HydratedDocument<DbType> | null;
      if (fields.id) {
        doc = await model.findByIdAndUpdate(fields.id, fields);
        if (!doc)
          return err({
            errType: "NOT_FOUND",
            error: new Error(`document with id "${fields.id}" not found`),
          });
      } else {
        doc = await model.create(fields);
      }
      return ok(mapper(doc));
    } catch (error) {
      if (error instanceof Error.ValidationError)
        return err({ errType: "VALIDATION_ERROR", error });
      throw error;
    }
  };
