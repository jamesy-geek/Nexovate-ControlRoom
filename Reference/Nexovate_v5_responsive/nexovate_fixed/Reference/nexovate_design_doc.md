# NEXOVATE 2026 — MISSION CONTROL
## Complete Build Specification for Antigravity
### Multi-Page HTML Site · Apollo Retro-NASA Aesthetic · v3.0

---

> **READ BEFORE BUILDING.**
> This is a complete, self-contained specification. Build the entire file structure described here.
> Do not collapse everything into one file. Each page is a separate `.html` file.
> Shared styles live in `css/`. Shared logic lives in `js/`.
> Every page links the shared files — no inline styles or scripts except where explicitly noted.

---

## 0. CRITICAL FACTS

| Key | Value |
|---|---|
| Event name | NEXOVATE 2026 |
| Organiser | CLUB ENNOVATE, PESCE Mandya |
| Dates | **May 22–23, 2026** |
| Countdown target | **`2026-05-22T09:00:00+05:30`** |
| Total prize | ₹2,00,000 |
| Hackathon duration | 24 hours |
| Registration | Google Form (constant `REG_FORM_URL` at top of `js/registration.js`) |

---

## 1. FILE STRUCTURE

Build this exact directory layout. Every file listed here must be created.

```
nexovate/
│
├── index.html              ← Page 1: Hero / Launch Control
├── dossier.html            ← Page 2: Mission Dossier (all events)
├── hacksprint.html         ← Page 3: Hacksprint 6.0 / Central Reactor
├── registration.html       ← Page 4: Crew Assignment (multi-step form)
├── confirmation.html       ← Page 5: Post-submit confirmation + patch
│
├── css/
│   ├── base.css            ← CSS reset, custom properties, typography, textures
│   ├── chrome.css          ← Ticker, T-minus, nav dots, sound icon (fixed chrome)
│   ├── transitions.css     ← Static overlay, page-in animation
│   ├── hero.css            ← index.html only
│   ├── dossier.css         ← dossier.html only
│   ├── hacksprint.css      ← hacksprint.html only
│   ├── registration.css    ← registration.html only
│   └── confirmation.css    ← confirmation.html only
│
└── js/
    ├── chrome.js           ← Ticker pause, countdown, nav dots active state, sound toggle
    ├── navigate.js         ← Static-cut page transition, navigate() function
    ├── events-data.js      ← EVT object — all 10 events (imported by dossier + registration)
    ├── schematic.js        ← SVG schematic interactions (dossier.html only)
    ├── registration.js     ← Multi-step form logic, GO/NO-GO, submit
    └── confirmation.js     ← Dynamic patch generation, SVG download
```

No other files. No `assets/` folder — all visuals are inline SVG or CSS.  
No `node_modules`, no `package.json`, no build step.  
Open `index.html` directly in a browser — it must work.

---

## 2. SHARED CSS FILES

### 2.1 `css/base.css`

Contains everything that applies globally.

**CSS custom properties:**
```css
:root {
  --bg:        #0D0A07;
  --bg2:       #110D09;
  --bg3:       #0A0805;
  --amber:     #F0A500;
  --amber-dk:  #C8882A;
  --amber-dim: rgba(240, 165, 0, 0.10);
  --amber-glow:rgba(240, 165, 0, 0.35);
  --offwhite:  #E8E0D0;
  --red:       #C0392B;
  --blue:      #4A6E8A;
  --blue-dim:  rgba(74, 110, 138, 0.06);
  --hack-bg:   #0F0700;
  --font-d:    'Orbitron', monospace;
  --font-m:    'IBM Plex Mono', monospace;
}
```

**Reset:**
```css
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--amber);
  font-family: var(--font-m);
  overflow-x: hidden;
  min-height: 100vh;
}
```

No `cursor: crosshair` on body. No custom cursors anywhere on body or button.

**Page wrapper** — every page's content sits inside this:
```css
.page {
  min-height: 100vh;
  padding: 90px 52px 60px;   /* top: 90px clears ticker + tminus bar */
  position: relative;
}
@media (max-width: 768px) {
  .page { padding: 90px 20px 80px; }
}
```

**Texture layers** — defined here, placed in HTML via `chrome.js` injecting into `<body>` on DOMContentLoaded:

Scanlines div (injected):
```css
#scanlines {
  position: fixed; inset: 0; pointer-events: none; z-index: 9998;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0,0,0,0.09) 2px, rgba(0,0,0,0.09) 4px
  );
}
```

Grain SVG (injected):
```css
#grain-svg {
  position: fixed; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 9997; opacity: 0.055;
}
```

Static overlay canvas (injected, `display:none` by default):
```css
#static-overlay {
  position: fixed; inset: 0; z-index: 9999; display: none;
}
#static-canvas { width: 100%; height: 100%; display: block; }
```

**Typography utility classes:**
```css
.lbl   { font-size: 9px;  letter-spacing: .45em; color: var(--amber-dk); display: block; }
.ttl   { font-family: var(--font-d); font-size: 26px; font-weight: 900;
         letter-spacing: .18em; color: var(--offwhite); text-transform: uppercase; }
.mono  { font-family: var(--font-m); }
.amber { color: var(--amber); }
.dim   { color: var(--amber-dk); }
.white { color: var(--offwhite); }
.red   { color: var(--red); }
.blue  { color: var(--blue); }

.divider { /* ━━━ unicode horizontal rule */
  color: var(--amber-dk);
  letter-spacing: .04em;
  font-size: 10px;
  display: block;
  margin: 8px 0;
}
```

**Button base styles:**
```css
.btn {
  font-family: var(--font-d);
  letter-spacing: 0.24em;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-primary {
  font-size: 12px;
  color: var(--bg);
  background: var(--amber);
  padding: 15px 44px;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  animation: pulse-btn 2.2s ease-in-out infinite;
}
.btn-primary:hover {
  background: var(--offwhite);
  box-shadow: 0 0 36px var(--amber-glow);
  animation: none;
}
.btn-action {
  font-size: 10px;
  color: var(--bg);
  background: var(--amber);
  padding: 11px 16px;
  width: 100%;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
}
.btn-action:hover { background: var(--offwhite); box-shadow: 0 0 18px rgba(240,165,0,.4); }
.btn-ghost {
  font-size: 11px;
  color: var(--amber);
  background: transparent;
  border: 1px solid var(--amber);
  padding: 11px 28px;
}
.btn-ghost:hover { background: rgba(240,165,0,0.12); }

@keyframes pulse-btn {
  0%,100% { box-shadow: 0 0 18px rgba(240,165,0,.25); }
  50%      { box-shadow: 0 0 40px rgba(240,165,0,.55); }
}
```

**Page-in animation** — plays on every page load:
```css
@keyframes page-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
.page { animation: page-in 0.35s ease-out forwards; }
```

---

### 2.2 `css/chrome.css`

All fixed chrome elements. Injected into every page.

**Ticker:**
```css
#ticker {
  position: fixed; top: 0; left: 0; right: 0; height: 26px;
  background: rgba(13,10,7,0.97);
  border-bottom: 1px solid rgba(200,136,42,0.4);
  overflow: hidden; z-index: 200;
  display: flex; align-items: center;
}
#ticker-inner {
  white-space: nowrap;
  animation: tick 55s linear infinite;
  font-size: 10px; letter-spacing: 0.18em; color: var(--amber-dk);
}
#ticker-inner em { color: var(--amber); font-style: normal; }
#ticker:hover #ticker-inner { animation-play-state: paused; }
@keyframes tick {
  from { transform: translateX(100vw); }
  to   { transform: translateX(-100%); }
}
```

