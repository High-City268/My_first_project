const db = require('../lib/db');

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const sql = 'SELECT icon, message, time, type, read FROM notifications ORDER BY id DESC';
    const notifications = await db.allAsync(sql, []);
    
    res.json({ notifications: notifications || [] });
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
