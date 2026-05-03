// ─── registration.js ───────────────────────────────────────────────────────
const REG_FORM_URL = 'YOUR_GOOGLE_FORM_URL_HERE'; // ← replace before deployment
const EXTERNAL_PAYMENT_URL = 'YOUR_EXTERNAL_PAYMENT_URL_HERE'; // ← replace with actual URL before deployment

const S = {
  crew:   '',
  lead:   '',   // ← NEW: team lead name
  phone:  '',   // ← NEW: contact number
  inst:   '',
  events: [],
  stepVisited: [false, false, false, false],
  gngTimers: []
};

const STEP_PROMPTS = [
  'MISSION CONTROL: PLEASE CONFIRM CREW DESIGNATION.\nTHIS IS THE IDENTIFIER BY WHICH YOUR TEAM WILL BE\nLOGGED IN THE OFFICIAL MISSION MANIFEST.',
  'MISSION CONTROL: CONFIRM LAUNCH SITE.\nYOUR INSTITUTION OF ORIGIN FOR MISSION RECORDS.',
  'MISSION CONTROL: SELECT PRIMARY MISSION.\nCHOOSE THE OPERATION YOUR CREW IS VOLUNTEERING FOR.\nEACH CREW MAY SUBMIT FOR ONE PRIMARY MISSION.',
  'MISSION CONTROL: CONDUCTING PRE-LAUNCH GO/NO-GO POLL.\nALL STATIONS CONFIRM STATUS.',
];

function typeInto(el, text, cb) {
  if (!el) return;
  el.textContent = '';
  let i = 0;
  function next() {
    if (i < text.length) {
      el.textContent += text[i++];
      if (typeof playTypeKey === 'function') playTypeKey();
      setTimeout(next, 18);
    } else if (cb) cb();
  }
  next();
}

