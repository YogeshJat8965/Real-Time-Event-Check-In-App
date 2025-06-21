import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@env"; 

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  socket = io(SOCKET_URL, {
    auth: {
      token: `Bearer ${token}`,
    },
  });

  return socket;
};

export const getSocket = () => socket;
