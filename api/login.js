const db = require('../lib/db');

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const sql = 'SELECT id, role, email, pw, name, avatar, title FROM users WHERE email = $1';
    const user = await db.getAsync(sql, [email]);
    
    if (!user || user.pw !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { pw, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
