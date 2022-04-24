import express from "express";

import notesRouter from "./notes";
import labelsRouter from "./labels";
import { parseFirebaseToken } from "middleware/firebase";

const router = express.Router();

router.use(parseFirebaseToken);
router.use(notesRouter);
router.use(labelsRouter);

export default router;
