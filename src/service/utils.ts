import { Result } from "core/result";

export type ServiceResult<Value, ErrorTypes extends string = "ERROR"> = Result<
  Value,
  { errType: ErrorTypes; error: Error }
>;
