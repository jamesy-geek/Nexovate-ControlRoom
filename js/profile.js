// ─── profile.js (v5 Overhaul) ────────────────────────────────────────────────
// Reads teamId from URL, loads from localStorage, renders profile card.

const PAYMENT_PORTAL_URL = 'YOUR_PAYMENT_PORTAL_URL_HERE'; // ← REPLACE BEFORE LAUNCH

document.addEventListener('DOMContentLoaded', () => {
  const params     = new URLSearchParams(window.location.search);
  const urlTeamId  = params.get('id');
  const root       = document.getElementById('profile-root');

  // ── Auth check ─────────────────────────────────────────────────────────────
  const user = getLoggedInUser();
  if (!user) {
    root.innerHTML = notLoggedInHTML();
    return;
  }

  // ── Team resolution ────────────────────────────────────────────────────────
  const teamId = urlTeamId || user.teamId || sessionStorage.getItem('reg_team_id');

  if (!teamId) {
    root.innerHTML = notFoundHTML('NO CREW REGISTERED YET');
    return;
  }

  const team = getTeam(teamId);
  if (!team) {
    root.innerHTML = notFoundHTML('CREW MANIFEST NOT FOUND · ID: ' + teamId);
    return;
  }

  renderProfile(team, root, user.email);
});

function getEvtDetail(evtId) {
  return EVT[evtId] || null;
}

function renderProfile(team, root, email) {
  const events = team.events && team.events.length > 0 ? team.events : [{ op: team.op, evt: team.evt, evtId: team.evtId }];
  const isMulti = events.length > 1;
  const evt = isMulti ? null : getEvtDetail(events[0].evtId);
  const profileURL = window.location.origin + '/profile.html?id=' + team.id;

  // Sequential team number (Prioritize saved crewNum, fallback to ID calculation)
  const teamNum = team.crewNum || (parseInt(team.id.replace('NXV-', ''), 36) % 999 + 1);

  root.innerHTML = `
    <!-- Announcement ticker -->
    <div class="prof-announce">
      <span class="prof-announce-inner">
        NEXOVATE 2026 &nbsp;·&nbsp; CREW REGISTRATION CONFIRMED &nbsp;·&nbsp; 
        MISSION DATE: MAY 22–23, 2026 &nbsp;·&nbsp; VENUE: PESCE MANDYA &nbsp;·&nbsp; 
        ALL SYSTEMS NOMINAL &nbsp;·&nbsp; PRIZE MANIFEST: ₹2,00,000 &nbsp;·&nbsp;
        NEXOVATE 2026 &nbsp;·&nbsp; CREW REGISTRATION CONFIRMED &nbsp;·&nbsp; 
        MISSION DATE: MAY 22–23, 2026 &nbsp;·&nbsp; VENUE: PESCE MANDYA &nbsp;·&nbsp; 
        ALL SYSTEMS NOMINAL &nbsp;·&nbsp; PRIZE MANIFEST: ₹2,00,000 &nbsp;·&nbsp;
      </span>
    </div>

    <!-- Map link -->
    <a class="prof-map-link" href="https://maps.google.com/?q=PESCE+Mandya+Karnataka" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
      PESCE MANDYA · MISSION SITE
    </a>

    <!-- Main card -->
    <div class="prof-card">
      <div class="prof-top-actions">
        <button class="prof-btn-top" onclick="navigate('hero')">⌂ HOME</button>
        <button class="prof-btn-top" onclick="logOut()">LOGOUT</button>
      </div>

      <!-- Identity Row -->
      <div class="prof-identity-row">
        <div class="prof-team-block">
          <div class="prof-team-lbl">CREW DESIGNATION</div>
          <div class="prof-team-name">${team.crew}</div>
          <div class="prof-team-inst">${team.inst}</div>
        </div>
        <div class="prof-crew-badge">
          <div class="pcb-lbl">CREW NO.</div>
          <div class="pcb-val">${String(teamNum).padStart(2, '0')}</div>
        </div>
      </div>

      <div class="prof-divider"></div>

      <!-- Operation Section -->
      <div class="prof-op-section">
        <div class="prof-team-lbl">ASSIGNED OPERATIONS</div>
        ${buildEventsHTML(team)}
      </div>

      <!-- Info Grid -->
      <div class="prof-info-grid">
        <div class="prof-info-item">
          <div class="pii-lbl">MISSION LEAD</div>
          <div class="pii-val">${team.lead || '—'}</div>
        </div>
        <div class="prof-info-item">
          <div class="pii-lbl">CONTACT COMMS</div>
          <div class="pii-val hi">${team.phone || '—'}</div>
        </div>
        <div class="prof-info-item">
          <div class="pii-lbl">MISSION TYPE</div>
          <div class="pii-val">${isMulti ? 'MULTIPLE' : (evt ? evt.type.split('·')[0].trim() : '—')}</div>
        </div>
        <div class="prof-info-item">
          <div class="pii-lbl">PRIZE MANIFEST</div>
          <div class="pii-val hi">${isMulti ? 'VARIES' : (evt ? evt.prize : '—')}</div>
        </div>
      </div>

      <!-- Payment CTA Block -->
      <div class="prof-payment-block">
        <div class="pay-title">OPERATION FINALIZATION REQUIRED</div>
        <div class="pay-desc">
          To finalize your crew's deployment and secure your slot in the mission, 
          complete the final registration and entry fee payment via our portal.
        </div>
        <button class="btn-payment" onclick="window.open('${PAYMENT_PORTAL_URL}', '_blank')">
          PROCEED TO PAYMENT PORTAL
        </button>
        <div class="pay-disclaimer">
          ⚠ &nbsp;DISCLAIMER: YOU WILL BE REDIRECTED TO AN EXTERNAL PLATFORM TO COMPLETE THE TRANSACTION.
        </div>
      </div>

      <div class="prof-divider"></div>

      <!-- Bottom Row -->
      <div class="prof-bottom-row">
        <div class="prof-patch-wrap">
          <div class="prof-team-lbl">MISSION PATCH</div>
          <div id="prof-patch"></div>
        </div>
        <div class="prof-qr-wrap">
          <div id="prof-qr"></div>
          <div class="prof-team-lbl" style="text-align:right; margin-top:8px;">SCAN FOR IDENTITY</div>
        </div>
      </div>

      <div class="prof-notice" style="margin-top:40px; opacity:0.6; font-size:8px; letter-spacing:.1em; line-height:2;">
        ★ &nbsp;THIS IS YOUR OFFICIAL CREW PROFILE. SCREENSHOT FOR OFFLINE ACCESS.<br>
        ★ &nbsp;REPORT TO PESCE MANDYA · MAY 22, 2026 · 09:00 HRS.<br>
        ★ &nbsp;CREW ID: ${team.id}
      </div>
    </div>

    <!-- Share Button -->
    <div class="prof-share-wrap">
      <button class="btn-share" onclick="shareProfile('${profileURL}')">
        ↗ SHARE CREW PROFILE
      </button>
    </div>
  `;

  buildProfilePatch(team.crew.substring(0, 13), evt ? evt.op : 'NEXOVATE');
  buildQR(profileURL);
}

