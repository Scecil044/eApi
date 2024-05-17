import { Router } from "express";
import authRoutes from "./auth.routes.js";
import roleRoutes from "./role.routes.js";
import userRoutes from "./user.routes.js";
import productsRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";
import chatRoutes from "./chat.routes.js";
import { auth } from "../../utils/auth.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/users", userRoutes);
router.use("/products", productsRoutes);
router.use("/cart", auth, cartRoutes); // check if auth works on this route as it is
router.use("/chat", auth, chatRoutes);

export default router;
