# Live Attendance System

> **Assignment Project**: Building a real-time attendance management system with Node.js, Express, MongoDB, and WebSockets.

A backend system that enables teachers to manage classes and track student attendance in real-time through WebSocket connections. This project is built as part of a backend development assignment.

## Assignment Overview

This project implements a complete backend system with:

- JWT-based authentication (signup, login, me)
- Role-based access control (teacher & student)
- Class management CRUD operations
- WebSocket-based live attendance tracking
- Attendance persistence to MongoDB

**Key Design**: Only ONE class session can be active at a time on WebSocket. No room management needed - all broadcasts go to all connected clients.

## Implementation Status

### Completed

- **Authentication System**
  - User registration with role selection (teacher/student)
  - Login with JWT token generation
  - Get current user info (me endpoint)
  - Password hashing with bcrypt
  - JWT middleware for protected routes

- **Class Management**
  - Create classes (Teacher only)

### In Progress

- Add students to classes
- View class details with enrolled students
- Get list of all students
- Real-time Attendance (WebSocket)
- Live attendance marking
- Real-time updates broadcast to all clients
- In-memory session management
- Persistent storage to MongoDB
- Attendance tracking features

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken) - Token expires in 1 day
- **Validation**: Zod schemas
- **WebSocket**: ws library (to be implemented)
- **Security**: bcrypt (10 salt rounds)
- **Dev Tools**: nodemon, tsx, prettier

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Akhand0ps/Live-Attendance-System.git
   cd Live-Attendance-System
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   Create a `.env` file in the root directory with the following:

   ```env
   PORT=3000
   uri=mongodb://localhost:27017/attendance-system
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

   **Important**:
   - The MongoDB URI variable is named `uri` (lowercase)
   - Make sure MongoDB is running before starting the server

4. **Start MongoDB**

   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Server will start on `http://localhost:3000` (or your specified PORT)

## Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Format code with Prettier
npm run format
```

## MongoDB Models

### User Model

```typescript
{
  _id: ObjectId,
  name: String,          // lowercase, trimmed
  email: String,         // unique, trimmed
  password: String,      // hashed with bcrypt (10 rounds)
  role: "teacher" | "student",
  createdAt: Date,
  updatedAt: Date
}
```

### Class Model

```typescript
{
  _id: ObjectId,
  className: String,     // trimmed, min 3 characters
  teacherId: ObjectId,   // ref: User
  studentsIds: [ObjectId], // ref: User (array)
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Model (To be implemented)

```typescript
{
  _id: ObjectId,
  classId: ObjectId,     // ref: Class
  studentId: ObjectId,   // ref: User
  status: "present" | "absent"
}
```

## HTTP API Endpoints

All API routes are prefixed with `/api/v1`

### Authentication Routes (`/api/v1/auth`)

#### 1. POST `/api/v1/auth/register`

Register a new user (teacher or student).

**Request Body:**

```json
{
  "name": "john doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "675e8f9a1234567890abcdef",
    "name": "john doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2026-01-08T10:30:00.000Z",
    "updatedAt": "2026-01-08T10:30:00.000Z"
  }
}
```

**Error Responses:**

```json
// Validation Error (422)
{
  "success": false,
  "error": "Invalid request Schema"
}

// Email exists (403)
{
  "success": false,
  "error": "Email already exists"
}
```

#### 2. POST `/api/v1/auth/login`

Login and receive JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**JWT Payload Structure:**

```json
{
  "id": "675e8f9a1234567890abcdef",
  "role": "student",
  "exp": 1704802200
}
```

**Error Responses:**

```json
// Validation Error (422)
{
  "success": false,
  "error": "Invalid request Schema"
}

// User not found (404)
{
  "success": false,
  "error": "User not found"
}

// Wrong password (400)
{
  "success": false,
  "error": "Invalid email or password"
}
```

#### 3. GET `/api/v1/auth/me`

Get current user details (requires authentication).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "675e8f9a1234567890abcdef",
    "name": "john doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2026-01-08T10:30:00.000Z",
    "updatedAt": "2026-01-08T10:30:00.000Z"
  }
}
```

**Error Responses:**

```json
// Missing/Invalid token (404 or 401)
{
  "success": false,
  "error": "please send jwt token"
}

