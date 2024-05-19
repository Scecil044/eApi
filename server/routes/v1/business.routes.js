import express from "express";
import { updateBusiness } from "../../controllers/business.controller.js";
import { auth } from "../../utils/auth.js";

const router = express.Router();

router.put("/:id", auth, updateBusiness);

export default router;
