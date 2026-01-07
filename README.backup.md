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

## 📦 Installation & Setup

1. **Clone the repository**

   ```bash
    clone https://github.com/Akhand0ps/Live-Attendance-System.git
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
   typescript
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

````

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
````

### Attendance Model (To be implemented)

````typescript
{
  _id: ObjectId,
  classId: ObjectId,     // ref: Class
  studentId: ObjectId,   // ref: User
```javascript
{
All API routes are prefixed with `/api/v1`

### Authentication Routes (`/api/v1/auth`)

#### 1. POST `/api/v1/auth/register
  password: String (hashed),
  role: "teacher" | "student"
}
```john doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
````

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

````json
// Validation Error (422)
{
  "success": false,
  "error": "Invalid request Schema"
}

// Email exists (403)
{Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
````

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
} (`/api/v1`)

#### 4. POST `/api/v1/class`
Create a new class (Teacher only).

**Headers:**
```

Authorization: Bearer <JWT_TOKEN>

````

**Request Body:**
```json
{
  "className": "Math 101"
}
````

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

675e8f9a1234567890abcdef"
}

````

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
````

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
    "startedAt": "2026-01-08
  }
}
```

### Class Routes

#### 4. POST `/class`

Create a new class (Teacher only).

**Request Body:**

```json
{
  "className": "Math 101"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "c101",
    "className": "Math 101",
    "teacherId": "t11",
    "studentIds": []
  }
}
```

#### 5. POST `/class/:id/add-student`

Add a student to a (To be implemented)

### Connection

```
ws://localhost:3000/ws?token=<JWT_TOKEN>
```

**Note**: WebSocket implementation is pending.studentId": "s100"
}

````

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "c101",
    "className": "Math 101",
    "teacherId": "t11",
    "studentIds": ["s100"]
  }
}
````

#### 6. GET `/class/:id`

Get class details with enrolled students (Teacher who owns class OR enrolled student).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "c101",
    "className": "Math 101",
    "teacherId": "t11",
    "students": [
      {
        "_id": "s100",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ]
  }
}
```

#### 7. GET `/students`

Get all students (Teacher only).

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "s100",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

### Attendance Routes

#### 8. GET `/class/:id/my-attendance`

Get student's attendance for a class (Student only, must be enrolled).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "classId": "c101",
    "status": "present"
  }
}
```

#### 9. POST `/attendance/start`

Start a new attendance session (Teacher only, must own class).

**Request Body:**

```json
{
  "classId": "c101"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "classId": "c101",
    "startedAt": "2025-03-11T10:00:00.000Z"
  }
}
```

## 🔌 WebSocket API

### Connection

```
ws://localhost:3000/ws?token=<JWT_TOKEN>
```

### Message Format

All WebSocket messages follow this format:

```json
{
  "event": "EVENT_NAME",
  "data": { ... }
}
```

### WebSocket Events

#### 1. ATTENDANCE_MARKED (Teacher → All Clients)

Teacher marks attendance for a student.

**Teacher Sends:**