// User not found (404)
{
  "success": false,
  "error": "User not found"
}
```

**Note**: Password field is excluded from the response.

### Class Routes (`/api/v1`)

#### 4. POST `/api/v1/class`

Create a new class (Teacher only).

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**

```json
{
  "className": "Math 101"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "675e9a1b1234567890fedcba",
    "className": "Math 101",
    "teacherId": "675e8f9a1234567890abcdef",
    "studentsIds": [],
    "createdAt": "2026-01-08T11:00:00.000Z",
    "updatedAt": "2026-01-08T11:00:00.000Z"
  }
}
```

**Error Responses:**

```json
// Validation Error (400)
{
  "success": false,
  "error": "Invalid request schema"
}

// Not a teacher (403)
{
  "success": false,
  "error": "Forbidden, teacher access required"
}
```

---

### Coming Soon - Additional Endpoints

#### 5. POST `/api/v1/class/:id/add-student`

Add a student to a class (Teacher only, must own class).

**Request Body:**

```json
{
  "studentId": "675e8f9a1234567890abcdef"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "675e9a1b1234567890fedcba",
    "className": "Math 101",
    "teacherId": "675e8f9a1234567890teacher",
    "studentsIds": ["675e8f9a1234567890abcdef"]
  }
}
```

#### 6. GET `/api/v1/class/:id`

Get class details with enrolled students (Teacher who owns class OR enrolled student).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "675e9a1b1234567890fedcba",
    "className": "Math 101",
    "teacherId": "675e8f9a1234567890teacher",
    "students": [
      {
        "_id": "675e8f9a1234567890abcdef",
        "name": "john doe",
        "email": "john@example.com"
      }
    ]
  }
}
```

#### 7. GET `/api/v1/students`

Get all students (Teacher only).

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "675e8f9a1234567890abcdef",
      "name": "john doe",
      "email": "john@example.com"
    }
  ]
}
```

### Attendance Routes (To be implemented)

#### 8. GET `/api/v1/class/:id/my-attendance`

Get student's attendance for a class (Student only, must be enrolled).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "classId": "675e9a1b1234567890fedcba",
    "status": "present"
  }
}
```

#### 9. POST `/api/v1/attendance/start`

Start a new attendance session (Teacher only, must own class).

**Request Body:**

```json
{
  "classId": "675e9a1b1234567890fedcba"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "classId": "675e9a1b1234567890fedcba",
    "startedAt": "2026-01-08T10:00:00.000Z"
  }
}
```

## WebSocket API (To be implemented)

### Connection

```
ws://localhost:3000/ws?token=<JWT_TOKEN>
```

NOTE: WebSocket implementation is pending.

### Message Format

All WebSocket messages follow this format:

```json
{
  "event": "EVENT_NAME",
  "data": { ... }
}
```

### WebSocket Events

#### 1. ATTENDANCE_MARKED (Teacher to All Clients)

Teacher marks attendance for a student.

**Teacher Sends:**

```json
{
  "event": "ATTENDANCE_MARKED",
  "data": {
    "studentId": "675e8f9a1234567890abcdef",
    "status": "present"
  }
}
```

**Server Broadcasts:**

```json
{
  "event": "ATTENDANCE_MARKED",
  "data": {
    "studentId": "675e8f9a1234567890abcdef",
    "status": "present"
  }
}
```

#### 2. TODAY_SUMMARY (Teacher to All Clients)

Request attendance summary.

**Teacher Sends:**

```json
{
  "event": "TODAY_SUMMARY"
}
```

**Server Broadcasts:**

```json
{
  "event": "TODAY_SUMMARY",
  "data": {
    "present": 18,
    "absent": 4,
    "total": 22
  }
}
```

#### 3. MY_ATTENDANCE (Student to Student Only)

Student requests their attendance status.

**Student Sends:**

```json
{
  "event": "MY_ATTENDANCE"
}
```

**Server Responds (Unicast):**

```json
{
  "event": "MY_ATTENDANCE",
  "data": {
    "status": "present"
  }
}
```

#### 4. DONE (Teacher to All Clients)

End attendance session and persist to database.

**Teacher Sends:**

```json
{
  "event": "DONE"
}
```

**Server Broadcasts:**

```json
{
  "event": "DONE",
  "data": {
    "message": "Attendance persisted",
    "present": 18,
    "absent": 4,
    "total": 22
  }
}
```

