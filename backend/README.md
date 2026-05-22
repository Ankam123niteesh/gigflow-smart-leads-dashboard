# GigFlow Backend

TypeScript Express API for GigFlow – Smart Leads Dashboard.

## Features

- JWT authentication with bcrypt password hashing
- Role-based access control for Admin and Sales User
- Lead CRUD with filtering, search, sorting, and pagination
- MongoDB with Mongoose models
- TypeScript-first validation and error handling

## Environment

Copy `.env.example` to `.env` and update values.

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Leads

All lead routes are protected.

- `GET /api/leads`
- `POST /api/leads`
- `GET /api/leads/:id`
- `PUT /api/leads/:id`
- `DELETE /api/leads/:id`

## Query Parameters

The lead list supports combined filters:

- `status=New|Contacted|Qualified|Lost`
- `source=Website|Instagram|Referral`
- `search=text`
- `sort=latest|oldest`
- `page=1`

Response includes:

- `totalLeads`
- `totalPages`
- `currentPage`
- `leads`

## Roles

- `Admin`: full access to all lead actions
- `Sales User`: can create and manage leads assigned to them or all leads depending on route policy described below

## Notes

The backend ships with route-level role checks and reusable validation schemas. The frontend will consume the API through environment-based base URLs.