**T-Minus widget:**
```css
#tminus {
  position: fixed; top: 26px; left: 50%; transform: translateX(-50%);
  background: rgba(13,10,7,0.97);
  border-bottom: 1px solid rgba(200,136,42,0.35);
  border-left:   1px solid rgba(200,136,42,0.15);
  border-right:  1px solid rgba(200,136,42,0.15);
  padding: 4px 28px 7px; text-align: center; z-index: 200;
  white-space: nowrap;
}
#tminus-lbl {
  font-size: 8px; letter-spacing: .35em; color: var(--amber-dk); display: block;
}
#tminus-dig {
  font-family: var(--font-d); font-size: 20px; font-weight: 700;
  color: var(--amber); letter-spacing: .12em;
  text-shadow: 0 0 18px rgba(240,165,0,.4);
}
@media (max-width: 768px) { #tminus-dig { font-size: 15px; } }
```

**Nav dots:**
```css
#nav-dots {
  position: fixed; right: 22px; top: 50%; transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 14px; z-index: 200;
}
@media (max-width: 768px) { #nav-dots { display: none; } }
.nd {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--amber-dk); opacity: 0.5;
  cursor: pointer; transition: all .3s; position: relative;
}
.nd.on { background: var(--amber); box-shadow: 0 0 12px var(--amber-glow); opacity: 1; }
.nd::after {
  content: attr(data-lbl);
  position: absolute; right: 18px; top: 50%; transform: translateY(-50%);
  font-size: 8px; letter-spacing: .2em; color: var(--amber-dk);
  white-space: nowrap; opacity: 0; transition: .2s;
}
.nd:hover::after { opacity: 1; }
```

**Sound icon:**
```css
#sound-btn {
  position: fixed; top: 33px; right: 16px; z-index: 200;
  background: transparent; border: none; cursor: pointer;
  color: var(--amber-dk); opacity: 0.6; transition: opacity 0.2s;
  padding: 4px;
}
#sound-btn:hover { opacity: 1; }
#sound-btn svg { width: 16px; height: 16px; display: block; }
```

**Mobile bottom nav:**
```css
#mobile-nav {
  display: none;
  position: fixed; bottom: 0; left: 0; right: 0; height: 52px;
  background: rgba(13,10,7,0.97);
  border-top: 1px solid rgba(200,136,42,0.3);
  z-index: 200;
  align-items: center; justify-content: space-between;
  padding: 0 20px;
  font-size: 9px; letter-spacing: 0.3em; color: var(--amber-dk);
  font-family: var(--font-m);
}
@media (max-width: 768px) { #mobile-nav { display: flex; } }
#mobile-nav span { color: var(--amber); letter-spacing: 0.4em; }
#mobile-nav button {
  background: transparent; border: none; color: var(--amber-dk);
  font-family: var(--font-m); font-size: 9px; letter-spacing: 0.3em;
  cursor: pointer; padding: 8px;
}
#mobile-nav button:hover { color: var(--amber); }
```

---

### 2.3 `css/transitions.css`

```css
/* Static overlay */
#static-overlay { position: fixed; inset: 0; z-index: 9999; display: none; }
#static-canvas  { width: 100%; height: 100%; display: block; }

/* Page-out: fired just before navigation */
.page-exit {
  animation: page-out 0.18s ease-in forwards;
}
@keyframes page-out {
  to { opacity: 0; transform: translateY(-4px); }
}
```

---

## 3. SHARED JS FILES

### 3.1 `js/navigate.js`

Handles all page transitions. Loaded on every page.

```js
// ─── navigate.js ───────────────────────────────────────────────────────────
// Intercepts internal link clicks, plays static-cut, then navigates.

const PAGES = {
  hero:         'index.html',
  dossier:      'dossier.html',
  hacksprint:   'hacksprint.html',
  registration: 'registration.html',
  confirmation: 'confirmation.html',
};

let soundEnabled = false;

function staticCut(callback, duration = 420) {
  const ov = document.getElementById('static-overlay');
  const cv = document.getElementById('static-canvas');
  const ctx = cv.getContext('2d');
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;

  // Amber-tinted static noise
  const img = ctx.createImageData(cv.width, cv.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() > 0.5 ? 220 : 15;
    img.data[i]   = v * 0.94;  // R
    img.data[i+1] = v * 0.65;  // G
    img.data[i+2] = 0;          // B
    img.data[i+3] = 180;        // A
  }
  ctx.putImageData(img, 0, 0);
  ov.style.display = 'block';

  if (soundEnabled) playStatic();
  setTimeout(() => {
    ov.style.display = 'none';
    if (callback) callback();
  }, duration);
}

function navigate(pageKey) {
  const url = PAGES[pageKey];
  if (!url) return;
  staticCut(() => { window.location.href = url; });
}

// Intercept all internal .nd (nav dot) clicks — handled in chrome.js
// Direct link calls: navigate('dossier') etc.
```

### 3.2 `js/chrome.js`

Loaded on every page. Injects fixed chrome HTML, runs countdown, manages nav state.

