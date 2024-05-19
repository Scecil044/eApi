import Business from "../models/Business.model.js";
import { findUserById } from "./user.service.js";

export const createNewBusiness = async (reqBody) => {
  try {
    const {
      businessLogo,
      businessName,
      yearFounded,
      businessNumber,
      businessEmail,
      address,
      category,
      city,
      street,
    } = reqBody.metaData;
    const business = await Business.create({
      metaData: {
        address,
        city,
        street,
        businessNumber,
        businessEmail,
        category,
        businessLogo,
        businessName,
        yearFounded,
      },
    });
    return business;
  } catch (error) {
    console.log(error);
    throw new Error("could not save new business!");
  }
};

export const getBusinessById = async (id) => {
  try {
    const isBusiness = await Business.findById(id).populate("userId");
    if (!isBusiness) throw new Error("Business not found!");
    return isBusiness;
  } catch (error) {
    throw new Error("could not get business by id");
  }
};

export const editBusinessDetails = async (
  businessId,
  reqBody,
  authenticatedUser
) => {
  try {
    const business = await getBusinessById(businessId);
    const updates = Object.keys(reqBody);
    updates.forEach((update) => {
      business[update] = reqBody[update];
    });
    await business.save();
    return business;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
// ==================================================================================
//                                 Aggregations
// ==================================================================================

export const getAllBusinessesCount = async () => {
  try {
    const pipeline = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          totalNumberOfBusinesses: {
            $sum: 1,
          },
        },
      },
    ];
    const businessCount = await Business.aggregate(pipeline);
    if (businessCount < 1) {
      return 0;
    } else {
      return businessCount[0].totalNumberOfBusinesses;
    }
  } catch (error) {
    throw new Error("failed to get business count", error);
  }
};
