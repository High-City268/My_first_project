// Enhanced Modal Forms for MEEP Platform
// These functions add registration forms for students and agents

async function showEnhancedAgentRegistration() {
  const body = document.getElementById('modal-body');
  const footer = document.getElementById('modal-footer');
  const title = document.getElementById('modal-title');

  title.textContent = 'Register New Recruitment Agent';
  body.innerHTML = `
    <div style="font-size:12px;color:var(--muted);margin-bottom:16px;font-weight:500">PERSONAL INFORMATION</div>
    <div class="grid-2">
      <div class="field-group"><label>First Name *</label><input id="agentFirstName" placeholder="First name"></div>
      <div class="field-group"><label>Last Name *</label><input id="agentLastName" placeholder="Last name"></div>
    </div>
    <div class="grid-2">
      <div class="field-group"><label>Email *</label><input type="email" id="agentEmail" placeholder="agent@email.pg"></div>
      <div class="field-group"><label>Password *</label><input type="password" id="agentPassword" placeholder="Min 8 chars"></div>
    </div>
    <div class="grid-2">
      <div class="field-group"><label>Phone *</label><input id="agentPhone" placeholder="+675 XXXX XXXX"></div>
      <div class="field-group"><label>Date of Birth</label><input type="date" id="agentDOB"></div>
    </div>
    <div class="grid-2">
      <div class="field-group"><label>Nationality</label><input id="agentNationality" placeholder="e.g. Papua New Guinean"></div>
      <div class="field-group"><label>Passport Number</label><input id="agentPassport" placeholder="e.g. P1234567"></div>
    </div>
    <div style="border-top:1px solid var(--border);padding-top:16px;margin:16px 0">
      <div style="font-size:12px;color:var(--muted);margin-bottom:14px;font-weight:500">ASSIGNMENT</div>
      <div class="grid-2">
        <div class="field-group"><label>Region/Location *</label>
          <select id="agentLocation"><option value="">Select location...</option>
            <option>Kimbe, WNB</option><option>Bialla, WNB</option><option>Hoskins, WNB</option><option>Talasea, WNB</option></select></div>
        <div class="field-group"><label>Commission Rate (%)</label>
          <input type="number" id="agentCommission" placeholder="e.g. 5" min="0" max="100" step="0.5"></div>
      </div>
      <div class="field-group"><label>Target Students (per quarter)</label>
        <input type="number" id="agentTarget" placeholder="e.g. 10" min="0"></div>
    </div>`;
  
  footer.innerHTML = `
    <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    <button class="btn btn-blue" onclick="registerAgentForm()">Register Agent</button>`;
  
  document.getElementById('modal-overlay').classList.add('open');
}

async function registerAgentForm() {
  const firstName = document.getElementById('agentFirstName').value.trim();
  const lastName = document.getElementById('agentLastName').value.trim();
  const email = document.getElementById('agentEmail').value.trim();
  const password = document.getElementById('agentPassword').value.trim();
  const phone = document.getElementById('agentPhone').value.trim();
  
  if (!firstName || !lastName || !email || !password || !phone) {
    toast('Please fill in all required fields', 'warn');
    return;
  }
  
  if (password.length < 8) {
    toast('Password must be at least 8 characters', 'warn');
    return;
  }
  
  try {
    const agentData = {
      firstName, lastName, email, password, phone,
      dob: document.getElementById('agentDOB').value,
      nationality: document.getElementById('agentNationality').value,
      passport: document.getElementById('agentPassport').value,
      location: document.getElementById('agentLocation').value,
      commission: parseFloat(document.getElementById('agentCommission').value) || 5,
      target: parseInt(document.getElementById('agentTarget').value) || 10
    };
    
    // Call registration API
    const response = await fetch('/api/register-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData)
    });

    const result = await response.json();

    if (!response.ok) {
      toast(`Registration failed: ${result.error || result.message}`, 'error');
      return;
    }

    toast(`Agent ${firstName} ${lastName} registered successfully!`, 'success');
    closeModal();
    if (currentUser.role === 'admin') {
      await loadPanel('agents');
    }
  } catch (error) {
    toast('Failed to register agent: ' + error.message, 'error');
  }
}

