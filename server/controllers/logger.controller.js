import {
  createLog,
  discardLog,
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
    const logString = logger.info(
      `${req.user.userName} accessed system logs route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json(result);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access system logs`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};

export const deleteSystemLog = async (req, res, next) => {
  try {
    const response = await discardLog(req.params.logId);
    if (!response) return next(errorHandler(400, "could not complete action"));
    res.status(200).json("log deleted successfully");
  } catch (error) {
    next(error);
  }
};