```js
// ─── chrome.js ─────────────────────────────────────────────────────────────
// Injected chrome: ticker, tminus, nav dots, sound icon, texture overlays.
// Determine active page from data-page attribute on .

document.addEventListener('DOMContentLoaded', () => {

  // ── Inject texture overlays ──────────────────────────────────────────────
  document.body.insertAdjacentHTML('afterbegin', `
    
    
      
        
        
      
      
    
    
  `);

  // ── Ticker ───────────────────────────────────────────────────────────────
  document.body.insertAdjacentHTML('afterbegin', `
    
      
        NEXOVATE 2026 &nbsp;·&nbsp; MISSION STATUS: GO
        &nbsp;·&nbsp; PESCE MANDYA LAUNCH SITE
        &nbsp;·&nbsp; MAY 22–23, 2026
        &nbsp;·&nbsp; ALL SYSTEMS NOMINAL
        &nbsp;·&nbsp; PRIZE MANIFEST: ₹2,00,000
        &nbsp;·&nbsp; HACKSPRINT 6.0 &nbsp;·&nbsp; 24 HOURS CONTINUOUS
        &nbsp;·&nbsp; CREW REGISTRATIONS OPEN &nbsp;·&nbsp; T-MINUS INITIATED
        &nbsp;·&nbsp; NEXOVATE 2026 &nbsp;·&nbsp; MISSION STATUS: GO
        &nbsp;·&nbsp; PESCE MANDYA LAUNCH SITE
        &nbsp;·&nbsp; MAY 22–23, 2026
        &nbsp;·&nbsp; ALL SYSTEMS NOMINAL
        &nbsp;·&nbsp; PRIZE MANIFEST: ₹2,00,000
        &nbsp;·&nbsp;
      
    
  `);

  // ── T-Minus widget ───────────────────────────────────────────────────────
  document.body.insertAdjacentHTML('afterbegin', `
    
      LAUNCH WINDOW OPENS IN
      -- : -- : --
    
  `);

  // ── Nav dots ─────────────────────────────────────────────────────────────
  const currentPage = document.body.dataset.page; // set on each page's 
  const navItems = [
    { key: 'hero',         lbl: 'LAUNCH',   url: 'index.html'       },
    { key: 'dossier',      lbl: 'DOSSIER',  url: 'dossier.html'     },
    { key: 'hacksprint',   lbl: 'REACTOR',  url: 'hacksprint.html'  },
    { key: 'registration', lbl: 'CREW REG', url: 'registration.html'},
  ];
  const dotsHTML = navItems.map(n =>
    `
     `
  ).join('');
  document.body.insertAdjacentHTML('beforeend',
    `${dotsHTML}`
  );

  // ── Sound toggle ─────────────────────────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', `
    
      
        
        
        
      
    
  `);

  // ── Mobile bottom nav ────────────────────────────────────────────────────
  const mIdx = navItems.findIndex(n => n.key === currentPage);
  const prev = mIdx > 0 ? navItems[mIdx - 1] : null;
  const next = mIdx < navItems.length - 1 ? navItems[mIdx + 1] : null;
  document.body.insertAdjacentHTML('beforeend', `
    
      
        ← ${prev ? prev.lbl : ''}
      
      ${navItems[mIdx]?.lbl || ''}
      
        ${next ? next.lbl : ''} →
      
    
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
      ? `${p(dd)}D  ${p(hh)} : ${p(mm)} : ${p(ss)}`
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
```

### 3.3 `js/events-data.js`

Single source of truth for all 10 events. Imported by `dossier.html` and `registration.html`.

```js
// ─── events-data.js ────────────────────────────────────────────────────────
const EVT = {
  roborace: {
    ref: 'NXV-2026-001', op: 'IRONCLAD', mod: 'PROPULSION SYSTEMS',
    type: 'TECHNICAL · FIELD OPERATIONS',
    tag: 'Speed is mission-critical. Hesitation is failure.',
    obj: 'Your vehicle must complete a purpose-built track at maximum velocity. The course includes lateral obstacles, tight cornering sections, and speed traps. Completion time is the sole metric. One violation and the clock keeps running — without you.',
    crew: '2–4', prize: '₹30,000', lead: 'HITESH K M', comms: '8904902088', nm: 'ROBO RACE'
  },
  robosoccer: {
    ref: 'NXV-2026-002', op: 'GRIDLOCK', mod: 'FIELD OPERATIONS BAY',
    type: 'TECHNICAL · FIELD OPERATIONS',
    tag: 'The field is contested. Control it.',
    obj: 'Two crews. One ball. A fixed time window to push it into the opponent\'s goalpost using remote-operated ground vehicles. A mission of real-time strategy, mechanical control, and adaptability under pressure.',
    crew: '2–4', prize: '₹30,000', lead: 'YASHAS P & UBAIR', comms: '9901793968 · 6360541947', nm: 'ROBO SOCCER'
  },
  robosumo: {
    ref: 'NXV-2026-003', op: 'IMMOVABLE', mod: 'TRACTION & TORQUE LAB',
    type: 'TECHNICAL · FIELD OPERATIONS',
    tag: 'Traction. Torque. Dominance.',
    obj: 'Two machines enter a marked arena. One leaves. Victory requires pushing the opposing unit beyond the designated boundary zone using force, positioning, and mechanical superiority. Pure engineering muscle.',
    crew: '2–4', prize: '₹20,000', lead: 'PARAMESH H N', comms: '9448176290', nm: 'ROBO SUMO'
  },
  linefollower: {
    ref: 'NXV-2026-004', op: 'THREADLINE', mod: 'GUIDANCE & NAVIGATION',
    type: 'TECHNICAL · AUTONOMOUS SYSTEMS',
    tag: 'The path is given. Precision is everything.',
    obj: 'Design and deploy an autonomous unit capable of detecting and tracking a defined path without human input during the run. A mission of programming discipline, sensor calibration, and engineering patience.',
    crew: '2–4', prize: '₹20,000', lead: 'CHIRANTH', comms: '9448176290', nm: 'LINE FOLLOWER'
  },
  maze: {
    ref: 'NXV-2026-005', op: 'LABYRINTH', mod: 'PATHFINDING MODULE',
    type: 'TECHNICAL · NAVIGATION',
    tag: 'Every dead end is data. Adapt.',
    obj: 'Navigate a remotely controlled vehicle through a walled maze faster than your competitors. The course is intentionally disorienting. Bluetooth and radio control permitted. Obstacle detection sensors are your instruments.',
    crew: '2–4', prize: '₹20,000', lead: 'DEEKSHA G Y & MANOJ', comms: '9353415303 · 9035052726', nm: 'MAZE'
  },
  brandrumbling: {
    ref: 'NXV-2026-006', op: 'SIGNAL', mod: 'BRAND FABRICATION LAB',
    type: 'NON-TECHNICAL · GROUND OPERATIONS',
    tag: 'Transmit clearly or get lost in noise.',
    obj: 'Your crew has a limited mission window to construct a complete brand identity from a given problem statement. Deliverables: logo, colour palette, UI/UX language, typography system, and advertising content.',
    crew: '2–4', prize: '₹10,000', lead: 'KISHAN S', comms: '8296557523', nm: 'RAPID BRAND RUMBLING'
  },
  sharktank: {
    ref: 'NXV-2026-007', op: 'PITCH', mod: 'RESOURCE ACQUISITION',
    type: 'NON-TECHNICAL · GROUND OPERATIONS',
    tag: 'You have three minutes to change the trajectory.',
    obj: 'Develop a viable startup concept, build a pitch deck, and present to a panel simulating a real-world funding environment. Judged on innovation depth, scalability, and execution credibility.',
    crew: '1–4', prize: '₹10,000', lead: 'SAROJ', comms: '8873250798', nm: 'SHARK TANK'
  },
  iqwars: {
    ref: 'NXV-2026-008', op: 'GREY MATTER', mod: 'ANALYTICAL SYSTEMS',
    type: 'NON-TECHNICAL · GROUND OPERATIONS',
    tag: 'Logic is the only instrument that doesn\'t malfunction.',
    obj: 'Consecutive rounds of structured intellectual combat — logical reasoning, rapid problem-solving, and general knowledge retrieval under strict time pressure. Accuracy under compression is the metric.',
    crew: '1–2', prize: '₹10,000', lead: 'KUNAL M K & AISHWARYA S', comms: '7795687774 · 7411260022', nm: 'IQ WARS 2.0'
  },
  waterrocket: {
    ref: 'NXV-2026-009', op: 'APOGEE', mod: 'LAUNCH SYSTEMS',
    type: 'NON-TECHNICAL · GROUND OPERATIONS',
    tag: 'Controlled force. Calculated trajectory. Maximum range.',
    obj: 'Design and launch a water-pressure propulsion system aimed at maximum range and target accuracy. The principles are real: aerodynamics, propulsion mechanics, pressure management.',
    crew: '2–4', prize: '₹10,000', lead: 'P HARSHIT RAO', comms: '9933806575', nm: 'WATER ROCKET'
  },
  hacksprint: {
    ref: 'NXV-2026-010', op: 'IGNITION', mod: 'CENTRAL REACTOR CORE',
    type: 'HACKATHON · OMEGA CLASSIFICATION',
    tag: 'This is not a drill.',
    obj: 'An intensive, multi-domain challenge. Crews of 3–4 develop and prototype original solutions across cutting-edge technical domains. 24 hours. No timeouts. No compromises.',
    crew: '3–4', prize: '₹60,000', lead: 'SONAL H & ASHWIN S', comms: '9591787616 · 8951728170', nm: 'HACKSPRINT 6.0'
  }
};
```

---

## 4. HTML PAGES

Every HTML page follows this exact `<head>` structure — only the page-specific CSS and JS files differ.

### HTML `<head>` template (all pages):

```html



  
  
  [PAGE TITLE] · NEXOVATE 2026
  
  
  
  
  
  
  
  


  
    
  
  
  
  
  
  


