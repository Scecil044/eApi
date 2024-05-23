import express from "express";
import { auth } from "../../utils/auth.js";
import {
  findUserLogs,
  listSystemLogs,
  searchForLog,
} from "../../controllers/logger.controller.js";

const router = express.Router();

router.get("/", auth, listSystemLogs);
router.get("/:id", auth, findUserLogs);
router.get("/filter", auth, searchForLog);

export default router;
