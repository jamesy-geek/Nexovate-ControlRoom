# NEXOVATE 2026 — AUTH, MULTI-EVENT & MOBILE UPGRADE SPEC
## Implementation Directive for AI Agent
### Target Codebase: Nexovate v5

---

> **READ THIS ENTIRE DOCUMENT BEFORE WRITING A SINGLE LINE OF CODE.**
> This spec overrides and extends the existing build. Preserve all existing visual design, CSS custom properties, aesthetic, and animation systems exactly as-is. Only add or modify the specific systems described here.

---

## 0. CONTEXT SUMMARY

Nexovate v5 is a multi-page static HTML event registration site for a college tech fest (NEXOVATE 2026, PESCE Mandya). It uses:
- Apollo/NASA retro aesthetic: black background, amber (`#F0A500`) / dark amber (`#C8882A`) palette, monospace fonts (`Orbitron`, `Share Tech Mono`)
- CSS custom properties in `css/base.css` (`--amber`, `--amber-dk`, `--red`, `--font-m`, `--font-d`)
- `localStorage` via `js/store.js` for team persistence
- Multi-step registration form in `registration.html` / `js/registration.js`
- Team profile display in `profile.html` / `js/profile.js`
- All 10 events in `js/events-data.js` as the `EVT` object
- No backend — pure static HTML/CSS/JS

The team lead registers a team through a 4-step form (Crew Name → Institution → Event Selection → Go/No-Go confirmation), then lands on a profile page. The "LAUNCH CONFIRMED" button on step 4 currently submits and redirects. Data is stored only in `localStorage` — no login system exists yet.

---

## 1. WHAT NEEDS TO BE BUILT

Four interconnected systems, all within the existing static file structure:

1. **Auth System** — email + password login/signup for the team lead, persisted in `localStorage`
2. **Multi-Event Selection** — replace single-select with multi-select on Step 3 of registration
3. **Profile Persistence via Login** — returning users log in and see their profile
4. **External Redirect on Launch** — "Launch Confirmed" button redirects to an external payment/registration URL
5. **Mobile-First Design** — every new and modified screen must be optimised for phones first

---

## 2. FILE CHANGES OVERVIEW

| File | Action | Reason |
|------|--------|--------|
| `js/auth.js` | **CREATE** | New auth module |
| `js/store.js` | **MODIFY** | Add user account storage functions |
| `js/registration.js` | **MODIFY** | Add auth check, multi-event logic, redirect |
| `js/profile.js` | **MODIFY** | Show multiple events, add logout |
| `registration.html` | **MODIFY** | Add login/signup gate UI before Step 1 |
| `profile.html` | **MODIFY** | Show multiple events, login gate, logout button |
| `css/auth.css` | **CREATE** | Styles for login/signup screens |
| `css/registration.css` | **MODIFY** | Multi-event select styles, mobile improvements |
| `css/profile.css` | **MODIFY** | Multi-event display, mobile improvements |

---

## 3. AUTH SYSTEM

### 3.1 Data Model

Add these functions to `js/store.js`. Keep all existing functions intact.

```js
// In store.js — add below existing code

const AUTH_KEY = 'nexovate_auth_users';
const SESSION_KEY = 'nexovate_session';

// User object shape:
// {
//   email: string (lowercase, trimmed — used as unique key),
//   passwordHash: string (SHA-256 hex of password),
//   teamId: string | null,         // linked team ID after registration
//   createdAt: ISO string
// }

function getAllUsers() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || '{}'); }
  catch { return {}; }
}

function saveUser(user) {
  const users = getAllUsers();
  users[user.email] = user;
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

function getUser(email) {
  return getAllUsers()[email.toLowerCase().trim()] || null;
}

function setSession(email) {
  sessionStorage.setItem(SESSION_KEY, email.toLowerCase().trim());
}

function getSession() {
  return sessionStorage.getItem(SESSION_KEY) || null;
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// Link a teamId to a user account after registration
function linkTeamToUser(email, teamId) {
  const user = getUser(email);
  if (!user) return;
  user.teamId = teamId;
  saveUser(user);
}
```

