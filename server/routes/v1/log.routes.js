import express from "express";
import {
  deleteSystemLog,
  searchForLog,
} from "../../controllers/logger.controller.js";
import { auth } from "../../utils/auth.js";

const router = express.Router();

router.get("/search", auth, searchForLog);
router.delete("/:logId", auth, deleteSystemLog);

export default router;
