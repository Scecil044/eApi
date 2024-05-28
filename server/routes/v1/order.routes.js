import express from "express";
import {
  deleteOrder,
  findOrderByOrderNumber,
  getOrderByUserId,
  placeOrder,
  removeItemFromOrder,
} from "../../controllers/order.controller.js";

const router = express.Router();

router.get("/:id", getOrderByUserId);
router.get("/id/:id", findOrderByOrderNumber);
router.post("/", placeOrder);
router.put("/:id", removeItemFromOrder);
router.delete("/:id", deleteOrder);

export default router;
