import Product from "../models/Product.model.js";
import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";
import { getBusinessById } from "./business.service.js";
import { createNewProductrating } from "./rating.service.js";
import { findRoleByRoleId } from "./role.service.js";
import { findUserById } from "./user.service.js";

export const findProductById = async (productId) => {
  try {
    const product = await Product.findById(productId)
      .populate("businessId")
      .populate("ratingId")
      .populate("commentId");
    if (!product) throw new Error("Failed to find product by id");
    return product;
  } catch (error) {
    throw new Error(
      "An error was encountered when attempting to get  product by id"
    );
  }
};

export const createNewProduct = async (reqBody, req) => {
  try {
    const {
      title,
      quantity,
      category,
      price,
      color,
      size,
      images,
      shortDescription,
      longDescription,
      isFlashSale,
    } = reqBody;
    console.log(reqBody);
    if (!title || !quantity || !price || !category || !shortDescription)
      throw new Error("please provide the required fields");
    const user = await User.findById(req.user.id);
    const role = await findRoleByRoleId(user.role);
    if (role.roleName !== "trader")
      throw new Error("You do are not registred as a trader in the system");
    console.log("business id on this", user);
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
      shortDescription,
      longDescription,
      isFlashSale,
    });
    const createdProduct = await findProductById(newProduct._id);
    return createdProduct;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateProductDetails = async (productId, reqBody) => {
  try {
    console.log("product id", productId);
    const product = await findProductById(productId);
    const updates = Object.keys(reqBody);
    updates.forEach((update) => {
      product[update] = reqBody[update];
    });
    await product.save();
    return product;
  } catch (error) {
    throw new Error(error);
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

// export const listAllProducts = async (reqQuery) => {
//   try {
//     const searchTerm = reqQuery.searchTerm ? reqQuery.searchTerm : {};
//     const searchRegex = new RegExp(searchTerm, "i");
//     const page = reqQuery.page ? parseInt(reqQuery.page) : 0;
//     const limit = reqQuery.limit ? parseInt(reqQuery.limit) : 30;
//     const sortBy = reqQuery.sortBy || "createdAt";
//     const sortOrder = reqQuery.sortOrder ? parseInt(reqQuery.sortOrder) : -1;
//     const pipeline = [
//       {
//         $lookup: {
//           from: "businesses",
//           localField: "businessId",
//           foreignField: "_id",
//           pipeline: [{ $match: { isDeleted: false } }],
//           as: "businessDetails",
//         },
//       },
//       {
//         $unwind: "$businessDetails",
//       },
//       {
//         $match: {
//           isDeleted: false,
//           $or: [
//             { title: { $regex: searchRegex } },
//             { shortDescription: { $regex: searchRegex } },
//             { longDescription: { $regex: searchRegex } },
//             {
//               "businessDetails.metaData.businessName": { $regex: searchRegex },
//             },
//             {
//               "businessDetails.metaData.businessEmail": { $regex: searchRegex },
//             },
//             {
//               "businessDetails.metaData.address": { $regex: searchRegex },
//             },
//             {
//               "businessDetails.metaData.city": { $regex: searchRegex },
//             },
//           ],
//         },
//       },
//       {
//         $facet: {
//           products: [
//             { $limit: limit },
//             { $skip: page },
//             {
//               $sort: {
//                 [sortBy]: sortOrder,
//               },
//             },
//             {
//               $project: {
//                 title: 1,
//                 shortDescription: 1,
//                 longDescription: 1,
//                 quantity: 1,
//                 price: 1,
//                 color: 1,
//                 businessDetails: 1,
//               },
//             },
//           ],
//           totalCount: [{ $count: "count" }],
//         },
//       },
//       {
//         $unwind: {
//           path: "$totalCount",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $addFields: {
//           totalCount: { $ifNull: ["$totalCount.count", 0] },
//         },
//       },
//     ];
//     const products = await Product.aggregate(pipeline);
//     if (!products || products.length < 1) {
//       return [];
//     } else {
//       return products;
//     }
//   } catch (error) {
//     throw new Error("Could not get the list of all products", error);
//   }
// };

export const listAllProducts = async (reqQuery) => {
  try {
    const searchTerm = reqQuery.searchTerm ? reqQuery.searchTerm : "";
    const searchRegex = new RegExp(searchTerm, "i");
    const page = reqQuery.page ? parseInt(reqQuery.page) : 1;
    const limit = reqQuery.limit ? parseInt(reqQuery.limit) : 30;
    const sortBy = reqQuery.sortBy || "createdAt";
    const sortOrder = reqQuery.sortOrder ? parseInt(reqQuery.sortOrder) : -1;

    const query = {
      isDeleted: false,
      $or: [
        { title: { $regex: searchRegex } },
        { shortDescription: { $regex: searchRegex } },
        { longDescription: { $regex: searchRegex } },
        { color: { $regex: searchRegex } },
        { "businessDetails.metaData.businessName": { $regex: searchRegex } },
        { "businessDetails.metaData.businessEmail": { $regex: searchRegex } },
        { "businessDetails.metaData.address": { $regex: searchRegex } },
        { "businessDetails.metaData.city": { $regex: searchRegex } },
      ],
    };

    const options = {
      page,
      limit,
      sort: { [sortBy]: sortOrder },
      populate: {
        path: "businessId",
        match: { isDeleted: false },
        select: "metaData",
      },
      select:
        "title shortDescription longDescription quantity price color businessId images size status category isFlashSale createdAt",
    };

    const products = await Product.paginate(query, options);

    if (!products || products.docs.length < 1) {
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

export const updateProductRating = async (productId, reqBody) => {
  try {
    const product = await findProductById(productId);
    const rating = await createNewProductrating(reqBody);
    product.ratingId = rating._id;
    await product.save();
    return product;
  } catch (error) {
    console.log(error);
    throw new Error(error);
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
      {
        $project: {
          title: 1,
          shortDescription: 1,
          longDescription: 1,
          price: 1,
          quantity: 1,
          color: 1,
          category: 1,
          product_images: {
            $cond: {
              if: { $eq: ["$images", null] },
              then: [],
              else: "$images",
            },
          },
          reviews: 1,
          status: 1,
          isFlashSale: 1,
          size: 1,
          businessLogo: {
            $cond: {
              if: { $eq: ["$businessDetails.metaData.businessLogo", null] },
              then: "",
              else: "$businessDetails.metaData.businessLogo",
            },
          },
          businessName: "$businessDetails.metaData.businessName",
          businessEmail: "$businessDetails.metaData.businessEmail",
          businessNumber: "$businessDetails.metaData.businessNumber",
          businessAddress: {
            $concat: [
              { ifNull: ["$businessDetails.metaData.street", ""] },
              ",",
              { ifNull: ["$businessDetails.metaData.city", ""] },
            ],
          },
        },
      },
    ];
    const products = await Product.aggregate(pipeline);
    return products;
  } catch (error) {
    throw new Error("unable to filter businesses");
  }
};

export const genericProductsFilter = async (reqQuery) => {
  try {
    const searchRegex = reqQuery.searchTerm
      ? new RegExp(reqQuery.searchTerm, "i")
      : null;
    const pipeline = [
      {
        $lookup: {
          from: "businesses",
          foreignField: "businessId",
          localField: "_id",
          as: "businessDetails",
        },
      },
      {
        $unwind: "$businessDetails",
      },
      {
        $match: {
          isDeleted: false,
          ...(searchRegex && {
            $or: [
              { title: { $regex: searchRegex } },
              { shortDescription: { $regex: searchRegex } },
              { longDescription: { $regex: searchRegex } },
              { color: { $regex: searchRegex } },
              { category: { $regex: searchRegex } },
              {
                "businessDetails.metaData.businessName": {
                  $regex: searchRegex,
                },
              },
              {
                "businessDetails.metaData.businessEmail": {
                  $regex: searchRegex,
                },
              },
              { "businessDetails.metaData.city": { $regex: searchRegex } },
              { "businessDetails.metaData.address": { $regex: searchRegex } },
              { "businessDetails.metaData.street": { $regex: searchRegex } },
              { "businessDetails.metaData.category": { $regex: searchRegex } },
            ],
          }),
        },
      },
      {
        $facet: {
          results: [
            {
              $project: {
                title: 1,
                shortDescription: 1,
                longDescription: 1,
                category: 1,
                price: 1,
                quantity: 1,
                size: 1,
                color: 1,
                businessName: "$businessDetails.meataData.businessName",
                businessEmail: "$businessDetails.meataData.businessEmail",
                businessLocation: {
                  $concat: [
                    "$businessDetails.meataData.city",
                    " ",
                    "$businessDetails.meataData.address",
                    " ",
                    "$businessDetails.meataData.street",
                  ],
                },
                businessLogo: {
                  $cont: {
                    if: {
                      $eq: ["$businessDetails.meataData.businessLogo", null],
                    },
                    then: "",
                    else: "$businessDetails.meataData.businessLogo",
                  },
                },
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $unwind: { path: "$totalCount", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          totalCount: { $ifNull: ["$totalCount.count", 0] },
        },
      },
    ];
    const result = await Product.aggregate(pipeline);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(error);
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
