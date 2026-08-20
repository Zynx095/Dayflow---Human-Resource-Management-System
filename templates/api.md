# API Contract
## Base URL: /api/v1

### Endpoint: POST /example
**Purpose:** [What it does]
**Request:**
\\\json
{ "key": "value" }
\\\
**Response (Success 200):**
\\\json
{ "status": "success", "data": {} }
\\\
**Response (Error 400):**
\\\json
{ "error": "Invalid input" }
\\\
"@

 = @"
# Database Schema
**Engine:** [SQLite / PostgreSQL / Firebase]

## Table: users
- id (UUID, Primary Key)
- email (String, Unique)
- created_at (Timestamp)

## Seed Data Strategy
- Create 3 mock users.
- Create 5 mock records for the primary dashboard.
