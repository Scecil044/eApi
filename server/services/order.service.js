import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import { errorHandler } from "../utils/error.js";
import { findProductById } from "./product.service.js";

export const orderPlacement = async (products) => {
  try {
    const productiIds = products.map(
      (product) => (product) => product.productId
    );
    
  } catch (error) {
    throw errorHandler(404, error.message);
  }
};
