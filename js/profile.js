// ─── profile.js ─────────────────────────────────────────────────────────────
// Reads teamId from URL, loads from localStorage, renders profile card.

document.addEventListener('DOMContentLoaded', () => {
  const params     = new URLSearchParams(window.location.search);
  const urlTeamId  = params.get('id');
  const root       = document.getElementById('profile-root');

  // ── Auth check ─────────────────────────────────────────────────────────────
  const user = getLoggedInUser();
  if (!user) {
    // Not logged in — show login prompt
    root.innerHTML = notLoggedInHTML();
    return;
  }

  // ── Team resolution ────────────────────────────────────────────────────────
  // Priority: URL param → user's linked teamId
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

// ── Event detail lookup by evtId ────────────────────────────────────────────
function getEvtDetail(evtId) {
  // Uses EVT from events-data.js
  return EVT[evtId] || null;
}

// ── Render ───────────────────────────────────────────────────────────────────
function renderProfile(team, root, email) {
  const events = team.events && team.events.length > 0 ? team.events : [{ op: team.op, evt: team.evt, evtId: team.evtId }];
  const isMulti = events.length > 1;
  const evt = isMulti ? null : getEvtDetail(events[0].evtId);
  const teamSlug = team.crew.replace(/\s+/g, '-').toLowerCase().substring(0, 8);
  const profileURL = window.location.origin + '/profile.html?id=' + team.id;

  // Sequential team number from ID (last 3 chars of timestamp base36 → convert to number, mod 999)
  const teamNum = parseInt(team.id.replace('NXV-', ''), 36) % 999 + 1;

  root.innerHTML = `
    <!-- Announcement ticker (card-level) -->
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

    <!-- Map banner -->
    <a class="prof-map-banner" href="https://maps.google.com/?q=PESCE+Mandya+Karnataka" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
      CAMPUS MAP · PESCE MANDYA
    </a>

    <!-- Main card -->
    <div class="prof-card">

      <button class="prof-logout-btn" onclick="logOut()">LOGOUT</button>
      <!-- Home button -->
      <button class="prof-home-btn" onclick="navigate('hero')">⌂ HOME</button>

      <!-- Timer -->
      <div class="prof-timer-wrap">
        <div class="prof-timer-lbl">T-MINUS TO LAUNCH</div>
        <div class="prof-timer-dig" id="prof-timer">-- : -- : --</div>
        <div class="prof-timer-sub" id="prof-timer-sub">MAY 22 · 09:00 HRS · PESCE MANDYA</div>
      </div>

      <!-- Team identity -->
      <div class="prof-identity">
        <div class="prof-team-block">
          <div class="prof-team-lbl">CREW DESIGNATION</div>
          <div class="prof-team-name">${team.crew}</div>
          <div class="prof-team-inst">${team.inst}</div>
        </div>
        <div class="prof-id-badge">
          <div class="prof-id-badge-lbl">CREW NO.</div>
          <div class="prof-id-badge-val">${String(teamNum).padStart(2, '0')}</div>
        </div>
      </div>

      <div class="prof-div"></div>

      <!-- Operation badge / Events grid -->
      ${buildEventsHTML(team)}

      <!-- Info grid -->
      <div class="prof-info-grid">
        <div class="prof-info-item">
          <div class="prof-info-lbl">MISSION TYPE</div>
          <div class="prof-info-val mono">${isMulti ? 'MULTIPLE MISSIONS' : (evt ? evt.type.split('·')[0].trim() : '—')}</div>
        </div>
        <div class="prof-info-item">
          <div class="prof-info-lbl">PRIZE POOL</div>
          <div class="prof-info-val prize">${isMulti ? 'SEE EVENTS' : (evt ? evt.prize : '—')}</div>
        </div>
        <div class="prof-info-item">
          <div class="prof-info-lbl">CREW SIZE</div>
          <div class="prof-info-val mono">${isMulti ? 'VARIES' : (evt ? evt.crew + ' PERSONNEL' : '—')}</div>
        </div>
        <div class="prof-info-item">
          <div class="prof-info-lbl">MISSION LEAD</div>
          <div class="prof-info-val mono" style="font-size:10px;">${isMulti ? 'SEE EVENTS' : (evt ? evt.lead : '—')}</div>
        </div>
      </div>

      <!-- Venue block -->
      <div class="prof-venue">
        <div class="prof-venue-lbl">LAUNCH SITE · VENUE</div>
        <div class="prof-venue-val">PESCE MANDYA</div>
        <div class="prof-venue-sub">
          ${isMulti ? 'VARIOUS MODULES' : (evt ? 'MODULE: ' + evt.mod : '')} &nbsp;·&nbsp; MAY 22–23, 2026
        </div>
      </div>

      <!-- Contact comms -->
      ${!isMulti && evt ? `
      <div style="font-size:9px;letter-spacing:.2em;color:var(--amber-dk);margin-bottom:14px;line-height:2;">
        <span style="color:var(--amber-dk);letter-spacing:.4em;font-size:8px;">MISSION COMMS &nbsp;</span>
        <span style="color:var(--amber);font-family:var(--font-m);">${evt.comms}</span>
      </div>
      ` : ''}

      <div class="prof-div"></div>

      <!-- Patch + QR row -->
      <div class="prof-bottom-row">
        <div class="prof-patch-wrap">
          <div style="font-size:8px;letter-spacing:.4em;color:var(--amber-dk);margin-bottom:8px;">MISSION PATCH</div>
          <div id="prof-patch"></div>
        </div>
        <div class="prof-qr-wrap">
          <div id="prof-qr"></div>
          <div class="prof-qr-lbl">SCAN TO ACCESS<br>CREW PROFILE</div>
        </div>
      </div>

      <div class="prof-notice">
        ★ &nbsp;THIS IS YOUR CREW PROFILE PAGE. BOOKMARK OR SCREENSHOT FOR REFERENCE.<br>
        ★ &nbsp;REPORT TO PESCE MANDYA LAUNCH SITE · MAY 22, 2026 · 09:00 HRS.<br>
        ★ &nbsp;CREW ID: ${team.id}
      </div>
      
      <div class="prof-notice" style="margin-top: 10px; border-color: rgba(240,165,0,0.4); color: var(--amber);">
        ⚠ &nbsp;DISCLAIMER: YOU WILL BE REDIRECTED TO AN EXTERNAL PLATFORM TO REGISTER AGAIN AND PAY THE ENTRANCE FEE. ANY DETAILS YOU NEED ABOUT THE EVENT WILL BE UPDATED ON THIS OFFICIAL NEXOVATE WEBSITE.
      </div>

    </div>

    <!-- Share button -->
    <button class="btn btn-next prof-share-btn" onclick="shareProfile('${profileURL}')">
      ↗ SHARE CREW PROFILE
    </button>
  `;

  // Build mission patch
  buildProfilePatch(team.crew.substring(0, 13), evt ? evt.op : 'NEXOVATE');

  // Build QR code
  buildQR(profileURL);

  // Start timer
  startProfileTimer();
}

// ── Mission patch (reused from confirmation.js logic) ────────────────────────
function buildProfilePatch(crew, op) {
  const container = document.getElementById('prof-patch');
  if (!container) return;
  container.innerHTML = `
    <svg width="120" height="120" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="pcp1" d="M 40,140 A 100,100 0 0,1 240,140"/>
        <path id="pcp2" d="M 52,155 A 100,100 0 0,0 228,155"/>
      </defs>
      <circle cx="140" cy="140" r="133" fill="none" stroke="#C8882A" stroke-width=".8" stroke-dasharray="7,4"/>
      <circle cx="140" cy="140" r="126" fill="#0C0905"/>
      <circle cx="140" cy="140" r="126" fill="none" stroke="#F0A500" stroke-width="2"/>
      <circle cx="140" cy="140" r="116" fill="none" stroke="#C8882A" stroke-width=".5"/>
      <g fill="#F0A500" opacity=".6">
        <circle cx="55" cy="95" r="1.5"/><circle cx="75" cy="58" r="1"/><circle cx="108" cy="44" r="1.5"/>
        <circle cx="225" cy="95" r="1.5"/><circle cx="205" cy="58" r="1"/><circle cx="172" cy="44" r="1.5"/>
        <circle cx="50" cy="160" r="1"/><circle cx="230" cy="160" r="1"/>
      </g>
      <line x1="70" y1="140" x2="210" y2="140" stroke="#F0A500" stroke-width="3"/>
      <rect x="122" y="122" width="36" height="36" fill="rgba(240,165,0,.13)" stroke="#F0A500" stroke-width="1.5" rx="2"/>
      <text x="140" y="143" text-anchor="middle" fill="#F0A500" font-size="7" font-family="monospace" letter-spacing="1">CORE</text>
      <rect x="80" y="130" width="20" height="20" fill="rgba(240,165,0,.06)" stroke="#C8882A" stroke-width=".8"/>
      <rect x="180" y="130" width="20" height="20" fill="rgba(240,165,0,.06)" stroke="#C8882A" stroke-width=".8"/>
      <rect x="22" y="133" width="44" height="14" fill="rgba(74,110,138,.28)" stroke="#4A6E8A" stroke-width=".8"/>
      <rect x="214" y="133" width="44" height="14" fill="rgba(74,110,138,.28)" stroke="#4A6E8A" stroke-width=".8"/>
      <text fill="#F0A500" font-family="'Orbitron',monospace" font-size="11" font-weight="700" letter-spacing="3">
        <textPath href="#pcp1" startOffset="50%" text-anchor="middle">${crew}</textPath>
      </text>
      <text fill="#C8882A" font-family="'Orbitron',monospace" font-size="9" letter-spacing="2.5">
        <textPath href="#pcp2" startOffset="50%" text-anchor="middle">${op}</textPath>
      </text>
      <text x="140" y="188" text-anchor="middle" fill="rgba(240,165,0,.45)" font-family="monospace" font-size="7" letter-spacing="2.5">NEXOVATE 2026</text>
    </svg>
  `;
}

// ── QR code ──────────────────────────────────────────────────────────────────
function buildQR(url) {
  const container = document.getElementById('prof-qr');
  if (!container) return;
  // qrcodejs creates a canvas or img inside the container
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
    // Fallback: show the URL as text if QR lib fails
    container.innerHTML = `<div style="width:96px;height:96px;border:1px solid rgba(240,165,0,.2);display:flex;align-items:center;justify-content:center;font-size:7px;color:var(--amber-dk);word-break:break-all;padding:4px;text-align:center;">${url}</div>`;
  }
}

// ── Countdown timer ───────────────────────────────────────────────────────────
function startProfileTimer() {
  const launch = new Date('2026-05-22T09:00:00+05:30');

  function tick() {
    const digEl = document.getElementById('prof-timer');
    const subEl = document.getElementById('prof-timer-sub');
    if (!digEl) return;

    const diff = Math.max(0, launch - Date.now()) / 1000;
    if (diff <= 0) {
      digEl.textContent = 'MISSION LIVE';
      digEl.classList.add('launched');
      if (subEl) subEl.textContent = 'NEXOVATE 2026 · IN PROGRESS';
      return;
    }

    const d  = Math.floor(diff / 86400);
    const h  = Math.floor((diff % 86400) / 3600);
    const m  = Math.floor((diff % 3600) / 60);
    const s  = Math.floor(diff % 60);

    if (d > 0) {
      digEl.textContent = `${d}D ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    } else {
      digEl.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }
  }

  tick();
  setInterval(tick, 1000);
}

// ── Share ─────────────────────────────────────────────────────────────────────
function shareProfile(url) {
  if (navigator.share) {
    navigator.share({
      title: 'NEXOVATE 2026 — Crew Profile',
      text: 'Access my crew profile for NEXOVATE 2026',
      url: url,
    }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url).then(() => {
      alert('Profile URL copied to clipboard:\n' + url);
    });
  }
}

// ── Not found HTML ────────────────────────────────────────────────────────────
function notLoggedInHTML() {
  return `
    <div class="prof-notfound">
      <div class="big">401</div>
      <div>AUTHENTICATION REQUIRED</div>
      <br>
      <div style="font-size:9px;opacity:.6;letter-spacing:.2em;">
        LOGIN TO ACCESS YOUR CREW PROFILE
      </div>
      <br><br>
      <button class="btn btn-next" onclick="window.location.href='registration.html'">
        → LOGIN / SIGN UP
      </button>
    </div>
  `;
}

function notFoundHTML(reason) {
  return `
    <div class="prof-notfound">
      <div class="big">404</div>
      <div>CREW MANIFEST NOT FOUND</div>
      <br>
      <div style="font-size:9px;opacity:.6;">${reason}</div>
      <br><br>
      <button class="btn btn-next" onclick="navigate('hero')">← RETURN TO MISSION CONTROL</button>
    </div>
  `;
}

// Build events section HTML
function buildEventsHTML(team) {
  const events = team.events && team.events.length > 0
    ? team.events
    : [{ op: team.op, evt: team.evt, evtId: team.evtId }]; // backwards compat

  if (events.length === 1) {
    // Single event — use existing badge style
    const evt = getEvtDetail(events[0].evtId);
    return singleEventHTML(events[0], evt);
  }

  // Multiple events — show a grid
  let html = `<div class="prof-events-grid">`;
  events.forEach(({ op, evt: evtName, evtId }) => {
    const detail = getEvtDetail(evtId);
    html += `
      <div class="prof-event-item">
        <div class="prof-event-op">${detail ? 'OP: ' + detail.op : op.replace('OPERATION: ', '')}</div>
        <div class="prof-event-name">${evtName}</div>
        ${detail ? `<div class="prof-event-prize">${detail.prize}</div>` : ''}
      </div>
    `;
  });
  html += `</div>`;
  return html;
}

function singleEventHTML(eventEntry, evt) {
  return `
    <div class="prof-op-badge">
      OPERATION: <span class="op-name">${evt ? evt.op : eventEntry.op.replace('OPERATION: ', '')}</span>
      &nbsp;·&nbsp; ${evt ? evt.nm : eventEntry.evt}
    </div>
  `;
}
