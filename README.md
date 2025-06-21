# Real-Time Event Check-In App (Backend)

This is the **backend** for the Real-Time Event Check-In App. It uses **Node.js**, **GraphQL**, **Prisma (PostgreSQL)**, and **Socket.IO** to support real-time updates, user authentication, and event attendance.


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
JWT_SECRET=supersecret
GRAPHQL_ENDPOINT=http://localhost:5000/graphql
SOCKET_URL=http://localhost:5000
```
⚠️ Ensure these URLs match your backend setup.

Running the App
### 4. Start Expo
```bash
npm start
```
Or, platform-specific:

```bash
npm run web
```
📱 You'll need the Expo Go app on your device or a simulator/emulator for native testing.


