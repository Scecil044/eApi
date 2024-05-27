import { createLog } from "../services/log.service.js";
import {
  createNewProduct,
  deleteItem,
  filterProductsByBusiness,
  findProductById,
  getAllProductsByBusinessId,
  getTotalProductsCount,
  listAllProducts,
  updateProductDetails,
  updateProductRating,
} from "../services/product.service.js";
import { errorHandler } from "../utils/error.js";
import { logger } from "../utils/winstonLogger.js";

export const createProduct = async (req, res, next) => {
  try {
    const createdProduct = await createNewProduct(req.body, req);
    if (!createdProduct)
      return next(errorHandler(400, "Could not create product!"));
    const logString = logger.info(
      `${req.user.userName} accessed the create product route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json(createdProduct);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the create product route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await updateProductDetails(req.params.id, req.body);
    const logString = logger.info(
      `${req.user.userName} accessed the update product route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    if (!product) return next(errorHandler(400, "could not update product!!"));
    res.status(200).json(product);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the update product route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const result = await deleteItem(req.params.id);
    if (!result) return next(errorHandler(400, "could not delete item"));
    const logString = logger.info(
      `${req.user.userName} accessed the delete product route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json("product deleted!");
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the delete product route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};

/**
 * This can be used to filter products
 */
export const getProducts = async (req, res, next) => {
  try {
    const products = await listAllProducts(req.query);
    if (req.user) {
      const logString = logger.info(
        `${req.user.userName} accessed the get products route`
      ).transports[0].logString;
      await createLog(req.user.id, logString);
    }
    res.status(200).json(products);
  } catch (error) {
    if (req.user) {
      const logString = logger.info(
        `${req.user.userName} unable to access the get products route`
      ).transports[0].logString;
      await createLog(req.user.id, logString);
    }
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await findProductById(req.params.id);
    res.status(200).json(product);
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

export const rateProduct = async (req, res, next) => {
  try {
    const result = await updateProductRating(req.params.id, req.body);
    res.status(200).json(result);
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
