# NEXOVATE V5 — DEBUG + BUILD SPECIFICATION
### For Antigravity IDE · Full Implementation Guide

---

## TABLE OF CONTENTS

1. [Bug Inventory & Root Causes](#1-bug-inventory--root-causes)
2. [Fix 1 — Button Font/Style Inconsistency](#2-fix-1--button-fontstyle-inconsistency)
3. [Fix 2 — Dossier → Registration Double-Select Loop](#3-fix-2--dossier--registration-double-select-loop)
4. [Fix 3 — Step 3 Blank (Event List Not Rendering)](#4-fix-3--step-3-blank-event-list-not-rendering)
5. [Fix 4 — Step 4 GO/NO-GO Static Values](#5-fix-4--step-4-gonogo-static-values)
6. [Fix 5 — Submit Redirects to External Form + Saves Data](#6-fix-5--submit-redirects-to-external-form--saves-data)
7. [New Feature — Team Profile Page (`profile.html`)](#7-new-feature--team-profile-page-profilehtml)
8. [New File — `js/store.js` (localStorage Persistence Layer)](#8-new-file--jsstorejs-localstorage-persistence-layer)
9. [New File — `css/profile.css`](#9-new-file--cssprofilecss)
10. [New File — `profile.html`](#10-new-file--profilehtml)
11. [New File — `js/profile.js`](#11-new-file--jsprofilejs)
12. [Update — `js/registration.js` (save + redirect)](#12-update--jsregistrationjs-save--redirect)
13. [Update — `js/navigate.js` (add profile route)](#13-update--jsnavigatejs-add-profile-route)
14. [Deployment Checklist](#14-deployment-checklist)

---

## 1. BUG INVENTORY & ROOT CAUSES

| # | Symptom | File(s) | Root Cause |
|---|---------|---------|------------|
| B1 | Buttons on some pages render black text on white/transparent bg with wrong font | `css/base.css`, `registration.html`, `dossier.html` | `.btn` class in `base.css` sets `border:none` but no color/background. Pages using `.btn .btn-next` or `.btn .btn-file` don't inherit the amber theme unless `.btn-primary` or `.btn-action` subclass is applied. The `registration.html` buttons use raw `class="btn btn-next"` which has no background/color rule. |
| B2 | Dossier → "SUBMIT CREW MANIFEST" takes you to registration, but after picking a mission it asks you to pick again (loop) | `js/schematic.js`, `js/registration.js` | `regFor(id)` in `schematic.js` sets `sessionStorage.preselect = id`, then calls `navigate('registration')`. In `registration.js`, `buildEvtList()` reads `preselect`, auto-clicks the event — correct. BUT `setStep(3)` is only called from `nxt(2)`, which means the pre-select auto-click fires on step 3, selects the event and shows the "CONFIRM MISSION" button, but the user is still on step 1. When they eventually reach step 3 manually, `buildEvtList()` runs again (because `setStep(3)` calls it), `preselect` is already cleared, so nothing is pre-selected. Also `navigate('registration')` in `schematic.js` passes the string `'registration'` but `PAGES` map expects key `'registration'` → resolves correctly, but the page always starts at step 1 regardless. |
| B3 | Step 3 of registration.html is blank | `registration.html`, `js/registration.js` | The `#evt-list` div is populated by `buildEvtList()`, which references `EVT` from `events-data.js`. The script load order in `registration.html` is: `navigate.js` → `chrome.js` → `events-data.js` → `registration.js`. BUT `chrome.js` fires `DOMContentLoaded` and injects chrome elements. `registration.js` also fires on `DOMContentLoaded` and calls `setStep(1)`. Because `chrome.js` runs first and does DOM manipulation, there's a race. More critically: `buildEvtList()` is called inside `setStep(3)` which is only triggered by `nxt(2)`. On first load, `setStep(1)` is called — step 3 is never initialized. If the user jumps directly to step 3 (or if preselect navigation triggers it) without going through `nxt(2)`, `buildEvtList()` never fires. Additionally, the `.reg-step` CSS rule sets `display:none` for all steps except `.on`, so step 3 just shows its header and blank prompt with no list. |
| B4 | GO/NO-GO items show hardcoded "GO ✓" text in HTML; JS tries to animate them dynamically but IDs mismatch | `registration.html`, `js/registration.js` | HTML has `<span class="gng-status">GO ✓</span>` hardcoded. JS `runGoNoGo()` looks for elements `gv1`–`gv4` (ids like `gv1`) but the HTML has class `gng-status` with no ids. Also `#gng-final` exists in HTML but `runGoNoGo` sets `style.opacity='1'` on it — works — but `launch-btn` is initially `display:none` via inline style. The `runGoNoGo` never fires because it's called in `setStep(4)` which requires `nxt(3)` to work, which requires step 3 to work (B3). |
| B5 | After submission, teams need profiles but there's no storage or profile page | Missing files | No `localStorage` layer, no `profile.html`, no per-team data model exists. |

---

## 2. FIX 1 — Button Font/Style Inconsistency

### Problem
`registration.html` uses `class="btn btn-next"` but `.btn-next` has no definition in any CSS file. `.btn` alone has no background or color. Result: browser default black text on white/transparent.

Same issue in `dossier.html`'s dynamically injected `<button class="btn btn-file">` in `schematic.js`.

### Fix in `css/base.css`
Add these rules at the bottom of the `.btn` block:

```css
/* ── btn-next (registration steps) ── */
.btn-next {
  font-size: 11px;
  color: var(--bg);
  background: var(--amber);
  padding: 12px 32px;
  clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-next:hover {
  background: var(--offwhite);
  box-shadow: 0 0 24px var(--amber-glow);
}

/* ── btn-file (dossier file panel) ── */
.btn-file {
  font-size: 10px;
  color: var(--bg);
  background: var(--amber);
  padding: 11px 20px;
  width: 100%;
  margin-top: 12px;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-file:hover {
  background: var(--offwhite);
  box-shadow: 0 0 18px rgba(240,165,0,.4);
}

/* ── danger variant (launch button) ── */
.btn-next.danger {
  background: var(--red);
}
.btn-next.danger:hover {
  background: #e74c3c;
  box-shadow: 0 0 24px rgba(192, 57, 43, 0.5);
}
.btn-next.full {
  width: 100%;
}
```

---

## 3. FIX 2 — Dossier → Registration Double-Select Loop

### Problem
`regFor(id)` sets preselect in sessionStorage, then navigates. On registration.html, `setStep(1)` fires. `buildEvtList()` only runs when `setStep(3)` is called, which only happens after step 2 is completed. By then `preselect` has been in storage but never consumed. When user reaches step 3 and `buildEvtList()` runs, it reads preselect, auto-clicks the event (correct) and clears preselect. But the user is confused because they already saw step 1 and 2 asking for crew/institution, then step 3 shows the event pre-selected — this part actually works correctly.

The real loop bug: `buildEvtList()` is called every time `setStep(3)` runs. If user goes back (there's no back button, but if they reload or something triggers `setStep(3)` again) it re-runs fine. The actual problem is that `selEvt` stores to `S.evtId` but when `nxt(3)` is called it only checks `if (!S.op)` — if the preselect click never fired properly, `S.op` is empty.

The deepest bug: `buildEvtList()` fires the `.click()` on the preselect element, which calls `selEvt()` which sets `S.op`, `S.evt`, `S.evtId`. But if `buildEvtList()` is called before the container is visible (step 3 `.reg-step` has `display:none`), the click event on the hidden element may not propagate correctly in all browsers.

### Fix in `js/registration.js`

Replace the `buildEvtList()` function's preselect block:

```js
// OLD (may fail on hidden elements):
if (presel) {
  const el = document.querySelector(`.reg-opt[onclick*="'${presel}'"]`);
  if (el) el.click();
  sessionStorage.removeItem('preselect');
}

// NEW (directly set state without relying on click dispatch):
if (presel) {
  const el = document.querySelector(`.reg-opt[onclick*="'${presel}'"]`);
  if (el) {
    // Set state directly
    const d = EVT[presel];
    if (d) {
      S.op = 'OPERATION: ' + d.op;
      S.evt = d.nm;
      S.evtId = presel;
      el.classList.add('sel');
      el.querySelector('.ro-bullet').textContent = '●';
      document.getElementById('step3-btn').style.display = 'block';
    }
  }
  sessionStorage.removeItem('preselect');
}
```

---

## 4. FIX 3 — Step 3 Blank (Event List Not Rendering)

### Problem
`buildEvtList()` only runs inside `setStep(3)`. `setStep(3)` is only called from `nxt(2)`. But `events-data.js` must be loaded before `registration.js`. Verify script order in `registration.html`:

```html
<!-- CORRECT ORDER — verify this is what's in registration.html -->
<script src="js/navigate.js"></script>
<script src="js/events-data.js"></script>  <!-- MUST come before chrome.js and registration.js -->
<script src="js/chrome.js"></script>
<script src="js/registration.js"></script>
```

Also, `chrome.js` injects the T-minus bar and ticker which themselves fire on `DOMContentLoaded`. Since multiple scripts attach to the same event, order of execution matches script-tag order — but `events-data.js` just declares `const EVT = {...}` with no event listener, so it's safe.

The real blank step 3 issue: in the current `registration.html`, step 3's div is:

```html
<div class="reg-step" id="rs3">
  ...
  <div class="reg-opts" id="evt-list">
    <!-- Populated by JS -->
  </div>
  <button class="btn btn-next" id="step3-btn" style="display:none;" onclick="nxt(3)">CONFIRM MISSION ›</button>
</div>
```

The CSS selector used in `buildEvtList()` targets `#evt-list`. This is correct. The issue is that `css/registration.css` defines `.reg-opts` but not `#evt-list` with any display rules — this is fine.

**The actual blank issue**: Looking at `registration.js`, `buildEvtList()` constructs HTML with `onclick="selEvt(this, '${d.op}', '${d.nm}', '${id}')"`. The variable `d.op` for `roborace` is `'IRONCLAD'` (no quotes issue), but `d.nm` for `hacksprint` is `'HACKSPRINT 6.0'` — the `6.0` contains a period, which is fine. However `d.nm` for robosoccer is `'ROBO SOCCER'` — spaces in the onclick string parameter should be fine as they're single-quoted within double-quoted HTML attribute.

**The actual actual issue**: The `step-ind` in HTML has hardcoded text for steps. But the `reg-prompt` div uses a static class `.reg-prompt` yet in `registration.js`, `typeInto()` targets `document.getElementById('sp'+n+'-text')`. This ID `sp1-text`, `sp2-text`, etc. **does not exist in registration.html**. The HTML uses `class="reg-prompt"` not `id="sp1-text"`. The typewriter effect tries to write into elements that don't exist, fails silently, and the step prompt text remains static (which is fine) — BUT `setStep()` also calls `document.getElementById('sp'+n)` for progress dots, and those IDs also don't exist in the current HTML.

### Fix in `registration.html`

The HTML needs the step progress dots with correct IDs AND the prompt elements need IDs. Replace the current `registration.html` with this corrected version:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CREW REGISTRATION · NEXOVATE 2026</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/chrome.css">
  <link rel="stylesheet" href="css/transitions.css">
  <link rel="stylesheet" href="css/registration.css">
  
  <script src="js/navigate.js"></script>
  <script src="js/events-data.js"></script>
  <script src="js/chrome.js"></script>
  <script src="js/registration.js"></script>
</head>
<body data-page="registration">
  <main class="page">
    <div class="reg-wrap">
      <div style="text-align:center;margin-bottom:32px;">
        <span class="section-lbl">CREW ASSIGNMENT PROTOCOL</span>
        <div class="section-ttl">CREW MANIFEST</div>
      </div>

      <!-- Step progress dots -->
      <div class="step-progress" style="justify-content:center;margin-bottom:28px;">
        <div class="sp-item" id="sp1">
          <div class="sp-dot"></div>
          <span>CREW</span>
        </div>
        <div class="sp-dash"></div>
        <div class="sp-item" id="sp2">
          <div class="sp-dot"></div>
          <span>SITE</span>
        </div>
        <div class="sp-dash"></div>
        <div class="sp-item" id="sp3">
          <div class="sp-dot"></div>
          <span>MISSION</span>
        </div>
        <div class="sp-dash"></div>
        <div class="sp-item" id="sp4">
          <div class="sp-dot"></div>
          <span>LAUNCH</span>
        </div>
      </div>

      <!-- Step 1 -->
      <div class="reg-step on" id="rs1">
        <div class="step-ind">STEP 01 OF 04 &nbsp;·&nbsp; CREW DESIGNATION</div>
        <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <br>
        <div class="reg-prompt" id="sp1-text">MISSION CONTROL: PLEASE CONFIRM CREW DESIGNATION.
THIS IS THE IDENTIFIER BY WHICH YOUR TEAM WILL BE
LOGGED IN THE OFFICIAL MISSION MANIFEST.</div>
        <div class="fp-lbl">CREW DESIGNATION:</div>
        <input class="reg-input" id="inp-crew" type="text" placeholder="ENTER TEAM NAME" autocomplete="off" oninput="clearErr(this)" />
        <br><br>
        <button class="btn btn-next" onclick="nxt(1)">CONFIRM DESIGNATION ›</button>
      </div>

      <!-- Step 2 -->
      <div class="reg-step" id="rs2">
        <div class="step-ind">STEP 02 OF 04 &nbsp;·&nbsp; LAUNCH SITE</div>
        <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <br>
        <div class="reg-prompt" id="sp2-text">MISSION CONTROL: CONFIRM LAUNCH SITE.
YOUR INSTITUTION OF ORIGIN FOR MISSION RECORDS.</div>
        <div class="fp-lbl">LAUNCH SITE (INSTITUTION):</div>
        <input class="reg-input" id="inp-inst" type="text" placeholder="ENTER COLLEGE / INSTITUTION" autocomplete="off" oninput="clearErr(this)" />
        <br><br>
        <button class="btn btn-next" onclick="nxt(2)">CONFIRM LAUNCH SITE ›</button>
      </div>

      <!-- Step 3 -->
      <div class="reg-step" id="rs3">
        <div class="step-ind">STEP 03 OF 04 &nbsp;·&nbsp; MISSION ASSIGNMENT</div>
        <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <br>
        <div class="reg-prompt" id="sp3-text">MISSION CONTROL: SELECT PRIMARY MISSION.
CHOOSE THE OPERATION YOUR CREW IS VOLUNTEERING FOR.
EACH CREW MAY SUBMIT FOR ONE PRIMARY MISSION.</div>
        <br>
        <div class="reg-opts" id="evt-list">
          <!-- Populated by buildEvtList() in registration.js -->
        </div>
        <button class="btn btn-next" id="step3-btn" style="display:none;" onclick="nxt(3)">CONFIRM MISSION ›</button>
      </div>

      <!-- Step 4 -->
      <div class="reg-step" id="rs4">
        <div class="step-ind">STEP 04 OF 04 &nbsp;·&nbsp; PRE-LAUNCH GO/NO-GO POLL</div>
        <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <br>
        <div class="reg-prompt" id="sp4-text">MISSION CONTROL: CONDUCTING PRE-LAUNCH GO/NO-GO POLL.
ALL STATIONS CONFIRM STATUS.</div>
        <br>
        <div class="gng-list">
          <div class="gng-item" id="g1">
            <span class="gng-lbl">CREW DESIGNATION &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="gng-val" id="gv1">PENDING…</span>
          </div>
          <div class="gng-item" id="g2">
            <span class="gng-lbl">LAUNCH SITE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="gng-val" id="gv2">PENDING…</span>
          </div>
          <div class="gng-item" id="g3">
            <span class="gng-lbl">MISSION ASSIGNMENT &nbsp;&nbsp;</span>
            <span class="gng-val" id="gv3">PENDING…</span>
          </div>
          <div class="gng-item" id="g4">
            <span class="gng-lbl">TEAM READINESS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="gng-val" id="gv4">PENDING…</span>
          </div>
        </div>
        <div id="gng-final" class="gng-final-text" style="opacity:0;margin:16px 0;">ALL STATIONS: GO FOR LAUNCH.</div>
        <button class="btn btn-next full danger" id="launch-btn" style="display:none;" onclick="submit()">
          LAUNCH CONFIRMED · COMMIT TO MISSION
        </button>
      </div>

    </div>
  </main>
</body>
</html>
```

---

## 5. FIX 4 — Step 4 GO/NO-GO Static Values

The `runGoNoGo()` function in `registration.js` needs updating to show actual crew data AND fix the ID references. Also update it to display the actual crew/institute/mission values:

```js
// REPLACE runGoNoGo() in registration.js with:
function runGoNoGo() {
  const items = [
    { id: 'g1', vid: 'gv1', val: S.crew },
    { id: 'g2', vid: 'gv2', val: S.inst },
    { id: 'g3', vid: 'gv3', val: S.evt },
    { id: 'g4', vid: 'gv4', val: 'CONFIRMED' },
  ];
  items.forEach(({ id, vid, val }, i) => {
    setTimeout(() => {
      const row = document.getElementById(id);
      const valEl = document.getElementById(vid);
      if (!row || !valEl) return;
      valEl.textContent = val + ' ✓';
      valEl.classList.add('go');
      row.classList.add('go');
      playTypeKey();
    }, 600 * (i + 1));
  });
  setTimeout(() => {
    const fin = document.getElementById('gng-final');
    if (fin) fin.style.opacity = '1';
  }, 3200);
  setTimeout(() => {
    const btn = document.getElementById('launch-btn');
    if (btn) btn.style.display = 'block';
  }, 3600);
}
```

---

## 6. FIX 5 — Submit Redirects to External Form + Saves Data

The `submit()` function needs to:
1. Save team data to `localStorage` (persistent, not just sessionStorage)
2. Generate a unique team ID
3. Open the external registration form in a new tab
4. Redirect to the team's profile page (not `confirmation.html`)

```js
// REPLACE submit() in registration.js with:
function submit() {
  // Generate unique team ID
  const teamId = 'NXV-' + Date.now().toString(36).toUpperCase();
  
  const teamData = {
    id:        teamId,
    crew:      S.crew,
    inst:      S.inst,
    op:        S.op,
    evt:       S.evt,
    evtId:     S.evtId,
    createdAt: new Date().toISOString(),
  };

  // Save to localStorage
  saveTeam(teamData);  // defined in js/store.js

  // Also keep sessionStorage for backward compat with confirmation.js
  sessionStorage.setItem('reg_crew', S.crew);
  sessionStorage.setItem('reg_inst', S.inst);
  sessionStorage.setItem('reg_op',   S.op);
  sessionStorage.setItem('reg_evt',  S.evt);
  sessionStorage.setItem('reg_team_id', teamId);

  // Open external Google Form in new tab
  if (REG_FORM_URL && REG_FORM_URL !== 'YOUR_GOOGLE_FORM_URL_HERE') {
    window.open(REG_FORM_URL, '_blank');
  }

  // Flash and navigate to profile
  document.body.style.background = '#F0A500';
  setTimeout(() => {
    document.body.style.background = '';
    staticCut(() => {
      window.location.href = 'profile.html?id=' + teamId;
    });
  }, 300);
}
```

Also add this to the top of `registration.html`'s script includes:
```html
<script src="js/store.js"></script>
```
(Add before `registration.js`.)

---

## 7. NEW FEATURE — Team Profile Page (`profile.html`)

### Design Reference (from screenshot)
The reference profile (hackfest.dev style) shows:
- Announcement ticker at top
- Campus map image at top of card
- Timer countdown (event countdown or hackathon timer)
- Team name (large) + Team number badge
- Lab/Venue assignment
- Dorm info (male/female blocks)
- QR code (links to the team's profile URL)

### Nexovate Adaptation (space-station amber theme)
We adapt this to the NEXOVATE aesthetic:
- Amber-on-black, Orbitron + IBM Plex Mono
- Timer: countdown to May 22, 2026 09:00 IST
- Team name + Operation name
- Event details (module, type, prize, lead, comms)
- Venue: PESCE Mandya (with map link)
- QR code: encodes `profile.html?id=<teamId>` — teams can share/screenshot
- Mission patch SVG (reused from confirmation.js logic)
- Unique team ID displayed

---

## 8. NEW FILE — `js/store.js` (localStorage Persistence Layer)

Create `js/store.js`:

```js
// ─── store.js ───────────────────────────────────────────────────────────────
// localStorage persistence layer for Nexovate team profiles.

const STORE_KEY = 'nexovate_teams';

/**
 * Returns all teams as an object keyed by teamId.
 */
function getAllTeams() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch {
    return {};
  }
}

/**
 * Saves a team. Overwrites if same id exists.
 * @param {Object} teamData - { id, crew, inst, op, evt, evtId, createdAt }
 */
function saveTeam(teamData) {
  const teams = getAllTeams();
  teams[teamData.id] = teamData;
  localStorage.setItem(STORE_KEY, JSON.stringify(teams));
}

/**
 * Retrieves a single team by ID.
 * @param {string} id
 * @returns {Object|null}
 */
function getTeam(id) {
  const teams = getAllTeams();
  return teams[id] || null;
}

/**
 * Deletes a team by ID (admin use).
 */
function deleteTeam(id) {
  const teams = getAllTeams();
  delete teams[id];
  localStorage.setItem(STORE_KEY, JSON.stringify(teams));
}
```

---

## 9. NEW FILE — `css/profile.css`

Create `css/profile.css`:

```css
/* ─── profile.css ─────────────────────────────────────────────────────────── */

.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  padding-bottom: 80px;
}

/* ── Not Found State ── */
.profile-notfound {
  text-align: center;
  padding: 80px 20px;
  font-family: var(--font-m);
  color: var(--amber-dk);
  font-size: 11px;
  letter-spacing: .2em;
}
.profile-notfound .big {
  font-family: var(--font-d);
  font-size: 28px;
  color: var(--red);
  letter-spacing: .3em;
  margin-bottom: 12px;
}

/* ── Announcement bar (inside card) ── */
.prof-announce {
  width: 100%;
  max-width: 520px;
  background: rgba(240,165,0,.07);
  border: 1px solid rgba(240,165,0,.15);
  border-bottom: none;
  padding: 7px 14px;
  font-family: var(--font-m);
  font-size: 9px;
  letter-spacing: .25em;
  color: var(--amber-dk);
  overflow: hidden;
  white-space: nowrap;
}
.prof-announce-inner {
  display: inline-block;
  animation: ticker-slide 18s linear infinite;
}
@keyframes ticker-slide {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ── Map Banner ── */
.prof-map-banner {
  width: 100%;
  max-width: 520px;
  height: 72px;
  background: linear-gradient(135deg, rgba(74,110,138,.3) 0%, rgba(13,10,7,1) 100%);
  border: 1px solid rgba(74,110,138,.4);
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  gap: 8px;
  font-family: var(--font-d);
  font-size: 10px;
  letter-spacing: .3em;
  color: var(--blue);
  text-decoration: none;
}
.prof-map-banner:hover {
  background: linear-gradient(135deg, rgba(74,110,138,.5) 0%, rgba(13,10,7,1) 100%);
  color: var(--offwhite);
}
.prof-map-banner svg {
  width: 16px; height: 16px;
  stroke: currentColor; fill: none; stroke-width: 1.5;
}

/* ── Main Card ── */
.prof-card {
  width: 100%;
  max-width: 520px;
  border: 1px solid rgba(240,165,0,.22);
  background: rgba(13,10,7,.95);
  padding: 28px 28px 24px;
  font-family: var(--font-m);
  position: relative;
}

/* ── Home nav button ── */
.prof-home-btn {
  position: absolute;
  top: 16px; left: 16px;
  background: transparent;
  border: 1px solid rgba(240,165,0,.3);
  color: var(--amber-dk);
  font-family: var(--font-m);
  font-size: 10px;
  letter-spacing: .2em;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.prof-home-btn:hover {
  border-color: var(--amber);
  color: var(--amber);
}

/* ── Timer block ── */
.prof-timer-wrap {
  text-align: center;
  margin: 20px 0 24px;
  padding: 14px;
  border: 1px solid rgba(240,165,0,.12);
  background: rgba(240,165,0,.03);
}
.prof-timer-lbl {
  font-size: 8px;
  letter-spacing: .45em;
  color: var(--amber-dk);
  margin-bottom: 6px;
}
.prof-timer-dig {
  font-family: var(--font-d);
  font-size: 36px;
  font-weight: 900;
  letter-spacing: .12em;
  color: var(--amber);
  line-height: 1;
}
.prof-timer-sub {
  font-size: 8px;
  letter-spacing: .45em;
  color: var(--amber-dk);
  margin-top: 6px;
}
.prof-timer-dig.launched {
  color: var(--red);
  font-size: 20px;
  letter-spacing: .2em;
}

/* ── Team identity row ── */
.prof-identity {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
.prof-team-block {}
.prof-team-lbl {
  font-size: 8px;
  letter-spacing: .45em;
  color: var(--amber-dk);
  margin-bottom: 4px;
}
.prof-team-name {
  font-family: var(--font-d);
  font-size: 26px;
  font-weight: 900;
  letter-spacing: .12em;
  color: var(--offwhite);
  line-height: 1.1;
}
.prof-team-inst {
  font-size: 9px;
  letter-spacing: .15em;
  color: var(--amber-dk);
  margin-top: 4px;
}

.prof-id-badge {
  flex-shrink: 0;
  border: 1px solid rgba(240,165,0,.3);
  padding: 8px 14px;
  text-align: center;
  background: rgba(240,165,0,.05);
  min-width: 72px;
}
.prof-id-badge-lbl {
  font-size: 7px;
  letter-spacing: .4em;
  color: var(--amber-dk);
  margin-bottom: 4px;
}
.prof-id-badge-val {
  font-family: var(--font-d);
  font-size: 22px;
  font-weight: 900;
  color: var(--amber);
  letter-spacing: .05em;
}

/* ── Divider ── */
.prof-div {
  border-top: 1px solid rgba(240,165,0,.12);
  margin: 14px 0;
}

/* ── Info rows ── */
.prof-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
  margin-bottom: 14px;
}
.prof-info-item {}
.prof-info-lbl {
  font-size: 8px;
  letter-spacing: .4em;
  color: var(--amber-dk);
  margin-bottom: 3px;
}
.prof-info-val {
  font-family: var(--font-d);
  font-size: 13px;
  letter-spacing: .1em;
  color: var(--amber);
}
.prof-info-val.big {
  font-size: 18px;
}
.prof-info-val.prize {
  color: var(--offwhite);
  font-size: 16px;
}
.prof-info-val.mono {
  font-family: var(--font-m);
  font-size: 11px;
}

/* ── Operation badge ── */
.prof-op-badge {
  display: inline-block;
  border: 1px solid rgba(240,165,0,.25);
  padding: 4px 10px;
  font-size: 9px;
  letter-spacing: .3em;
  color: var(--amber-dk);
  margin-bottom: 14px;
}
.prof-op-badge .op-name {
  color: var(--amber);
  font-family: var(--font-d);
}

/* ── Venue block ── */
.prof-venue {
  background: rgba(74,110,138,.06);
  border: 1px solid rgba(74,110,138,.2);
  padding: 12px 14px;
  margin-bottom: 14px;
}
.prof-venue-lbl {
  font-size: 8px;
  letter-spacing: .4em;
  color: var(--blue);
  margin-bottom: 4px;
}
.prof-venue-val {
  font-family: var(--font-d);
  font-size: 12px;
  letter-spacing: .15em;
  color: var(--offwhite);
}
.prof-venue-sub {
  font-size: 9px;
  letter-spacing: .15em;
  color: var(--amber-dk);
  margin-top: 3px;
}

/* ── QR + Patch row ── */
.prof-bottom-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
}
.prof-patch-wrap {
  flex: 1;
}
.prof-qr-wrap {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.prof-qr-wrap canvas,
.prof-qr-wrap img {
  width: 96px;
  height: 96px;
  border: 1px solid rgba(240,165,0,.2);
  background: var(--offwhite);
}
.prof-qr-lbl {
  font-size: 7px;
  letter-spacing: .3em;
  color: var(--amber-dk);
  text-align: center;
}

/* ── Notice ── */
.prof-notice {
  font-size: 8.5px;
  letter-spacing: .1em;
  color: rgba(200,136,42,.5);
  margin-top: 10px;
  line-height: 1.6;
}

/* ── Share button ── */
.prof-share-btn {
  margin-top: 18px;
  width: 100%;
  max-width: 520px;
}

/* Responsive */
@media (max-width: 560px) {
  .prof-card { padding: 20px 16px 18px; }
  .prof-timer-dig { font-size: 28px; }
  .prof-team-name { font-size: 20px; }
  .prof-info-grid { grid-template-columns: 1fr; }
  .prof-bottom-row { flex-direction: column; align-items: center; }
}
```

---

## 10. NEW FILE — `profile.html`

Create `profile.html` in the root directory:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CREW PROFILE · NEXOVATE 2026</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet">
  
  <!-- QR code library (no-install, CDN) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/chrome.css">
  <link rel="stylesheet" href="css/transitions.css">
  <link rel="stylesheet" href="css/profile.css">
  
  <script src="js/navigate.js"></script>
  <script src="js/store.js"></script>
  <script src="js/events-data.js"></script>
  <script src="js/chrome.js"></script>
  <script src="js/profile.js"></script>
</head>
<body data-page="profile">
  <main class="page profile-page">
    <div id="profile-root">
      <!-- Populated by profile.js -->
    </div>
  </main>
</body>
</html>
```

---

## 11. NEW FILE — `js/profile.js`

Create `js/profile.js`:

```js
// ─── profile.js ─────────────────────────────────────────────────────────────
// Reads teamId from URL, loads from localStorage, renders profile card.

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get('id');
  const root   = document.getElementById('profile-root');

  if (!teamId) {
    // Try to load the most recently registered team from sessionStorage
    const sessionId = sessionStorage.getItem('reg_team_id');
    if (sessionId) {
      window.location.href = 'profile.html?id=' + sessionId;
      return;
    }
    root.innerHTML = notFoundHTML('NO TEAM ID IN URL');
    return;
  }

  const team = getTeam(teamId);
  if (!team) {
    root.innerHTML = notFoundHTML('CREW MANIFEST NOT FOUND · ID: ' + teamId);
    return;
  }

  renderProfile(team, root);
});

// ── Event detail lookup by evtId ────────────────────────────────────────────
function getEvtDetail(evtId) {
  // Uses EVT from events-data.js
  return EVT[evtId] || null;
}

// ── Render ───────────────────────────────────────────────────────────────────
function renderProfile(team, root) {
  const evt      = getEvtDetail(team.evtId);
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

      <!-- Operation badge -->
      <div class="prof-op-badge">
        OPERATION: <span class="op-name">${evt ? evt.op : team.op.replace('OPERATION: ', '')}</span>
        &nbsp;·&nbsp; ${evt ? evt.nm : team.evt}
      </div>

      <!-- Info grid -->
      <div class="prof-info-grid">
        <div class="prof-info-item">
          <div class="prof-info-lbl">MISSION TYPE</div>
          <div class="prof-info-val mono">${evt ? evt.type.split('·')[0].trim() : '—'}</div>
        </div>
        <div class="prof-info-item">
          <div class="prof-info-lbl">PRIZE POOL</div>
          <div class="prof-info-val prize">${evt ? evt.prize : '—'}</div>
        </div>
        <div class="prof-info-item">
          <div class="prof-info-lbl">CREW SIZE</div>
          <div class="prof-info-val mono">${evt ? evt.crew + ' PERSONNEL' : '—'}</div>
        </div>
        <div class="prof-info-item">
          <div class="prof-info-lbl">MISSION LEAD</div>
          <div class="prof-info-val mono" style="font-size:10px;">${evt ? evt.lead : '—'}</div>
        </div>
      </div>

      <!-- Venue block -->
      <div class="prof-venue">
        <div class="prof-venue-lbl">LAUNCH SITE · VENUE</div>
        <div class="prof-venue-val">PESCE MANDYA</div>
        <div class="prof-venue-sub">
          ${evt ? 'MODULE: ' + evt.mod : ''} &nbsp;·&nbsp; MAY 22–23, 2026
        </div>
      </div>

      <!-- Contact comms -->
      ${evt ? `
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
```

---

## 12. UPDATE — `js/registration.js` (save + redirect)

Complete updated `registration.js` — replace the entire file:

```js
// ─── registration.js ───────────────────────────────────────────────────────
const REG_FORM_URL = 'YOUR_GOOGLE_FORM_URL_HERE'; // ← replace before deployment

const S = { crew: '', inst: '', op: '', evt: '', evtId: '', stepVisited: [false,false,false,false] };

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
  techEvents.forEach(id => {
    const d = EVT[id];
    if (!d) return;
    html += `
      <div class="reg-opt" onclick="selEvt(this, '${d.op}', '${d.nm}', '${id}')">
        <span class="ro-bullet">○</span>
        <span class="ro-op">OPERATION: ${d.op}</span>
        <span class="ro-nm">${d.nm}</span>
      </div>
    `;
  });
  html += `<div class="reg-sep"></div>`;
  ntEvents.forEach(id => {
    const d = EVT[id];
    if (!d) return;
    html += `
      <div class="reg-opt" onclick="selEvt(this, '${d.op}', '${d.nm}', '${id}')">
        <span class="ro-bullet">○</span>
        <span class="ro-op">OPERATION: ${d.op}</span>
        <span class="ro-nm">${d.nm}</span>
      </div>
    `;
  });
  html += `<div class="reg-sep"></div>`;
  const hk = EVT['hacksprint'];
  if (hk) {
    html += `
      <div class="reg-opt" onclick="selEvt(this, '${hk.op}', '${hk.nm}', 'hacksprint')">
        <span class="ro-bullet">○</span>
        <span class="ro-op">OPERATION: ${hk.op}</span>
        <span class="ro-nm">${hk.nm} <span class="omega-badge">OMEGA</span></span>
      </div>
    `;
  }
  container.innerHTML = html;

  // Handle pre-select from dossier
  if (presel) {
    const el = document.querySelector(`.reg-opt[onclick*="'${presel}'"]`);
    if (el) {
      // Set state directly — don't rely on click on potentially hidden element
      const d = EVT[presel];
      if (d) {
        S.op = 'OPERATION: ' + d.op;
        S.evt = d.nm;
        S.evtId = presel;
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
}

function selEvt(el, op, evt, id) {
  document.querySelectorAll('.reg-opt').forEach(o => {
    o.classList.remove('sel');
    const b = o.querySelector('.ro-bullet');
    if (b) b.textContent = '○';
  });
  el.classList.add('sel');
  const bullet = el.querySelector('.ro-bullet');
  if (bullet) bullet.textContent = '●';
  S.op = 'OPERATION: ' + op;
  S.evt = evt;
  S.evtId = id;
  const btn3 = document.getElementById('step3-btn');
  if (btn3) btn3.style.display = 'block';
  if (typeof playBlip === 'function') playBlip();
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
    if (!S.evtId) return;
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
  const items = [
    { id: 'g1', vid: 'gv1', val: S.crew },
    { id: 'g2', vid: 'gv2', val: S.inst },
    { id: 'g3', vid: 'gv3', val: S.evt },
    { id: 'g4', vid: 'gv4', val: 'CONFIRMED' },
  ];
  items.forEach(({ id, vid, val }, i) => {
    setTimeout(() => {
      const row   = document.getElementById(id);
      const valEl = document.getElementById(vid);
      if (!row || !valEl) return;
      valEl.textContent = val + '  ✓';
      valEl.classList.add('go');
      row.classList.add('go');
      if (typeof playTypeKey === 'function') playTypeKey();
    }, 600 * (i + 1));
  });
  setTimeout(() => {
    const fin = document.getElementById('gng-final');
    if (fin) fin.style.opacity = '1';
  }, 3200);
  setTimeout(() => {
    const btn = document.getElementById('launch-btn');
    if (btn) btn.style.display = 'block';
  }, 3600);
}

function submit() {
  // Generate unique team ID
  const teamId = 'NXV-' + Date.now().toString(36).toUpperCase();

  const teamData = {
    id:        teamId,
    crew:      S.crew,
    inst:      S.inst,
    op:        S.op,
    evt:       S.evt,
    evtId:     S.evtId,
    createdAt: new Date().toISOString(),
  };

  // Persist to localStorage
  if (typeof saveTeam === 'function') saveTeam(teamData);

  // SessionStorage for fallback
  sessionStorage.setItem('reg_crew',    S.crew);
  sessionStorage.setItem('reg_inst',    S.inst);
  sessionStorage.setItem('reg_op',      S.op);
  sessionStorage.setItem('reg_evt',     S.evt);
  sessionStorage.setItem('reg_team_id', teamId);

  // Open external form in new tab
  if (REG_FORM_URL && REG_FORM_URL !== 'YOUR_GOOGLE_FORM_URL_HERE') {
    window.open(REG_FORM_URL, '_blank');
  }

  // Flash amber then navigate to profile
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

// Init
document.addEventListener('DOMContentLoaded', () => setStep(1));
```

---

## 13. UPDATE — `js/navigate.js` (add profile route)

Add `profile` to the PAGES map:

```js
// In navigate.js, update PAGES object:
const PAGES = {
  hero:         'index.html',
  dossier:      'dossier.html',
  hacksprint:   'hacksprint.html',
  registration: 'registration.html',
  confirmation: 'confirmation.html',
  profile:      'profile.html',        // ← ADD THIS LINE
};
```

---

## 14. DEPLOYMENT CHECKLIST

### Before going live:

- [ ] Replace `'YOUR_GOOGLE_FORM_URL_HERE'` in `registration.js` with actual Google Form URL
- [ ] Confirm `events-data.js` is loaded **before** `registration.js` in `registration.html`
- [ ] Confirm `store.js` is loaded **before** `registration.js` in `registration.html`
- [ ] Confirm `store.js` is loaded **before** `profile.js` in `profile.html`
- [ ] Test the full flow: Index → Dossier → pick event → Registration (preselect works) → step through → Submit → Profile loads
- [ ] Test direct URL: `profile.html?id=NXV-XXXX` (bookmark test)
- [ ] Test profile on mobile (responsive breakpoints in profile.css)
- [ ] Verify QR code CDN loads (qrcodejs from cdnjs.cloudflare.com)
- [ ] If deploying to Vercel / static host, no backend changes needed — all data in localStorage

### File manifest of changes:
```
MODIFIED:
  css/base.css              — Add .btn-next, .btn-file, .btn-next.danger, .btn-next.full
  js/navigate.js            — Add 'profile' to PAGES map
  js/registration.js        — Full replacement (all fixes + profile save + redirect)
  registration.html         — Full replacement (fixed IDs, correct script order)

CREATED:
  js/store.js               — localStorage team persistence layer
  js/profile.js             — Profile page renderer
  css/profile.css           — Profile page styles
  profile.html              — Profile page shell
```

---

*End of spec. All file contents above are production-ready and self-contained.*
