import express from "express";
import { query } from "express-validator";

import { routerBuilder } from "./utils";
import { createLabelController } from "controller/labels";

const router = express.Router();

routerBuilder(router, "/labels", "post", createLabelController);

export default router;
