import Business from "../models/Business.model.js";
import moment from "moment";

export const createNewBusiness = async (reqBody) => {
  try {
    const { businessLogo, businessName, yearFounded, metaData, category } =
      reqBody;
    const business = await Business.create({
      businessName,
      businessLogo,
      yearFounded,
      metaData,
      category,
      createdBy: req.user.id,
    });
    return business;
  } catch (error) {
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
