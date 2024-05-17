import express from "express";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "../../controllers/role.controller.js";

const router = express.Router();

router.route("/").post(createRole).get(getRoles);
router.route("/:id").put(updateRole).delete(deleteRole);

export default router;
