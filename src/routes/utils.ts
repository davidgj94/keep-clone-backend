import express, { RequestHandler } from "express";

import { paths } from "types/swagger";
import { Extract } from "core/types";
import { controllerWrapper, Controller } from "controller/utils";

export type ExtractOperation<
  T extends keyof paths,
  U extends keyof paths[T]
> = Extract<Extract<paths, T>, U>;

const transformRouteParams = (routeUrl: string) => {
  routeUrl
    .split("")
    .map((val) => val.replace(/{(.*)}/, (substring, match) => `:${match}`))
    .join("/");
};

export function routerBuilder<
  Endpoint extends keyof paths,
  Method extends keyof paths[Endpoint]
>(
  router: express.Router,
  endpointPath: Endpoint,
  method: Method,
  controller: Controller<ExtractOperation<Endpoint, Method>>
): void;
export function routerBuilder<
  Endpoint extends keyof paths,
  Method extends keyof paths[Endpoint]
>(
  router: express.Router,
  endpointPath: Endpoint,
  method: Method,
  middlewares: RequestHandler[],
  controller: Controller<ExtractOperation<Endpoint, Method>>
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
