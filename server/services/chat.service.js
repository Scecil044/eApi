import Cart from "../models/Cart.model.js";

export const addItemToCart = async (userId, productId) => {
  try {
  } catch (error) {
    throw new Error("could not complete add to cart functionality");
  }
};

export const removeFromCart = async (userId, productId) => {
  try {
  } catch (error) {
    throw new Error("could not complete remove from cart functionality");
  }
};

// ==================================================================================
//                                 Aggregations
// ==================================================================================
export const getCartsStats = async () => {
  try {
    // const count = await Cart.countDocuments({ isDeleted: false });
    // return count;
    const pipeline = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: {
            $sum: 1,
          },
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 100,
      },
    ];
    const result = await Cart.aggregate(pipeline);
    return result;
  } catch (error) {
    throw new Error("Could not count all cart items");
  }
};
