import Product from "../models/Product.model.js";
import { getBusinessById } from "./business.service.js";
import { findUserById } from "./user.service.js";

export const createNewProduct = async (reqBody) => {
  try {
    const { title, quantity, category, price, color, size, images } = reqBody;
    const user = await findUserById(req.user.id);
    const newProduct = await Product.create({
      title,
      quantity,
      price,
      category,
      color,
      size,
      images,
      createdBy: req.user.id,
      businessId: user.businessId,
    });
    return newProduct;
  } catch (error) {
    throw new Error(
      "An error was encountered when attempting to create new product"
    );
  }
};

export const findProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Failed to find product by id");
    return product;
  } catch (error) {
    throw new Error(
      "An error was encountered when attempting to get  product by id"
    );
  }
};
export const updateProductDetails = async (productId, reqBody) => {
  try {
    const product = await findProductById(productId);
    const updates = reqBody;
    updates.forEach((update) => {
      product[update] = reqBody[update];
    });
    await product.save();
    return product;
  } catch (error) {
    throw new Error(
      "An error was encountered when attempting to update  product"
    );
  }
};

export const deleteItem = async (productId) => {
  try {
    const product = await findProductById(productId);
    product.isDeleted = true;
    await product.save();
    return product;
  } catch (error) {
    throw new Error("Could not delete ite, from products tab;e");
  }
};

export const listAllProducts = async (reqQuery) => {
  try {
    const searchTerm = reqQuery.searchTerm ? reqQuery.searchTerm : {};
    const searchRegex = new RegExp(searchTerm, "i");
    const pipeline = [
      {
        $match: {
          isDeleted: false,
          $or: [
            { title: { $regex: searchRegex } },
            { shortDescription: { $regex: searchRegex } },
            { longDescription: { $regex: searchRegex } },
          ],
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "businessId",
          foreignField: "_id",
          as: "businessDetails",
        },
      },
      {
        $unwind: "$businessDetails",
      },
      {
        $group: {
          _id: null,
          totalCount: {
            $sum: 1,
          },
        },
      },
    ];
    const products = await Product.aggregate(pipeline);
    if (!products || products.length < 1) {
      return [];
    } else {
      return products;
    }
  } catch (error) {
    throw new Error("Could not get the list of all products", error);
  }
};

export const getSpecificProduct = async (productId) => {
  try {
    const product = await findProductById(productId);
    return product;
  } catch (error) {
    throw new Error(
      "An error was encountered when attempting to get product by id"
    );
  }
};

export const getAllProductsByBusinessId = async (businessId, reqBody) => {
  try {
    const business = await getBusinessById(businessId);
    const pipeline = [
      {
        $match: {
          isDeleted: false,
          businessId: business.id,
        },
      },
      {
        $lookUp: {
          from: "businesses",
          localField: "businessId",
          foreignField: "_id",
          as: "businessDetails",
        },
      },
      {
        $unwind: "$businessDetails",
      },
      {
        $project: {
          title: 1,
          shortDescription: 1,
          longDescription: 1,
          price: 1,
          quantity: 1,
          isFlashSale: 1,
          size: 1,
          color: 1,
          category: 1,
          images: 1,
        },
      },
    ];
    const products = await Product.aggregate(pipeline);
    if (products.length < 1 || !products) {
      return [];
    } else {
      return products;
    }
  } catch (error) {
    throw new Error(
      "An error was encountered when fetching products by business"
    );
  }
};
/*
 * Use this function to filter through businesses listed by id
 */
export const filterProductsByBusiness = async (reqBody) => {
  try {
    const searchTerm = reqBody.searchTerm ? reqBody.searchTerm : {};
    const searchRegex = new RegExp(searchTerm);
    const pipeline = [
      {
        $lookUp: {
          from: "businesses",
          localField: "businessId",
          foreignField: "_id",
          as: "businessDetails",
        },
      },
      {
        $unwind: "$businessDetails",
      },
      {
        $match: {
          isDeleted: false,
          $or: [
            { title: { $regex: searchRegex } },
            { shortDescription: { $regex: searchRegex } },
            { longDescription: { $regex: searchRegex } },
            { "businessDetails.meteData.city": { $regex: searchRegex } },
            {
              "businessDetails.meteData.businessEmail": { $regex: searchRegex },
            },
            {
              "businessDetails.meteData.businessNumber": {
                $regex: searchRegex,
              },
            },
            {
              "businessDetails.meteData.street": { $regex: searchRegex },
            },
          ],
        },
      },
    ];
    const products = await Product.aggregate(pipeline);
    return products;
  } catch (error) {
    throw new Error("unable to filter businesses");
  }
};

// ==================================================================================
//                                 Aggregations
// ==================================================================================
export const getTotalProductsCount = async () => {
  try {
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
        },
      },
    ];
    const productsCount = await Product.aggregate(pipeline);
    if (
      Array.isArray(productsCount) &&
      productsCount.length > 0 &&
      productsCount[0].totalCount > 0
    ) {
      return productsCount[0].totalCount;
    } else {
      return 0;
    }
  } catch (error) {
    throw new Error("Could not get total product count");
  }
};
