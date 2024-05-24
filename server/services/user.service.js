import User from "../models/User.model.js";
import moment from "moment";
import { findRoleByName } from "./role.service.js";


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
    const isUser = await User.findById(userId).populate("role", "roleName");

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
      .populate("role", "roleName");
    // Extracting roles from users
    // const usersWithRoles = systemUsers.map((user) => {
    //   return {
    //     ...user.toObject(),
    //     role: user.role ? user.role.roleName : null,
    //   };
    // });

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
      limit,
      skip: page,
      sort: {
        [sortBy]: sortOrder,
      },
    };
    const systemUsers = await User.paginate(
      filter,
      "firstName lastName email phoneNumber businessId isDeleted isActive isBlackListed role metaData",
      options
    );

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
    const roleId = await findRoleByName(reqBody.role);
    reqBody.role = roleId;

    const updates = Object.keys(reqBody);
    console.log(updates);
    updates.forEach((update) => {
      userDoc[update] = reqBody[update];
    });
    await userDoc.save();
    userDoc.password = undefined;
    return userDoc;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update details! ", error);
  }
};
// export const getUserRole = async (roleString) => {
//   try {
//     const pipeline = [
//       {
//         $match: {
//           isDeleted: false,
//         },
//       },
//       {
//         $lookup: {
//           from: "roles",
//           foreignField: "role",
//           localField: "_id",
//           as: "roleDetails",
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           "$roleDetails.roleName": {
//             $eq: roleString,
//           },
//         },
//       },
//       {
//         $project: {
//           firstName: 1,
//           lastName: 1,
//           email: 1,
//           phoneNumber: 1,
//           roleName: "$roleDetails.roleName",
//         },
//       },
//     ];
//     // return users
//     const users = await User.aggregate(pipeline);
//     return users;
//   } catch (error) {
//     throw new Error("could not find user role");
//   }
// };

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
  const trader = await findRoleByName("trader");
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
    // {
    //   $project: {
    //     firstName: 1,
    //     lastName: 1,
    //     email: 1,
    //     phoneNumber: 1,
    //     profilePicture: {
    //       $cond: {
    //         if: { $gte: ["$profilePicture", null] },
    //         then: "$profilePicture",
    //         else: "",
    //       },
    //     },
    //     businessName: "$businessDetails.businessName",
    //     businessEmail: "$businessDetails.businessEmail",
    //   },
    // },
  ];

  const tradersCount = await User.aggregate(pipeline);
  if (tradersCount > 0) {
    return tradersCount[0].total;
  } else {
    return 0;
  }
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
        $facet: {
          results: [
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
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
