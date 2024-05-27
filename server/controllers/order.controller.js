import { orderPlacement } from "../services/order.service.js";
import { errorHandler } from "../utils/error.js";

export const placeOrder = async (req, res, next) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      products = [products];
    }

    const result = await orderPlacement(products);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
