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
    body("title").isString().optional(),
    body("content").isString().optional(),
    body("labels").isArray().optional(),
    body("labels.*").isString(),
    body("user").isString().optional(),
    body("archived").isBoolean().default(false),
    body("binned").isBoolean().default(false),
  ],
  NotesController.createNote
);

export default router;
