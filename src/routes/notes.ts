import express from "express";
import { query, body } from "express-validator";
import passport from "passport";

import { routerBuilder } from "./utils";
import { NotesController } from "controller/notes";

const router = express.Router();

const noteFieldsValidationChain = [
  body("title").isString().optional(),
  body("content").isString().optional(),
  body("labels").isArray().optional(),
  body("labels.*").isString(),
  body("archived").isBoolean().optional().default(false),
  body("binned").isBoolean().optional().default(false),
];

const getNotesValidationChain = [
  query("cursor").isString().optional(),
  query("limit").isNumeric().optional().toInt(),
  query("labelId").isString().optional(),
];

routerBuilder(
  router,
  "/notes",
  "post",
  noteFieldsValidationChain,
  NotesController.createNote
);

routerBuilder(
  router,
  "/notes",
  "get",
  getNotesValidationChain,
  NotesController.getNotes
);

routerBuilder(
  router,
  "/notes/{noteId}",
  "put",
  noteFieldsValidationChain,
  NotesController.modifyNote
);

export default router;
