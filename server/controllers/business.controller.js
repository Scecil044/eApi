import {
  editBusinessDetails,
  genericBusinessFilter,
  getAllBusinessesCount,
  listAllBusinesses,
  registerNewBusiness,
} from "../services/business.service.js";
import { createLog } from "../services/log.service.js";
import { findUserById } from "../services/user.service.js";
import { errorHandler } from "../utils/error.js";
import { logger } from "../utils/winstonLogger.js";

export const updateBusiness = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (
      !(req.user.role === "admin" || req.user.role === "superAdmin") &&
      user.businessId !== req.params.id
    ) {
      return next(errorHandler(403, "You cannot complete this action"));
    }
    const details = await editBusinessDetails(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).json(business);
  } catch (error) {
    next(error);
  }
};

export const getBusinesses = async (req, res, next) => {
  try {
    const result = await listAllBusinesses();
    if (!result)
      return next(errorHandler(400, "could not list all businesses"));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
// ==================================================================================
//                                 Aggregations
// ==================================================================================
export const countBusinesses = async (req, res, next) => {
  try {
    const result = await getAllBusinessesCount();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const filterBusinesses = async (req, res, next) => {
  try {
    console.log("query string", req.query);
    const result = await genericBusinessFilter(req.query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createNewBusiness = async (req, res, next) => {
  try {
    const data = await registerNewBusiness(req.params.userId, req.body);

    res.status(200).json(data);
  } catch (error) {
    throw new Error("could not create new business" + error.message);
  }
};
