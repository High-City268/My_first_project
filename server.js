const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MEEP backend' });
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.getUserByEmail(email);
    if (!user || user.pw !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const { pw, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/menu', async (req, res) => {
  try {
    const role = req.query.role || 'admin';
    const menu = await db.getMenu(role);
    res.json({ menu });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/agents', async (req, res) => {
  try {
    const agents = await db.getAgents();
    res.json({ agents });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await db.getStudents();
    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const status = req.query.status;
    const applications = await db.getApplications(status);
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/documents', async (req, res) => {
  try {
    const documents = await db.getDocuments();
    res.json({ documents });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await db.getNotifications();
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/profile', async (req, res) => {
  try {
    const profile = await db.getProfile();
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const reports = await db.getReports();
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Meep.html'));
});

(async () => {
  try {
    await db.init();
    app.listen(PORT, () => {
      console.log(`MEEP backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
})();