### 3.2 Password Hashing

Create `js/auth.js`:

```js
// ─── auth.js ────────────────────────────────────────────────────────────────
// Auth module for Nexovate. No backend. localStorage-based.

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const hashBuf = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function signUp(email, password) {
  email = email.toLowerCase().trim();
  if (!email || !password) return { ok: false, err: 'ALL FIELDS REQUIRED' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, err: 'INVALID EMAIL FORMAT' };
  if (password.length < 6) return { ok: false, err: 'PASSWORD MIN 6 CHARACTERS' };
  if (getUser(email)) return { ok: false, err: 'ACCOUNT ALREADY EXISTS · LOGIN INSTEAD' };

  const passwordHash = await hashPassword(password);
  saveUser({ email, passwordHash, teamId: null, createdAt: new Date().toISOString() });
  setSession(email);
  return { ok: true, email };
}

async function logIn(email, password) {
  email = email.toLowerCase().trim();
  if (!email || !password) return { ok: false, err: 'ALL FIELDS REQUIRED' };
  const user = getUser(email);
  if (!user) return { ok: false, err: 'ACCOUNT NOT FOUND · SIGN UP FIRST' };
  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) return { ok: false, err: 'INCORRECT PASSWORD' };
  setSession(email);
  return { ok: true, email, teamId: user.teamId };
}

function logOut() {
  clearSession();
  window.location.href = 'index.html';
}

function getLoggedInUser() {
  const email = getSession();
  if (!email) return null;
  return getUser(email);
}
```

### 3.3 Auth Gate UI

Create `css/auth.css`:

```css
/* ─── auth.css ────────────────────────────────────────────────────────────── */

.auth-gate {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  padding-top: 80px;    /* clear fixed chrome ticker */
  box-sizing: border-box;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  border: 1px solid rgba(240, 165, 0, 0.22);
  background: rgba(240, 165, 0, 0.02);
  padding: 32px 28px;
  font-family: var(--font-m);
  box-sizing: border-box;
}

/* On small phones, reduce padding */
@media (max-width: 420px) {
  .auth-card { padding: 24px 18px; }
}

.auth-header {
  text-align: center;
  margin-bottom: 28px;
}

.auth-title {
  font-family: var(--font-d);
  font-size: 16px;
  letter-spacing: 0.3em;
  color: var(--amber);
  margin-bottom: 6px;
}

.auth-subtitle {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--amber-dk);
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid rgba(240, 165, 0, 0.2);
  margin-bottom: 28px;
}

.auth-tab {
  flex: 1;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px 0;
  font-family: var(--font-m);
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--amber-dk);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.2s, border-color 0.2s;
}

.auth-tab.active {
  color: var(--amber);
  border-bottom-color: var(--amber);
}

.auth-field {
  margin-bottom: 20px;
}

.auth-label {
  display: block;
  font-size: 8px;
  letter-spacing: 0.3em;
  color: var(--amber-dk);
  margin-bottom: 8px;
}

.auth-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(240, 165, 0, 0.5);
  color: var(--amber);
  font-family: var(--font-m);
  font-size: 14px;              /* 14px minimum — prevents iOS zoom on focus */
  letter-spacing: 0.08em;
  padding: 10px 0;
  outline: none;
  box-sizing: border-box;
  -webkit-appearance: none;     /* remove iOS default styling */
  border-radius: 0;             /* prevent iOS rounding */
}

.auth-input:focus { border-bottom-color: var(--amber); }
.auth-input.error { border-bottom-color: var(--red); }

.auth-err {
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--red);
  min-height: 18px;
  margin-bottom: 16px;
  text-align: center;
}

.auth-btn {
  width: 100%;
  background: transparent;
  border: 1px solid var(--amber);
  color: var(--amber);
  font-family: var(--font-m);
  font-size: 11px;
  letter-spacing: 0.3em;
  padding: 16px;               /* tall tap target for mobile */
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  -webkit-tap-highlight-color: transparent;
  min-height: 52px;            /* accessible tap target */
}

.auth-btn:active,
.auth-btn:hover {
  background: rgba(240, 165, 0, 0.1);
}

.auth-divider {
  text-align: center;
  font-size: 8px;
  letter-spacing: 0.3em;
  color: var(--amber-dk);
  opacity: 0.5;
  margin: 20px 0;
}

.auth-welcome {
  text-align: center;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--amber-dk);
  margin-top: 20px;
}
```

