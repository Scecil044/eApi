import express from "express";
import { listChatMembers } from "../../controllers/cart.controller";
import { archiveChat } from "../../controllers/chat.controller";

const router = express.Router();

router.post("/", createChat);
router.delete("/:id", deleteChat);
router.delete("/:id", deleteChat);
router.get("/members/:id", listChatMembers);
router.put("/archive/:id", archiveChat);

export default router;
