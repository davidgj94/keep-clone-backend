import { Result } from "core/result";

export type ServiceResult<Value, ErrorTypes extends string = "ERROR"> = Result<
  Value,
  { errType: ErrorTypes; error: Error }
>;

export type Mapper<DbType, DtoType> = (fromDbObject: DbType) => DtoType;
