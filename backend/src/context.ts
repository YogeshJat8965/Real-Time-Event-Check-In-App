// backend/src/context.ts
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

interface AuthPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
}

export const createContext = ({ req, io }: { req: any; io: Server }) => {
  const authHeader = req.headers.authorization || "";
  let user: AuthPayload | null = null;

  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (typeof decoded !== "string") {
        user = decoded as AuthPayload;
      } 
    } catch (err) {
      console.warn("Invalid token:", (err as Error).message);
    }
  }

  return { prisma, user, io };
};