### 3.4 Auth Gate HTML (inject into registration.html)

In `registration.html`, **before** the existing `<div class="page">` registration content, add:

```html
<!-- AUTH GATE — shown when not logged in -->
<div id="auth-gate" class="auth-gate" style="display:none;">
  <div class="auth-card">
    <div class="auth-header">
      <div class="auth-title">MISSION CONTROL</div>
      <div class="auth-subtitle">CREW LEAD AUTHENTICATION REQUIRED</div>
    </div>

    <div class="auth-tabs">
      <button class="auth-tab active" id="tab-login" onclick="authShowTab('login')">LOGIN</button>
      <button class="auth-tab" id="tab-signup" onclick="authShowTab('signup')">SIGN UP</button>
    </div>

    <!-- Login form -->
    <div id="auth-login-form">
      <div class="auth-field">
        <label class="auth-label" for="auth-email-l">CREW LEAD EMAIL</label>
        <input class="auth-input" id="auth-email-l" type="email" autocomplete="email"
               inputmode="email" placeholder="" oninput="authClearErr()">
      </div>
      <div class="auth-field">
        <label class="auth-label" for="auth-pass-l">PASSWORD</label>
        <input class="auth-input" id="auth-pass-l" type="password" autocomplete="current-password"
               placeholder="" oninput="authClearErr()" onkeydown="if(event.key==='Enter') authDoLogin()">
      </div>
      <div class="auth-err" id="auth-err-l"></div>
      <button class="auth-btn" id="auth-login-btn" onclick="authDoLogin()">INITIATE LOGIN</button>
    </div>

    <!-- Signup form -->
    <div id="auth-signup-form" style="display:none;">
      <div class="auth-field">
        <label class="auth-label" for="auth-email-s">CREW LEAD EMAIL</label>
        <input class="auth-input" id="auth-email-s" type="email" autocomplete="email"
               inputmode="email" placeholder="" oninput="authClearErr()">
      </div>
      <div class="auth-field">
        <label class="auth-label" for="auth-pass-s">CREATE PASSWORD</label>
        <input class="auth-input" id="auth-pass-s" type="password" autocomplete="new-password"
               placeholder="MIN 6 CHARACTERS" oninput="authClearErr()">
      </div>
      <div class="auth-field">
        <label class="auth-label" for="auth-pass-s2">CONFIRM PASSWORD</label>
        <input class="auth-input" id="auth-pass-s2" type="password" autocomplete="new-password"
               placeholder="" oninput="authClearErr()" onkeydown="if(event.key==='Enter') authDoSignup()">
      </div>
      <div class="auth-err" id="auth-err-s"></div>
      <button class="auth-btn" id="auth-signup-btn" onclick="authDoSignup()">CREATE ACCOUNT</button>
    </div>

    <div class="auth-welcome" id="auth-status"></div>
  </div>
</div>
<!-- END AUTH GATE -->
```

### 3.5 Auth Gate Logic (add to js/auth.js)

