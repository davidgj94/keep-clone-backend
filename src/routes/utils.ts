import express from "express";
import { paths } from "types/swagger/schema";
import { ExtractParameters, ExtractResponse } from "types/swagger/utils";

export const routerBuilder =
  (router: express.Router) =>
  <Endpoint extends keyof paths, Method extends keyof paths[Endpoint]>(
    endpointPath: Endpoint,
    method: Method
  ) => {};
