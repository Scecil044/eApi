import Business from "../models/Business.model.js";
import { findUserById } from "./user.service.js";

export const createNewBusiness = async (reqBody) => {
  try {
    const {
      businessLogo,
      businessName,
      yearFounded,
      businessNumber,
      businessEmail,
      address,
      category,
      city,
      street,
    } = reqBody.metaData;
    const business = await Business.create({
      metaData: {
        address,
        city,
        street,
        businessNumber,
        businessEmail,
        category,
        businessLogo,
        businessName,
        yearFounded,
      },
    });
    return business;
  } catch (error) {
    console.log(error);
    throw new Error(
      "could not save new business! An error was encounterd with the following details:" +
        error.message
    );
  }
};

export const getBusinessById = async (id) => {
  try {
    const isBusiness = await Business.findById(id).populate("userId");
    if (!isBusiness) throw new Error("Business not found!");
    return isBusiness;
  } catch (error) {
    throw new Error("could not get business by id");
  }
};

export const editBusinessDetails = async (
  businessId,
  reqBody,
  authenticatedUser
) => {
  try {
    const business = await getBusinessById(businessId);
    const updates = Object.keys(reqBody);
    updates.forEach((update) => {
      business[update] = reqBody[update];
    });
    await business.save();
    return business;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const listAllBusinesses = async () => {
  try {
    const options = {};
    const query = {
      isDeleted: false,
    };
    const businesses = await Business.find(query, null, options).populate(
      "userId",
      "firstName lastName email phoneNumber"
    );
    return businesses;
  } catch (error) {
    console.log(error);
    throw new Error("could not list all businesses");
  }
};
// ==================================================================================
//                                 Aggregations
// ==================================================================================

export const getAllBusinessesCount = async () => {
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
          totalNumberOfBusinesses: {
            $sum: 1,
          },
        },
      },
    ];
    const businessCount = await Business.aggregate(pipeline);
    if (businessCount < 1) {
      return 0;
    } else {
      return businessCount[0].totalNumberOfBusinesses;
    }
  } catch (error) {
    throw new Error("failed to get business count", error);
  }
};

export const genericBusinessFilter = async (reqQuery) => {
  try {
    console.log("value of reqQuery", reqQuery);

    const searchRegex = reqQuery.searchTerm
      ? new RegExp(reqQuery.searchTerm, "i")
      : null;
    const page = reqQuery.page ? parseInt(reqQuery.page) : 0;
    const limit = reqQuery.limit ? parseInt(reqQuery.limit) : 10;
    const sortOrder = reqQuery.sortOrder ? parseInt(reqQuery.sortOrder) : -1;
    const sortBy = reqQuery.sortBy || "createdAt";

    const pipeline = [
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $match: {
          isDeleted: false,
          ...(searchRegex && {
            $or: [
              { "metaData.businessName": { $regex: searchRegex } },
              { "metaData.businessEmail": { $regex: searchRegex } },
              { "metaData.address": { $regex: searchRegex } },
              { "metaData.city": { $regex: searchRegex } },
              { "metaData.street": { $regex: searchRegex } },
              { "userDetails.firstName": { $regex: searchRegex } },
              { "userDetails.lastName": { $regex: searchRegex } },
              { "userDetails.email": { $regex: searchRegex } },
              { "userDetails.phoneNumber": { $regex: searchRegex } },
            ],
          }),
        },
      },
      {
        $facet: {
          results: [
            {
              $project: {
                _id: 1,
                ownerFirstName: "$userDetails.firstName",
                ownerLastName: "$userDetails.lastName",
                ownerFullName: {
                  $concat: [
                    "$userDetails.firstName",
                    " ",
                    "$userDetails.lastName",
                  ],
                },
                ownerProfilePicture: {
                  $cond: {
                    if: { $eq: ["$userDetails.profilePicture", null] },
                    then: "",
                    else: "$userDetails.profilePicture",
                  },
                },
                "metaData.businessName": 1,
                "metaData.businessEmail": 1,
                "metaData.businessLogo": 1,
                "metaData.category": 1,
                "metaData.yearFounded": 1,
                "metaData.street": 1,
                "metaData.address": 1,
                "metaData.city": 1,
                isDeleted: 1,
                "metaData.businessLogo": {
                  $cond: {
                    if: { $eq: ["$metaData.businessLogo", null] },
                    then: "",
                    else: "$metaData.businessLogo",
                  },
                },
              },
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
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
      {
        $sort: { [sortBy]: sortOrder },
      },
      {
        $skip: page * limit,
      },
      {
        $limit: limit,
      },
    ];

    const result = await Business.aggregate(pipeline);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Unable to filter businesses");
  }
};

export const registerNewBusiness = async (userId, reqBody) => {
  try {
    const newBusiness = await createNewBusiness(reqBody);
    const user = await findUserById(userId);
    if (!user) return next(errorHandler(400, "could not find user"));
    user.businessId.unshift(newBusiness._id);
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  } catch (error) {
    throw new Error(
      "could not complete action. An error was encountered with the following details:" +
        error.message
    );
  }
};
