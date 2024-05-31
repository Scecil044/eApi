import User from "../models/User.model.js";
import moment from "moment";
import { findRoleByName } from "./role.service.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const findUserByEmail = async (email) => {
  try {
    const isUser = await User.findOne({ email }).populate("role", "roleName");
    return isUser;
  } catch (error) {
    console.log(error);
    throw new Error("could not find user by email", error);
  }
};
// function implementation works well
export const findUserById = async (userId) => {
  try {
    const isUser = await User.findById(userId)
      .populate("role", "roleName")
      .populate("businessId");

    // return isUser ? { ...isUser.toObject(), role: isUser.role.roleName } : null;
    return isUser;
  } catch (error) {
    console.log(error);
    throw new Error("could not find user by id", error);
  }
};

export const discardUser = async (userId) => {
  try {
    const isUser = await findUserById(userId);
    if (!isUser) throw new Error("User not found in db!!");
    isUser.isDeleted = true;
    await isUser.save();
    return isUser;
  } catch (error) {
    throw new Error("failed to delete user", error);
  }
};
/*
 *Functionality works well
 * it basically toggles between active and inactive states for user
 */
export const deactivateUserAccount = async (userId) => {
  try {
    const isUser = await findUserById(userId);
    if (!isUser) throw new Error("Could not find user by provided id");
    isUser.isActive = !isUser.isActive;
    await isUser.save();
    isUser.password = undefined;
    return isUser;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to deactivate user account", error);
  }
};

export const getUsersExceptAuthenticatedUser = async (reqUser) => {
  try {
    const systemUsers = await User.find({
      _id: { $ne: reqUser.id },
      isDeleted: false,
    })
      .select("-password")
      .populate("role", "roleName")
      .populate("businessId");

    return systemUsers;
  } catch (error) {
    console.log(error);
    throw new Error("Could not list users");
  }
};

export const getAllSystemUsers = async (reqQuery) => {
  try {
    const page = reqQuery.page ? parseInt(reqQuery.page) : 1;
    const limit = reqQuery.limit ? parseInt(reqQuery.limit) : 20;
    const sortOrder = reqQuery.sortOrder ? parseInt(reqQuery.sortOrder) : -1;
    const sortBy = reqQuery.sortBy || "createdAt";

    const filter = {
      isDeleted: false,
    };

    const options = {
      page, // mongoose-paginate-v2 expects a 1-based page number
      limit,
      sort: {
        [sortBy]: sortOrder,
      },
      populate: {
        path: "businessId",
        select:
          "metaData.businessName metaData.businessEmail metaData.businessNumber metaData.address metaData.city metaData.street metaData.yearFounded metaData.businessLogo metaData.category",
      },
    };

    const systemUsers = await User.paginate(filter, options);

    return systemUsers;
  } catch (error) {
    console.log(error);
    throw new Error("Could not list all system users");
  }
};

export const updateUserDetails = async (userId, reqBody) => {
  try {
    const userDoc = await findUserById(userId);
    if (!userDoc) throw new Error("user not found");
    const role = await findRoleByName(reqBody.role);
    reqBody.role = role._id;
    console.log("request body", reqBody);

    const updates = Object.keys(reqBody);
    console.log(updates);
    updates.forEach((update) => {
      userDoc[update] = reqBody[update];
    });
    await userDoc.save();
    const updatedUser = await findUserById(userId);
    updatedUser.password = undefined;
    return updatedUser;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update details! ", error);
  }
};
// Adjust the path to your User model

export const passwordReset = async (reqBody, reqUser) => {
  try {
    const { password, email } = reqBody;
    if (!password || !email) {
      throw errorHandler(400, "Please enter your email and a desired password");
    }

    const user = await findUserById(reqUser.id);
    if (!user) {
      throw errorHandler(400, "Could not find user");
    }

    if (user.email !== email) {
      throw errorHandler(400, "Confirm your email and retry");
    }

    const isPasswordSame = await bcrypt.compare(password, user.password);
    if (isPasswordSame) {
      throw errorHandler(
        400,
        "Please enter a new password different from the previous one"
      );
    }

    user.password = password;
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Could not complete password reset. An error occurred with the following details: " +
        error.message
    );
  }
};

// ==================================================================================
//                                 Aggregations
// ==================================================================================
export const getAllActiveUsersCount = async () => {
  try {
    const pipeline = [
      {
        $match: {
          isActive: true,
        },
      },
      {
        $group: {
          id: null,
          totalActiveUsers: {
            $sum: 1,
          },
        },
      },
    ];
    const activeUsers = await User.aggregate(pipeline);
    if (activeUsers.length > 0) {
      return activeUsers[0].totalActiveUsers;
    } else {
      return 0;
    }
  } catch (error) {
    throw new Error("failed to get active users");
  }
};

