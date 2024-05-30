import mongoose from "mongoose";
import Token from "../models/Token.model.js";
import jwt from "jsonwebtoken";

export const saveToken = async (token, expiry, userId) => {
  try {
    const tokenDoc = await Token.create({
      token,
      expiry,
      userId,
      isBlackListed: false,
    });
    return tokenDoc;
  } catch (error) {
    throw new Error(
      "could not save token. Encountered error: " + error.message
    );
  }
};

export const verifyToken = async (token, userId) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const token = await Token.findOne({
      userId: mongoose.Types.ObjectId(payload.userId),
      isBlackListed: false,
      isDeleted: false,
    });
    if (!token) {
      throw new Error("Token not found!!");
    }
    return token;
  } catch (error) {
    throw new Error(
      "could not save token. Encountered error: " + error.message
    );
  }
};
