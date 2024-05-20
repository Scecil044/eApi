import express from "express";
import { updateBusiness } from "../../controllers/business.controller.js";
import { auth } from "../../utils/auth.js";
import { getAllBusinessesCount } from "../../services/business.service.js";

const router = express.Router();

router.put("/:id", auth, updateBusiness);

router.get("/count", getAllBusinessesCount);

export default router;
