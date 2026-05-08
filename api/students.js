const db = require('../lib/db');

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const sql = 'SELECT name, village, program, agent, "docsVerified", "docsTotal", status FROM students ORDER BY id';
    const students = await db.allAsync(sql, []);
    
    res.json({ students: students || [] });
  } catch (error) {
    console.error('Students error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
