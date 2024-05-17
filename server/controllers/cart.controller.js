import { getCartsStats } from "../services/chat.service.js";

export const getCartItems = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const getCartItem = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const addCartItem = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const deleteCartItem = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

// ==================================================================================
//                                 Aggregations
// ==================================================================================
export const getStats = async (req, res, next) => {
  try {
    const cartStats = await getCartsStats();
    res.status(200).json(cartStats);
  } catch (error) {
    next(error);
  }
};