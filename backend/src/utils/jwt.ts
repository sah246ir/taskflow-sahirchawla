import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env";

export const signJwtToken = (userId: string,email: string) => {
  return jwt.sign({ userId, email }, jwtSecret, { expiresIn: "1h" });
};

export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, jwtSecret);
};
