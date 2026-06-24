# Project & Task Management API

A RESTful API for managing projects and tasks, built with Node.js, TypeScript, Express, PostgreSQL, and Sequelize.  
This project is designed as a backend technical assessment demonstrating scalable architecture, authentication, and clean code practices.

---

## Tech Stack

- **Runtime:** Node.js (v22.18)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **API Documentation:** Swagger

---

## Features

- User Authentication (Register / Login)
- JWT Authentication & Authorization
- Password hashing using bcrypt
- Projects CRUD (scoped per user)
- Tasks CRUD under projects
- Task filtering by status & priority
- Role-based access control (Admin / Member)
- Pagination & Sorting support
- Layered architecture (Routes → Controllers → Services → Models)
- Centralized error handling
- Input validation using Zod

---

## Project Structure

src/
├── config/ # Environment & database configuration
├── controllers/ # Request handlers
├── services/ # Business logic layer
├── models/ # Sequelize models & relationships
├── routes/ # API routes
├── middlewares/ # Authentication, validation, error handling
├── validators/ # Zod schemas
├── utils/ # Helper functions (JWT, pagination, errors)
├── migrations/ # Database migrations
├── seeders/ # Seed data
├── app.ts # Express app setup
└── server.ts # Entry point

tests/
docs/

---

## Getting Started

### Prerequisites

- Node.js (v22.18)
- PostgreSQL installed and running

---

## Installation (Local Setup)

npm install
cp .env.example .env
createdb project_task_db
npm run migrate
npm run seed
npm run dev

## Swagger Documentation

## http://localhost:3000/api-docs

## API Base URL

## http://localhost:3000/api/v1

## Authentication

All endpoints except auth require:
Authorization: Bearer <token>

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| POST   | /auth/register | Register new user     |
| POST   | /auth/login    | Login and receive JWT |

| Method | Endpoint      | Description       |
| ------ | ------------- | ----------------- |
| POST   | /projects     | Create project    |
| GET    | /projects     | Get user projects |
| GET    | /projects/:id | Get project by ID |
| PUT    | /projects/:id | Update project    |
| DELETE | /projects/:id | Delete project    |

| Method | Endpoint                           | Description    |
| ------ | ---------------------------------- | -------------- |
| POST   | /projects/:projectId/tasks         | Create task    |
| GET    | /projects/:projectId/tasks         | Get all tasks  |
| GET    | /projects/:projectId/tasks/:taskId | Get task by ID |
| PUT    | /projects/:projectId/tasks/:taskId | Update task    |
| DELETE | /projects/:projectId/tasks/:taskId | Delete task    |

| Method | Endpoint | Description   |
| ------ | -------- | ------------- |
| GET    | /users   | Get all users |

## Pagination & Sorting

Supported query parameters:

page
limit
sortBy
sortOrder

## Examples

GET /projects?page=1&limit=10
GET /projects?sortBy=createdAt&sortOrder=DESC

## Authorization Model

## Member: Can access only their own data

## Admin: Can access all system data

Enforced using JWT middleware + role-based access control.

| Variable       | Description           |
| -------------- | --------------------- |
| PORT           | Server port           |
| DB_HOST        | Database host         |
| DB_USER        | Database username     |
| DB_PASS        | Database password     |
| DB_NAME        | Database name         |
| JWT_SECRET     | JWT secret key        |
| JWT_EXPIRES_IN | Token expiration time |

---

## Docker Setup

This project supports Docker for easy setup and consistent development environments.

### Prerequisites

- Docker
- Docker Compose

---

### Run with Docker

Build and start the application:
docker compose up --build

## Running Tests

createdb project_task_db_test
npm test

## Important Notes

After cloning the project
npm install
npm run migrate
npm run seed
npm run dev
