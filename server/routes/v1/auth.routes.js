import express from "express";
import { login, logout, register } from "../../controllers/auth.controller.js";
import { auth } from "../../utils/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/logout",auth, logout);
router.post("/register", register);

export default router;
