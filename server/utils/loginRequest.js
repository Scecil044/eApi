import { errorHandler } from "./error.js";

export const loginRequest = (reqBody) => {
  try {
    const { email, password } = reqBody;
    if (!email) {
      throw errorHandler(400, "Please provide your email");
    } else if (!password) {
      throw errorHandler(400, "Please provide your email");
    } else if (!email && !password) {
      throw errorHandler(
        400,
        "Please a valid email and the associated password"
      );
    }
  } catch (error) {
    throw new Error(
      "lOGIN input validation failed with the error:",
      +error.message
    );
  }
};
