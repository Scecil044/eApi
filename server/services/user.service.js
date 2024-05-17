import { error } from "console";
import User from "../models/User.model.js";
import moment from "moment";

export const findUserByEmail = async (email) => {
  try {
    const isUser = await User.findOne({ email });
    return isUser;
  } catch (error) {
    throw new Error("could not find user by email", error);
  }
};
export const findUserById = async (userId) => {
  try {
    const isUser = await userId.findUserById(userId);
    return isUser;
  } catch (error) {
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
export const deactivateUserAccount = async (userId) => {
  try {
    const isUser = await findUserById(userId);
    if (!isUser) throw new Error("Could not find user by provided id", error);
    isUser.isActive = false;
    await isUser.save;
    isUser.password = undefined;
    return isUser;
  } catch (error) {
    throw new Error("Failed to deactivate user account", error);
  }
};
export const getUsersExceptAuthenticatedUser = async () => {
  try {
    const systemUsers = await User.find({
      _id: { $ne: req.user.id },
      isDeleted: false,
    }).select("-password");
    return systemUsers;
  } catch (error) {
    throw new Error("Could not list users");
  }
};
export const getAllSystemUsers = async () => {
  try {
    const filter = {
      isDeleted: false,
    };
    const options = {};
    const systemUsers = await User.find(
      filter,
      "firstName lastName email phoneNumber businessId isDeleted isActive isBlackListed role metaData",
      options
    );
    return systemUsers;
  } catch (error) {
    throw new Error("Could not list all system users");
  }
};

export const updateUserDetails = async (userId, reqBody) => {
  try {
    const user = await findUserById(userId);
    if (!user) throw new Error("user not found");
    const updates = reqBody;
    updates.forEach((update) => {
      user[update] = reqBody[update];
    });
    await user.save();
    user.password = undefined;
    return user;
  } catch (error) {
    throw new Error("Failed to update details!");
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
export const registrationsWithinTheLastSixMonths = async () => {
  const currentDate = new Date();
  const sixMonthsAgo = moment().subtract(6, "months").toDate();
  const pipeline = [
    {
      $match: {
        createdAt: {
          $gte: sixMonthsAgo, // Filter registrations after or on six months ago
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
  ];
  const registrations = await User.aggregate(pipeline);
  if (registrations.length < 1) {
    return registrations[0].totalRegistrations;
  } else {
    return 0;
  }
};
/*
 * Aggregation pipelines
 * This function returns the total number of users with businesses
 */
export const getTradersCount = async () => {
  const pipeline = [
    {
      $match: {
        isDeleted: false,
        role: "trader",
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
        firstName: 1,
        lastName: 1,
        email: 1,
        phoneNumber: 1,
        profilePicture: {
          $cond: {
            if: { $gte: ["$profilePicture", null] },
            then: "$profilePicture",
            else: "",
          },
        },
        businessName: "$businessDetails.businessName",
        businessEmail: "$businessDetails.businessEmail",
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
  if (tradersCount > 0) {
    return tradersCount[0].total;
  }
};
