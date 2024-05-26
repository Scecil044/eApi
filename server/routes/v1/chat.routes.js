import express from "express";
import { listChatMembers } from "../../controllers/cart.controller.js";
import {
  addContributor,
  archiveChat,
  changeGroupName,
  createChat,
  deleteChat,
  deleteMessage,
  getChat,
  getUserChats,
  removeMember,
  sendResponseMessage,
} from "../../controllers/chat.controller.js";
import { auth } from "../../utils/auth.js";

const router = express.Router();

router.post("/", createChat);
router.delete("/delete/chat/:id", deleteChat);
router.put("/reply/:id", sendResponseMessage);
router.get("/:id", getChat);
router.get("/user/chats", auth, getUserChats);
router.get("/members/:id", listChatMembers);
router.put("/archive/:id", archiveChat);
router.put("/rename/:chatId", changeGroupName);
router.put("/remove/contributor/:chatId/:memberId", auth, removeMember);
router.put("/add/contributor/:chatId/:memberId", auth, addContributor);
router.delete("/delete/message/:chatId/:messageId", deleteMessage);

export default router;
