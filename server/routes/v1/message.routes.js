import express from "express";
import {
  createResponse,
  filterAllMessages,
} from "../../controllers/message.controller.js";
import { auth } from "../../utils/auth.js";

const router = express.Router();

router.post("/", auth, createResponse);
router.post("/search", auth, filterAllMessages);

export default router;
