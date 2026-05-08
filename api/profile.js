const db = require('../lib/db');

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const sql = 'SELECT "fullName", dob, nationality, passport, village, district, phone, "grade12Year", "lastSchool", "programInterest", "recruitingAgent", "agentLocation", email FROM profile WHERE id = 1';
    const profile = await db.getAsync(sql, []);
    
    res.json({ profile: profile || null });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
