// Serverless function to register new students
// POST /api/register-student.js

const db = require('../lib/db');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  // Set CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      firstName, lastName, email, phone, dob, nationality, passport,
      village, district, region, school, grade12Year, gender,
      grade12Result, program, agent
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !dob || !nationality || 
        !passport || !village || !district || !school || !grade12Year || !program || !agent) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['firstName', 'lastName', 'email', 'phone', 'dob', 'nationality', 
                   'passport', 'village', 'district', 'school', 'grade12Year', 'program', 'agent']
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Phone format validation
    if (phone.length < 7) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    // Check if student already exists
    const existing = await db.getAsync(
      'SELECT id FROM users WHERE email = ? AND role = ?',
      [email, 'student']
    );

    if (existing) {
      return res.status(409).json({ error: 'Student with this email already exists' });
    }

    // Create user account for student
    const userId = await db.runAsync(
      `INSERT INTO users (email, password, role, name, avatar, title, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [email, 'password123', 'student', `${firstName} ${lastName}`, 
       `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`, 'Student']
    );

    // Create student record
    await db.runAsync(
      `INSERT INTO students (user_id, first_name, last_name, email, phone, dob, 
                             nationality, passport, village, district, region,
                             school, grade12_year, gender, grade12_result, program,
                             agent_name, status, docs_verified, docs_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, firstName, lastName, email, phone, dob, nationality, passport,
       village, district, region, school, grade12Year, gender || '', 
       grade12Result || '', program, agent, 'Registered', 0, 0]
    );

    // Create welcome notification
    await db.runAsync(
      `INSERT INTO notifications (user_id, icon, message, type, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
      [userId, '📝', `Welcome! Your registration as a student has been confirmed.`, 'info']
    );

    res.status(201).json({
      success: true,
      message: `Student ${firstName} ${lastName} registered successfully`,
      userId,
      email,
      fullName: `${firstName} ${lastName}`
    });

  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register student',
      message: error.message 
    });
  }
}
