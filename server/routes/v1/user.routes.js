import express from "express";
import {
  deleteUser,
  filterSystemUsers,
  getSystemUsers,
  getTotalNumberOfTraders,
  getUser,
  getUsers,
  recentRegistrations,
  resetPassword,
  suspendUser,
  updateUser,
} from "../../controllers/user.controller.js";
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

router.get("/", auth, getUsers);
router.get("/system/users", auth, getSystemUsers);
router.get("/search", auth, filterSystemUsers);
router.put("/:id", auth, updateUser);
router.get("/:id", auth, getUser);
router.delete("/:id", auth, deleteUser);
router.put("/suspend/:id", auth, suspendUser);
router.put("/", loginRateLimiter, auth, resetPassword);
// Aggregations
router.get("/recent/registrations", auth, recentRegistrations);
router.get("/all/traders", auth, getTotalNumberOfTraders);

export default router;
