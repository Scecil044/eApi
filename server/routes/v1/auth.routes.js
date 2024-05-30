import express from "express";
import {
  login,
  logout,
  register,
  resetPassword,
} from "../../controllers/auth.controller.js";
import { auth } from "../../utils/auth.js";
import rateLimit from "express-rate-limit";

// Create a rate limiting middleware
const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
  message:
    "Too many login attempts from this IP, please try again after 1 minute",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router = express.Router();

router.post("/login", loginRateLimiter, login);
router.get("/logout", auth, logout);
router.post("/register", register);
router.get("/reset", resetPassword);

export default router;