```

`data-page` values: `hero` · `dossier` · `hacksprint` · `registration` · `confirmation`

---

### 4.1 `index.html` — Hero / Launch Control

```
<title>LAUNCH CONTROL · NEXOVATE 2026</title>
data-page="hero"
Page-specific CSS: css/hero.css
Page-specific JS: (none — hero has no page-specific JS beyond chrome)
```

**Content inside `<main class="page">`:**

```html


  
  
    
  

  
  INTERCOLLEGIATE TECHNICAL FEST · CLUB ENNOVATE · 2026

  
  
    HOSTED BY CLUB ENNOVATE · PESCE MANDYA
    LAUNCH WINDOW MAY 22–23, 2026 · 09:00 HRS
    PRIZE MANIFEST ₹2,00,000 ACROSS 10 OPERATIONS
  

  
  
    INITIATE MISSION BRIEFING
  

  
  
    10 OPERATIONS · ₹2,00,000 PRIZE MANIFEST · HACKSPRINT 6.0 · 24HRS
  


```

**`css/hero.css`:**
```css
#hero-content {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; gap: 0;
  min-height: calc(100vh - 90px);
}
#patch-wrap {
  margin-bottom: 32px;
  filter: drop-shadow(0 0 36px rgba(240,165,0,.28));
  animation: float 4.5s ease-in-out infinite;
}
@keyframes float {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-9px); }
}
.classify {
  font-size: 8px; letter-spacing: .4em;
  border: 1px solid rgba(200,136,42,.5);
  color: var(--amber-dk); padding: 3px 14px;
  margin-bottom: 20px;
}
.hero-sub {
  font-size: 11px; letter-spacing: .18em;
  color: var(--amber-dk); margin-bottom: 40px; line-height: 2.2;
}
.hero-sub span { color: var(--offwhite); }
.hero-footer {
  margin-top: 40px; font-size: 9px;
  letter-spacing: .4em; color: rgba(200,136,42,0.4);
}
```

---

### 4.2 `dossier.html` — Mission Dossier

```
<title>MISSION DOSSIER · NEXOVATE 2026</title>
data-page="dossier"
Page-specific CSS: css/dossier.css
Page-specific JS: js/events-data.js (loaded first), then js/schematic.js
```

Script order for this page specifically:
```html




```

**Content inside `<main class="page">`:**

```html


  MISSION DOSSIER · ALL OPERATIONS
  SELECT A MODULE
  CLICK ANY MODULE ON THE SCHEMATIC TO ACCESS ITS MISSION FILE





  
  
    STATION SCHEMATIC · NXV-2026
    
      
    
  

  
  
    
    
         ─┬─
  ┌─┴─┐
  │   │
  └───┘
──┤   ├──
  └───┘
      AWAITING MODULE SELECTION
      SELECT A MODULE FROMTHE SCHEMATIC TO ACCESSITS MISSION FILE.
    
  





  10 OPERATIONS · TOTAL PRIZE MANIFEST: ₹2,00,000 · REGISTRATIONS OPEN

