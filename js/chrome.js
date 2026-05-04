// ─── chrome.js ─────────────────────────────────────────────────────────────
// Injected chrome: ticker, tminus, nav dots, sound icon, texture overlays.

document.addEventListener('DOMContentLoaded', () => {

  // ── Inject texture overlays ──────────────────────────────────────────────
  document.body.insertAdjacentHTML('afterbegin', `
    <div id="scanlines"></div>
    <svg id="grain-svg">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.08 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
    <div id="static-overlay"><canvas id="static-canvas"></canvas></div>
  `);

  // ── Ticker ───────────────────────────────────────────────────────────────
  document.body.insertAdjacentHTML('afterbegin', `
    <div id="ticker">
      <div id="ticker-inner">
        LAUNCH WINDOW OPENS IN -- : -- : -- NEXOVATE 2026 &nbsp;&middot;&nbsp; MISSION STATUS: GO &nbsp;&middot;&nbsp; PESCE MANDYA LAUNCH SITE &nbsp;&middot;&nbsp; MAY 22–23, 2026 &nbsp;&middot;&nbsp; ALL SYSTEMS NOMINAL &nbsp;&middot;&nbsp; PRIZE MANIFEST: ₹2,00,000 &nbsp;&middot;&nbsp; HACKSPRINT 6.0 &nbsp;&middot;&nbsp; 24 HOURS CONTINUOUS &nbsp;&middot;&nbsp; CREW REGISTRATIONS OPEN &nbsp;&middot;&nbsp; T-MINUS INITIATED &nbsp;&middot;&nbsp; NEXOVATE 2026 &nbsp;&middot;&nbsp; MISSION STATUS: GO &nbsp;&middot;&nbsp; PESCE MANDYA LAUNCH SITE &nbsp;&middot;&nbsp; MAY 22–23, 2026 &nbsp;&middot;&nbsp; ALL SYSTEMS NOMINAL &nbsp;&middot;&nbsp; PRIZE MANIFEST: ₹2,00,000 &nbsp;&middot;&nbsp;
      </div>
    </div>
  `);

  // ── T-Minus widget ───────────────────────────────────────────────────────
  document.body.insertAdjacentHTML('afterbegin', `
    <div id="tminus">
      <span id="tminus-lbl">LAUNCH WINDOW OPENS IN</span>
      <div id="tminus-dig">-- : -- : --</div>
    </div>
  `);

  // ── Nav dots ─────────────────────────────────────────────────────────────
  const currentPage = document.body.dataset.page; 
  const navItems = [
    { key: 'hero',         lbl: 'LAUNCH',   url: 'index.html'       },
    { key: 'dossier',      lbl: 'DOSSIER',  url: 'dossier.html'     },
    { key: 'hacksprint',   lbl: 'REACTOR',  url: 'hacksprint.html'  },
    { key: 'registration', lbl: 'CREW REG', url: 'registration.html'},
  ];
  const dotsHTML = navItems.map(n =>
    `<div class="nd ${n.key === currentPage ? 'on' : ''}" data-lbl="${n.lbl}" onclick="navigate('${n.url}')"></div>`
  ).join('');
  document.body.insertAdjacentHTML('beforeend',
    `<div id="nav-dots">${dotsHTML}</div>`
  );

  // ── Sound toggle ─────────────────────────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', `
    <button id="sound-btn" onclick="toggleSound()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <path id="sound-waves" d="M15.54 8.46a5 5 0 0 1 0 7.07 M19.07 4.93a10 10 0 0 1 0 14.14" display="none"/>
        <line id="mute-line" x1="22" y1="2" x2="2" y2="22" display="inline"/>
      </svg>
    </button>
  `);

  // ── Mobile bottom nav ────────────────────────────────────────────────────
  const mIdx = navItems.findIndex(n => n.key === currentPage);
  const prev = mIdx > 0 ? navItems[mIdx - 1] : null;
  const next = mIdx < navItems.length - 1 ? navItems[mIdx + 1] : null;
  document.body.insertAdjacentHTML('beforeend', `
    <div id="mobile-nav">
      <button onclick="${prev ? `navigate('${prev.url}')` : ''}" ${!prev ? 'style="visibility:hidden"' : ''}>← ${prev ? prev.lbl : ''}</button>
      <span>${navItems[mIdx]?.lbl || ''}</span>
      <button onclick="${next ? `navigate('${next.url}')` : ''}" ${!next ? 'style="visibility:hidden"' : ''}>${next ? next.lbl : ''} →</button>
    </div>
  `);

  // ── Countdown ────────────────────────────────────────────────────────────
  function tickCountdown() {
    const launch = new Date('2026-05-22T09:00:00+05:30');
    let diff = Math.max(0, launch - Date.now()) / 1000;
    const lbl = document.getElementById('tminus-lbl');
    const dig = document.getElementById('tminus-dig');
    if (!lbl || !dig) return;

    const p = n => String(Math.floor(n)).padStart(2,'0');

    if (diff <= 0) {
      lbl.textContent = 'MISSION ACTIVE';
      dig.textContent = '00 : 00 : 00';
      lbl.style.color = dig.style.color = 'var(--red)';
      return;
    }
    if (diff < 86400) {
      lbl.textContent = 'FINAL COUNTDOWN';
      lbl.style.color = dig.style.color = 'var(--red)';
    } else {
      lbl.style.color = dig.style.color = '';
      const alt = Math.floor(Date.now() / 8000) % 2 === 0;
      lbl.textContent = alt ? 'LAUNCH WINDOW OPENS IN' : 'MAY 22 · 09:00 HRS · PESCE MANDYA';
    }

    const dd = Math.floor(diff / 86400);
    const hh = Math.floor((diff % 86400) / 3600);
    const mm = Math.floor((diff % 3600) / 60);
    const ss = Math.floor(diff % 60);
    dig.textContent = dd > 0
      ? `${p(dd)}D ${p(hh)}:${p(mm)}:${p(ss)}`
      : `${p(hh)} : ${p(mm)} : ${p(ss)}`;
  }
  setInterval(tickCountdown, 1000);
  tickCountdown();
});

// ── Sound system (Web Audio API) ──────────────────────────────────────────
let _audioCtx = null;
function _ctx() { return (_audioCtx = _audioCtx || new (window.AudioContext || window.webkitAudioContext)()); }

function playBlip() {
  if (!soundEnabled) return;
  const ctx = _ctx(), osc = ctx.createOscillator(), g = ctx.createGain();
  osc.connect(g); g.connect(ctx.destination);
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
  g.gain.setValueAtTime(0.15, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc.start(); osc.stop(ctx.currentTime + 0.08);
}
function playStatic() {
  const ctx = _ctx(), len = ctx.sampleRate * 0.2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  src.connect(ctx.destination); src.start();
}
function playTypeKey() {
  if (!soundEnabled) return;
  const ctx = _ctx(), osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = 'square'; osc.connect(g); g.connect(ctx.destination);
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  g.gain.setValueAtTime(0.05, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
  osc.start(); osc.stop(ctx.currentTime + 0.04);
}
function toggleSound() {
  soundEnabled = !soundEnabled;
  document.getElementById('mute-line').setAttribute('display', soundEnabled ? 'none' : 'inline');
  document.getElementById('sound-waves').setAttribute('display', soundEnabled ? 'inline' : 'none');
}
