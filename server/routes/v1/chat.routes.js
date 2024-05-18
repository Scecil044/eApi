import express from "express";
import { listChatMembers } from "../../controllers/cart.controller.js";
import {
  archiveChat,
  createChat,
  deleteChat,
  updateChat,
} from "../../controllers/chat.controller.js";

const router = express.Router();

router.post("/", createChat);
router.delete("/:id", deleteChat);
router.delete("/:id", updateChat);
router.get("/members/:id", listChatMembers);
router.put("/archive/:id", archiveChat);

export default router;
