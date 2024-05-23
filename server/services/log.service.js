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
  console.log("hello world");
};
