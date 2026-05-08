const users = [
  { role: 'admin', email: 'admin@muthuvel.edu', pw: 'Admin@2025', name: 'Dr. Anand Raj', avatar: 'AR', title: 'Administrator · India' },
  { role: 'agent', email: 'peter@kavali.pg', pw: 'Agent@2025', name: 'Peter Kavali', avatar: 'PK', title: 'Recruitment Agent · PNG' },
  { role: 'student', email: 'james.tari@student.com', pw: 'Student@2025', name: 'James Tari', avatar: 'JT', title: 'Student Applicant · PNG' }
];

const menus = {
  admin: [
    { icon: '◼', label: 'Dashboard', panel: 'dashboard' },
    { icon: '👥', label: 'Agents', panel: 'agents' },
    { icon: '🎓', label: 'Students', panel: 'students' },
    { icon: '📋', label: 'Applications', panel: 'applications' },
    { icon: '📄', label: 'Documents', panel: 'documents' },
    { icon: '📊', label: 'Reports', panel: 'reports' },
    { icon: '⚙', label: 'Settings', panel: 'settings' }
  ],
  agent: [
    { icon: '◼', label: 'Dashboard', panel: 'dashboard' },
    { icon: '🎓', label: 'My Students', panel: 'students' },
    { icon: '📋', label: 'Applications', panel: 'applications' },
    { icon: '📄', label: 'Documents', panel: 'documents' },
    { icon: '➕', label: 'Register Student', panel: 'register' }
  ],
  student: [
    { icon: '◼', label: 'My Dashboard', panel: 'dashboard' },
    { icon: '👤', label: 'My Profile', panel: 'profile' },
    { icon: '📄', label: 'Documents', panel: 'documents' },
    { icon: '📋', label: 'My Application', panel: 'applications' },
    { icon: '🔔', label: 'Notifications', panel: 'notifications' }
  ]
};

const agents = [
  { name: 'Peter Kavali', location: 'Kimbe, WNB', phone: '+675 7001 1001', students: 18, approved: 14, status: 'active' },
  { name: 'Susan Mala', location: 'Hoskins, WNB', phone: '+675 7001 1002', students: 14, approved: 10, status: 'active' },
  { name: 'Tom Bana', location: 'Bialla, WNB', phone: '+675 7001 1003', students: 9, approved: 6, status: 'active' },
  { name: 'Grace Ito', location: 'Kimbe, WNB', phone: '+675 7001 1004', students: 6, approved: 3, status: 'active' },
  { name: 'Mark Tole', location: 'Talasea, WNB', phone: '+675 7001 1005', students: 0, approved: 0, status: 'inactive' }
];

const students = [
  { name: 'James Tari', village: 'Kimbe', program: 'B.Tech CSE', agent: 'Peter Kavali', docsVerified: 3, docsTotal: 4, status: 'pending' },
  { name: 'Mary Pondo', village: 'Hoskins', program: 'BBA', agent: 'Susan Mala', docsVerified: 4, docsTotal: 4, status: 'reviewed' },
  { name: 'John Kaipu', village: 'Bialla', program: 'MBBS', agent: 'Peter Kavali', docsVerified: 4, docsTotal: 4, status: 'approved' },
  { name: 'Alice Wari', village: 'Talasea', program: 'B.Pharm', agent: 'Tom Bana', docsVerified: 4, docsTotal: 4, status: 'approved' },
  { name: 'Paul Kavana', village: 'Kimbe', program: 'B.Tech ME', agent: 'Susan Mala', docsVerified: 2, docsTotal: 4, status: 'rejected' },
  { name: 'Rose Baki', village: 'Hoskins', program: 'BCA', agent: 'Grace Ito', docsVerified: 1, docsTotal: 4, status: 'pending' },
  { name: 'Thomas Mala', village: 'Bialla', program: 'MBA', agent: 'Peter Kavali', docsVerified: 4, docsTotal: 4, status: 'reviewed' }
];

