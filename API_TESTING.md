# API Testing Guide for MEEP Platform

## Server Status
- **Server**: Running on http://localhost:4000
- **Database**: SQLite (meep.db) - automatically initialized
- **CORS**: Enabled for all origins

## Test Credentials

### Admin Account
- **Email**: admin@muthuvel.edu
- **Password**: Admin@2025
- **Role**: Administrator

### Agent Account  
- **Email**: peter@kavali.pg
- **Password**: Agent@2025
- **Role**: Recruitment Agent

### Student Account
- **Email**: james.tari@student.com
- **Password**: Student@2025
- **Role**: Student Applicant

## API Endpoints Overview

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/login` | User login |

### Menu & Navigation
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/menu?role=admin\|agent\|student` | Get navigation menu for role |

### Data Management
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/agents` | List all agents |
| GET | `/api/students` | List all students |
| GET | `/api/applications` | List applications |
| GET | `/api/applications?status=pending\|approved\|rejected` | Filter applications |
| GET | `/api/documents` | List documents |
| GET | `/api/notifications` | List notifications |
| GET | `/api/profile` | Get user profile |
| GET | `/api/reports` | Get dashboard reports |

### Registration (NEW)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/register-student` | Register new student |
| POST | `/api/register-agent` | Register new agent |

### System
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check |

## Testing with cURL

### 1. Login
```bash
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@muthuvel.edu","password":"Admin@2025"}'
```

**Expected Response** (200 OK):
```json
{
  "user": {
    "id": 1,
    "role": "admin",
    "email": "admin@muthuvel.edu",
    "name": "Dr. Anand Raj",
    "avatar": "AR",
    "title": "Administrator · India"
  }
}
```

### 2. Get Menu
```bash
curl "http://localhost:4000/api/menu?role=admin"
```

**Expected Response** (200 OK):
```json
{
  "menu": [
    { "icon": "◼", "label": "Dashboard", "panel": "dashboard" },
    { "icon": "👥", "label": "Agents", "panel": "agents" },
    ...
  ]
}
```

### 3. Get Students List
```bash
curl http://localhost:4000/api/students
```

**Expected Response** (200 OK):
```json
{
  "students": [
    {
      "name": "James Tari",
      "village": "Kimbe",
      "program": "B.Tech CSE",
      "agent": "Peter Kavali",
      "docsVerified": 3,
      "docsTotal": 4,
      "status": "pending"
    },
    ...
  ]
}
```

### 4. Get Applications
```bash
curl "http://localhost:4000/api/applications?status=pending"
```

**Expected Response** (200 OK):
```json
{
  "applications": [
    {
      "id": "APP-2025-001",
      "student": "James Tari",
      "program": "B.Tech CSE",
      "agent": "Peter Kavali",
      "status": "pending",
      "date": "2 Jan 2025"
    },
    ...
  ]
}
```

### 5. Register New Student
```bash
curl -X POST http://localhost:4000/api/register-student \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@student.com",
    "phone": "+675 7234 5678",
    "dob": "2003-05-15",
    "nationality": "Papua New Guinean",
    "passport": "P7654321",
    "village": "Port Moresby",
    "district": "Kimbe",
    "school": "Port Moresby Secondary",
    "grade12Year": "2023",
    "program": "MBBS",
    "agent": "Peter Kavali"
  }'
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Student John Doe registered successfully",
  "userId": 4,
  "email": "john.doe@student.com",
  "fullName": "John Doe"
}
```

### 6. Register New Agent
```bash
curl -X POST http://localhost:4000/api/register-agent \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice.smith@agent.pg",
    "password": "SecurePass123",
    "phone": "+675 7500 2000",
    "location": "Port Moresby",
    "dob": "1990-03-20",
    "nationality": "Papua New Guinean",
    "commission": 7.5,
    "target": 15
  }'
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Agent Alice Smith registered successfully",
  "userId": 5,
  "email": "alice.smith@agent.pg",
  "fullName": "Alice Smith",
  "location": "Port Moresby",
  "targetStudents": 15
}
```

