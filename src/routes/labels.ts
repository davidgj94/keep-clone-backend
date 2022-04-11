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
  [
    passport.authenticate("jwt", { session: false }),
    ...labelFieldsValidationChain,
  ],
  LabelController.createLabel
);

routerBuilder(
  router,
  "/labels",
  "get",
  [passport.authenticate("jwt", { session: false })],
  LabelController.findLabels
);

routerBuilder(
  router,
  "/labels/{labelId}",
  "put",
  [
    passport.authenticate("jwt", { session: false }),
    ...labelFieldsValidationChain,
  ],
  LabelController.modifyLabel
);

routerBuilder(
  router,
  "/labels/{labelId}",
  "delete",
  [passport.authenticate("jwt", { session: false })],
  LabelController.deleteLabel
);

export default router;
