// backend/src/auth/jwt.ts
import jwt from "jsonwebtoken";

interface User {
  id: string;
  name: string;
  email: string;
}

export const generateToken = (user: User) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  return jwt.sign(payload, secret, { expiresIn: "7d" });
};
