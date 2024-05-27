import express from "express";
import { auth } from "../../utils/auth.js";
import { placeOrder } from "../../controllers/order.controller.js";

const router = express.Router();

router.post("/:id", placeOrder);

export default router;
