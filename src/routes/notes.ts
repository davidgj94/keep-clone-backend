import express from "express";
import { query, body } from "express-validator";

import { routerBuilder } from "./utils";
import { NotesController } from "controller/notes";

const router = express.Router();

routerBuilder(
  router,
  "/notes",
  "post",
  [
    body("data.title").isString().optional(),
    body("data.content").isString().optional(),
    body("data.labels").isArray().optional(),
    body("data.labels.*").isString(),
    body("data.user").isString().optional(),
    body("data.archived").isBoolean().default(false),
    body("data.binned").isBoolean().default(false),
  ],
  NotesController.createNote
);

export default router;
