import { loginUser, registerUser } from "../services/auth.service.js";
import { findRoleByRoleId } from "../services/role.service.js";
import { findUserByEmail } from "../services/user.service.js";
import { errorHandler } from "../utils/error.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(errorHandler(400, "please provide all required fields"));
    const authenticatedUser = await loginUser(email, password);
    // const role = await Role.findById(authenticatedUser.role);
    // authenticatedUser.role = undefined;
    // const userWithRole = {
    //   ...authenticatedUser.toObject(), // Convert Mongoose document to plain JavaScript object
    //   role: role ? role.roleName : null,
    // };

    res
      .cookie(
        "access_token",
        generateToken(
          authenticatedUser.email,
          authenticatedUser._id,
          authenticatedUser.role.roleName
        ),
        {
          httpOnly: true,
        }
      )
      .status(200)
      .json(authenticatedUser);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
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
      role,
      gender,
    } = req.body;
    if (
      !phoneNumber ||
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !role ||
      !gender
    )
      return next(errorHandler(400, "Please provide all required fields"));
    const user = await registerUser(req.body);
    if (!user) return next(errorHandler(400, "failed to register user!"));
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("logged out!");
  } catch (error) {
    next(error);
  }
};

export const continueWithGoogle = async (req, res, next) => {
  try {
    const { email, name, profilePicture } = req.body;
    const user = await findUserByEmail(email);
    const role = await findRoleByRoleId(user.roleName);
    if (user) {
      user.password = undefined;
      res
        .cookie("access_token", generateToken(user.email, user._id, role._id), {
          httpOnly: true,
        })
        .status(200)
        .json(user);
    } else {
      const generateRandomPassword = (length) => {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_";
        let randomPassword = "";
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomPassword += characters.charAt(randomIndex);
        }
        return randomPassword;
      };
      const firstName = name.split(" ")[0].toLowerCase();
      const lastName = name.split(" ")[1].toLowerCase();
      const pwd = generateRandomPassword(10);
      const hashedPassword = await bcrypt.hash(pwd);
      const data = {
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: "+2540000000000",
      };
      const newUser = await registerUser(data);
      const role = await findRoleByRoleId(newUser.roleName);
      newUser.password = undefined;
      res
        .cookie(
          "access_token",
          generateToken(newUser.email, newUser._id, role._id),
          {
            httpOnly: true,
          }
        )
        .status(200)
        .json(newUser);
    }
  } catch (error) {
    next(error);
  }
};
