import jwt from "jsonwebtoken";

export const generateToken = (email, firstName, lastName, userId, roleName) => {
  const generatedName = firstName + " " + lastName;
  return jwt.sign(
    { id: userId, email: email, role: roleName, userName: generatedName },
    process.env.JWT_SECRET
  );
};

export const generatePasswordToken = (email) => {
  return jwt.sign({ email: email }, process.env.JWT_SECRET);
};
