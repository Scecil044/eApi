import express, { Router } from "express";
import {
  continueWithGoogle,
  login,
  logout,
  register,
} from "../../controllers/auth.controller.js";

const router = express.Router();

router.route("/").post(login).post(register).get(logout);
router.post("/google/auth", continueWithGoogle);

export default router;
