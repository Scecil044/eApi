import express from "express";
import {
  countOFaLLProducts,
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  listProductsByBusiness,
  rateProduct,
  searchProductsFilteredByBusinessId,
  updateProduct,
} from "../../controllers/product.controller.js";
import { auth } from "../../utils/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", auth, updateProduct);
router.put("/rate/:id", rateProduct);
router.delete("/:id", auth, deleteProduct);
router.get("/by/business/:id", listProductsByBusiness);
router.get("/search/:id", searchProductsFilteredByBusinessId);
router.get("/total/count", countOFaLLProducts);
export default router;
