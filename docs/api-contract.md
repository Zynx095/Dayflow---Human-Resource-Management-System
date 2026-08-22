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

## Leave Management (/api/leave)

### POST /leave
Employee submits a new leave request.
- **Headers:** Authorization: Bearer <token> (requires employee role)
- **Request Body:** { "leave_type": "PAID" | "SICK" | "UNPAID", "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD", "reason": "string" }
- **Response (200):** { "message": "Leave request created", "id": 1 }
- **Response (400):** Validation error (e.g. invalid dates, missing reason).

### GET /leave/my
Get all leave requests for the current employee.
- **Headers:** Authorization: Bearer <token> (requires employee role)
- **Response (200):** { "records": [ ... ] }

### GET /leave/all
HR gets all leave requests for all employees.
- **Headers:** Authorization: Bearer <token> (requires hr role)
- **Response (200):** { "records": [ ... ] }

### GET /leave/:id
Get details of a specific leave request. Employees can only access their own.
- **Headers:** Authorization: Bearer <token>
- **Response (200):** { "record": { ... } }
- **Response (403):** Cannot access another employee's request.

### POST /leave/:id/approve
HR approves a pending leave request.
- **Headers:** Authorization: Bearer <token> (requires hr role)
- **Request Body (Optional):** { "admin_comment": "string" }
- **Response (200):** { "message": "Leave request approved" }
- **Response (400):** Cannot approve if status is not PENDING.

### POST /leave/:id/reject
HR rejects a pending leave request.
- **Headers:** Authorization: Bearer <token> (requires hr role)
- **Request Body (Optional):** { "admin_comment": "string" }
- **Response (200):** { "message": "Leave request rejected" }
- **Response (400):** Cannot reject if status is not PENDING.

## Payroll / Salary Visibility (/api/payroll)

### GET /payroll/me
Employee retrieves their own payroll records.
- **Headers:** Authorization: Bearer <token> (requires employee role)
- **Response (200):** { "records": [ { "id": 1, "pay_period": "2026-08", "base_salary": 5000, "allowances": 300, "deductions": 100, "net_salary": 5200, "created_at": "...", "updated_at": "..." } ] }
- **Response (401):** Unauthorized.
- **Response (403):** Forbidden (wrong role).

### GET /payroll/all
HR retrieves payroll records for all employees.
- **Headers:** Authorization: Bearer <token> (requires hr role)
- **Response (200):** { "records": [ { "id": 1, "pay_period": "2026-08", "base_salary": 6000, "allowances": 500, "deductions": 200, "net_salary": 6300, "employee_id": 1, "business_id": "EMP-000", "name": "HR Admin", "department": "Human Resources" } ] }

### GET /payroll/:employeeId
HR retrieves payroll records for a specific employee.
- **Headers:** Authorization: Bearer <token> (requires hr role)
- **Path Parameters:** employeeId (integer database ID)
- **Response (200):** { "records": [ ... ] }
- **Response (400):** Invalid employee ID format.
- **Response (404):** Employee not found.
