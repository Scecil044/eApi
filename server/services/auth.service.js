import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";
import { createNewBusiness } from "./business.service.js";
import { notifyUser } from "./email.service.js";
import { findRole, findRoleByRoleId } from "./role.service.js";

import { findUserByEmail, findUserById } from "./user.service.js";

export const authenticateUser = async () => {};

export const registerUser = async (reqBody) => {
  try {
    const isUser = await findUserByEmail(reqBody.email);
    if (isUser) throw new Error("Email taken");
    // find role
    let roleID;
    const role = reqBody.role;
    switch (role) {
      case role === "superAdmin":
        roleID = 1;
        break;
      case role === "admin":
        roleID = 2;
        break;
      case role === "user":
        roleID = 3;
        break;
      case role === "trader":
        roleID = 4;
        break;
      default:
        roleID = 3;
    }
    const selectedRole = await findRoleByRoleId(roleID);
    const newUser = await User.create({
      email: reqBody.email,
      password: reqBody.password,
      phoneNumber: reqBody.phoneNumber,
      firstName: reqBody.firstName,
      lastName: reqBody.lastName,
      role: selectedRole._id,
      gender: reqBody.gender,
    });
    if (
      reqBody.category ||
      reqBody.businessEmail ||
      reqBody.businessName ||
      reqBody.yearFounded ||
      reqBody.metaData
    ) {
      const businessData = await createNewBusiness(req.body);
      if (!businessData)
        return next(errorHandler("could not create new business"));
    }
    const createdUser = await User.findById(newUser._id, {
      password: 0,
    }).populate("businessId");
    // const emailBody = {
    //   from: process.env.SMTP_EMAIL,
    //   to: createdUser.email,
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
    return createdUser;
  } catch (error) {
    console.log(error);
    throw new Error("registration process failure", error);
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
