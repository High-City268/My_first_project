const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'meep.db');
const db = new sqlite3.Database(dbPath);

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function init() {
  await runAsync('PRAGMA foreign_keys = ON');

  await runAsync(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    pw TEXT,
    name TEXT NOT NULL,
    avatar TEXT,
    title TEXT,
    created_at TEXT
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    icon TEXT,
    label TEXT,
    panel TEXT
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    dob TEXT,
    nationality TEXT,
    passport TEXT,
    location TEXT,
    students INTEGER,
    approved INTEGER,
    status TEXT,
    commission_rate REAL DEFAULT 5,
    target_students INTEGER DEFAULT 10,
    created_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    dob TEXT,
    nationality TEXT,
    passport TEXT,
    village TEXT,
    district TEXT,
    region TEXT,
    school TEXT,
    grade12_year TEXT,
    gender TEXT,
    grade12_result TEXT,
    program TEXT,
    agent TEXT,
    agent_name TEXT,
    docsVerified INTEGER DEFAULT 0,
    docsTotal INTEGER DEFAULT 0,
    docs_verified INTEGER DEFAULT 0,
    docs_total INTEGER DEFAULT 0,
    status TEXT,
    created_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    student TEXT,
    program TEXT,
    agent TEXT,
    docsVerified INTEGER,
    docsTotal INTEGER,
    status TEXT,
    date TEXT
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student TEXT,
    type TEXT,
    filename TEXT,
    uploaded TEXT,
    status TEXT
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    icon TEXT,
    message TEXT,
    time TEXT,
    type TEXT,
    read INTEGER DEFAULT 0,
    created_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    fullName TEXT,
    dob TEXT,
    nationality TEXT,
    passport TEXT,
    village TEXT,
    district TEXT,
    phone TEXT,
    grade12Year TEXT,
    lastSchool TEXT,
    programInterest TEXT,
    recruitingAgent TEXT,
    agentLocation TEXT,
    email TEXT
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS report_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT,
    value TEXT
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS report_programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    program TEXT,
    students INTEGER,
    pct INTEGER
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS report_pipeline (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT,
    count INTEGER,
    color TEXT
  )`);

  const userCount = await getAsync('SELECT COUNT(*) AS count FROM users');
  if (userCount.count === 0) {
    await seedDatabase();
  }
}

async function seedDatabase() {
  const users = [
    ['admin', 'admin@muthuvel.edu', 'Admin@2025', 'Dr. Anand Raj', 'AR', 'Administrator · India'],
    ['agent', 'peter@kavali.pg', 'Agent@2025', 'Peter Kavali', 'PK', 'Recruitment Agent · PNG'],
    ['student', 'james.tari@student.com', 'Student@2025', 'James Tari', 'JT', 'Student Applicant · PNG']
  ];
  const menuRows = [
    ['admin', '◼', 'Dashboard', 'dashboard'],
    ['admin', '👥', 'Agents', 'agents'],
    ['admin', '🎓', 'Students', 'students'],
    ['admin', '📋', 'Applications', 'applications'],
    ['admin', '📄', 'Documents', 'documents'],
    ['admin', '📊', 'Reports', 'reports'],
    ['admin', '⚙', 'Settings', 'settings'],
    ['agent', '◼', 'Dashboard', 'dashboard'],
    ['agent', '🎓', 'My Students', 'students'],
    ['agent', '📋', 'Applications', 'applications'],
    ['agent', '📄', 'Documents', 'documents'],
    ['agent', '➕', 'Register Student', 'register'],
    ['student', '◼', 'My Dashboard', 'dashboard'],
    ['student', '👤', 'My Profile', 'profile'],
    ['student', '📄', 'Documents', 'documents'],
    ['student', '📋', 'My Application', 'applications'],
    ['student', '🔔', 'Notifications', 'notifications']
  ];
  const agents = [
    ['Peter Kavali', 'Kimbe, WNB', '+675 7001 1001', 18, 14, 'active'],
    ['Susan Mala', 'Hoskins, WNB', '+675 7001 1002', 14, 10, 'active'],
    ['Tom Bana', 'Bialla, WNB', '+675 7001 1003', 9, 6, 'active'],
    ['Grace Ito', 'Kimbe, WNB', '+675 7001 1004', 6, 3, 'active'],
    ['Mark Tole', 'Talasea, WNB', '+675 7001 1005', 0, 0, 'inactive']
  ];
  const students = [
    ['James Tari', 'Kimbe', 'B.Tech CSE', 'Peter Kavali', 3, 4, 'pending'],
    ['Mary Pondo', 'Hoskins', 'BBA', 'Susan Mala', 4, 4, 'reviewed'],
    ['John Kaipu', 'Bialla', 'MBBS', 'Peter Kavali', 4, 4, 'approved'],
    ['Alice Wari', 'Talasea', 'B.Pharm', 'Tom Bana', 4, 4, 'approved'],
    ['Paul Kavana', 'Kimbe', 'B.Tech ME', 'Susan Mala', 2, 4, 'rejected'],
    ['Rose Baki', 'Hoskins', 'BCA', 'Grace Ito', 1, 4, 'pending'],
    ['Thomas Mala', 'Bialla', 'MBA', 'Peter Kavali', 4, 4, 'reviewed']
  ];
  const applications = [
    ['APP-2025-001', 'James Tari', 'B.Tech CSE', 'Peter Kavali', 3, 4, 'pending', '2 Jan 2025'],
    ['APP-2025-002', 'Mary Pondo', 'BBA', 'Susan Mala', 4, 4, 'reviewed', '28 Dec 2024'],
    ['APP-2024-018', 'John Kaipu', 'MBBS', 'Peter Kavali', 4, 4, 'approved', '20 Dec 2024'],
    ['APP-2024-017', 'Alice Wari', 'B.Pharm', 'Tom Bana', 4, 4, 'approved', '15 Dec 2024'],
    ['APP-2024-015', 'Paul Kavana', 'B.Tech ME', 'Susan Mala', 2, 4, 'rejected', '10 Dec 2024'],
    ['APP-2025-003', 'Rose Baki', 'BCA', 'Grace Ito', 1, 4, 'pending', '4 Jan 2025']
  ];
  const documents = [
    ['James Tari', 'Passport', 'passport_james.pdf', '2 Jan 2025', 'pending'],
    ['James Tari', 'Academic Transcript', 'transcript_james.pdf', '2 Jan 2025', 'pending'],
    ['Mary Pondo', 'Passport', 'passport_mary.pdf', '28 Dec 2024', 'verified'],
    ['Mary Pondo', 'Grade 12 Certificate', 'cert_mary.pdf', '28 Dec 2024', 'verified'],
    ['John Kaipu', 'Medical Certificate', 'medical_john.pdf', '20 Dec 2024', 'verified'],
    ['Alice Wari', 'Passport', 'passport_alice.pdf', '15 Dec 2024', 'verified']
  ];
  const notifications = [
    ['⚠', 'Your Medical Certificate is still missing. Please upload to proceed.', 'Today, 10:30 AM', 'warn', 0],
    ['📋', 'Your application APP-2025-001 has been received by Muthuvel Education.', '2 Jan 2025', 'info', 0],
    ['👤', 'Your profile has been created by Agent Peter Kavali.', '28 Dec 2024', 'info', 0],
    ['✅', 'Your Grade 12 Certificate was successfully uploaded.', '30 Dec 2024', 'success', 1],
    ['✅', 'Your Passport was successfully uploaded and verified.', '2 Jan 2025', 'success', 1]
  ];
  const profile = ['James Karo Tari', '15 Mar 2002', 'Papua New Guinean', 'P1234567', 'Kimbe', 'Kimbe', '+675 7234 5678', '2023', 'Kimbe Secondary School', 'B.Tech CSE', 'Peter Kavali', 'Kimbe, WNB', 'james.tari@student.com'];
  const reportStats = [
    ['enrolled', '23'],
    ['conversionRate', '49%'],
    ['underReview', '17'],
    ['rejected', '5']
  ];
  const reportPrograms = [
    ['MBBS', 12, 45],
    ['B.Tech CSE', 10, 37],
    ['BBA', 8, 30],
    ['B.Pharm', 7, 26]
  ];
  const reportPipeline = [
    ['Registered', 47, 'var(--muted)'],
    ['Pending', 12, 'var(--gold)'],
    ['Reviewed', 5, 'var(--brand-mid)'],
    ['Approved', 23, 'var(--success)'],
    ['Rejected', 5, 'var(--danger)']
  ];

  for (const row of users) await runAsync('INSERT INTO users (role,email,password,pw,name,avatar,title,created_at) VALUES (?,?,?,?,?,?,?,datetime(\'now\'))', row);
  for (const row of menuRows) await runAsync('INSERT INTO menus (role,icon,label,panel) VALUES (?,?,?,?)', row);
  for (const row of agents) await runAsync('INSERT INTO agents (name,location,phone,students,approved,status) VALUES (?,?,?,?,?,?)', row);
  for (const row of students) await runAsync('INSERT INTO students (name,village,program,agent,docsVerified,docsTotal,status) VALUES (?,?,?,?,?,?,?)', row);
  for (const row of applications) await runAsync('INSERT INTO applications (id,student,program,agent,docsVerified,docsTotal,status,date) VALUES (?,?,?,?,?,?,?,?)', row);
  for (const row of documents) await runAsync('INSERT INTO documents (student,type,filename,uploaded,status) VALUES (?,?,?,?,?)', row);
  for (const row of notifications) await runAsync('INSERT INTO notifications (icon,message,time,type,read) VALUES (?,?,?,?,?)', row);
  await runAsync('INSERT INTO profile (id,fullName,dob,nationality,passport,village,district,phone,grade12Year,lastSchool,programInterest,recruitingAgent,agentLocation,email) VALUES (1,?,?,?,?,?,?,?,?,?,?,?,?,?)', profile);
  for (const row of reportStats) await runAsync('INSERT INTO report_stats (key,value) VALUES (?,?)', row);
  for (const row of reportPrograms) await runAsync('INSERT INTO report_programs (program,students,pct) VALUES (?,?,?)', row);
  for (const row of reportPipeline) await runAsync('INSERT INTO report_pipeline (label,count,color) VALUES (?,?,?)', row);
}

async function getUserByEmail(email) {
  return getAsync('SELECT id, role, email, pw, name, avatar, title FROM users WHERE email = ?', [email]);
}

async function getMenu(role) {
  return allAsync('SELECT icon, label, panel FROM menus WHERE role = ? ORDER BY id', [role]);
}

async function getAgents() {
  return allAsync('SELECT name, location, phone, students, approved, status FROM agents ORDER BY id');
}

async function getStudents() {
  return allAsync('SELECT name, village, program, agent, docsVerified, docsTotal, status FROM students ORDER BY id');
}

async function getApplications(status) {
  if (status) {
    return allAsync('SELECT id, student, program, agent, docsVerified, docsTotal, status, date FROM applications WHERE status = ? ORDER BY date DESC', [status]);
  }
  return allAsync('SELECT id, student, program, agent, docsVerified, docsTotal, status, date FROM applications ORDER BY date DESC');
}

async function getDocuments() {
  return allAsync('SELECT student, type, filename, uploaded, status FROM documents ORDER BY id');
}

async function getNotifications() {
  return allAsync('SELECT icon, message, time, type, read FROM notifications ORDER BY id DESC');
}

async function getProfile() {
  return getAsync('SELECT fullName, dob, nationality, passport, village, district, phone, grade12Year, lastSchool, programInterest, recruitingAgent, agentLocation, email FROM profile WHERE id = 1');
}

async function getReports() {
  const stats = await allAsync('SELECT key, value FROM report_stats ORDER BY id');
  const programs = await allAsync('SELECT program, students, pct FROM report_programs ORDER BY id');
  const pipeline = await allAsync('SELECT label, count, color FROM report_pipeline ORDER BY id');
  return {
    stats: stats.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {}),
    programs,
    pipeline
  };
}

module.exports = {
  init,
  getUserByEmail,
  getMenu,
  getAgents,
  getStudents,
  getApplications,
  getDocuments,
  getNotifications,
  getProfile,
  getReports
};
