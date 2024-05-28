import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import { errorHandler } from "../utils/error.js";
import { uuid } from "uuidv4";
import { findUserById } from "./user.service.js";

export const findOrderPlacementsByUserId = async (userId, reqQuery) => {
  try {
    const options = {
      sortOrder: reqQuery.sortOrder ? parseInt(reqQuery.sortOrder) : -1,
      limit: reqQuery.limit ? parseInt(reqQuery.limit) : 20,
      page: reqQuery.page ? parseInt(reqQuery.page) : 0,
      sortBy: reqQuery.sortBy || "createdAt",
    };
    const filter = {
      isDeleted: false,
      userId: userId,
    };

    const isUser = await findUserById(userId);
    if (!isUser)
      throw errorHandler(404, "could not find user by the specified id");
    const userOrders = await Order.find(filter, null, options)
      .populate("productId")
      .populate("userId");
    return userOrders;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
export const orderPlacement = async (products) => {
  try {
    let orderedProducts = [];
    const productIds = products.map((item) => item.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    let totalAmount = 0;

    for (let product of products) {
      const singleProduct = dbProducts.find(
        (item) => item._id.toString() === product.productId.toString()
      );
      if (!singleProduct) {
        throw errorHandler(
          404,
          `Product with id ${product.productId} not found in database`
        );
      }
      if (singleProduct.quantity < product.orderedQuantity) {
        throw errorHandler(
          400,
          `You can order up to ${singleProduct.quantity} units of this item`
        );
      }

      totalAmount += singleProduct.price * product.orderedQuantity;

      orderedProducts.push({
        productId: product.productId,
        orderedQuantity: product.orderedQuantity,
      });

      singleProduct.quantity -= product.orderedQuantity;
      await singleProduct.save();
    }

    const orderNumber = uuid();

    const grandTotal = totalAmount;

    const order = await Order.create({
      orderNumber,
      items: orderedProducts,
      grandTotal,
      status: "pending",
    });
    return order;
  } catch (error) {
    console.log(error);
    throw errorHandler(400, "Order placement failed: ", error.message);
  }
};

export const discardOrder = async (orderNumber) => {
  try {
  } catch (error) {
    throw errorHandler(400, "could not delete order");
  }
};
