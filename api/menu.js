const db = require('../lib/db');

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const role = req.query.role || 'admin';
    
    if (!['admin', 'agent', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const sql = 'SELECT icon, label, panel FROM menus WHERE role = $1 ORDER BY id';
    const menu = await db.allAsync(sql, [role]);
    
    res.json({ menu: menu || [] });
  } catch (error) {
    console.error('Menu error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
