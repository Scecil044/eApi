import Order from "../models/Order.model.js";
import {
  discardOrder,
  findOrderPlacementsByUserId,
  getAllSystemOrders,
  listAllPendingOrders,
  listDeliveredOrders,
  orderPlacement,
} from "../services/order.service.js";
import { errorHandler } from "../utils/error.js";

export const listSystemOrders = async (req, res, next) => {
  try {
    const result = await getAllSystemOrders();
    if (!result) return next(errorHandler(400, "could not get system orders"));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const findOrderByOrderNumber = async (orderNumber) => {
  try {
    const order = await Order.findOne({ orderNumber: orderNumber });
    if (!order) throw errorHandler(404, "ourder not found in db");
    order.isDeleted = true;
    await order.save();
    return order;
  } catch (error) {
    console.log(error);
    throw errorHandler(400, "could not find order by order number");
  }
};

export const getOrderByUserId = async (req, res, next) => {
  try {
    const result = await findOrderPlacementsByUserId(req.params.userId);
    if (!result)
      return next(errorHandler(400, "could not get orders by user id"));
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    throw errorHandler(400, "could not find order by user id");
  }
};

export const placeOrder = async (req, res, next) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      products = [products];
    }
    const result = await orderPlacement(req.body, req.user.id);
    if (!result) return next(errorHandler(400, "could not create order"));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeItemFromOrder = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    await discardOrder(req.params.id);
    res.status(200).json("order deleted");
  } catch (error) {
    next(error);
  }
};

export const getDeliveredOrders = async (req, res, next) => {
  const result = await listDeliveredOrders(req.body);
  if (!result)
    return next(
      errorHandler(
        400,
        "An error was encountered when fetching delivered products"
      )
    );
  res.status(200).json(result);
  try {
  } catch (error) {
    next(error);
  }
};

export const getPendingOrders = async (req, res, next) => {
  try {
    const data = await listAllPendingOrders(req.body);
    if (!data)
      return next(
        errorHandler(
          400,
          "An error was encountered when listing pending orders"
        )
      );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getCancelledOrders = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
