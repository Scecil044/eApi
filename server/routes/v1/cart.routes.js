import express from "express";
import {
  addCartItem,
  deleteCartItem,
  getCartItem,
  getCartItems,
  getStats,
} from "../../controllers/cart.controller.js";
import { createChat, deleteChat } from "../../controllers/chat.controller.js";

const router = express.Router();

router.get("/", getCartItems);
router.post("/", addCartItem);
router.get("/:id", getCartItem);
router.delete("/:id", deleteCartItem);

// ==================================================================================
//                                 Aggregations
// ==================================================================================
router.get("/stats", getStats);


export default router;
