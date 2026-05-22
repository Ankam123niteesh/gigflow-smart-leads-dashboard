# GigFlow – Smart Leads Dashboard

GigFlow is a full MERN stack TypeScript application for managing sales leads with secure authentication, role-based access control, advanced filtering, and CSV export.

## Stack

- Frontend: React + TypeScript + Vite + TailwindCSS
- Backend: Node.js + Express + TypeScript
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt

## Project Structure

- `backend/` - Express API, auth, leads, and MongoDB models
- `frontend/` - React dashboard UI
- `docker-compose.yml` - local multi-service environment

## Setup

### Backend

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.
3. Run `npm install` and `npm run dev` inside `backend/`.

### Frontend

1. Create `frontend/.env` with `VITE_API_URL=http://localhost:5000`.
2. Run `npm install` and `npm run dev` inside `frontend/`.

### Docker

Run the full stack with:

```bash
docker compose up --build
```

## Backend API

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Leads

Protected by JWT.

- `GET /api/leads`
- `POST /api/leads`
- `GET /api/leads/:id`
- `PUT /api/leads/:id`
- `DELETE /api/leads/:id`

## API Documentation

### Authentication

`POST /api/auth/register`

Request body:

```json
{
  "name": "Ava Johnson",
  "email": "ava@example.com",
  "password": "Secret123!",
  "role": "Sales User"
}
```

`POST /api/auth/login`

Request body:

```json
{
  "email": "ava@example.com",
  "password": "Secret123!"
}
```

Response shape:

```json
{
  "user": {
    "id": "...",
    "name": "Ava Johnson",
    "email": "ava@example.com",
    "role": "Sales User"
  },
  "token": "jwt-token"
}
```

### Leads

`GET /api/leads?status=New&source=Website&search=ava&sort=latest&page=1`

Query parameters work together and return:

- `leads`
- `totalLeads`
- `totalPages`
- `currentPage`

`POST /api/leads`

Request body:

```json
{
  "name": "Northstar Labs",
  "email": "lead@company.com",
  "status": "New",
  "source": "Website"
}
```

## Notes

- Use the JWT from login in the `Authorization: Bearer <token>` header.
- The backend paginates lead lists at 10 records per page.
- CSV export is handled in the frontend by fetching the active filtered result set.