```js
// ─── Auth Gate UI logic (add to auth.js) ────────────────────────────────────

function authShowTab(tab) {
  document.getElementById('auth-login-form').style.display = tab === 'login' ? '' : 'none';
  document.getElementById('auth-signup-form').style.display = tab === 'signup' ? '' : 'none';
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  authClearErr();
}

function authClearErr() {
  const errL = document.getElementById('auth-err-l');
  const errS = document.getElementById('auth-err-s');
  if (errL) errL.textContent = '';
  if (errS) errS.textContent = '';
}

async function authDoLogin() {
  const btn = document.getElementById('auth-login-btn');
  btn.disabled = true;
  btn.textContent = 'AUTHENTICATING...';

  const email    = document.getElementById('auth-email-l').value;
  const password = document.getElementById('auth-pass-l').value;
  const result   = await logIn(email, password);

  if (!result.ok) {
    document.getElementById('auth-err-l').textContent = result.err;
    btn.disabled = false;
    btn.textContent = 'INITIATE LOGIN';
    return;
  }

  // Logged in — check if user already has a team
  if (result.teamId) {
    // Redirect to existing profile
    if (typeof staticCut === 'function') {
      staticCut(() => { window.location.href = 'profile.html?id=' + result.teamId; });
    } else {
      window.location.href = 'profile.html?id=' + result.teamId;
    }
  } else {
    // Show registration form
    authGatePassed();
  }
}

async function authDoSignup() {
  const btn = document.getElementById('auth-signup-btn');
  btn.disabled = true;
  btn.textContent = 'CREATING ACCOUNT...';

  const email  = document.getElementById('auth-email-s').value;
  const pass1  = document.getElementById('auth-pass-s').value;
  const pass2  = document.getElementById('auth-pass-s2').value;

  if (pass1 !== pass2) {
    document.getElementById('auth-err-s').textContent = 'PASSWORDS DO NOT MATCH';
    btn.disabled = false;
    btn.textContent = 'CREATE ACCOUNT';
    return;
  }

  const result = await signUp(email, pass1);

  if (!result.ok) {
    document.getElementById('auth-err-s').textContent = result.err;
    btn.disabled = false;
    btn.textContent = 'CREATE ACCOUNT';
    return;
  }

  // Account created — show registration form
  authGatePassed();
}

function authGatePassed() {
  // Hide gate, show registration flow
  const gate = document.getElementById('auth-gate');
  const regContent = document.getElementById('reg-content');
  if (gate) gate.style.display = 'none';
  if (regContent) regContent.style.display = '';
}

// Call this on DOMContentLoaded in registration.html
function authGateInit() {
  const user = getLoggedInUser();

  if (!user) {
    // Not logged in — show gate, hide registration
    document.getElementById('auth-gate').style.display = '';
    document.getElementById('reg-content').style.display = 'none';
  } else if (user.teamId) {
    // Already registered — redirect to profile immediately
    window.location.href = 'profile.html?id=' + user.teamId;
  } else {
    // Logged in but not registered — show registration
    document.getElementById('auth-gate').style.display = 'none';
    document.getElementById('reg-content').style.display = '';
  }
}
```

### 3.6 Wrap Existing Registration Content

In `registration.html`, wrap the existing `<div class="page">` (the 4-step form) in:

```html
<div id="reg-content">
  <!-- existing .page div with all 4 registration steps goes here — unchanged -->
</div>
```

### 3.7 Script Load Order in registration.html

Add these `<script>` tags in this order — before the closing `</body>`:

```html
<script src="js/store.js"></script>
<script src="js/auth.js"></script>
<script src="js/events-data.js"></script>
<script src="js/registration.js"></script>
<script src="js/chrome.js"></script>
<script src="js/navigate.js"></script>
```

Add `<link rel="stylesheet" href="css/auth.css">` in the `<head>`.

### 3.8 Trigger Auth Gate on Page Load

At the bottom of `registration.html`, after all scripts, add:

```html
<script>
  document.addEventListener('DOMContentLoaded', authGateInit);
</script>
```

Remove the existing `document.addEventListener('DOMContentLoaded', () => setStep(1));` from `registration.js` and instead call `setStep(1)` inside `authGatePassed()` after showing `reg-content`.

