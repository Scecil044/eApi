import jwt from "jsonwebtoken";

export const generateToken = (email, userId, roleName) => {
  return jwt.sign(
    { id: userId, email: email, role: roleName },
    process.env.JWT_SECRET
  );
};
