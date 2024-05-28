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
export const orderPlacement = async (reqBody, userId) => {
  try {
    const { products, deliveryAddress } = reqBody;
    if (!deliveryAddress)
      throw errorHandler(400, "please provide a defined delivery address");
    console.log(deliveryAddress);
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
      userId: userId,
      orderNumber,
      items: orderedProducts,
      grandTotal,
      address: deliveryAddress,
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

export const getAllSystemOrders = async () => {
  try {
    const pipeline = [
      {
        $match: { isDeleted: false },
      },
      {
        $lookup: {
          from: "products",
          localField: "$items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          totalAmount: [
            {
              $group: {
                _id: null,
                total: { $sum: "$grandTotal" },
              },
            },
          ],
          $project: {
            orders: "$$ROOT",
            totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
            totalAmount: { $arrayElemAt: ["$totalAmount.total", 0] },
          },
        },
      },
    ];

    // const result = await Order.aggregate(pipeline);
    const orders = await Order.find({ isDeleted: false })
      .populate("userId", "firstName lastName gender phoneNumber email")
      .populate("items.productId");
    return orders;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const listDeliveredOrders = async () => {
  try {
    const pipeline = [
      {
        $match: {
          isDeleted: false,
          status: "delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalAmount: { $sum: "$grandTotal" },
          orders: { $push: "$$ROOT" },
        },
      },
      {
        $unwind: "$orders",
      },
      {
        $lookup: {
          from: "users",
          localField: "orders.userId",
          foreignField: "_id",
          as: "orders.user",
        },
      },
      {
        $unwind: "$orders.user",
      },
      {
        $lookup: {
          from: "products",
          localField: "orders.items.productId",
          foreignField: "_id",
          as: "orders.items.productDetails",
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $first: "$totalCount" },
          totalAmount: { $first: "$totalAmount" },
          orders: { $push: "$orders" },
        },
      },
      {
        $project: {
          _id: 0,
          totalCount: 1,
          totalAmount: 1,
          orders: 1,
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    return result;
  } catch (error) {
    throw errorHandler(400, "could not list delivered orders");
  }
};
