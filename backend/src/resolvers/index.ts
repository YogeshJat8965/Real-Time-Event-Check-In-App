//resolvers/index.ts
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

interface Context {
  prisma: PrismaClient;
  user: { id: string; name: string; email: string };
  io: Server;
}

export const resolvers = {
  Query: {
    events: async (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.event.findMany({ include: { attendees: true } });
    },

    event: async (_: unknown, args: { id: string }, { prisma }: Context) => {
      return prisma.event.findUnique({
        where: { id: args.id },
        include: { attendees: true },
      });
    },

    me: (_: unknown, __: unknown, { user }: Context) => user,
  },

  Mutation: {
    registerUser: async (
      _: unknown,
      args: { name: string; email: string },
      { prisma }: Context
    ) => {
      const email = args.email.toLowerCase();

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        throw new Error("User already registered. Please login.");
      }

      const user = await prisma.user.create({
        data: { name: args.name, email },
      });

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return { token, user };
    },

    loginUser: async (
      _: unknown,
      args: { name: string; email: string },
      { prisma }: Context
    ) => {
      const email = args.email.toLowerCase();

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new Error("User not found. Please register first.");
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return { token, user };
    },

    joinEvent: async (
      _: unknown,
      args: { eventId: string },
      { prisma, user, io }: Context
    ) => {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });

      const event = await prisma.event.update({
        where: { id: args.eventId },
        data: {
          attendees: { connect: { id: user.id } },
        },
        include: { attendees: true },
      });

      io.to(args.eventId).emit("userJoined", { user, eventId: args.eventId });

      return event;
    },

    leaveEvent: async (
  _: unknown,
  args: { eventId: string },
  { prisma, user, io }: Context
) => {
  const event = await prisma.event.update({
    where: { id: args.eventId },
    data: {
      attendees: {
        disconnect: { id: user.id },
      },
    },
    include: {
      attendees: true,
    },
  });

  io.to(args.eventId).emit("userLeft", {
    user,
    eventId: args.eventId,
  });

  return event;
},
  },
};
