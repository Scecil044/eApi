import express from "express";
import {
  deleteOrder,
  findOrderByOrderNumber,
  getDeliveredOrders,
  getOrderByUserId,
  listSystemOrders,
  placeOrder,
  removeItemFromOrder,
} from "../../controllers/order.controller.js";

const router = express.Router();

router.get("/", listSystemOrders);
router.get("/delivered", getDeliveredOrders);
router.get("/:id", getOrderByUserId);
router.get("/id/:id", findOrderByOrderNumber);
router.post("/", placeOrder);
router.put("/:id", removeItemFromOrder);
router.delete("/:id", deleteOrder);

export default router;
