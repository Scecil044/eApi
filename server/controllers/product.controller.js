import {
  createNewProduct,
  deleteItem,
  filterProductsByBusiness,
  findProductById,
  getAllProductsByBusinessId,
  getTotalProductsCount,
  listAllProducts,
  updateProductDetails,
} from "../services/product.service.js";
import { errorHandler } from "../utils/error.js";

export const createProduct = async (req, res, next) => {
  try {
    const createdProduct = await createNewProduct(req.body);
    if (!createdProduct)
      return next(errorHandler(400, "Could not create product!"));
    res.status(200).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await updateProductDetails(req.params.id);
    if (!product) return next(errorHandler(400, "could not update product!!"));
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const result = await deleteItem(req.params.id);
    if (!result) return next(errorHandler(400, "could not delete item"));
    res.status(200).json("product deleted!");
  } catch (error) {
    next(error);
  }
};

/**
 * This can be used to filter products
 */
export const getProducts = async (req, res, next) => {
  try {
    const products = await listAllProducts(req.query);
    // if (!products) return next(errorHandler(400, "could not fetch products"));
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
export const listProductsByBusiness = async (req, res, next) => {
  try {
    const products = await getAllProductsByBusinessId(req.params.id);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * Function to search for businesses filtered by id
 */
export const searchProductsFilteredByBusinessId = async (req, res, next) => {
  try {
    const products = await filterProductsByBusiness(req.params.id);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// ==================================================================================
//                                 Aggregations
// ==================================================================================
export const countOFaLLProducts = async (req, res, next) => {
  try {
    const result = await getTotalProductsCount();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