---

## 4. MULTI-EVENT SELECTION

### 4.1 What Changes

Step 3 of registration currently allows selecting **one event**. Change it to allow **multiple events**. The user should be able to tap/click multiple events and all selected events are confirmed. The profile will then list all selected events.

### 4.2 State Change in registration.js

Replace the single-event state:

```js
// OLD
const S = { crew: '', inst: '', op: '', evt: '', evtId: '', stepVisited: [false,false,false,false] };
```

With:

```js
// NEW
const S = {
  crew:         '',
  inst:         '',
  events:       [],   // array of { op, evt, evtId } — one entry per selected event
  stepVisited:  [false, false, false, false]
};
```

### 4.3 Updated selEvt Function

Replace the existing `selEvt` function:

```js
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
}
```

### 4.4 Updated buildEvtList Function

Replace the line:

```js
html += `<div class="reg-opt" onclick="selEvt(this, '${d.op}', '${d.nm}', '${id}')">`;
```

Add a note above each group:

```html
<div class="reg-group-label">TECHNICAL OPERATIONS</div>
```

```html
<div class="reg-group-label">NON-TECHNICAL OPERATIONS</div>
```

```html
<div class="reg-group-label">OMEGA CLASSIFICATION</div>
```

The `reg-opt` items remain the same in structure. Their click handler now toggles instead of single-selects.

Also, after building the list, add a selected-count indicator below the list:

```html
<div class="reg-sel-count" id="sel-count"></div>
```

Update this element whenever selection changes:

```js
function updateSelCount() {
  const el = document.getElementById('sel-count');
  if (!el) return;
  const n = S.events.length;
  el.textContent = n === 0 ? 'SELECT ONE OR MORE MISSIONS' : `${n} MISSION${n > 1 ? 'S' : ''} SELECTED`;
  el.style.color = n === 0 ? 'var(--amber-dk)' : 'var(--amber)';
}
```

Call `updateSelCount()` at the end of `selEvt()` and at the end of `buildEvtList()`.

### 4.5 Go/No-Go Step Update (Step 4)

The Go/No-Go panel in Step 4 currently shows a single event. Replace with:

```js
function runGoNoGo() {
  const evtSummary = S.events.map(e => e.evt).join(' · ');

  const items = [
    { id: 'g1', vid: 'gv1', val: S.crew },
    { id: 'g2', vid: 'gv2', val: S.inst },
    { id: 'g3', vid: 'gv3', val: evtSummary || '—' },
    { id: 'g4', vid: 'gv4', val: 'CONFIRMED' },
  ];
  // rest of animation logic unchanged
}
```

In `registration.html`, the Go/No-Go row label for mission assignment should say `MISSION ASSIGNMENT(S)` and its value element (`gv3`) should display all selected events.

### 4.6 Submit Function Update

Replace the `submit()` function to handle multiple events:

```js
function submit() {
  const teamId = 'NXV-' + Date.now().toString(36).toUpperCase();

  const teamData = {
    id:        teamId,
    crew:      S.crew,
    inst:      S.inst,
    events:    S.events,     // array of { op, evt, evtId }
    // Keep legacy fields for backwards compatibility
    op:        S.events[0]?.op || '',
    evt:       S.events[0]?.evt || '',
    evtId:     S.events[0]?.evtId || '',
    createdAt: new Date().toISOString(),
  };

  if (typeof saveTeam === 'function') saveTeam(teamData);

  // Link this team to the logged-in user account
  const sessionEmail = getSession();
  if (sessionEmail && typeof linkTeamToUser === 'function') {
    linkTeamToUser(sessionEmail, teamId);
  }

  sessionStorage.setItem('reg_team_id', teamId);

  // ── EXTERNAL REDIRECT ──────────────────────────────────────────────────────
  // Open external payment/registration page in a new tab
  const EXTERNAL_REG_URL = 'YOUR_EXTERNAL_PAYMENT_URL_HERE'; // ← replace before deployment
  if (EXTERNAL_REG_URL && EXTERNAL_REG_URL !== 'YOUR_EXTERNAL_PAYMENT_URL_HERE') {
    window.open(EXTERNAL_REG_URL, '_blank', 'noopener,noreferrer');
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
  }, 300);
}
```

