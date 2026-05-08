# MEEP - Student Management & Recruitment Platform

A complete student management and recruitment platform built with Express.js, SQLite/PostgreSQL, and a responsive web interface. Fully compatible with Vercel serverless deployment.

## Features

- **Student Management**: Register, track, and manage student applications
- **Agent Management**: Manage recruitment agents and their performance
- **Application Tracking**: Track student applications through the entire pipeline
- **Document Management**: Upload and verify student documents
- **User Authentication**: Role-based access (Admin, Agent, Student)
- **Reports & Analytics**: Dashboard with enrollment statistics and trends
- **Responsive UI**: Modern, mobile-friendly interface
- **Vercel Ready**: Deploy serverless to Vercel with PostgreSQL backend

## Architecture

```
Project Structure:
├── api/                      # Vercel serverless functions
│   ├── login.js
│   ├── menu.js
│   ├── agents.js
│   ├── students.js
│   ├── applications.js
│   ├── documents.js
│   ├── notifications.js
│   ├── profile.js
│   ├── reports.js
│   └── health.js
├── lib/
│   └── db.js               # Database abstraction layer
├── Meep.html               # Frontend application
├── server.js               # Local Express server
├── database.js             # Database initialization (local dev)
├── vercel.json             # Vercel configuration
├── package.json            # Dependencies and scripts
└── public/                 # Static files (Vercel)
```

## Local Development

### Prerequisites
- Node.js 24.x or higher
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:4000 in your browser

### Default Test Credentials

- **Admin**: admin@muthuvel.edu / Admin@2025
- **Agent**: peter@kavali.pg / Agent@2025
- **Student**: james.tari@student.com / Student@2025

## Deployment on Vercel

### Prerequisites
- Vercel account (https://vercel.com)
- PostgreSQL database (e.g., Supabase, Railway, or Vercel Postgres)
- GitHub repository with this code

### Step-by-Step Deployment

#### 1. Set up PostgreSQL Database

**Using Supabase (Recommended)**:
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database > Connection Pooling
4. Copy the "Connection string" in Session mode
5. Store as `DATABASE_URL` environment variable

**Using Vercel Postgres**:
1. Go to https://vercel.com/dashboard
2. Click "Add New..." > "Database" > "Create Database"
3. Follow setup instructions
4. Copy the connection string

#### 2. Prepare Your Git Repository

```bash
# Initialize if not already done
git init
git add .
git commit -m "Initial MEEP platform commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/meep-platform.git
git push -u origin main
```

#### 3. Deploy to Vercel

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/import
2. Select your GitHub repository
3. Vercel will auto-detect the project settings
4. Add environment variable `DATABASE_URL` with your PostgreSQL connection string
5. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variable
vercel env add DATABASE_URL
# Paste your PostgreSQL connection string

# Redeploy with environment
vercel --prod
```

### 4. Initialize Database on Production

After your first deployment, you need to initialize the PostgreSQL database with the schema and seed data.

Create a temporary initialization script:

```bash
# Create api/init.js
# Run once: vercel env pull && node api/init.js
```

Or use a one-time setup script in your Vercel logs.

### 5. Verify Deployment

Visit your Vercel deployment URL and test:
- Login with the test credentials
- Check the /api/health endpoint
- Verify student/agent data loads correctly

## Database Schema

### SQLite (Local Development)

The database is automatically initialized with:
- **users**: Admin, agent, and student accounts
- **menus**: Navigation items per role
- **agents**: Recruitment agent profiles
- **students**: Student records
- **applications**: Application tracking
- **documents**: Document uploads and status
- **notifications**: User notifications
- **profile**: Student profile information
- **report_stats**: Dashboard statistics
- **report_programs**: Program enrollment data
- **report_pipeline**: Application pipeline stages

### PostgreSQL (Production)

Same schema as SQLite. Create using your database admin panel or migration tools.

## API Endpoints

All endpoints are relative to the domain root:

```
GET  /api/health              - Health check
POST /api/login               - User authentication
GET  /api/menu?role=admin     - Navigation menu
GET  /api/agents              - List all agents
GET  /api/students            - List all students
GET  /api/applications        - List applications (with optional status filter)
GET  /api/documents           - List documents
GET  /api/notifications       - List notifications
GET  /api/profile             - Get user profile
GET  /api/reports             - Get dashboard reports
```

### Example Requests

```javascript
// Login
POST /api/login
{
  "email": "admin@muthuvel.edu",
  "password": "Admin@2025"
}

// Get agent menu
GET /api/menu?role=agent

// Filter applications by status
GET /api/applications?status=pending
```

## Environment Variables

**Local Development (.env.local)**
```
NODE_ENV=development
PORT=4000
# DATABASE_URL is optional (uses SQLite by default)
```

**Vercel Production**
```
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=production
```

## Frontend Features

### Admin Dashboard
- Overview statistics (students, agents, applications)
- Agent management and performance tracking
- Student records with document status
- Application review interface
- Document verification
- Reports and analytics

### Agent Portal
- Personal student dashboard
- Student management
- Application tracking
- Document review
- Student registration

### Student Portal
- My dashboard and timeline
- Profile management
- Document upload and tracking
- Application status
- Notifications

## Security Considerations

1. **Passwords**: Currently stored in plain text (for demo). Use bcrypt in production:
   ```javascript
   const bcrypt = require('bcrypt');
   const hashedPw = await bcrypt.hash(password, 10);
   ```

2. **Authentication**: Implement JWT tokens for better security
   ```javascript
   const jwt = require('jsonwebtoken');
   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
   ```

3. **CORS**: Currently allows all origins. Restrict in production:
   ```javascript
   app.use(cors({ origin: process.env.FRONTEND_URL }));
   ```

4. **Environment Variables**: Never commit `.env` files. Use Vercel's environment management.

5. **Database**: Use connection pooling in production.

## Troubleshooting

### "Module not found" errors on Vercel
- Ensure all dependencies are in `package.json`
- Run `npm install` and commit `package-lock.json`

### Database connection timeouts
- Check DATABASE_URL format
- Verify database is accessible from Vercel IPs
- Check PostgreSQL connection limits

### CORS errors
- Ensure frontend origin is allowed
- Check `vercel.json` rewrite rules

### Cold starts on Vercel
- Normal for serverless. Optimize with:
  - Database connection pooling
  - Function optimization
  - Minimal dependencies

## Performance Tips

1. **Local Development**: Use SQLite for faster iteration
2. **Production**: Use PostgreSQL with connection pooling
3. **Caching**: Implement Redis for frequently accessed data
4. **Pagination**: Add pagination to large queries
5. **Indexes**: Add database indexes on frequently filtered columns

## Next Steps

1. **User Authentication**: Implement proper JWT-based auth
2. **Password Security**: Use bcrypt for password hashing
3. **File Uploads**: Add S3 or similar for document storage
4. **Email Notifications**: Integrate email service
5. **Advanced Analytics**: Add more detailed reporting
6. **Mobile App**: Create React Native mobile app
7. **Real-time Updates**: Implement WebSocket for live updates
8. **Multi-tenancy**: Support multiple organizations

## Support & Contributing

For issues or feature requests, please open an issue in the GitHub repository.

## License

MIT License - See LICENSE file for details

---

**Deployment Checklist**:
- [ ] Database created and configured
- [ ] DATABASE_URL environment variable set
- [ ] Code pushed to GitHub
- [ ] Vercel deployment completed
- [ ] API health check passing
- [ ] Login functionality tested
- [ ] Sample data visible in dashboards
- [ ] Custom domain configured (optional)
- [ ] SSL certificate enabled
