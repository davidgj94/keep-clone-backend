import express from "express";

import notesRouter from "./notes";
import labelsRouter from "./labels";

const router = express.Router();

router.use(notesRouter);
router.use(labelsRouter);

export default router;
