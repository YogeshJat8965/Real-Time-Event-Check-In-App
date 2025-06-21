//schema/typeDefs.ts
import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Event {
    id: ID!
    name: String!
    location: String!
    startTime: String!
    attendees: [User!]!
  }

  type Query {
    events: [Event!]!
    event(id: ID!): Event
    me: User
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    loginUser(name: String!, email: String!): AuthPayload!
    registerUser(name: String!, email: String!): AuthPayload!
    joinEvent(eventId: ID!): Event
    leaveEvent(eventId: ID!): Event
  }
`;
