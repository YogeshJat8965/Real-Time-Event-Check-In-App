import jwt from "jsonwebtoken";

export function generateMockToken(user: { id: string; name: string; email: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(user, secret);
}
