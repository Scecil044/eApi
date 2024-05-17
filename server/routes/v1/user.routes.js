import express from "express";
import {
  deleteUser,
  getTotalNumberOfTraders,
  getUser,
  getUsers,
  recentRegistrations,
  suspendUser,
  updateUser,
} from "../../controllers/user.controller.js";
import { auth } from "../../utils/auth.js";

const router = express.Router();

router.put("/:id", auth, updateUser);
router.get("/", auth, getUsers);
router.get("/:id", auth, getUser);
router.delete("/:id", deleteUser);
router.put("/suspend/user/:id", auth, suspendUser);
// Aggregations
router.get("/recent/registrations", auth, recentRegistrations);
router.get("/all/traders", auth, getTotalNumberOfTraders);

export default router;
