import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
// import jwtDecode from "jwt-decode";

export const auth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(403, "not token, not authorized!"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Not Authorized!ß"));
    req.user = user;
    next();
  });
};
