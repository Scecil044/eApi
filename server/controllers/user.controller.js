import { findRoleByRoleId } from "../services/role.service.js";
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
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return next(errorHandler(404, "user not found in db!"));
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
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
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    await discardUser(req.params.id);
    res.status(200).json("User deleted");
  } catch (error) {
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
    res.status(200).json(updatedUser);
  } catch (error) {
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
    res.status(200).json(traders);
  } catch (error) {
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
    test.status(200).json(recentRegistrationCount);
  } catch (error) {
    next(error);
  }
};