### WebSocket Error Messages

```json
{
  "event": "ERROR",
  "data": {
    "message": "Error description"
  }
}
```

Common errors:

- `"Unauthorized or invalid token"` - Invalid JWT
- `"Forbidden, teacher event only"` - Student tried teacher-only event
- `"Forbidden, student event only"` - Teacher tried student-only event
- `"No active attendance session"` - No session started

## Authentication & Authorization

### JWT Implementation

- **Token expiry**: 1 day (24 hours)
- **Secret**: Defined in `.env` as `JWT_SECRET`
- **Algorithm**: HS256 (default)

### JWT Payload Structure

```typescript
{
  "id": "675e8f9a1234567890abcdef",  // user's MongoDB _id
  "role": "teacher" | "student",
  "iat": 1704715800,                  // issued at
  "exp": 1704802200                   // expires at
}
```

### How to Use JWT

**1. HTTP Requests**
Include JWT token in Authorization header with Bearer prefix:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example with curl:**

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/v1/auth/me
```

**Example with JavaScript fetch:**

```javascript
fetch('http://localhost:3000/api/v1/auth/me', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

**2. WebSocket Connection** (when implemented)
Pass token as query parameter:

```
ws://localhost:3000/ws?token=<JWT_TOKEN>
```

### Protected Routes

Routes that require authentication middleware (`authenticate`):

- `GET /api/v1/auth/me`
- `POST /api/v1/class` (also requires teacher role)

### Role-Based Access

Routes that require teacher role (`verifyRole` middleware):

- `POST /api/v1/class`
- All attendance management endpoints (when implemented)

## In-Memory Session State (To be implemented)

The server will maintain one active attendance session at a time:

```javascript
const activeSession = {
  classId: '675e9a1b1234567890fedcba',
  startedAt: '2026-01-08T10:00:00.000Z',
  attendance: {
    '675e8f9a1234567890abcdef': 'present',
    '675e8f9a1234567890student2': 'absent',
  },
}
```

**Design Decisions:**

- Only ONE session can be active at a time
- `startedAt` must be ISO string: `new Date().toISOString()`
- Session is cleared when teacher sends `DONE` event
- No room management - all broadcasts go to all connected clients

## Response Format

### Standard Response Format

**Success:**

```json
{
  "success": true,
  "data": {
    /* response data */
  }
}
```

**Error:**

```json
{
  "success": false,
  "error": "Error message"
}
```

## Error Handling

### HTTP Status Codes

| Code | Description      | Example Error Messages                                           |
| ---- | ---------------- | ---------------------------------------------------------------- |
| 200  | Success          | -                                                                |
| 201  | Created          | -                                                                |
| 400  | Bad Request      | `"Invalid request schema"`, `"Invalid email or password"`        |
| 401  | Unauthorized     | `"Unauthorized, token missing or invalid"`                       |
| 403  | Forbidden (Role) | `"Forbidden, teacher access required"`, `"Email already exists"` |
| 404  | Not Found        | `"User not found"`, `"please send jwt token"`                    |
| 422  | Validation Error | `"Invalid request Schema"`                                       |
| 500  | Server Error     | `"Internal Server Error"`, `err.message`                         |

## Planned Features & Flows

### Attendance Session Flow (To be implemented)

1. **Start Session**: Teacher calls `POST /api/v1/attendance/start` with classId
2. **Mark Attendance**: Teacher sends `ATTENDANCE_MARKED` events via WebSocket
3. **Real-time Updates**: All connected clients receive attendance updates
4. **Check Status**: Students can query their status via `MY_ATTENDANCE` event
5. **View Summary**: Teacher can request `TODAY_SUMMARY` anytime
6. **End Session**: Teacher sends `DONE` event, which:
   - Marks all unmarked students as absent
   - Persists attendance to MongoDB
   - Broadcasts final summary
   - Clears in-memory session

### Role-Based Access Control

**Teacher Permissions:**

- Create classes (implemented)
- Add students to classes (pending)
- Start attendance sessions (pending)
- Mark attendance (pending)
- View all students (pending)
- Access teacher-only routes (implemented)

**Student Permissions:**

- View enrolled classes (pending)
- Check own attendance (pending)
- Receive real-time attendance updates (pending)

## Project Structure

```
Live-Attendance-System/
├── src/
│   ├── index.ts                    # Entry point - server initialization
│   ├── app.ts                      # Express app configuration
│   ├── config/
│   │   └── db.config.ts           # MongoDB connection setup
│   ├── controller/
│   │   ├── user.controller.ts     # Auth: register, login, me
│   │   └── class.controller.ts    # Class: create class
│   ├── middleware/
│   │   ├── auth.middleware.ts     # JWT verification
│   │   └── auth.role.ts           # Teacher role check
│   ├── models/
│   │   ├── user.model.ts          # User schema with timestamps
│   │   └── class.model.ts         # Class schema with timestamps
│   ├── routes/
│   │   ├── user.route.ts          # /api/v1/auth routes
│   │   └── class.route.ts         # /api/v1/class routes
│   ├── schemas/
│   │   ├── auth.schema.ts         # Zod validation for auth
│   │   └── class.schema.ts        # Zod validation for class
│   ├── types/
│   │   └── express.d.ts           # Custom Express types
│   └── utils/
│       └── hash.pass.ts           # Bcrypt password hashing
├── .env                            # Environment variables
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

### Key Files

- **index.ts**: Starts server after DB connection
- **app.ts**: Express middleware and route mounting
- **db.config.ts**: Async MongoDB connection with error handling
- **auth.middleware.ts**: Extracts and verifies JWT, attaches `req.user`
- **auth.role.ts**: Ensures user has teacher role
- **express.d.ts**: TypeScript declarations for `req.user`

## Testing

### Manual Testing with REST Client

You can test the API using any HTTP client like Postman, Thunder Client, or curl.

**Example workflow:**

```bash
# 1. Register a teacher
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "name": "Teacher Name",
  "email": "teacher@test.com",
  "password": "123456",
  "role": "teacher"
}

