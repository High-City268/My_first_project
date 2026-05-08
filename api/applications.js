const db = require('../lib/db');

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const status = req.query.status;
    let sql = 'SELECT id, student, program, agent, "docsVerified", "docsTotal", status, date FROM applications';
    let params = [];
    
    if (status) {
      sql += ' WHERE status = $1';
      params = [status];
    }
    
    sql += ' ORDER BY date DESC';
    const applications = await db.allAsync(sql, params);
    
    res.json({ applications: applications || [] });
  } catch (error) {
    console.error('Applications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