async function showEnhancedStudentRegistration() {
  const body = document.getElementById('modal-body');
  const footer = document.getElementById('modal-footer');
  const title = document.getElementById('modal-title');

  title.textContent = 'Register New Student';
  body.innerHTML = `
    <div style="max-height:500px;overflow-y:auto">
      <div style="font-size:12px;color:var(--muted);margin-bottom:14px;font-weight:500">PERSONAL INFORMATION</div>
      <div class="grid-2">
        <div class="field-group"><label>First Name *</label><input id="stdFirstName" placeholder="First name"></div>
        <div class="field-group"><label>Last Name *</label><input id="stdLastName" placeholder="Last name"></div>
      </div>
      <div class="grid-2">
        <div class="field-group"><label>Email *</label><input type="email" id="stdEmail" placeholder="student@email.com"></div>
        <div class="field-group"><label>Phone *</label><input id="stdPhone" placeholder="+675 XXXX XXXX"></div>
      </div>
      <div class="grid-2">
        <div class="field-group"><label>Date of Birth *</label><input type="date" id="stdDOB"></div>
        <div class="field-group"><label>Gender</label>
          <select id="stdGender"><option value="">Select...</option><option>Male</option><option>Female</option><option>Other</option></select></div>
      </div>
      <div class="grid-2">
        <div class="field-group"><label>Nationality *</label><input id="stdNationality" placeholder="e.g. Papua New Guinean"></div>
        <div class="field-group"><label>Passport Number *</label><input id="stdPassport" placeholder="e.g. P1234567"></div>
      </div>
      
      <div style="border-top:1px solid var(--border);padding-top:14px;margin:14px 0">
        <div style="font-size:12px;color:var(--muted);margin-bottom:14px;font-weight:500">ADDRESS & LOCATION</div>
        <div class="grid-2">
          <div class="field-group"><label>Village/Town *</label><input id="stdVillage" placeholder="e.g. Kimbe"></div>
          <div class="field-group"><label>District *</label>
            <select id="stdDistrict"><option value="">Select district...</option>
              <option>Kimbe</option><option>Bialla</option><option>Talasea</option><option>Hoskins</option></select></div>
        </div>
        <div class="field-group"><label>Region/State</label><input id="stdRegion" placeholder="e.g. West New Britain"></div>
      </div>
      
      <div style="border-top:1px solid var(--border);padding-top:14px;margin:14px 0">
        <div style="font-size:12px;color:var(--muted);margin-bottom:14px;font-weight:500">ACADEMIC BACKGROUND</div>
        <div class="field-group"><label>Last School Attended *</label><input id="stdSchool" placeholder="Secondary school name"></div>
        <div class="grid-2">
          <div class="field-group"><label>Grade 12 Year *</label><input type="number" id="stdGrade12Year" placeholder="e.g. 2023" min="2000" max="2099"></div>
          <div class="field-group"><label>Grade 12 Result</label><input id="stdGrade12Result" placeholder="e.g. A"></div>
        </div>
        <div class="field-group"><label>Program of Interest *</label>
          <select id="stdProgram"><option value="">Select program...</option>
            ${['MBBS','B.Tech (CSE)','B.Tech (ME)','B.Tech (EE)','BBA','MBA','BCA','B.Pharm','B.Sc Nursing'].map(p=>`<option>${p}</option>`).join('')}
          </select></div>
      </div>
      
      <div style="border-top:1px solid var(--border);padding-top:14px;margin:14px 0">
        <div style="font-size:12px;color:var(--muted);margin-bottom:14px;font-weight:500">RECRUITMENT AGENT</div>
        <div class="field-group"><label>Recruiting Agent *</label>
          <select id="stdAgent"><option value="">Select agent...</option>
            <option>Peter Kavali</option><option>Susan Mala</option><option>Tom Bana</option><option>Grace Ito</option></select></div>
      </div>
    </div>`;
  
  footer.innerHTML = `
    <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    <button class="btn btn-gold" onclick="registerStudentForm()">Register Student</button>`;
  
  document.getElementById('modal-overlay').classList.add('open');
}

async function registerStudentForm() {
  const firstName = document.getElementById('stdFirstName').value.trim();
  const lastName = document.getElementById('stdLastName').value.trim();
  const email = document.getElementById('stdEmail').value.trim();
  const phone = document.getElementById('stdPhone').value.trim();
  const dob = document.getElementById('stdDOB').value;
  const nationality = document.getElementById('stdNationality').value.trim();
  const passport = document.getElementById('stdPassport').value.trim();
  const village = document.getElementById('stdVillage').value.trim();
  const district = document.getElementById('stdDistrict').value;
  const school = document.getElementById('stdSchool').value.trim();
  const grade12Year = document.getElementById('stdGrade12Year').value;
  const program = document.getElementById('stdProgram').value;
  const agent = document.getElementById('stdAgent').value;
  
  if (!firstName || !lastName || !email || !phone || !dob || !nationality || !passport || !village || !district || !school || !grade12Year || !program || !agent) {
    toast('Please fill in all required fields', 'warn');
    return;
  }
  
  try {
    const studentData = {
      firstName, lastName, email, phone, dob, nationality, passport, village, district, school,
      grade12Year: parseInt(grade12Year), gender: document.getElementById('stdGender').value,
      region: document.getElementById('stdRegion').value,
      grade12Result: document.getElementById('stdGrade12Result').value,
      program, agent
    };
    
    // Call registration API
    const response = await fetch('/api/register-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });

    const result = await response.json();

    if (!response.ok) {
      toast(`Registration failed: ${result.error || result.message}`, 'error');
      return;
    }

    toast(`Student ${firstName} ${lastName} registered successfully!`, 'success');
    closeModal();
    if (currentUser.role === 'admin' || currentUser.role === 'agent') {
      await loadPanel('students');
    } else if (currentUser.role === 'student') {
      await loadPanel('dashboard');
    }
  } catch (error) {
    toast('Failed to register student: ' + error.message, 'error');
  }
}

// Export functions for global scope
window.showEnhancedAgentRegistration = showEnhancedAgentRegistration;
window.showEnhancedStudentRegistration = showEnhancedStudentRegistration;
window.registerAgentForm = registerAgentForm;
window.registerStudentForm = registerStudentForm;
