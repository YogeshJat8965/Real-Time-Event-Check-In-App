# Real-Time Event Check-In App (Backend)
## Real-Time Event Check-In App is a full-stack application that allows users to register and check in to events in real-time. It features a React Native (Expo) frontend and a Node.js backend powered by GraphQL, Prisma (PostgreSQL), and Socket.IO for instant updates on event participation.


## Getting Started

### 1. Clone and Navigate

```bash
cd backend
```
### 2.  Install Dependencies
```bash
npm install

```
### 3. Setup Environment Variables
Create a .env file in the root of the backend folder:
```bash
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"
JWT_SECRET=supersecret
PORT=5000
```
#### For Example, 
```bash
DATABASE_URI="postgresql://postgres:abishek123@localhost:5432/postgres"
```
Ensure PostgreSQL is running locally, and a database named postgres exists (or update the URL accordingly).

### 4. Prisma Setup
Generate Prisma Client
```bash
npx prisma generate
```
Run Migrations
```bash
npx prisma migrate dev --name init
```

Seed the Database
```bash
npm run seed
```
### 5. Start the Server
```bash
npm run dev
```
The server should now be running at:

```bash
http://localhost:5000/graphql
```
---
# Real-Time Event Check-In App (Client)

This is the **React Native (Expo)** frontend for the Real-Time Event Check-In App. It connects to a GraphQL backend and uses **Socket.IO** for real-time updates. Built with **Apollo Client**, **Zustand**, and **React Navigation**.


## 🚀 Getting Started

### 1. Clone and Navigate

```bash
cd client
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Setup Environment Variables
Create a .env file in the root:
```bash
GRAPHQL_ENDPOINT=http://localhost:5000/graphql
SOCKET_URL=http://localhost:5000
```
⚠️ Ensure these URLs match your backend setup.

Running the App
### 4. Start Expo
```bash
npm start
```


