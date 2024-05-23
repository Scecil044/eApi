import {
  createLog,
  filterSystemLogs,
  getSystemLogs,
  getSystemLogsByUserId,
} from "../services/log.service.js";
import { errorHandler } from "../utils/error.js";
import { logger } from "../utils/winstonLogger.js";

export const findUserLogs = async (req, res, next) => {
  try {
    const logs = await getSystemLogsByUserId(req.user.id);

    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};
export const listSystemLogs = async (req, res, next) => {
  try {
    const logs = await getSystemLogs(req.query);
    if (!logs)
      return next(errorHandler(400, "could not retrieve system logs!"));
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

export const searchForLog = async (req, res, next) => {
  try {
    const result = await filterSystemLogs(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
