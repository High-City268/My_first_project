// Serverless function to register new recruitment agents
// POST /api/register-agent.js

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
      firstName, lastName, email, password, phone, dob, nationality, passport,
      location, commission, target
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !phone || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['firstName', 'lastName', 'email', 'password', 'phone', 'location']
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
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

    // Check if agent already exists
    const existing = await db.getAsync(
      'SELECT id FROM users WHERE email = ? AND role = ?',
      [email, 'agent']
    );

    if (existing) {
      return res.status(409).json({ error: 'Agent with this email already exists' });
    }

    // Create user account for agent
    const userId = await db.runAsync(
      `INSERT INTO users (email, password, role, name, avatar, title, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [email, password, 'agent', `${firstName} ${lastName}`, 
       `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`, 'Recruitment Agent']
    );

    // Create agent record
    await db.runAsync(
      `INSERT INTO agents (user_id, first_name, last_name, email, phone, dob, 
                          nationality, passport, location, commission_rate, target_students, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, firstName, lastName, email, phone, dob || '', nationality || '', 
       passport || '', location, commission || 5, target || 10, 'Active']
    );

    // Create welcome notification for admin
    const adminId = await db.getAsync(
      'SELECT id FROM users WHERE role = ? ORDER BY id LIMIT 1',
      ['admin']
    );

    if (adminId) {
      await db.runAsync(
        `INSERT INTO notifications (user_id, icon, message, type, created_at)
         VALUES (?, ?, ?, ?, datetime('now'))`,
        [adminId.id, '👤', `New agent ${firstName} ${lastName} registered from ${location}`, 'info']
      );
    }

    res.status(201).json({
      success: true,
      message: `Agent ${firstName} ${lastName} registered successfully`,
      userId,
      email,
      fullName: `${firstName} ${lastName}`,
      location,
      targetStudents: target || 10
    });

  } catch (error) {
    console.error('Agent registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register agent',
      message: error.message 
    });
  }
}
