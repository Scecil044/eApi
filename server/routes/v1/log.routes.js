import express from "express";
import { searchForLog } from "../../controllers/logger.controller.js";
import { auth } from "../../utils/auth.js";

const router = express.Router();

router.get("/search", auth, searchForLog);

export default router;