```

**`css/dossier.css`:**
```css
.dossier-hdr { text-align: center; margin-bottom: 28px; }
.dossier-sub { font-size: 10px; letter-spacing: .2em; color: var(--amber-dk); margin-top: 8px; }
.dossier-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  border: 1px solid rgba(240,165,0,.18);
  min-height: 500px; flex: 1;
}
@media (max-width: 768px) {
  .dossier-grid { grid-template-columns: 1fr; }
}
.sch-panel {
  border-right: 1px solid rgba(240,165,0,.18);
  padding: 20px; position: relative; overflow: hidden;
  background-image:
    linear-gradient(rgba(74,110,138,.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(74,110,138,.055) 1px, transparent 1px);
  background-size: 36px 36px;
}
@media (max-width: 768px) {
  .sch-panel { border-right: none; border-bottom: 1px solid rgba(240,165,0,.18); height: 300px; }
}
.sch-lbl { font-size: 8px; letter-spacing: .35em; color: var(--amber-dk); margin-bottom: 14px; display: block; }
#schematic-svg { width: 100%; height: auto; }

/* SVG module interactions */
.mod-g  { cursor: crosshair; }
.mod-rect { fill: rgba(240,165,0,.04); stroke: var(--amber-dk); stroke-width: .9; transition: all .2s; }
.mod-g:hover .mod-rect,
.mod-g.sel  .mod-rect { fill: rgba(240,165,0,.14); stroke: var(--amber); stroke-width: 1.5; }
.mod-op { font-family: var(--font-d); font-size: 7.5px; fill: var(--amber); text-anchor: middle; letter-spacing: .12em; }
.mod-nm { font-family: var(--font-m); font-size: 6.5px; fill: var(--amber-dk); text-anchor: middle; letter-spacing: .06em; }
.mod-g:hover .mod-nm,
.mod-g.sel  .mod-nm { fill: var(--offwhite); }

/* Non-technical modules (blue stroke) */
.nt-rect { fill: rgba(74,110,138,.06); stroke: #4A6E8A; stroke-width: .9; transition: all .2s; }
.mod-g:hover .nt-rect,
.mod-g.sel  .nt-rect { fill: rgba(74,110,138,.18); stroke-width: 1.5; }
.nt-op { font-family: var(--font-d); font-size: 7px; fill: #4A6E8A; text-anchor: middle; letter-spacing: .1em; }
.nt-nm { font-family: var(--font-m); font-size: 6px; fill: #4A6E8A; text-anchor: middle; }
.mod-g:hover .nt-nm { fill: var(--offwhite); }

/* Reactor core */
.reactor-g { cursor: crosshair; }
.reactor-ring { fill: none; stroke: var(--amber); stroke-width: .6; animation: rpulse 2.2s ease-in-out infinite; }
.reactor-ring:nth-child(2) { animation-delay: .6s; }
@keyframes rpulse {
  0%,100% { opacity: .15; }
  50%      { opacity: .55; }
}
.reactor-rect {
  fill: rgba(240,165,0,.09); stroke: var(--amber); stroke-width: 1.5;
  filter: drop-shadow(0 0 7px rgba(240,165,0,.4)); transition: all .3s;
}
.reactor-g:hover .reactor-rect,
.reactor-g.sel  .reactor-rect { fill: rgba(240,165,0,.22); filter: drop-shadow(0 0 18px rgba(240,165,0,.7)); }

/* File panel */
.file-panel {
  background: rgba(240,165,0,.025); padding: 22px;
  overflow-y: auto; font-size: 11px; line-height: 1.85;
  font-family: var(--font-m);
}
.fp-placeholder {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100%; font-size: 10px;
  letter-spacing: .14em; color: var(--amber-dk); text-align: center; gap: 16px;
}
.fp-placeholder pre { opacity: .3; font-size: 11px; line-height: 1.6; }
.fp-op {
  font-family: var(--font-d); font-size: 18px; font-weight: 700;
  letter-spacing: .18em; color: var(--amber);
  text-shadow: 0 0 18px rgba(240,165,0,.4); margin: 10px 0 4px;
}
.fp-tagline { font-style: italic; color: var(--amber-dk); font-size: 10.5px; margin-bottom: 10px; }
.fp-obj { color: var(--offwhite); font-size: 10.5px; line-height: 1.85; margin: 8px 0 14px; }
.fp-lbl { color: var(--amber-dk); font-size: 10px; letter-spacing: .18em; }
.fp-val { color: var(--offwhite); }
.fp-prize { color: var(--amber); font-family: var(--font-d); font-size: 15px; }
.fp-type { font-size: 8px; letter-spacing: .22em; color: var(--blue); }
.fp-status { font-size: 8px; letter-spacing: .3em; color: var(--amber-dk); margin: 8px 0; }
.dossier-footer {
  text-align: center; margin-top: 20px;
  font-size: 9px; letter-spacing: .4em; color: rgba(200,136,42,0.4);
}
```

---

### 4.3 `hacksprint.html` — Central Reactor Core

```
<title>OPERATION: IGNITION · NEXOVATE 2026</title>
data-page="hacksprint"
Page-specific CSS: css/hacksprint.css
Page-specific JS: (none beyond chrome — typewriter runs inline)
```

**Content inside `<main class="page">`:**

```html


  
  
  
  LAUNCH PAD
  ORBIT




  
  [ SKIP ]





  
    [PRIORITY TRANSMISSION]
    OPERATION: IGNITION
    HACKSPRINT 6.0
  

  

  
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    OPERATION: IGNITION · MISSION PARAMETERS
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    MISSION CLASS &nbsp;&nbsp;&nbsp;OMEGA · UNRESTRICTED
    DURATION &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24 HOURS CONTINUOUS OPERATION
    CREW REQUIREMENT3 – 4 PERSONNEL
    MISSION VALUE &nbsp;&nbsp;₹60,000
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ACTIVE MISSION DOMAINS:
    DOMAIN A · ARTIFICIAL INTELLIGENCE
    DOMAIN B · AGRICULTURE & HEALTHCARE TECHNOLOGY
    DOMAIN C · INTERNET OF THINGS
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    MISSION PHASES:
    PHASE 1 — PROBLEM ACQUISITION [ 0 – 2 HRS ]
    PHASE 2 — SYSTEMS DEVELOPMENT [ 2 – 20 HRS ]
    PHASE 3 — MISSION PRESENTATION [ 20 – 24 HRS ]
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    MISSION LEADS &nbsp;&nbsp;SONAL H · ASHWIN S
    COMMS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9591787616 · 8951728170
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  

  
    HACKSPRINT 6.0 is an intensive, multi-domain challenge where crews of 3 to 4
    develop and prototype original solutions across cutting-edge technical domains.
    Problem statements are self-chosen. Originality, engineering discipline, and
    execution are evaluated. 24 hours. No timeouts. No compromises.
  

  
    INITIATE CREW REGISTRATION · OPERATION IGNITION
  


```

**`js/` — inline script at bottom of hacksprint.html** (not a separate .js file — this page's logic is short enough):

```html

// Transmission lines
const TX_LINES = [
  { text: 'MISSION CONTROL TO ALL STATIONS.', cls: 'tx-dim' },
  { text: 'THIS IS A PRIORITY TRANSMISSION.', cls: 'tx-dim' },
  { text: '', cls: '' },
  { text: 'OPERATION: IGNITION IS NOW ACTIVE.', cls: 'tx-amber tx-large' },
  { text: 'CLASSIFICATION: OMEGA LEVEL.', cls: 'tx-dim' },
  { text: 'DURATION: 24 HOURS CONTINUOUS.', cls: 'tx-dim' },
  { text: '', cls: '' },
  { text: 'THIS IS NOT A DRILL.', cls: 'tx-red tx-bold' },
];

let txDone = false;

function runTx() {
  const container = document.getElementById('tx-lines');
  container.innerHTML = '';
  let i = 0, ci = 0;
  let curLine = null;

  function nextChar() {
    if (txDone) return;
    if (i >= TX_LINES.length) { finishTx(); return; }

    const line = TX_LINES[i];
    if (!curLine) {
      curLine = document.createElement('div');
      curLine.className = 'tx-line ' + (line.cls || '');
      container.appendChild(curLine);
    }

    if (line.text === '') { // blank line — just pause
      curLine = null; i++; ci = 0;
      setTimeout(nextChar, 200);
      return;
    }

    if (ci < line.text.length) {
      curLine.textContent += line.text[ci++];
      playTypeKey();
      setTimeout(nextChar, 22);
    } else {
      curLine = null; i++; ci = 0;
      setTimeout(nextChar, 350);
    }
  }
  nextChar();
}

function finishTx() {
  txDone = true;
  const ov = document.getElementById('tx-overlay');
  ov.style.transition = 'opacity 0.5s';
  ov.style.opacity = '0';
  setTimeout(() => {
    ov.style.display = 'none';
    const content = document.getElementById('hack-content');
    content.style.display = 'block';
    content.style.animation = 'page-in 0.4s ease-out forwards';
  }, 500);
}

function skipTx() { finishTx(); }

function flashAndNavigate() {
  // White-amber flash
  document.body.style.background = '#F0A500';
  setTimeout(() => {
    document.body.style.background = '';
    // Pass event pre-selection via sessionStorage
    sessionStorage.setItem('preselect', 'hacksprint');
    staticCut(() => { window.location.href = 'registration.html'; });
  }, 150);
}

window.addEventListener('load', runTx);

```

**`css/hacksprint.css`:**
```css
body[data-page="hacksprint"] { background: var(--hack-bg); }
body[data-page="hacksprint"]::before {
  content: '';
  position: fixed; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(240,100,0,.08) 0%, transparent 65%);
  z-index: 0;
}
#trajectory-arc { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
#tx-overlay {
  position: fixed; inset: 0; z-index: 100;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: var(--hack-bg);
}
#tx-lines { font-family: var(--font-m); font-size: 13px; letter-spacing: .28em; line-height: 2.2; text-align: center; }
.tx-dim  { color: var(--amber-dk); }
.tx-amber{ color: var(--amber); }
.tx-large{ font-family: var(--font-d); font-size: 16px; letter-spacing: .22em; }
.tx-red  { color: var(--red); font-family: var(--font-d); font-size: 15px; letter-spacing: .3em; }
.tx-bold { font-weight: 700; }
#tx-skip {
  position: absolute; bottom: 32px; right: 32px;
  background: transparent; border: 1px solid rgba(200,136,42,0.3);
  color: var(--amber-dk); font-family: var(--font-m); font-size: 9px;
  letter-spacing: .3em; padding: 6px 14px; cursor: pointer;
}
#tx-skip:hover { color: var(--amber); border-color: rgba(200,136,42,0.7); }
#hack-content {
  position: relative; z-index: 1;
  max-width: 680px; width: 100%; margin: 0 auto;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.hack-op {
  font-family: var(--font-d); font-size: 32px; font-weight: 900;
  letter-spacing: .22em; color: var(--amber); margin-top: 8px;
}
.hack-sub { font-family: var(--font-m); font-size: 14px; letter-spacing: .38em; color: var(--offwhite); }
.divider-line { width: 100%; border-top: 1px solid rgba(240,165,0,0.3); margin: 20px 0; }
.hack-brief {
  width: 100%; border: 1px solid rgba(240,165,0,.28);
  padding: 28px; background: rgba(240,165,0,.025);
  font-family: var(--font-m); font-size: 11px; line-height: 1.9;
  text-align: left;
}
.hack-brief-title { font-family: var(--font-m); font-size: 9px; letter-spacing: .3em; color: var(--amber-dk); padding: 8px 0; }
.brief-row, .brief-domain, .brief-phase { margin: 4px 0; }
.brief-section-title { font-size: 9px; letter-spacing: .3em; color: var(--amber-dk); margin: 10px 0 6px; }
.fp-prize { color: var(--amber); font-family: var(--font-d); font-size: 16px; }
.hack-desc {
  width: 100%; font-family: var(--font-m); font-size: 11px; line-height: 1.9;
  color: var(--offwhite); margin-top: 20px; text-align: left;
}
.btn-omega {
  font-family: var(--font-d); font-size: 13px; letter-spacing: .3em;
  color: var(--bg); background: var(--amber);
  border: 2px solid var(--red); padding: 18px 52px;
  box-shadow: 0 0 0 4px rgba(192,57,43,.3), 0 0 32px rgba(240,165,0,.3);
  animation: omega-pulse 1.8s ease-in-out infinite;
  margin-top: 32px; cursor: pointer;
}
.btn-omega:hover { background: var(--offwhite); animation: none; }
@keyframes omega-pulse {
  0%,100% { box-shadow: 0 0 0 4px rgba(192,57,43,.3), 0 0 20px rgba(240,165,0,.25); }
  50%      { box-shadow: 0 0 0 4px rgba(192,57,43,.5), 0 0 48px rgba(240,165,0,.55); }
}
```

---

### 4.4 `registration.html` — Crew Assignment

```
<title>CREW ASSIGNMENT · NEXOVATE 2026</title>
data-page="registration"
Page-specific CSS: css/registration.css
Script order: navigate.js, chrome.js, events-data.js, registration.js
```

**Content inside `<main class="page">`:**

```html


  CREW ASSIGNMENT PROTOCOL
  MISSION CONTROL
  SUBMIT YOUR CREW MANIFEST




  CREW
  
  SITE
  
  MISSION
  
  CONFIRM





  
  
    
    
    
      CONFIRM →
    
  

  
  
    
    
    
      CONFIRM →
    
  

  
  
    
    
      
    
    
      CONFIRM →
    
  

  <!-- Step 4 — GO/NO-GO -->
  
    
    
      CREW DESIGNATION ··········[   ]
      LAUNCH SITE ················[   ]
      MISSION ASSIGNMENT ·········[   ]
      TEAM READINESS ·············[   ]
    
    
      ALL STATIONS: GO FOR LAUNCH.
    
    
      LAUNCH CONFIRMED · COMMIT TO MISSION
    
  


```

**`js/registration.js`:**
```js
// ─── registration.js ───────────────────────────────────────────────────────
const REG_FORM_URL = 'YOUR_GOOGLE_FORM_URL_HERE'; // ← replace before deployment

const S = { crew: '', inst: '', op: '', evt: '', evtId: '', stepVisited: [false,false,false,false] };

const STEP_PROMPTS = [
  'MISSION CONTROL: PLEASE CONFIRM CREW DESIGNATION.\nThis is the identifier by which your team will be\nlogged in the official mission manifest.',
  'MISSION CONTROL: CONFIRM LAUNCH SITE.\nYour institution of origin for mission record purposes.',
  'MISSION CONTROL: SELECT PRIMARY MISSION.\nChoose the operation your crew is volunteering for.\nEach crew may submit for one primary mission.',
  'MISSION CONTROL: CONDUCTING PRE-LAUNCH\nGO/NO-GO POLL.',
];

function typeInto(el, text, cb) {
  el.textContent = '';
  let i = 0;
  function next() {
    if (i < text.length) {
      el.textContent += text[i++];
      playTypeKey();
      setTimeout(next, 18);
    } else if (cb) cb();
  }
  next();
}

function setStep(n) {
  document.querySelectorAll('.reg-step').forEach(s => s.classList.remove('on'));
  document.getElementById('rs' + n).classList.add('on');
  // Update progress dots
  [1,2,3,4].forEach(i => document.getElementById('sp'+i).className = 'sp-item' + (i <= n ? ' active' : ''));
  // Typewriter prompt if not visited
  const promptEl = document.getElementById('sp'+n+'-text');
  if (!S.stepVisited[n-1]) {
    typeInto(promptEl, STEP_PROMPTS[n-1]);
    S.stepVisited[n-1] = true;
  } else {
    promptEl.textContent = STEP_PROMPTS[n-1];
  }
  // Step 3 init: populate event list
  if (n === 3) buildEvtList();
  // Step 4 init: run GO/NO-GO
  if (n === 4) runGoNoGo();
}

function buildEvtList() {
  const container = document.getElementById('evt-list');
  const techEvents = ['roborace','robosoccer','robosumo','linefollower','maze'];
  const ntEvents   = ['brandrumbling','sharktank','iqwars','waterrocket'];
  const presel = sessionStorage.getItem('preselect') || '';

  let html = '';
  techEvents.forEach(id => {
    const d = EVT[id];
    html += `
      ○
      OPERATION: ${d.op}
      ${d.nm}
    `;
  });
  html += ``;
  ntEvents.forEach(id => {
    const d = EVT[id];
    html += `
      ○
      OPERATION: ${d.op}
      ${d.nm}
    `;
  });
  html += ``;
  const hk = EVT['hacksprint'];
  html += `
    ○
    OPERATION: ${hk.op}
    ${hk.nm}
    OMEGA
  `;
  container.innerHTML = html;

  if (presel) {
    S.evtId = presel;
    S.op  = 'OPERATION: ' + EVT[presel].op;
    S.evt = EVT[presel].nm;
    document.getElementById('step3-btn').style.display = 'block';
    sessionStorage.removeItem('preselect');
  }
}

function selEvt(el, op, evt, id) {
  document.querySelectorAll('.reg-opt').forEach(o => {
    o.classList.remove('sel');
    o.querySelector('.ro-bullet').textContent = '○';
  });
  el.classList.add('sel');
  el.querySelector('.ro-bullet').textContent = '●';
  S.op = 'OPERATION: ' + op; S.evt = evt; S.evtId = id;
  document.getElementById('step3-btn').style.display = 'block';
  playBlip();
}

function nxt(from) {
  if (from === 1) {
    const v = document.getElementById('inp-crew').value.trim();
    if (!v) { shakeInput('inp-crew'); return; }
    S.crew = v.toUpperCase();
    setStep(2);
  } else if (from === 2) {
    const v = document.getElementById('inp-inst').value.trim();
    if (!v) { shakeInput('inp-inst'); return; }
    S.inst = v.toUpperCase();
    setStep(3);
  } else if (from === 3) {
    if (!S.op) return;
    setStep(4);
  }
}

function shakeInput(id) {
  const el = document.getElementById(id);
  el.style.borderBottomColor = 'var(--red)';
  el.style.animation = 'shake 0.3s ease';
  setTimeout(() => { el.style.animation = ''; }, 300);
}
function clearErr(el) {
  el.style.borderBottomColor = '';
}

function runGoNoGo() {
  const items = [
    { id: 'g1', vid: 'gv1' },
    { id: 'g2', vid: 'gv2' },
    { id: 'g3', vid: 'gv3' },
    { id: 'g4', vid: 'gv4' },
  ];
  items.forEach(({ id, vid }, i) => {
    setTimeout(() => {
      const row = document.getElementById(id);
      const val = document.getElementById(vid);
      val.textContent = 'GO ✓';
      val.classList.add('go');
      row.classList.add('go');
      playTypeKey();
    }, 600 * (i + 1));
  });
  setTimeout(() => {
    document.getElementById('gng-final').style.opacity = '1';
  }, 3200);
  setTimeout(() => {
    document.getElementById('launch-btn').style.display = 'block';
  }, 3600);
}

function submit() {
  // Save to sessionStorage for confirmation page
  sessionStorage.setItem('reg_crew', S.crew);
  sessionStorage.setItem('reg_inst', S.inst);
  sessionStorage.setItem('reg_op',   S.op);
  sessionStorage.setItem('reg_evt',  S.evt);
  // Open Google Form in new tab
  window.open(REG_FORM_URL, '_blank');
  // Navigate to confirmation
  document.body.style.background = '#F0A500';
  setTimeout(() => {
    document.body.style.background = '';
    staticCut(() => { window.location.href = 'confirmation.html'; });
  }, 300);
}

// Init
document.addEventListener('DOMContentLoaded', () => setStep(1));
```

**`css/registration.css`:**
```css
.page { display: flex; flex-direction: column; align-items: center; padding-top: 100px; }
.reg-hdr { text-align: center; margin-bottom: 20px; }
.reg-sub { font-size: 9px; letter-spacing: .3em; color: var(--amber-dk); margin-top: 4px; }

/* Step progress */
.step-progress {
  display: flex; align-items: center; gap: 0;
  margin-bottom: 32px; font-family: var(--font-m); font-size: 8px; letter-spacing: .3em;
}
.sp-item { display: flex; flex-direction: column; align-items: center; gap: 6px; color: var(--amber-dk); opacity: 0.4; }
.sp-item.active { opacity: 1; color: var(--amber); }
.sp-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.sp-dash { width: 40px; height: 1px; background: rgba(200,136,42,0.3); margin-bottom: 14px; }
@media (max-width: 480px) { .sp-dash { width: 20px; } }

/* Panel */
.reg-panel {
  max-width: 580px; width: 100%;
  border: 1px solid rgba(240,165,0,.22);
  padding: 32px; background: rgba(240,165,0,.02);
  font-family: var(--font-m);
}
.reg-step { display: none; }
.reg-step.on { display: block; }

/* Prompt text */
.step-prompt {
  font-size: 11px; letter-spacing: .12em; color: var(--amber-dk);
  line-height: 1.9; white-space: pre-line; margin-bottom: 20px;
}

/* Input */
.reg-input {
  width: 100%; background: transparent; border: none;
  border-bottom: 1px solid rgba(240,165,0,.5);
  color: var(--amber); font-family: var(--font-m); font-size: 13px;
  letter-spacing: .1em; padding: 8px 0; outline: none;
  margin-bottom: 20px;
}
.reg-input:focus { border-bottom-color: var(--amber); }
.reg-input::placeholder { color: rgba(200,136,42,0.4); font-size: 11px; letter-spacing: .2em; }
@keyframes shake {
  0%,100% { transform: translateX(0); }
  25%      { transform: translateX(-4px); }
  75%      { transform: translateX(4px); }
}

/* Event list */
.reg-opt {
  display: flex; align-items: center; gap: 12px; padding: 9px 12px;
  cursor: crosshair; transition: background 0.15s;
  font-size: 10px; letter-spacing: .14em;
  border: 1px solid transparent;
}
.reg-opt:hover { background: rgba(240,165,0,.06); }
.reg-opt.sel { background: rgba(240,165,0,.08); border-color: rgba(240,165,0,.2); }
.ro-bullet { color: var(--amber); font-size: 12px; width: 12px; }
.ro-op { color: var(--amber); font-family: var(--font-d); font-size: 9px; letter-spacing: .14em; flex: 1; }
.ro-nm { color: var(--amber-dk); font-size: 9px; letter-spacing: .1em; }
.omega-badge {
  font-size: 7px; letter-spacing: .3em; color: var(--red);
  border: 1px solid var(--red); padding: 1px 4px;
}
.reg-sep { border-top: 1px solid rgba(240,165,0,.1); margin: 6px 0; }

/* Actions */
.reg-actions { display: flex; justify-content: flex-end; margin-top: 8px; }

/* GO/NO-GO */
.gng-list { margin: 16px 0; font-size: 11px; line-height: 2.4; letter-spacing: .06em; }
.gng-item { display: flex; justify-content: space-between; padding: 4px 0; transition: background 0.3s; }
.gng-item.go { background: rgba(240,165,0,.06); }
.gng-lbl { color: var(--amber-dk); }
.gng-val { color: var(--amber-dk); }
.gng-val.go { color: var(--amber); font-family: var(--font-d); font-size: 12px; letter-spacing: .2em; }
.gng-final-text { font-family: var(--font-d); font-size: 14px; letter-spacing: .22em; color: var(--amber); text-align: center; }
```

---

### 4.5 `confirmation.html` — Mission Confirmed

```
<title>MISSION CONFIRMED · NEXOVATE 2026</title>
data-page="confirmation"
Page-specific CSS: css/confirmation.css
Page-specific JS: js/confirmation.js
```

**Content inside `<main class="page">`:**
```html

  
  
    CREW MANIFEST ACCEPTED.
    MISSION CONTROL CONFIRMS:
    
    IS GO FOR
    
    REPORT TO PESCE MANDYA LAUNCH SITE
    MAY 22–23, 2026.
  
  SAVE MISSION PATCH ↓
  
    
      ← RETURN TO MISSION DOSSIER
    
  

```

**`js/confirmation.js`:**
```js
// ─── confirmation.js ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const crew = sessionStorage.getItem('reg_crew') || 'YOUR CREW';
  const op   = sessionStorage.getItem('reg_op')   || 'OPERATION: IGNITION';
  const opShort = op.replace('OPERATION: ', '');

  document.getElementById('conf-crew').textContent = crew;
  document.getElementById('conf-op').textContent   = op;

  buildPatch(crew.substring(0, 13), opShort);
});

