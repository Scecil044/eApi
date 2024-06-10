import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";
import { createNewBusiness } from "./business.service.js";
import { notifyUser, sendResetEmail } from "./email.service.js";
import { findRole, findRoleByRoleId } from "./role.service.js";

import { findUserByEmail, findUserById } from "./user.service.js";

export const createUser = async (reqBody) => {
  try {
    let newUser;
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

      newUser = await User.create({
        email: reqBody.email,
        password: reqBody.password,
        phoneNumber: reqBody.phoneNumber,
        firstName: reqBody.firstName,
        lastName: reqBody.lastName,
        role: selectedRole._id,
        gender: reqBody.gender,
      });
      newUser.businessId.push(businessData._id);
      businessData.userId = newUser._id;
      await businessData.save();
      await newUser.save();
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
    if (!isMatch) throw errorHandler(400, "invalid credentials!!");
    user.password = undefined;

    // user = await User.checkRole();
    // const admin = user.admin;
    // const superAdmin = user.superAdmin;
    // const trader = user.trader;
    // const systemUser = user.systemUser;
    // const response = {
    //   admin,
    //   systemUser,
    //   trader,
    //   superAdmin,
    //   user,
    // };
    // return response;

    return user;
  } catch (error) {
    console.log(error);
    throw new Error(
      "failed to authenticate!. An error was expereinced with the followind details: " +
        error.message
    );
  }
};

export const sendPasswordResetLink = async (to, token) => {
  try {
    const subject = "Reset Password";
    const client_url = process.env.CLIENT_URL;
    const url = `${client_url}/forgor/password?q=${token}`;
    const text = `Hello, <br></br>Looks like you have forgotten your password. if so, click the link below to reset your password
    <a href='${url}'>Reset your password</a>  <br></br/> if you did not request this, please ignore the email`;
    await sendResetEmail(to, subject, text);
  } catch (error) {
    throw errorHandler(400, error.message);
  }
};