function buildEventsHTML(team) {
  const events = team.events && team.events.length > 0 ? team.events : [{ op: team.op, evt: team.evt, evtId: team.evtId }];
  
  if (events.length === 1) {
    const e = events[0];
    const detail = getEvtDetail(e.evtId);
    return `<div class="prof-op-badge">${detail ? 'OPERATION: ' + detail.op : e.op} · ${e.evt}</div>`;
  }

  let html = `<div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:12px;">`;
  events.forEach(e => {
    const detail = getEvtDetail(e.evtId);
    html += `
      <div style="border:1px solid rgba(240,165,0,0.1); padding:12px; background:rgba(240,165,0,0.02);">
        <div style="font-size:7px; letter-spacing:.2em; color:var(--amber-dk); margin-bottom:4px;">${detail ? 'OP: ' + detail.op : 'OPERATION'}</div>
        <div style="font-family:var(--font-d); font-size:10px; color:var(--offwhite);">${e.evt}</div>
      </div>
    `;
  });
  html += `</div>`;
  return html;
}

function buildProfilePatch(crew, op) {
  const container = document.getElementById('prof-patch');
  if (!container) return;
  container.innerHTML = `
    <svg width="100" height="100" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="pcp1" d="M 40,140 A 100,100 0 0,1 240,140"/>
        <path id="pcp2" d="M 52,155 A 100,100 0 0,0 228,155"/>
      </defs>
      <circle cx="140" cy="140" r="133" fill="none" stroke="#C8882A" stroke-width=".8" stroke-dasharray="7,4"/>
      <circle cx="140" cy="140" r="126" fill="#0C0905"/>
      <circle cx="140" cy="140" r="126" fill="none" stroke="#F0A500" stroke-width="2"/>
      <circle cx="140" cy="140" r="116" fill="none" stroke="#C8882A" stroke-width=".5"/>
      <line x1="70" y1="140" x2="210" y2="140" stroke="#F0A500" stroke-width="3"/>
      <text fill="#F0A500" font-family="'Orbitron',monospace" font-size="11" font-weight="700" letter-spacing="3">
        <textPath href="#pcp1" startOffset="50%" text-anchor="middle">${crew}</textPath>
      </text>
      <text fill="#C8882A" font-family="'Orbitron',monospace" font-size="9" letter-spacing="2.5">
        <textPath href="#pcp2" startOffset="50%" text-anchor="middle">${op}</textPath>
      </text>
    </svg>
  `;
}

function buildQR(url) {
  const container = document.getElementById('prof-qr');
  if (!container) return;
  try {
    new QRCode(container, {
      text: url,
      width: 96,
      height: 96,
      colorDark: '#0D0A07',
      colorLight: '#E8E0D0',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch (e) {
    container.innerHTML = `<div style="font-size:7px;color:var(--amber-dk);">${url}</div>`;
  }
}

function shareProfile(url) {
  if (navigator.share) {
    navigator.share({ title: 'NEXOVATE 2026 Crew', url: url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url).then(() => alert('URL copied.'));
  }
}

function notLoggedInHTML() {
  return `<div style="text-align:center; padding:100px 20px;"><div style="font-size:32px; color:var(--amber); margin-bottom:20px;">401</div><div style="font-size:10px; color:var(--offwhite); letter-spacing:.3em;">AUTHENTICATION REQUIRED</div><br><button class="btn-payment" onclick="window.location.href='registration.html'">LOGIN</button></div>`;
}

function notFoundHTML(reason) {
  return `<div style="text-align:center; padding:100px 20px;"><div style="font-size:32px; color:var(--amber); margin-bottom:20px;">404</div><div style="font-size:10px; color:var(--offwhite); letter-spacing:.3em;">${reason}</div><br><button class="btn-payment" onclick="navigate('hero')">HOME</button></div>`;
}
