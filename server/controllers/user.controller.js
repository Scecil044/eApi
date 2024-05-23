import { createLog } from "../services/log.service.js";
import {
  deactivateUserAccount,
  discardUser,
  findUserById,
  getTradersCount,
  getUsersExceptAuthenticatedUser,
  registrationsWithinTheLastSixMonths,
  updateUserDetails,
} from "../services/user.service.js";
import { errorHandler } from "../utils/error.js";
import { logger } from "../utils/winstonLogger.js";
import httpStatus from "http-status";

/*
 *Check the implementation of this
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await getUsersExceptAuthenticatedUser(req.user);
    if (!users || users.length < 1)
      return next(
        errorHandler(400, "no users have been listed in the database yet")
      );
    const logString = logger.info(
      `${req.user.userName} accessed get users route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(httpStatus.OK).json(users);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the list of all users in the database`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return next(errorHandler(404, "user not found in db!"));
    user.password = undefined;
    const logString = logger.info(
      `${req.user.userName} accessed get user route for id ${req.params.id}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json(user);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the  get user ${req.params.id} from db`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await updateUserDetails(req.params.id, req.body);
    if (!updatedUser)
      return next(
        errorHandler(400, "An error was encountered, could not update user")
      );
    const logString = logger.info(
      `${req.user.userName} accessed get user update user route for id ${req.params.id}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json(updatedUser);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the  update user functionality for ${req.params.id}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    await discardUser(req.params.id);
    const logString = logger.info(
      `${req.user.userName} accessed get user delete user route for id ${req.params.id}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json("User deleted");
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the delete user functionality for ${req.params.id}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};
export const suspendUser = async (req, res, next) => {
  try {
    console.log("authenticated user", req.user);
    console.log("userId", req.params.id);
    if (req.user.role !== "admin" && req.user.role !== "superAdmin") {
      return next(errorHandler(400, "You do not have Administrator rights!"));
    }
    const updatedUser = await deactivateUserAccount(req.params.id);
    const logString = logger.info(
      `${req.user.userName} accessed get user suspend user route for id ${req.params.id}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json(updatedUser);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the suspend user functionality for ${req.params.id}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};
/*
 * Aggregation pipelines
 * This function returns the total number of users with businesses
 */
export const getTotalNumberOfTraders = async (req, res, next) => {
  try {
    const traders = await getTradersCount();
    const logString = logger.info(
      `${req.user.userName} accessed get number of traders route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json(traders);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the get number of traders functionality`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};

/*
 * Aggregation pipelines
 * This function returns the total number of registrations within the last 6 months
 */
export const recentRegistrations = async (req, res, next) => {
  try {
    const recentRegistrationCount = await registrationsWithinTheLastSixMonths();
    const logString = logger.info(
      `${req.user.userName} accessed recent registrations route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json(recentRegistrationCount);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the get recent registrations functionality`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};
