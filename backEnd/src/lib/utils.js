import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = process.env;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // prevent xss attacks:cross-site scripting
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: "strict", // csrf attacks
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
