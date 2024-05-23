import express from "express";
import {
  countBusinesses,
  filterBusinesses,
  getBusinesses,
  updateBusiness,
} from "../../controllers/business.controller.js";
import { auth } from "../../utils/auth.js";

const router = express.Router();

router.get("/", getBusinesses);
router.put("/:id", auth, updateBusiness);

router.get("/count", countBusinesses);
router.get("/search", filterBusinesses);

export default router;
