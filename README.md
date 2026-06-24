Project & Task Management API

A RESTful API for managing projects and tasks, built with Node.js, TypeScript, Express, PostgreSQL, and Sequelize. Built as a backend technical assessment.

Tech Stack
Category Technology
Runtime Node.js (v22.18.)
Framework Express.js
Database PostgreSQL
ORM Sequelize
Authentication JWT (JSON Web Tokens)
Language TypeScript
Validation Zod
API Docs Swagger
Features
Auth: registration, login, JWT authentication, bcrypt password hashing
Projects: full CRUD scoped to authenticated user
Tasks: full CRUD under projects with filtering by status and priority
Authorization: role-based access control (admin / member)
Pagination & Sorting: supported on list endpoints
Layered Architecture: routes → controllers → services → models
Validation: using Zod
Error Handling: centralized error handler

Project Structure
src/
├── config/ # environment config + database setup
├── controllers/ # request handlers
├── services/ # business logic
├── models/ # Sequelize models + relations
├── routes/ # API routes
├── middlewares/ # auth, validation, error handling
├── validators/ # Zod schemas
├── utils/ # helpers (JWT, errors, pagination)
├── migrations/ # database migrations
├── seeders/ # seed data
├── app.ts # express app setup
└── server.ts # entry point
tests/
docs/
Getting Started
Prerequisites
Node.js v18+
PostgreSQL
Option A — Run locally
npm install
cp .env.example .env
createdb project_task_db
npm run migrate
npm run seed
npm run dev

API:

http://localhost:3000/api/v1

Swagger:

http://localhost:3000/api-docs
Option B — Docker
docker compose up --build
Running Tests
createdb project_task_db_test
npm test
API Documentation
Swagger: http://localhost:3000/api-docs

Database
Migrations: /migrations
Seed data: /seeders
Run:
npm run migrate && npm run seed
API Overview

Base URL:

/api/v1

All endpoints except auth require:

Authorization: Bearer <token>
Auth
Method Endpoint Description
POST /auth/register Create new user
POST /auth/login Login and get JWT
Projects
Method Endpoint Description
POST /projects Create project
GET /projects Get user projects
GET /projects/:id Get project by ID
PUT /projects/:id Update project
DELETE /projects/:id Delete project
Tasks
Method Endpoint Description
POST /projects/:projectId/tasks Create task
GET /projects/:projectId/tasks Get tasks
GET /projects/:projectId/tasks/:taskId Get task by ID
PUT /projects/:projectId/tasks/:taskId Update task
DELETE /projects/:projectId/tasks/:taskId Delete task
Users (Admin only)
Method Endpoint Description
GET /users Get all users
Pagination & Sorting

Supported query params:

page
limit
sortBy
sortOrder

Example:

GET /projects?page=1&limit=10
GET /projects?sortBy=createdAt&sortOrder=DESC
Authorization Model
Members: only their own data
Admins: all system data
Enforced via JWT middleware + role checks
Notes
Passwords hashed with bcrypt
JWT authentication
Zod validation
Centralized error handling
Sequelize ORM
UUID primary keys
Environment Variables
Variable Description
PORT Server port
DB_HOST Database host
DB_USER Database user
DB_PASS Database password
DB_NAME Database name
JWT_SECRET JWT secret
JWT_EXPIRES_IN Token expiration
Important Note

After cloning:

npm install
npm run migrate
npm run test
