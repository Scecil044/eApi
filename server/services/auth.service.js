import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";
import { createNewBusiness } from "./business.service.js";
import { notifyUser } from "./email.service.js";
import { findRole, findRoleByRoleId } from "./role.service.js";

import { findUserByEmail, findUserById } from "./user.service.js";

export const authenticateUser = async () => {};

export const registerUser = async (reqBody) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      businessName,
      yearFounded,
      businessEmail,
      metaData,
      category,
    } = reqBody;
    const isUser = await findUserByEmail(email);
    if (isUser) throw new Error("Email taken");
    // find role
    const selectedRole = await findRoleByRoleId(reqBody.role);
    const newUser = await User.create({
      email,
      password,
      phoneNumber,
      firstName,
      lastName,
      role: selectedRole._id,
    });
    if (category || businessEmail || businessName || yearFounded || metaData) {
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
    throw new Error("registration process failure", error);
  }
};
export const loginUser = async (email, password) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) next(errorHandler(400, "user not found"));
    const isMatch = await user.comparePasswords(password);
    if (!isMatch) return next(errorHandler(400, "invalid credentials"));
    user.password = undefined;
    return user;
  } catch (error) {
    throw new Error("failed to authenticate!!");
  }
};