### 7. Health Check
```bash
curl http://localhost:4000/api/health
```

**Expected Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2025-01-05T10:30:00Z",
  "database": "connected"
}
```

## Testing in Frontend

The registration forms are now integrated into `Meep.html`:

1. Open http://localhost:4000 in browser
2. Login with test credentials
3. Click "Add New Agent" button → opens Quick Add dialog
4. Click "Full Form" button → opens enhanced registration form
5. Fill in all required fields (marked with *)
6. Click "Register Agent" → sends POST to `/api/register-agent`
7. Success toast appears and data is stored in database

## Error Responses

### 400 Bad Request - Missing Fields
```json
{
  "error": "Missing required fields",
  "required": ["firstName", "lastName", "email", ...]
}
```

### 409 Conflict - Already Exists
```json
{
  "error": "Student with this email already exists"
}
```

### 405 Method Not Allowed
```json
{
  "error": "Method not allowed"
}
```

### 500 Server Error
```json
{
  "error": "Failed to register student",
  "message": "error details here"
}
```

## Database Tables Updated

### users
```sql
- id (PK)
- role (admin|agent|student)
- email (UNIQUE)
- password
- pw (legacy)
- name
- avatar
- title
- created_at
```

### students
```sql
- id (PK)
- user_id (FK to users)
- first_name, last_name
- email, phone
- dob (date of birth)
- nationality, passport
- village, district, region
- school, grade12_year, gender, grade12_result
- program, agent, agent_name
- docsVerified, docsTotal
- status
- created_at
```

### agents
```sql
- id (PK)
- user_id (FK to users)
- first_name, last_name
- email, phone
- dob, nationality, passport
- location
- commission_rate (default 5%)
- target_students (default 10)
- status
- created_at
```

### notifications
```sql
- id (PK)
- user_id (FK to users)
- icon
- message
- type (info|success|warn|error)
- read (0|1)
- created_at
```

## Features Implemented

✅ **Complete Student Registration**
- Form validation
- Database persistence
- Welcome notification
- Auto-generated user account

✅ **Complete Agent Registration**
- Enhanced form with commission/target
- Database persistence
- Admin notification
- Role-based access

✅ **Database Abstraction**
- SQLite for local development
- PostgreSQL support for Vercel
- Automatic table creation
- Sample seed data

✅ **API Error Handling**
- Validation errors (400)
- Conflict detection (409)
- Server error handling (500)
- CORS enabled

✅ **Frontend Integration**
- Modal forms with validation
- Async API calls
- Toast notifications
- Auto-refresh after registration

## Deployment Status

### Local Development ✅
- Database: SQLite initialized
- Server: Running on port 4000
- Frontend: Meep.html loaded
- APIs: All endpoints functional

### Production Ready (Vercel)
- Database abstraction: Ready
- Environment detection: Ready
- Serverless functions: Created (10 endpoints)
- Deployment config: Ready (vercel.json)
- See DEPLOYMENT.md for setup

## Next Steps

1. **Test In Browser**
   - Open http://localhost:4000
   - Login with admin@muthuvel.edu / Admin@2025
   - Try registering new student/agent
   - Verify data appears in dashboards

2. **Document Upload** (Phase 2)
   - Create /api/upload endpoint
   - Implement file storage
   - Update document tracking

3. **Production Deployment** (Phase 3)
   - Create PostgreSQL database
   - Set DATABASE_URL in Vercel
   - Deploy to Vercel
   - Run end-to-end tests

4. **Security Hardening** (Phase 4)
   - Add bcrypt password hashing
   - Implement JWT authentication
   - Add rate limiting
   - Add input sanitization

## Support

For issues or questions:
- Check server logs: Terminal where `npm start` is running
- Check browser console: F12 → Console tab
- Check database: Open meep.db with SQLite viewer
- Review error responses: Check HTTP status code and message
