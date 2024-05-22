import Logger from "../models/Logger.js";

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
