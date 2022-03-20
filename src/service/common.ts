import { Model, HydratedDocument, Error } from "mongoose";
import { isEmpty, omit } from "lodash";

import { Mapper, ServiceResult } from "./utils";
import { err, ok } from "core/result";

export const upsertService =
  <DbType, DtoType>(
    model: Model<DbType>,
    mapper: Mapper<HydratedDocument<DbType>, DtoType>
  ) =>
  async (
    fields: Partial<DtoType> & { id?: string } & { user: string }
  ): Promise<ServiceResult<DtoType, "VALIDATION_ERROR" | "NOT_FOUND">> => {
    try {
      let doc: HydratedDocument<DbType> | null;
      if (fields.id) {
        doc = await model.findByIdAndUpdate(fields.id, fields, { new: true });
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
