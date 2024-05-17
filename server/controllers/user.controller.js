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

export const getUsers = async () => {
  try {
    const users = await getUsersExceptAuthenticatedUser();
    if (!users || users.length < 1)
      return next(
        errorHandler(400, "no users have been listed in the database yet")
      );
    resizeBy.status(200).json(users);
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
    if (!updateUser)
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
    const deleteAction = await discardUser;
  } catch (error) {
    next(error);
  }
};
export const suspendUser = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      next(
        errorHandler(404, "you do not have the rights to complete this action")
      );
    const userData = await deactivateUserAccount(req.params.id);
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};
/*
 * Aggregation pipelines
 * This function returns the total number of users with businesses
 */
export const getTotalNumberOfTraders = async () => {
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
export const recentRegistrations = async () => {
  try {
    const recentRegistrationCount = await registrationsWithinTheLastSixMonths();
    test.status(200).json(recentRegistrationCount);
  } catch (error) {
    next(error);
  }
};