# 2. Login to get token
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "teacher@test.com",
  "password": "123456"
}

# 3. Create a class (use token from step 2)
POST http://localhost:3000/api/v1/class
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "className": "Mathematics 101"
}

# 4. Get your profile
GET http://localhost:3000/api/v1/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

### Assignment Test Application

The assignment provides a test application: [https://github.com/rahul-MyGit/mid-test](https://github.com/rahul-MyGit/mid-test)

## Quick Start Guide

### 1. Ensure MongoDB is Running

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod

# Or using MongoDB Compass
# Just open MongoDB Compass - it will start MongoDB automatically
```

### 2. Start Development Server

```bash
npm run dev
```

You should see:

```
Mongodb connected localhost
server running on PORT 3000
```

### 3. Test Basic Flow

**Step 1: Register a Teacher**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Teacher",
    "email": "teacher@test.com",
    "password": "123456",
    "role": "teacher"
  }'
```

**Step 2: Login**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@test.com",
    "password": "123456"
  }'
```

Save the token from response!

**Step 3: Create a Class**

```bash
curl -X POST http://localhost:3000/api/v1/class \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "className": "Mathematics 101"
  }'
```

**Step 4: Get Your Profile**

```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Development Notes

### Current Implementation Status

**Completed:**

- Authentication (register, login, me)
- JWT middleware with role-based access
- Create class endpoint
- Password hashing with bcrypt
- Zod validation schemas
- MongoDB models with timestamps

**Pending:**

- Add students to class
- Get class details with populated students
- Get all students (teacher only)
- Attendance model
- WebSocket implementation
- Real-time attendance tracking

### Next Steps

1. Implement remaining class management endpoints
2. Add Attendance model
3. Implement WebSocket server
4. Add attendance session management
5. Implement real-time events (ATTENDANCE_MARKED, TODAY_SUMMARY, MY_ATTENDANCE, DONE)

## Assignment Reference

This project is built according to specifications from:
**Backend WebSocket Live Attendance System** assignment

Assignment details: [Notion Link](https://brindle-goal-102.notion.site/Backend-WebSocket-Live-Attendance-System-2c646b36b2e980b09b42d7c0240a8170)

## License

ISC

## Author

**GitHub**: [@Akhand0ps](https://github.com/Akhand0ps)  
**Repository**: [Live-Attendance-System](https://github.com/Akhand0ps/Live-Attendance-System)

---

NOTE: This is a work-in-progress assignment project. The system is designed for a single active attendance session at a time, with all WebSocket broadcasts going to all connected clients without room management.