const applications = [
  { id: 'APP-2025-001', student: 'James Tari', program: 'B.Tech CSE', agent: 'Peter Kavali', docsVerified: 3, docsTotal: 4, status: 'pending', date: '2 Jan 2025' },
  { id: 'APP-2025-002', student: 'Mary Pondo', program: 'BBA', agent: 'Susan Mala', docsVerified: 4, docsTotal: 4, status: 'reviewed', date: '28 Dec 2024' },
  { id: 'APP-2024-018', student: 'John Kaipu', program: 'MBBS', agent: 'Peter Kavali', docsVerified: 4, docsTotal: 4, status: 'approved', date: '20 Dec 2024' },
  { id: 'APP-2024-017', student: 'Alice Wari', program: 'B.Pharm', agent: 'Tom Bana', docsVerified: 4, docsTotal: 4, status: 'approved', date: '15 Dec 2024' },
  { id: 'APP-2024-015', student: 'Paul Kavana', program: 'B.Tech ME', agent: 'Susan Mala', docsVerified: 2, docsTotal: 4, status: 'rejected', date: '10 Dec 2024' },
  { id: 'APP-2025-003', student: 'Rose Baki', program: 'BCA', agent: 'Grace Ito', docsVerified: 1, docsTotal: 4, status: 'pending', date: '4 Jan 2025' }
];

const documents = [
  { student: 'James Tari', type: 'Passport', filename: 'passport_james.pdf', uploaded: '2 Jan 2025', status: 'pending' },
  { student: 'James Tari', type: 'Academic Transcript', filename: 'transcript_james.pdf', uploaded: '2 Jan 2025', status: 'pending' },
  { student: 'Mary Pondo', type: 'Passport', filename: 'passport_mary.pdf', uploaded: '28 Dec 2024', status: 'verified' },
  { student: 'Mary Pondo', type: 'Grade 12 Certificate', filename: 'cert_mary.pdf', uploaded: '28 Dec 2024', status: 'verified' },
  { student: 'John Kaipu', type: 'Medical Certificate', filename: 'medical_john.pdf', uploaded: '20 Dec 2024', status: 'verified' },
  { student: 'Alice Wari', type: 'Passport', filename: 'passport_alice.pdf', uploaded: '15 Dec 2024', status: 'verified' }
];

const notifications = [
  { icon: '⚠', message: 'Your Medical Certificate is still missing. Please upload to proceed.', time: 'Today, 10:30 AM', type: 'warn', read: false },
  { icon: '📋', message: 'Your application APP-2025-001 has been received by Muthuvel Education.', time: '2 Jan 2025', type: 'info', read: false },
  { icon: '👤', message: 'Your profile has been created by Agent Peter Kavali.', time: '28 Dec 2024', type: 'info', read: false },
  { icon: '✅', message: 'Your Grade 12 Certificate was successfully uploaded.', time: '30 Dec 2024', type: 'success', read: true },
  { icon: '✅', message: 'Your Passport was successfully uploaded and verified.', time: '2 Jan 2025', type: 'success', read: true }
];

const profile = {
  fullName: 'James Karo Tari',
  dob: '15 Mar 2002',
  nationality: 'Papua New Guinean',
  passport: 'P1234567',
  village: 'Kimbe',
  district: 'Kimbe',
  phone: '+675 7234 5678',
  grade12Year: '2023',
  lastSchool: 'Kimbe Secondary School',
  programInterest: 'B.Tech CSE',
  recruitingAgent: 'Peter Kavali',
  agentLocation: 'Kimbe, WNB',
  email: 'james.tari@student.com'
};

const reports = {
  enrolled: 23,
  conversionRate: '49%',
  underReview: 17,
  rejected: 5,
  enrollmentByProgram: [
    { program: 'MBBS', students: 12, pct: 45 },
    { program: 'B.Tech CSE', students: 10, pct: 37 },
    { program: 'BBA', students: 8, pct: 30 },
    { program: 'B.Pharm', students: 7, pct: 26 }
  ],
  pipeline: [
    { label: 'Registered', count: 47, color: 'var(--muted)' },
    { label: 'Pending', count: 12, color: 'var(--gold)' },
    { label: 'Reviewed', count: 5, color: 'var(--brand-mid)' },
    { label: 'Approved', count: 23, color: 'var(--success)' },
    { label: 'Rejected', count: 5, color: 'var(--danger)' }
  ]
};

module.exports = {
  users,
  menus,
  agents,
  students,
  applications,
  documents,
  notifications,
  profile,
  reports
};