function buildPatch(crew, op) {
  document.getElementById('conf-patch').innerHTML = `
    
      
        
        
      
      
      
      
      
      
        
        
        
        
      
      
      
      CORE
      
      
      
        ${crew}
      
      
        ${op}
      
      NEXOVATE 2026
    `;
}

function downloadPatch() {
  const svg  = document.querySelector('#conf-patch svg');
  const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'nexovate-mission-patch.svg'; a.click();
  URL.revokeObjectURL(url);
}
```

**`css/confirmation.css`:**
```css
.page { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.conf-wrap { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 24px; }
#conf-patch { filter: drop-shadow(0 0 36px rgba(240,165,0,.35)); animation: float 4.5s ease-in-out infinite; }
@keyframes float {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-9px); }
}
.conf-msg {
  font-family: var(--font-m); font-size: 11px;
  letter-spacing: .18em; color: var(--offwhite); line-height: 2.2;
}
.conf-highlight {
  font-family: var(--font-d); font-size: 18px;
  letter-spacing: .18em; color: var(--amber); display: block; margin: 4px 0;
}
.conf-return {
  font-size: 9px; letter-spacing: .3em; color: var(--amber-dk); margin-top: 8px;
}
.conf-return span { cursor: pointer; }
.conf-return span:hover { color: var(--amber); }
```

---

## 5. SCHEMATIC SVG — Full Specification (`js/schematic.js`)

```js
// ─── schematic.js ──────────────────────────────────────────────────────────
// Manages module selection and file panel updates in dossier.html