export const getAllInactiveUsersCount = async () => {
  try {
    const pipeline = [
      {
        $match: {
          isActive: false,
        },
      },
      {
        $group: {
          id: null,
          totalInactiveUsers: {
            $sum: 1,
          },
        },
      },
    ];
    const inactiveUsers = await User.aggregate(pipeline);
    if (inactiveUsers.length > 0) {
      return deletedUsers[0].totalInactiveUsers;
    } else {
      return 0;
    }
  } catch (error) {
    throw new Error("failed to get active users");
  }
};

export const getAllDeletedUsersCount = async () => {
  try {
    const pipeline = [
      {
        $match: {
          isDeleted: true,
        },
      },
      {
        $group: {
          id: null,
          totalDeletedUsers: {
            $sum: 1,
          },
        },
      },
    ];
    const deletedUsers = await User.aggregate(pipeline);
    if (deletedUsers.length > 0) {
      return deletedUsers[0].totalDeletedUsers;
    } else {
      return 0;
    }
  } catch (error) {
    throw new Error("failed to get active users");
  }
};
/*
 * Aggregation pipelines
 * This function returns the total number of registrations within the last six months
 */
export const registrationsWithinTheLastOneMonth = async () => {
  const currentDate = new Date();
  const oneMonthAgo = moment().subtract(1, "months").toDate(); // Calculate one month ago

  const pipeline = [
    {
      $match: {
        createdAt: {
          $gte: oneMonthAgo, // Filter registrations after or on one month ago
          $lte: currentDate, // Filter registrations before or on current date
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRegistrations: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0, // Exclude the default _id field
        totalRegistrations: 1, // Include the totalRegistrations field
      },
    },
  ];

  const registrations = await User.aggregate(pipeline);

  return registrations.length > 0
    ? registrations[0]
    : { totalRegistrations: 0 }; // Return the first document or a default object with totalRegistrations: 0
};

/*
 * Aggregation pipelines
 * This function returns the total number of users with businesses
 */
export const getTradersCount = async () => {
  const trader = await findRoleByName("trader");
  console.log(trader);
  const pipeline = [
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "roleDetails",
      },
    },
    {
      $unwind: "$roleDetails",
    },
    {
      $match: {
        isDeleted: false,
        "roleDetails._id": trader._id,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: 1,
        },
      },
    },
  ];

  const tradersCount = await User.aggregate(pipeline);
  return tradersCount.length > 0 ? tradersCount[0].total : 0;
};

export const filterUsers = async (reqQuery) => {
  try {
    const limit = reqQuery.limit ? parseInt(reqQuery.limit) : 10;
    const page = reqQuery.page ? parseInt(reqQuery.page) : 0;
    const sortOrder = reqQuery.sortOrder ? parseInt(reqQuery.sortOrder) : -1;
    const sortBy = reqQuery.sortBy || "createdAt";
    const searchRegex = reqQuery.searchTerm
      ? new RegExp(reqQuery.searchTerm, "i")
      : null;

    const pipeline = [
      {
        $match: {
          isDeleted: false,
          ...(searchRegex && {
            $or: [
              { firstName: { $regex: searchRegex } },
              { lastName: { $regex: searchRegex } },
              { email: { $regex: searchRegex } },
              { phoneNumber: { $regex: searchRegex } },
            ],
          }),
        },
      },
      {
        $sort: {
          [sortBy]: sortOrder,
        },
      },
      {
        $skip: page * limit,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "businesses",
          localField: "businessId",
          foreignField: "_id",
          as: "business",
        },
      },
      {
        $unwind: {
          path: "$business",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $facet: {
          results: [
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                business: {
                  _id: 1,
                  "metaData.businessName": 1,
                  "metaData.businessEmail": 1,
                  "metaData.businessNumber": 1,
                  "metaData.address": 1,
                  "metaData.city": 1,
                  "metaData.street": 1,
                  "metaData.yearFounded": 1,
                  "metaData.businessLogo": 1,
                  "metaData.category": 1,
                },
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $unwind: "$totalCount",
      },
      {
        $addFields: {
          totalCount: { $ifNull: ["$totalCount.count", 0] },
        },
      },
    ];

    const result = await User.aggregate(pipeline);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("could not filter users");
  }
};

export const getDeletedUsers = async () => {
  try {
    const pipeline = [
      {
        $match: {
          isDeleted: true,
        },
      },
      {
        $unwind: {
          path: "$businessId",
          preserveNullAndEmptyArrays: true,
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
        $unwind: {
          path: "$businessDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          email: { $first: "$email" },
          phoneNumber: { $first: "$phoneNumber" },
          profilePicture: { $first: "$profilePicture" },
          gender: { $first: "$gender" },
          role: { $first: "$role" },
          isActive: { $first: "$isActive" },
          isDeleted: { $first: "$isDeleted" },
          isBlackListed: { $first: "$isBlackListed" },
          metaData: { $first: "$metaData" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          businessId: { $addToSet: "$businessId" },
          businesses: { $addToSet: "$businessDetails" },
        },
      },
    ];
    const result = await User.aggregate(pipeline);
  } catch (error) {
    throw new Error("could not get deleted users:" + error.message);
  }
};
