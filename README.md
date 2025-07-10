# Team Collaboration Platform

This repository contains a simple full‑stack application that demonstrates a small team collaboration tool. The project includes a Node.js/Express API with a React front‑end and uses PostgreSQL via Prisma ORM.

## Technology Stack

- **Node.js 18** with **Express** – REST API server
- **Prisma** ORM with **PostgreSQL** database
- **React** (Create React App) for the front‑end
- **Docker** & **Docker Compose** for local development
- **ESLint**, **Prettier** and **Husky** for code quality

## Features

- User registration and login using JWT authentication
- Manage teams: create teams, invite members by user ID or email, list your teams
- Boards inside teams: create boards and list boards for a team
- Tasks inside boards: create, update and delete tasks, assign members and change task status (todo / in‑progress / done)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [PostgreSQL](https://www.postgresql.org/) (unless using Docker)
- Optional: [Docker](https://www.docker.com/) and Docker Compose

### Installation

1. Install backend dependencies:
   ```bash
   npm install
   ```
2. Install front‑end dependencies:
   ```bash
   cd client && npm install
   cd ..
   ```
3. Create a `.env` file in the project root and define the following variables:
   ```bash
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<db_name>
   JWT_SECRET=your_jwt_secret
   PORT=5555
   REACT_APP_API_URL=http://localhost:5555/api
   ```

### Running with Docker

If Docker is available you can start the API, React client and PostgreSQL database with one command:

```bash
docker-compose up --build
```

Docker Compose will run database migrations automatically and launch the API on port **5555** and the React app on port **3001**.

### Running locally without Docker

1. Ensure PostgreSQL is running and `DATABASE_URL` in your `.env` points to it.
2. Apply database migrations and generate the Prisma client:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Start the API server:
   ```bash
   node index.js
   ```
4. In a separate terminal start the React development server:

   ```bash
   cd client && npm start
   ```

5. (Optional) Seed the database with some example data:
   ```bash
   npm run seed
   ```

The React app will be accessible at `http://localhost:3000` (or the port shown by `npm start`).

## Useful scripts

- `npm run lint` – run ESLint on the backend
- `cd client && npm start` – run the React front‑end
- `docker-compose up` – start the API, client and database using Docker
- `npm run seed` – populate the database with sample data
- `npx cypress open` – run Cypress tests in interactive mode
