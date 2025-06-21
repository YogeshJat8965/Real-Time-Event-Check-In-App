// backend/src/index.ts
import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./resolvers/index.js";
import { createContext } from "./context.js";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { initSocket } from "./sockets/eventSocket.js";

dotenv.config();

const app = express();
app.use(cors());

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

initSocket(io);

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => createContext({ req, io }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer();
  