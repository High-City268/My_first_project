const db = require('../lib/db');

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const sql = 'SELECT name, location, phone, students, approved, status FROM agents ORDER BY id';
    const agents = await db.allAsync(sql, []);
    
    res.json({ agents: agents || [] });
  } catch (error) {
    console.error('Agents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
