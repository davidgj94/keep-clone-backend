import { paths } from "./schema";

import { Extract, ValueOf } from "core/types";

export type ExtractParameters<
  T extends keyof paths,
  U extends keyof paths[T]
> = Extract<Extract<Extract<paths, T>, U>, "parameters">;

export type ExtractResponse<
  T extends keyof paths,
  U extends keyof paths[T],
  S extends number
> = ValueOf<Extract<Extract<Extract<Extract<paths, T>, U>, "responses">, S>>;