function selMod(id) {
  // If hacksprint: navigate to that page instead
  if (id === 'hacksprint') {
    staticCut(() => { window.location.href = 'hacksprint.html'; });
    return;
  }
  playBlip();
  // Deselect all
  document.querySelectorAll('.mod-g, .reactor-g').forEach(g => g.classList.remove('sel'));
  const el = document.getElementById('m-' + id);
  if (el) el.classList.add('sel');
  // Update file panel
  const d = EVT[id];
  if (!d) return;
  document.getElementById('file-panel').innerHTML = `
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
      MISSION FILE · REF: ${d.ref}
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    OPERATION: ${d.op}
    
      MODULE: ${d.mod}
    
    ${d.type}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    "${d.tag}"
    ${d.obj}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
      CREW &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        ${d.crew} PERSONNEL
      PRIZE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        ${d.prize}
      MISSION LEAD 
        ${d.lead}
      COMMS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        ${d.comms}
    
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    STATUS: ACCEPTING CREW APPLICATIONS
    
      SUBMIT CREW MANIFEST
    
  `;
}
```

**The SVG itself (inline in `dossier.html` inside `#schematic-svg`):**

Build the SVG with this exact module layout. Place these elements inside the `<svg viewBox="0 0 600 460">`:

```
Main truss: horizontal line from (30,230) to (570,230), stroke #C8882A, stroke-width 1.5, opacity 0.5

Technical modules (5 boxes, 78×48 each, above truss):
  id="m-roborace"       center (80, 110)   codename "IRONCLAD"    label "ROBO RACE"
  id="m-robosoccer"     center (185, 148)  codename "GRIDLOCK"    label "ROBO SOCCER"
  id="m-robosumo"       center (300, 105)  codename "IMMOVABLE"   label "ROBO SUMO"
  id="m-linefollower"   center (415, 148)  codename "THREADLINE"  label "LINE FOLLOWER"
  id="m-maze"           center (520, 108)  codename "LABYRINTH"   label "MAZE"

Each technical box: class="mod-g", onclick="selMod('roborace')" etc.
  rect: class="mod-rect", x=cx-39, y=cy-24, width=78, height=48, rx=2
  text line 1 (codename): class="mod-op", x=cx, y=cy-6
  text line 2 (label):    class="mod-nm", x=cx, y=cy+8
  connector: dashed line from bottom of box to truss at same cx

Ground Operations Ring bracket:
  rect: x=30 y=270 width=520 height=130, fill=none,
        stroke=#4A6E8A, stroke-width=0.6, opacity=0.25, rx=4
  label: text "GROUND OPERATIONS RING" at x=38 y=285,
         font-family=IBM Plex Mono, font-size=7, fill=#4A6E8A, letter-spacing=0.25em

Non-technical modules (4 boxes, 82×46 each, below truss):
  id="m-brandrumbling"  center (88, 330)   codename "SIGNAL"      label "BRAND RUMBLING"
  id="m-sharktank"      center (220, 310)  codename "PITCH"       label "SHARK TANK"
  id="m-iqwars"         center (390, 330)  codename "GREY MATTER" label "IQ WARS 2.0"
  id="m-waterrocket"    center (520, 312)  codename "APOGEE"      label "WATER ROCKET"

Each non-tech box: class="mod-g", onclick="selMod('brandrumbling')" etc.
  rect: class="nt-rect" (blue stroke)
  text line 1: class="nt-op"
  text line 2: class="nt-nm"
  connector: dashed line from top of box to truss

Central Reactor Core (Hacksprint — ON the truss at center):
  id="m-hacksprint", class="reactor-g", onclick="selMod('hacksprint')"
  circle r=52 cx=300 cy=230: class="reactor-ring"
  circle r=44 cx=300 cy=230: class="reactor-ring", animation-delay .6s
  rect 60×40 centered at (300,230): class="reactor-rect"
  text "IGNITION" at (300, 226): Orbitron 8px, fill #F0A500, letter-spacing 2
  text "CENTRAL REACTOR" at (300, 238): IBM Plex Mono 6px, fill #C8882A
  text "HACKSPRINT 6.0" at (300, 248): IBM Plex Mono 6px, fill #C8882A

Reference numbers (faint, --blue, 7px, IBM Plex Mono):
  "[NXV-001]" near roborace module (right side)
  "[NXV-005]" near maze module (left side)
  "[NXV-010]" below reactor core
  "[NXV-GOR]" inside the ground operations ring bracket

Annotation marks (×, +, small circles) scattered in empty space, --blue, opacity 0.2–0.3
Dimension callout lines with arrow-like tick marks along the truss (4–5 tick pairs)
```