function setStep(n) {
  document.querySelectorAll('.reg-step').forEach(s => s.classList.remove('on'));
  const stepEl = document.getElementById('rs' + n);
  if (stepEl) stepEl.classList.add('on');

  // Update progress dots
  [1,2,3,4].forEach(i => {
    const dot = document.getElementById('sp' + i);
    if (dot) dot.className = 'sp-item' + (i <= n ? ' active' : '');
  });

  // Typewriter prompt
  const promptEl = document.getElementById('sp' + n + '-text');
  if (promptEl) {
    if (!S.stepVisited[n-1]) {
      typeInto(promptEl, STEP_PROMPTS[n-1]);
      S.stepVisited[n-1] = true;
    } else {
      promptEl.textContent = STEP_PROMPTS[n-1];
    }
  }

  if (n === 3) buildEvtList();
  if (n === 4) runGoNoGo();

  // Scroll to top of form
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildEvtList() {
  const container = document.getElementById('evt-list');
  if (!container) return;

  const techEvents = ['roborace','robosoccer','robosumo','linefollower','maze'];
  const ntEvents   = ['brandrumbling','sharktank','iqwars','waterrocket'];
  const presel = sessionStorage.getItem('preselect') || '';

  let html = '';
  html += `<div class="reg-group-label">TECHNICAL OPERATIONS</div>`;
  techEvents.forEach(id => {
    const d = EVT[id];
    if (!d) return;
    html += `
      <div class="reg-opt" onclick="selEvt(this, '${d.op}', '${d.nm}', '${id}')">
        <span class="ro-bullet">○</span>
        <span class="ro-nm-hi">${d.nm}</span>
      </div>
    `;
  });
  html += `<div class="reg-sep"></div>`;
  html += `<div class="reg-group-label">NON-TECHNICAL OPERATIONS</div>`;
  ntEvents.forEach(id => {
    const d = EVT[id];
    if (!d) return;
    html += `
      <div class="reg-opt" onclick="selEvt(this, '${d.op}', '${d.nm}', '${id}')">
        <span class="ro-bullet">○</span>
        <span class="ro-nm-hi">${d.nm}</span>
      </div>
    `;
  });
  html += `<div class="reg-sep"></div>`;
  html += `<div class="reg-group-label">OMEGA CLASSIFICATION</div>`;
  const hk = EVT['hacksprint'];
  if (hk) {
    html += `
      <div class="reg-opt" onclick="selEvt(this, '${hk.op}', '${hk.nm}', 'hacksprint')">
        <span class="ro-bullet">○</span>
        <span class="ro-nm-hi">${hk.nm} <span class="omega-badge">OMEGA</span></span>
      </div>
    `;
  }
  html += `<div class="reg-sel-count" id="sel-count"></div>`;
  container.innerHTML = html;

  // Handle pre-select from dossier
  if (presel) {
    const el = document.querySelector(`.reg-opt[onclick*="'${presel}'"]`);
    if (el) {
      // Set state directly — don't rely on click on potentially hidden element
      const d = EVT[presel];
      if (d) {
        S.events.push({ op: 'OPERATION: ' + d.op, evt: d.nm, evtId: presel });
        el.classList.add('sel');
        const bullet = el.querySelector('.ro-bullet');
        if (bullet) bullet.textContent = '●';
        const btn3 = document.getElementById('step3-btn');
        if (btn3) btn3.style.display = 'block';
        if (typeof playBlip === 'function') playBlip();
      }
    }
    sessionStorage.removeItem('preselect');
  }
  updateSelCount();
}

function updateSelCount() {
  const el = document.getElementById('sel-count');
  if (!el) return;
  const n = S.events.length;
  el.textContent = n === 0 ? 'SELECT ONE OR MORE MISSIONS' : `${n} MISSION${n > 1 ? 'S' : ''} SELECTED`;
  el.style.color = n === 0 ? 'var(--amber-dk)' : 'var(--amber)';
}

function selEvt(el, op, evt, id) {
  // Toggle selection
  const idx = S.events.findIndex(e => e.evtId === id);

  if (idx >= 0) {
    // Deselect
    S.events.splice(idx, 1);
    el.classList.remove('sel');
    const bullet = el.querySelector('.ro-bullet');
    if (bullet) bullet.textContent = '○';
  } else {
    // Select
    S.events.push({ op: 'OPERATION: ' + op, evt, evtId: id });
    el.classList.add('sel');
    const bullet = el.querySelector('.ro-bullet');
    if (bullet) bullet.textContent = '●';
  }

  // Show/hide next button based on whether at least one event is selected
  const btn3 = document.getElementById('step3-btn');
  if (btn3) btn3.style.display = S.events.length > 0 ? 'block' : 'none';

  if (typeof playBlip === 'function') playBlip();
  updateSelCount();
}

function nxt(from) {
if (from === 1) {
  const crew  = document.getElementById('inp-crew').value.trim();
  const lead  = document.getElementById('inp-lead').value.trim();
  const phone = document.getElementById('inp-phone').value.trim();
  if (!crew)  { shakeInput('inp-crew');  return; }
  if (!lead)  { shakeInput('inp-lead');  return; }
  if (!phone) { shakeInput('inp-phone'); return; }
  S.crew  = crew.toUpperCase();
  S.lead  = lead.toUpperCase();
  S.phone = phone;
  setStep(2);
} else if (from === 2) {
    const v = document.getElementById('inp-inst').value.trim();
    if (!v) { shakeInput('inp-inst'); return; }
    S.inst = v.toUpperCase();
    setStep(3);
  } else if (from === 3) {
    if (S.events.length === 0) return;
    setStep(4);
  }
}

function shakeInput(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderBottomColor = 'var(--red)';
  el.style.animation = 'shake 0.3s ease';
  setTimeout(() => { el.style.animation = ''; }, 300);
}
function clearErr(el) {
  if (el) el.style.borderBottomColor = '';
}

function runGoNoGo() {
  // Clear any existing timers
  S.gngTimers.forEach(clearTimeout);
  S.gngTimers = [];

  const evtSummary = S.events.map(e => e.evt).join(' · ');

  const items = [
    { id: 'g1', vid: 'gv1', val: S.crew },
    { id: 'g2', vid: 'gv2', val: S.lead },
    { id: 'g3', vid: 'gv3', val: S.phone },
    { id: 'g4', vid: 'gv4', val: S.inst },
    { id: 'g5', vid: 'gv5', val: evtSummary || '—' },
    { id: 'g6', vid: 'gv6', val: 'CONFIRMED' },
  ];

  // Reset state
  items.forEach(it => {
    const row = document.getElementById(it.id);
    const val = document.getElementById(it.vid);
    if (row) row.classList.remove('go');
    if (val) { val.classList.remove('go'); val.textContent = 'PENDING…'; }
  });
  const fin = document.getElementById('gng-final');
  if (fin) fin.style.opacity = '0';
  const btn = document.getElementById('launch-btn');
  if (btn) btn.style.display = 'none';

  items.forEach(({ id, vid, val }, i) => {
    const t = setTimeout(() => {
      const row   = document.getElementById(id);
      const valEl = document.getElementById(vid);
      if (!row || !valEl) return;
      valEl.textContent = val + '  ✓';
      valEl.classList.add('go');
      row.classList.add('go');
      if (typeof playTypeKey === 'function') playTypeKey();
    }, 600 * (i + 1));
    S.gngTimers.push(t);
  });

  S.gngTimers.push(setTimeout(() => {
    const fin = document.getElementById('gng-final');
    if (fin) fin.style.opacity = '1';
  }, 4400));

  S.gngTimers.push(setTimeout(() => {
    const btn = document.getElementById('launch-btn');
    if (btn) btn.style.display = 'block';
  }, 4800));
}

function submit() {
  const teamId = 'NXV-' + Date.now().toString(36).toUpperCase();

  const teamData = {
    id:        teamId,
    crew:      S.crew,
    lead:      S.lead,
    phone:     S.phone,
    inst:      S.inst,
    events:    S.events,
    op:        S.events[0]?.op || '',
    evt:       S.events[0]?.evt || '',
    evtId:     S.events[0]?.evtId || '',
    createdAt: new Date().toISOString(),
  };

  if (typeof saveTeam === 'function') saveTeam(teamData);

  const sessionEmail = getSession();
  if (typeof postToSheets === 'function') {
    postToSheets(teamData, sessionEmail || '');
  }

  // Link this team to the logged-in user account
  if (sessionEmail && typeof linkTeamToUser === 'function') {
    linkTeamToUser(sessionEmail, teamId);
  }

  sessionStorage.setItem('reg_team_id', teamId);

  // ── EXTERNAL REDIRECT ──────────────────────────────────────────────────────
  // Open external payment/registration page in a new tab
  if (EXTERNAL_PAYMENT_URL && EXTERNAL_PAYMENT_URL !== 'YOUR_EXTERNAL_PAYMENT_URL_HERE') {
    window.open(EXTERNAL_PAYMENT_URL, '_blank', 'noopener,noreferrer');
  }
  // ──────────────────────────────────────────────────────────────────────────

  // Navigate to profile
  document.body.style.background = '#F0A500';
  setTimeout(() => {
    document.body.style.background = '';
    if (typeof staticCut === 'function') {
      staticCut(() => { window.location.href = 'profile.html?id=' + teamId; });
    } else {
      window.location.href = 'profile.html?id=' + teamId;
    }
  }, 600);
}