**Important:** The `EXTERNAL_REG_URL` constant is what the "LAUNCH CONFIRMED" button triggers. Replace `YOUR_EXTERNAL_PAYMENT_URL_HERE` with the actual URL of the external payment/registration site before deployment.

### 4.7 Multi-Event CSS Additions (add to css/registration.css)

```css
/* Multi-select group labels */
.reg-group-label {
  font-size: 8px;
  letter-spacing: 0.35em;
  color: var(--amber-dk);
  opacity: 0.6;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(240, 165, 0, 0.1);
}

/* Selected count indicator */
.reg-sel-count {
  font-size: 9px;
  letter-spacing: 0.25em;
  color: var(--amber-dk);
  text-align: center;
  margin-top: 16px;
  min-height: 20px;
  transition: color 0.3s;
}

/* Multi-select hint on options */
.reg-opt {
  cursor: pointer;
  /* existing styles preserved */
}
.reg-opt.sel .ro-bullet {
  color: var(--amber);
}

/* Mobile: make options taller for easier tapping */
@media (max-width: 600px) {
  .reg-opt {
    padding: 14px 12px;
    min-height: 52px;
  }
}
```

---

## 5. PROFILE PAGE — MULTI-EVENT DISPLAY & LOGIN GATE

### 5.1 Profile Auth Gate

In `profile.html`, add the same auth gate pattern. On `DOMContentLoaded`:

```js
// In profile.js — replace the existing DOMContentLoaded handler start

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
```

### 5.2 Not Logged In HTML

Add this function to `profile.js`:

```js
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
```

### 5.3 Logout Button in Profile

In `renderProfile()`, add a logout button near the top of the card HTML:

```html
<button class="prof-logout-btn" onclick="logOut()">LOGOUT</button>
```

Add to `css/profile.css`:

```css
.prof-logout-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: 1px solid rgba(240, 165, 0, 0.3);
  color: var(--amber-dk);
  font-family: var(--font-m);
  font-size: 8px;
  letter-spacing: 0.25em;
  padding: 8px 14px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  min-height: 40px;   /* mobile tap target */
}

.prof-logout-btn:active {
  border-color: var(--amber);
  color: var(--amber);
}
```

Make `.prof-card` position relative so the absolute logout button works:

```css
.prof-card { position: relative; /* add to existing rule */ }
```

### 5.4 Multi-Event Display in Profile

The `team.events` array (from the new data model) contains all selected events. Replace the single operation badge in `renderProfile()` with a multi-event section:

```js
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
```

Replace the single operation badge `div` in `renderProfile()` with `buildEventsHTML(team)`.

Also update the info grid below it: when multiple events are selected, the mission-specific fields (prize, crew size, module, lead) should be hidden or show a summary like `SEE INDIVIDUAL EVENTS ABOVE` instead of pulling from a single event.

### 5.5 Multi-Event CSS (add to css/profile.css)

```css
/* Multi-event grid */
.prof-events-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
}

@media (max-width: 440px) {
  .prof-events-grid { grid-template-columns: 1fr; }
}

.prof-event-item {
  border: 1px solid rgba(240, 165, 0, 0.2);
  padding: 12px;
  background: rgba(240, 165, 0, 0.02);
}

.prof-event-op {
  font-size: 8px;
  letter-spacing: 0.3em;
  color: var(--amber-dk);
  margin-bottom: 4px;
}

.prof-event-name {
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--amber);
  font-family: var(--font-d);
}

.prof-event-prize {
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--amber-dk);
  margin-top: 6px;
  opacity: 0.7;
}
```

---

## 6. MOBILE-FIRST DESIGN REQUIREMENTS

