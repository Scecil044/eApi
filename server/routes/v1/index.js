import { Router } from "express";
import authRoutes from "./auth.routes.js";
import roleRoutes from "./role.routes.js";
import userRoutes from "./user.routes.js";
import productsRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";
import chatRoutes from "./chat.routes.js";
import messageRoutes from "./message.routes.js";
import paymentRoutes from "./payment.routes.js";
import logRoutes from "./log.routes.js";
import { auth } from "../../utils/auth.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/roles", auth, roleRoutes);
router.use("/users", userRoutes);
router.use("/products", productsRoutes);
router.use("/cart", auth, cartRoutes); // check if auth works on this route as it is
router.use("/chat", auth, chatRoutes);
router.use("/message", auth, messageRoutes);
router.use("/payments", paymentRoutes);
router.use("/system/logs", logRoutes);

export default router;
