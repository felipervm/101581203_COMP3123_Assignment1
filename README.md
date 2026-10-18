# COMP3123 Assignment 1 — Secure Employee API

**Student ID:** 101581203  
**Course:** COMP3123 — Full Stack Development I  
**Assignment:** Assignment 1 — Backend REST API

A secure Node.js/Express/MongoDB REST API with user registration, JWT authentication, employee CRUD, per-user employee ownership, validation, rate limiting, Helmet security headers, local logging, health checks, Postman evidence, and Vercel deployment support.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Validation (`express-validator`)
- Security headers (`helmet`)
- Rate limiting (`express-rate-limit`)
- Logging (`winston`)
- Postman
- Vercel

## Project Structure

```text
.
├── api/index.js
├── src/
│   ├── app.js
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── validators/
├── logs/
├── postman/
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── vercel.json
```

## Setup

1. Clone this repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set `MONGODB_URI` to a MongoDB connection string whose database is **comp3123_assignment1**.
5. Set a strong `JWT_SECRET`.
6. Run `npm run dev` or `npm start`.

Default local URL: `http://localhost:3000`

## Live Deployment

Production API: `https://101581203-comp-3123-assignment1.vercel.app`

Health check: `https://101581203-comp-3123-assignment1.vercel.app/health`

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/comp3123_assignment1
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

Never commit the real `.env` file.

## Required Endpoints

| Method | Endpoint | Success |
|---|---|---:|
| POST | `/api/v1/user/signup` | 201 |
| POST | `/api/v1/user/login` | 200 |
| GET | `/api/v1/emp/employees` | 200 |
| POST | `/api/v1/emp/employees` | 201 |
| GET | `/api/v1/emp/employees/:eid` | 200 |
| PUT | `/api/v1/emp/employees/:eid` | 200 |
| DELETE | `/api/v1/emp/employees?eid=xxx` | 204 |
| GET | `/health` | 200 |

Employee endpoints require:

```http
Authorization: Bearer <jwt>
```

## Authentication

### Signup

`POST /api/v1/user/signup`

```json
{
  "username": "felipe",
  "email": "felipe@example.com",
  "password": "StrongPass123!"
}
```

Passwords are hashed with bcrypt before storage and are never returned by the API.

### Login

Login accepts either username + password or email + password.

```json
{
  "username": "felipe",
  "password": "StrongPass123!"
}
```

or

```json
{
  "email": "felipe@example.com",
  "password": "StrongPass123!"
}
```

A successful login returns a JWT.

## Authorization / Ownership

Every employee stores a MongoDB `user` ObjectId referring to its owner. The API never trusts a client-supplied owner ID. It derives ownership from the authenticated JWT.

Employee queries enforce ownership server-side. A logged-in user can only list, retrieve, update, or delete employees they created. Cross-user access returns `403 Forbidden`.

## Validation

The API validates:

- username length and allowed characters
- valid email format
- strong passwords
- required employee fields
- positive numeric salary
- valid dates
- valid MongoDB ObjectIds
- reasonable string lengths

Validation errors return JSON with `400 Bad Request`.

## Security

### Helmet

Helmet is enabled globally to add defensive HTTP security headers.

### Rate Limiting

Authentication endpoints are protected by a stricter limiter: **5 requests per minute per IP**. General API traffic is also rate-limited. If a limit is exceeded, the API returns `429 Too Many Requests`.

### Environment Variables

Secrets are stored in `.env`, which is ignored by Git. A safe `.env.example` is included.

## Logging

Winston writes local logs to:

- `logs/app.log`
- `logs/error.log`

Logged information includes timestamps, request method/path/status, authentication events, validation/authorization failures, and application errors. Passwords, JWT secrets, database passwords, and full tokens are intentionally not logged.

A safe `logs/sample.log` is included as an example because generated logs are ignored by Git.

## Health Check

`GET /health`

Example:

```json
{
  "success": true,
  "status": "ok",
  "database": "connected"
}
```

## Postman

Import:

`postman/COMP3123_Assignment1.postman_collection.json`

The collection contains positive and negative requests for signup, login, JWT protection, employee CRUD, validation, ownership, rate limiting, and health checks.

Recommended variables:

- `baseUrl`
- `tokenA`
- `tokenB`
- `employeeAId`
- `employeeBId`

## Vercel

This repository includes `vercel.json` and `api/index.js`.

In Vercel, configure:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `NODE_ENV=production`

Do not add secrets to the repository.

## Submission Evidence Checklist

- GitHub repository link
- ZIP without `node_modules`
- exported Postman collection
- MongoDB database/users/employees screenshots
- hashed-password screenshot
- user/employee ownership screenshot
- signup success + validation/duplicate screenshots
- login success + invalid credentials screenshots
- JWT missing/invalid screenshots
- employee CRUD screenshots
- invalid ObjectId / missing employee screenshots
- two-user ownership rejection screenshots
- `429 Too Many Requests` screenshot
- Helmet/security-header evidence
- `/health` screenshot
- local log-file screenshot
- deployed Vercel URL (if deployed)

## Sample Marking Credentials

Create non-sensitive test users in your own database for marking, for example:

- `markerA@example.com` / `MarkerPass123!`
- `markerB@example.com` / `MarkerPass123!`

These are sample test credentials only; do not reuse real passwords.
