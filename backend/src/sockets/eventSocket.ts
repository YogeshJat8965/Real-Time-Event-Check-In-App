//sockets/eventSocket.ts
import { Server } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface UserPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
}

export const initSocket = (io: Server) => {
  io.on("connection", (socket) => {
    const rawToken = socket.handshake.auth?.token || "";

    if (!rawToken.startsWith("Bearer ")) {
      socket.disconnect();
      return;
    }

    const token = rawToken.replace("Bearer ", "");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

      if (typeof decoded === "string") {
        socket.disconnect();
        return;
      }

      const user = decoded as UserPayload;
      socket.data.user = user;

      socket.on("joinRoom", (eventId: string) => {
        socket.join(eventId);
      });

      socket.on("leaveRoom", (eventId: string) => {
        socket.leave(eventId);
      });

      socket.on("disconnect", () => {
        // clean up if needed
      });

    } catch {
      socket.disconnect();
    }
  });
};
