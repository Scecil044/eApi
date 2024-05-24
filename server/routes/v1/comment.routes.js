import express from "express";
import {
  deleteUserComment,
  updateComment,
} from "../../controllers/comment.controller.js";

const router = express.Router();

router.put("/:commentId", updateComment);
router.delete("/:commentId", deleteUserComment);

export default router;
