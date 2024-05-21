import express from "express";
import { listChatMembers } from "../../controllers/cart.controller.js";
import {
  addContributor,
  archiveChat,
  createChat,
  deleteChat,
  deleteMessage,
  removeMember,
  updateChat,
} from "../../controllers/chat.controller.js";
import { auth } from "../../utils/auth.js";

const router = express.Router();

router.post("/", createChat);
router.delete("/delete/chat/:id", deleteChat);
router.delete("/:id", updateChat);
router.get("/members/:id", listChatMembers);
router.put("/archive/:id", archiveChat);
router.put("/remove/contributor/:chatId/:memberId", auth, removeMember);
router.put("/add/contributor/:chatId/:memberId", auth, addContributor);
router.delete("/delete/message/:id", deleteMessage);

export default router;