---

## 6. DO NOT DO THESE THINGS

- **Do not use `cursor: crosshair` on `<body>` or `<button>`.** Crosshair only on `.mod-g`, `.reactor-g`, `.nd`, `.reg-opt`.
- **Do not use custom cursor URLs.**
- **Do not put all pages in one HTML file.** 5 separate `.html` files.
- **Do not use inline `<style>` or `<script>` tags** except for the short Hacksprint transmission script noted above. Everything else goes in the `css/` and `js/` files.
- **Do not add Bootstrap, Tailwind, jQuery, or any framework.**
- **Do not use `alert()`.**
- **Do not add a footer.** No social links, Instagram handles, or club info beyond what's specified.
- **Do not change the event dates.** May 22–23, 2026.
- **Do not leave `REG_FORM_URL = 'YOUR_GOOGLE_FORM_URL_HERE'` without a comment** — it must be clearly labelled as the only value that needs to be filled in before deployment.
- **Do not use `localStorage`.** Use `sessionStorage` for passing registration data between pages.
- **Do not add `console.log` in final output.**

---

*End of specification. Build files in this order:*
*`css/base.css` → `css/chrome.css` → `css/transitions.css` → `js/navigate.js` → `js/chrome.js` → `js/events-data.js` → `index.html + css/hero.css` → `dossier.html + css/dossier.css + js/schematic.js` → `hacksprint.html + css/hacksprint.css` → `registration.html + css/registration.css + js/registration.js` → `confirmation.html + css/confirmation.css + js/confirmation.js`*