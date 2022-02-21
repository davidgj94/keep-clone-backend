import express, { RequestHandler } from "express";
import { paths } from "types/swagger/schema";
import { ExtractParameters, ExtractResponse } from "types/swagger/utils";
import { controllerWrapper, Controller } from "core/controller";

// TODO: transform from {variable} to :variable
const transformRouteParams = (routeUrl: string) => routeUrl;

export function routerBuilder<
  Endpoint extends keyof paths,
  Method extends keyof paths[Endpoint]
>(
  router: express.Router,
  endpointPath: Endpoint,
  method: Method,
  controller: Controller<
    ExtractParameters<Endpoint, Method>,
    ExtractResponse<Endpoint, Method, 200>
  >
): void;
export function routerBuilder<
  Endpoint extends keyof paths,
  Method extends keyof paths[Endpoint]
>(
  router: express.Router,
  endpointPath: Endpoint,
  method: Method,
  middlewares: RequestHandler[],
  controller: Controller<
    ExtractParameters<Endpoint, Method>,
    ExtractResponse<Endpoint, Method, 200>
  >
): void;

export function routerBuilder<
  Endpoint extends keyof paths,
  Method extends keyof paths[Endpoint]
>(
  router: express.Router,
  endpointPath: Endpoint,
  method: Method,
  ...args: any[]
): void {
  if (args.length === 1)
    return router[method as string](
      transformRouteParams(endpointPath),
      method as string,
      controllerWrapper(args[0])
    );
  if (args.length === 2)
    return router[method as string](
      transformRouteParams(endpointPath),
      method as string,
      ...args[0],
      controllerWrapper(args[1])
    );
}
