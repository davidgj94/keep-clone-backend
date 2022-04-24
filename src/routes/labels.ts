import express from "express";
import { query, body } from "express-validator";
import passport from "passport";

import { routerBuilder } from "./utils";
import { LabelController } from "controller/labels";

const router = express.Router();

const labelFieldsValidationChain = [
  body("id").isString().optional(),
  body("name").isString().optional(),
];

routerBuilder(
  router,
  "/labels",
  "post",
  labelFieldsValidationChain,
  LabelController.createLabel
);

routerBuilder(router, "/labels", "get", LabelController.findLabels);

routerBuilder(
  router,
  "/labels/{labelId}",
  "put",
  labelFieldsValidationChain,
  LabelController.modifyLabel
);

routerBuilder(
  router,
  "/labels/{labelId}",
  "delete",
  LabelController.deleteLabel
);

export default router;