These rules apply to **every screen** — auth gate, registration steps, profile. The site must feel native on phones.

### 6.1 Global Mobile Rules

Add to `css/base.css` (or `css/auth.css` if it doesn't conflict):

```css
/* Prevent text size adjustments on orientation change */
html { -webkit-text-size-adjust: 100%; }

/* Smooth scrolling for anchor jumps */
html { scroll-behavior: smooth; }

/* Prevent double-tap zoom on buttons */
button, .reg-opt, .auth-btn {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Base font input size — prevents iOS zoom (must be 16px+) */
input, textarea, select {
  font-size: 16px !important;  /* override any smaller font-size on inputs */
}
```

> **Critical iOS rule:** Any `<input>` with `font-size` smaller than 16px will cause iOS Safari to auto-zoom in. All inputs must have `font-size: 16px` (or `font-size: 1rem`) minimum. The visual size can be controlled via `transform: scale()` on the parent if needed, but the font-size value must be ≥ 16px.

### 6.2 Registration Page Mobile

Add to `css/registration.css`:

```css
/* Full-width panel on mobile */
@media (max-width: 600px) {
  .page { padding: 80px 16px 60px; }
  .reg-panel { padding: 20px 16px; }
  
  /* Bigger next buttons for easy tapping */
  .btn-next {
    min-height: 52px;
    font-size: 12px;
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
  }

  /* Step progress labels */
  .sp-item span { display: none; } /* hide text labels on tiny screens */
}
```

### 6.3 Profile Page Mobile

Add to `css/profile.css`:

```css
@media (max-width: 600px) {
  .profile-page { padding-top: 60px; padding-bottom: 60px; }

  .prof-card { padding: 20px 16px; }

  .prof-team-name {
    font-size: 18px;   /* was larger — scale down for phones */
    word-break: break-word;
  }

  .prof-timer-dig {
    font-size: 28px;   /* readable but not cramped */
  }

  .prof-info-grid {
    grid-template-columns: 1fr 1fr;  /* 2-col on phones */
  }

  .prof-bottom-row {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .prof-share-btn {
    width: 100%;
    min-height: 52px;
    box-sizing: border-box;
  }
}
```

### 6.4 Tap Target Sizing

Every interactive element (buttons, event options, tab buttons) must have a minimum height of **44px** (Apple HIG standard). Verify these elements have sufficient size:

- `.auth-btn` → `min-height: 52px` ✓ (already in auth.css above)
- `.reg-opt` → `min-height: 52px` on mobile ✓ (already in registration.css above)
- `.btn-next` → `min-height: 52px` on mobile ✓
- `.prof-logout-btn` → `min-height: 40px` ✓

### 6.5 Viewport Meta Tag

Verify all HTML files have this exact viewport meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

`viewport-fit=cover` handles the iPhone notch/Dynamic Island safely.

---

## 7. EXTERNAL REDIRECT — LAUNCH CONFIRMED BUTTON

### 7.1 The Constant

In `js/registration.js`, at the top of the file, there is already:

```js
const REG_FORM_URL = 'YOUR_GOOGLE_FORM_URL_HERE';
```

Add a second constant directly below it:

```js
const EXTERNAL_PAYMENT_URL = 'YOUR_EXTERNAL_PAYMENT_URL_HERE'; // ← replace with actual URL before deployment
```

### 7.2 Redirect Behaviour

In the `submit()` function (see Section 4.6), the external URL opens in a **new tab** via `window.open(..., '_blank', 'noopener,noreferrer')`. The current tab then navigates to `profile.html`.

This means:
- Phone users: new tab opens with the payment site, current tab shows their profile
- The profile is immediately accessible even if they close the payment tab

### 7.3 Note to Deployer

Before going live, find and replace both:
- `YOUR_GOOGLE_FORM_URL_HERE` → actual Google Form URL (already existed)
- `YOUR_EXTERNAL_PAYMENT_URL_HERE` → actual external payment/registration URL

---

## 8. COMPLETE SCRIPT LOAD ORDER

### registration.html `<head>`:
```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/chrome.css">
<link rel="stylesheet" href="css/transitions.css">
<link rel="stylesheet" href="css/registration.css">
<link rel="stylesheet" href="css/auth.css">
```

### registration.html before `</body>`:
```html
<script src="js/store.js"></script>
<script src="js/auth.js"></script>
<script src="js/events-data.js"></script>
<script src="js/registration.js"></script>
<script src="js/chrome.js"></script>
<script src="js/navigate.js"></script>
<script>document.addEventListener('DOMContentLoaded', authGateInit);</script>
```

### profile.html `<head>`:
```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/chrome.css">
<link rel="stylesheet" href="css/transitions.css">
<link rel="stylesheet" href="css/profile.css">
```

### profile.html before `</body>`:
```html
<script src="js/store.js"></script>
<script src="js/auth.js"></script>
<script src="js/events-data.js"></script>
<script src="js/profile.js"></script>
<script src="js/chrome.js"></script>
<script src="js/navigate.js"></script>
```

---

## 9. TESTING CHECKLIST

The agent implementing this spec must verify all of the following before marking complete:

### Auth Flow
- [ ] Visiting `registration.html` when not logged in shows the auth gate, hides the form
- [ ] Signing up with a valid email + matching passwords ≥6 chars creates account and proceeds to form
- [ ] Signing up with duplicate email shows error message
- [ ] Signing up with mismatched passwords shows error
- [ ] Logging in with correct credentials proceeds to form (new user) or profile (returning user)
- [ ] Logging in with wrong password shows error
- [ ] After registration, visiting `registration.html` again redirects to profile automatically
- [ ] Logout button on profile page clears session and goes to `index.html`
- [ ] Visiting `profile.html` when logged out shows the 401 not-logged-in screen with login button

### Multi-Event Selection
- [ ] Multiple events can be selected (all highlight with filled bullet)
- [ ] Clicking a selected event deselects it
- [ ] Selection count updates correctly
- [ ] Next button only appears when ≥1 event is selected
- [ ] Step 4 Go/No-Go shows all selected event names
- [ ] Profile shows all selected events (multi-event grid for 2+, single badge for 1)

### External Redirect
- [ ] "LAUNCH CONFIRMED" button opens external payment URL in new tab
- [ ] Current tab navigates to profile after button is pressed
- [ ] If `EXTERNAL_PAYMENT_URL` is still the placeholder string, no new tab is opened (graceful no-op)

### Mobile
- [ ] Auth gate looks correct on 375px width (iPhone SE)
- [ ] Auth gate looks correct on 390px width (iPhone 14)
- [ ] All inputs do NOT trigger zoom on iOS (font-size ≥ 16px)
- [ ] All buttons are ≥44px tall
- [ ] Event option list is scrollable and easily tappable
- [ ] Profile card is readable and not overflowing on 375px width
- [ ] Multi-event grid collapses to 1 column on narrow screens

---

## 10. CONSTRAINTS — DO NOT CHANGE

- **Do not add any backend, server, or external API calls** (except the external redirect URL which the user opens, not the site)
- **Do not change the visual design language** — amber/black palette, Orbitron font, monospace aesthetic, NASA retro tone must be preserved exactly
- **Do not change any animation or sound logic** — typewriter effects, static cuts, blip sounds
- **Do not change existing HTML structure** outside of the specific additions described here
- **Do not use any external auth library** — the SHA-256 + localStorage approach described is the intended implementation
- **Do not store plaintext passwords** — always hash with `crypto.subtle.digest('SHA-256', ...)`
- **localStorage is the only persistence layer** — no cookies, no IndexedDB, no external storage

---

*End of specification. Implement all sections in order. Start with js/auth.js and js/store.js additions, then registration.html gate, then multi-event logic, then profile updates, then mobile CSS.*
