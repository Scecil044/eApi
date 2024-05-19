import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";
import { createNewBusiness } from "./business.service.js";
import { notifyUser } from "./email.service.js";
import { findRole, findRoleByRoleId } from "./role.service.js";

import { findUserByEmail, findUserById } from "./user.service.js";

export const createUser = async (reqBody) => {
  try {
    let newUser;
    let newBusiness;
    // find role
    let roleID;
    const role = reqBody.role;
    switch (role) {
      case "superAdmin":
        roleID = 1;
        break;
      case "admin":
        roleID = 2;
        break;
      case "user":
        roleID = 3;
        break;
      case "trader":
        roleID = 4;
        break;
      default:
        roleID = 3;
    }
    // console.log("Selected role", roleID);
    const selectedRole = await findRoleByRoleId(roleID);
    if (selectedRole.roleName === "trader") {
      if (
        !reqBody.metaData.address ||
        !reqBody.metaData.city ||
        !reqBody.metaData.businessNumber ||
        !reqBody.metaData.businessEmail ||
        !reqBody.metaData.street ||
        !reqBody.metaData.businessName ||
        !reqBody.metaData.yearFounded ||
        !reqBody.metaData.category
      ) {
        throw new Error("Please provide all required fields!");
      }
      const businessData = await createNewBusiness(reqBody);
      newBusiness = businessData;

      newUser = await User.create({
        email: reqBody.email,
        password: reqBody.password,
        phoneNumber: reqBody.phoneNumber,
        firstName: reqBody.firstName,
        lastName: reqBody.lastName,
        role: selectedRole._id,
        gender: reqBody.gender,
        businessId: newBusiness._id,
      });
      const createdUser = await User.findById(newUser._id, {
        password: 0,
      }).populate("businessId");
      return createdUser;
    } else {
      newUser = await User.create({
        email: reqBody.email,
        password: reqBody.password,
        phoneNumber: reqBody.phoneNumber,
        firstName: reqBody.firstName,
        lastName: reqBody.lastName,
        role: selectedRole._id,
        gender: reqBody.gender,
      });
      const createdUser = await User.findById(newUser._id, {
        password: 0,
      }).populate("businessId");
      return createdUser;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const registerUser = async (reqBody) => {
  try {
    const isUser = await findUserByEmail(reqBody.email);
    if (isUser) throw new Error("Email taken");
    const newUser = await createUser(reqBody);
    // const emailBody = {
    //   from: "scecil072@gmail.com",
    //   to: [createdUser.email],
    //   text: "Congratulations!!",
    //   subject: "Account Creation",
    //   html: `<h2>New Registration s</h2>
    //   <br></br>
    //   <p>A new user has been created!</p>
    //   <br></br>
    //   <br></br>
    //   <p>Best Regards</p>
    //   `,
    // };
    // await notifyUser(emailBody);
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
export const loginUser = async (email, password) => {
  try {
    const user = await findUserByEmail(email);
    // console.log(user);
    const isMatch = await user.comparePasswords(password);
    if (!isMatch) return next(errorHandler(400, "invalid credentials!!"));
    user.password = undefined;
    return user;
  } catch (error) {
    console.log(error);
    throw new Error("failed to authenticate!!");
  }
};
