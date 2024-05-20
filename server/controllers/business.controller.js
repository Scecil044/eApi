import {
  editBusinessDetails,
  getAllBusinessesCount,
} from "../services/business.service.js";
import { findUserById } from "../services/user.service.js";
import { errorHandler } from "../utils/error.js";

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
