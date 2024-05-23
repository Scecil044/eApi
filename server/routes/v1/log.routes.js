import express from "express";
import { searchForLog } from "../../controllers/logger.controller.js";

const router = express.Router();

router.get("/search", searchForLog);

export default router;
