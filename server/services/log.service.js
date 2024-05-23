import Logger from "../models/Logger.model.js";
import { findUserById } from "./user.service.js";

export const createLog = async (userId, message) => {
  try {
    const newLog = await Logger.create({
      userId: userId,
      message: message,
    });
    if (!newLog) throw new Error("could not save log");
    return newLog;
  } catch (error) {
    console.log(error);
    throw new Error("could not create log");
  }
};

export const getSystemLogs = async (reqQuery) => {
  try {
    const filter = {
      isDeleted: false,
    };
    const options = {
      limit: reqQuery.limit ? parseInt(reqQuery.limit) : 20,
      skip: reqQuery.page ? parseInt(reqQuery.page) : 0,
    };
    const systemLogs = await Logger.find(filter, null, options);
    return systemLogs;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSystemLogsByUserId = async (userId) => {
  try {
    const user = await findUserById(userId);
    const userLogs = await Logger.find({
      _id: userId ? userId : req.user.id,
      isDeleted: false,
    });
    if (!userLogs)
      throw new Error(`Could not list system logs for ${user.firstName}`);
    return userLogs;
  } catch (error) {
    console.log(error);
    throw new Error("could not find system logs by the provided user id");
  }
};

export const filterSystemLogs = async (reqQuery) => {
  try {
    const limit = reqQuery.limit ? parseInt(reqQuery.limit) : 2;
    const page = reqQuery.page ? parseInt(reqQuery.page) : 0;
    const sortOrder = reqQuery.sortBy ? parseInt(reqQuery.sortBy) : -1;
    const sortBy = reqQuery.sortBy || "dateCreated";
    const searchRegex = reqQuery.searchTerm
      ? new RegExp(reqQuery.searchTerm, "i")
      : null;

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId", // Assuming userId is the reference in Logger documents
          foreignField: "_id",
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
              { message: { $regex: searchRegex } },
              { "userDetails.firstName": { $regex: searchRegex } },
              { "userDetails.lastName": { $regex: searchRegex } },
              { "userDetails.email": { $regex: searchRegex } },
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
        $skip: limit * page,
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
                message: 1,
                dateCreated: 1,
                firstName: "$userDetails.firstName",
                lastName: "$userDetails.lastName",
                email: "$userDetails.email",
                phoneNumber: "$userDetails.phoneNumber",
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $unwind: {
          path: "$totalCount",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          totalCount: { $ifNull: ["$totalCount.count", 0] },
        },
      },
    ];

    const result = await Logger.aggregate(pipeline);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("could not filter system logs");
  }
};
