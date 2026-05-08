const db = require('../lib/db');

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const sql = 'SELECT student, type, filename, uploaded, status FROM documents ORDER BY id';
    const documents = await db.allAsync(sql, []);
    
    res.json({ documents: documents || [] });
  } catch (error) {
    console.error('Documents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
