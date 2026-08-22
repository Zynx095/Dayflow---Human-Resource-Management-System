# Dayflow API Contract

## Base URL
`/api`

## Authentication (`/api/auth`)

### `POST /auth/signin`
Authenticate and receive a JWT.
- **Request Body:** `{ "email": "employee@example.com", "password": "password123" }`
- **Response (200):** `{ "token": "jwt-token-string", "user": { "id": 1, "email": "...", "role": "employee", "name": "..." } }`
- **Response (400):** Validation error.
- **Response (401):** Invalid credentials.

### `POST /auth/signout`
Sign out the current user (client-side token deletion).
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):** `{ "message": "Signed out successfully" }`

### `GET /auth/me`
Get current authenticated user info.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):** `{ "user": { ... }, "employee": { ... } }`

## Attendance (`/api/attendance`)

### `POST /attendance/check-in`
Record check-in time for today.
- **Headers:** `Authorization: Bearer <token>` (requires `employee` role)
- **Response (200):** `{ "message": "Checked in successfully", "check_in": "ISO-string" }`
- **Response (400):** Already checked in today.

### `POST /attendance/check-out`
Record check-out time and calculate worked hours.
- **Headers:** `Authorization: Bearer <token>` (requires `employee` role)
- **Response (200):** `{ "message": "Checked out successfully", "check_out": "ISO-string", "worked_hours": 8.5 }`
- **Response (400):** Cannot check out before checking in, or already checked out.

### `GET /attendance/today`
Get today's attendance record.
- **Headers:** `Authorization: Bearer <token>` (requires `employee` role)
- **Response (200):** `{ "record": { "check_in": "...", "check_out": "...", "status": "present", "worked_hours": null } }` (or null if none)

### `GET /attendance/weekly`
Get the last 7 attendance records.
- **Headers:** `Authorization: Bearer <token>` (requires `employee` role)
- **Response (200):** `{ "records": [ ... ] }`