````json
{
  "event": "ATTENDAN & Authorization

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
````

### How to Use JWT

**1. HTTP Requests**
Include JWT token in Authorization header with Bearer prefix:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example with curl:**

````bash (To be implemented)

The server will maintain one active attendance session at a time:

```javascript
const activeSession = {
  classId: "675e9a1b1234567890fedcba",
  startedAt: "2026-01-08T10:00:00.000Z",
  attendance: {
    "675e8f9a1234567890abcdef": "present",
    "675e8f9a1234567890student2": "absent"
  }
};
````

**Design Decisions:**

- Only ONE session can be active at a time
- `startedAt` must be ISO string: `new Date().toISOString()`
- Session is cleared when teacher sends `DONE` event
- No room management - all broadcasts go to all connected clients

### Protected Routes

Routes that require authentication middleware (`authenticate`):

- `GET /api/v1/auth/me`
- `POST /api/v1/class` (also requires teacher role)

### Role-Based Access

Routes that require teacher role (`verifyRole` middleware):

- `POST /api/v1/class`
- All attendance management endpoints (when implemented)uest attendance summary.

**Teacher Sends:**

```json
{
  "event": "TODAY_SUMMARY"
}
```

\*\*Server BroaHandling

### Standard Response Format

**Success:**

````json
{
  "success": true,
  "data": { /* response data */ }
}
```Planned Features & Flows

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
- ✅ Create classes
- ⏳ Add students to classes
- ⏳ Start attendance sessions
- ⏳ Mark attendance
- ⏳ View all students
- ✅ Access teacher-only routes

**Student Permissions:**
- ⏳ View enrolled classes
- ⏳ Check own attendance
- ⏳*Student Sends:**
```json
{
  "event": "MY_ATTENDANCE"
}
````

Live-Attendance-System/
├── src/
│ ├── index.ts # Entry point - server initialization
│ ├── app.ts # Express app configuration
│ ├── config/
│ │ └── db.config.ts # MongoDB connection setup
│ ├── controller/
│ │ ├── user.controller.ts # Auth: register, login, me
│ │ └── class.controller.ts # Class: create class
│ ├── middleware/
│ │ ├── auth.middleware.ts # JWT verification
│ │ └── auth.role.ts # Teacher role check
│ ├── models/
│ │ ├── user.model.ts # User schema with timestamps
│ │ └── class.model.ts # Class schema with timestamps
│ ├── routes/
│ │ ├── user.route.ts # /api/v1/auth routes
│ │ └── class.route.ts # /api/v1/class routes
│ ├── schemas/
│ │ ├── auth.schema.ts # Zod validation for auth
│ │ └── class.schema.ts # Zod validation for class
│ ├── types/
│ │ └── express.d.ts # Custom Express types
│ └── utils/
│ └── hash.pass.ts # Bcrypt password hashing
├── .env # Environment variables
├── package.json # Dependencies & scripts
├── tsconfig.json # TypeScript configuration
└── README.md # This file

````

### Key Files
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
````

### Assignment Test Application

The assignment provides a test application: [https://github.com/rahul-MyGit/mid-test](https://github.com/rahul-MyGit/mid-test)

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

## 🔐 Authentication

### JWT Payload Structure

```json
{
  "userId": "MONGODB_OBJECT_ID",
  "role": "teacher" | "student"
}
```

### HTTP Requests

Include JWT token in header:

```
Authorization: <JWT_TOKEN>
```

###📝 Development Notes

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
3. lement WebSocket server
4. Add attendance session management
5. Implement real-time events (ATTENDANCE_MARKED, TODAY_SUMMARY, MY_ATTENDANCE, DONE)

## 📚 Assignment Reference

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
"s100": "present",
"s101": "absent"
}
};

````

**Important:**
- Only ONE session can be active at a time
- `startedAt` must be ISO string: `new Date().toISOString()`
- Session is cleared when teacher sends `DONE` event

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
````

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

## 🛡️ Error Codes

| Code | Description           | Example Error Message                                                               |
| ---- | --------------------- | ----------------------------------------------------------------------------------- |
| 400  | Bad Request           | `"Invalid request schema"`, `"Invalid email or password"`, `"Email already exists"` |
| 401  | Unauthorized          | `"Unauthorized, token missing or invalid"`                                          |
| 403  | Forbidden (Role)      | `"Forbidden, teacher access required"`                                              |
| 403  | Forbidden (Ownership) | `"Forbidden, not class teacher"`                                                    |
| 404  | Not Found             | `"Class not found"`, `"User not found"`, `"Student not found"`                      |

## 🎯 Key Features & Flows

### Attendance Session Flow

1. **Start Session**: Teacher calls `POST /attendance/start` with classId
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

- Create classes
- Add students to classes
- Start attendance sessions
- Mark attendance
- View all students
- Access all teacher-only routes

**Student Permissions:**

- View enrolled classes
- Check own attendance
- Receive real-time attendance updates

## 🔧 Project Structure

```
websocket-att/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── index.ts              # Entry point
│   ├── config/
│   │   └── db.config.ts      # MongoDB configuration
│   ├── controller/
│   │   ├── class.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── auth.role.ts
│   ├── models/
│   │   ├── class.model.ts
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── class.route.ts
│   │   └── user.route.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   └── class.schema.ts
│   ├── types/
│   │   └── express.d.ts
│   └── utils/
│       └── hash.pass.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing

Test application available at: [https://github.com/rahul-MyGit/mid-test](https://github.com/rahul-MyGit/mid-test)

## 📜 Scripts

```bash
# Start development server with auto-reload
npm run dev

# Format code with Prettier
npm run format
```

## 🚦 Getting Started

1. **Start MongoDB** (make sure MongoDB is running)

   ```bash
   mongod
   ```

2. **Run the server**

   ```bash
   npm run dev
   ```

3. **Test the API**
   - Use Postman or any HTTP client
   - Test WebSocket connection using a WebSocket client

### Example Workflow

1. **Sign up a teacher**

   ```bash
   POST /auth/signup
   {
     "name": "Teacher Name",
     "email": "teacher@test.com",
     "password": "123456",
     "role": "teacher"
   }
   ```

2. **Login and get token**

   ```bash
   POST /auth/login
   {
     "email": "teacher@test.com",
     "password": "123456"
   }
   ```

3. **Create a class**

   ```bash
   POST /class
   Authorization: <token>
   {
     "className": "Math 101"
   }
   ```

4. **Sign up students and add them to class**

5. **Start attendance session**

   ```bash
   POST /attendance/start
   {
     "classId": "class_id_here"
   }
   ```

6. **Connect via WebSocket**

   ```
   ws://localhost:3000/ws?token=<token>
   ```

7. **Mark attendance via WebSocket**

## 🤝 Contributing

This is an assignment project. For issues or suggestions, please refer to the assignment guidelines.

## 📄 License

ISC

## 👨‍💻 Author

Assignment by: [Your Name]

---

**Note**: This system is designed for a single active attendance session at a time. All WebSocket broadcasts go to all connected clients without room management.
