# NEXOVATE V5 — FULL CHANGE SPECIFICATION
> Feed this file to Gemini along with the `nexovate_fixed` project folder.  
> All file paths are relative to the project root (`nexovate_fixed/`).  
> Make **every** change listed. Do not skip sections.

---

## 0. STARTING STATE

The base project is the folder `nexovate_fixed` (from `Reference/Nexovate_v5_responsive/nexovate_fixed`).  
Delete all old Nexovate files on the server and replace with the contents of `nexovate_fixed` before making any of the changes below.

---

## 1. REMOVE HACKSPRINT SPECIAL PAGE

### 1a. Delete `hacksprint.html`
Remove the file entirely. There is no longer a dedicated HackSprint page.

### 1b. Update `js/chrome.js` — nav items
In the `navItems` array, remove the `hacksprint` entry:
```js
// REMOVE this line:
{ key: 'hacksprint', lbl: 'REACTOR', url: 'hacksprint.html' },
```
The nav should now only have: `hero`, `dossier`, `registration`.  
Update the mobile-nav prev/next logic accordingly (it auto-derives from the array, so just removing the entry is enough).

### 1c. Update `js/schematic.js` — HackSprint module click
The `regFor(id)` function in `schematic.js` already pre-selects the event in registration via `sessionStorage`. No change needed — HackSprint clicking its module in the dossier will now correctly go to `registration.html` with `hacksprint` pre-selected, same as every other event. 

Confirm the function looks like this (do not change):
```js
function regFor(id) {
  sessionStorage.setItem('preselect', id);
  navigate('registration');
}
```

---

## 2. DOSSIER PAGE — BUTTON CHANGES

### 2a. Remove "SUBMIT CREW MANIFEST" button from file panel
File: `js/schematic.js`

Find and **delete** this line inside the `showFile(id)` function:
```js
<button class="btn btn-file" onclick="regFor('${id}')">SUBMIT CREW MANIFEST</button>
```
The file panel should end at the `STATUS: ACCEPTING CREW APPLICATIONS` line with no button below it.

### 2b. Replace the footer button in `dossier.html`
File: `dossier.html`

Find the `<div class="dossier-footer">` block:
```html
<div class="dossier-footer">
  <button class="btn btn-primary" onclick="navigate('hacksprint.html')">PROCEED TO OPERATION IGNITION ›</button>
</div>
```

Replace it with:
```html
<div class="dossier-footer">
  <button class="btn btn-primary" onclick="navigate('registration.html')">
    PROCEED TO OPERATION JANUS ›
    <span class="btn-subtitle">CHOOSING YOUR COMPETITION</span>
  </button>
</div>
```

### 2c. Add `.btn-subtitle` style
File: `css/base.css` — add at the end:
```css
.btn-subtitle {
  display: block;
  font-size: 8px;
  letter-spacing: .35em;
  opacity: 0.7;
  margin-top: 3px;
  font-family: var(--font-m);
  text-transform: uppercase;
}
```

---

## 3. REGISTRATION — STEP 3 EVENT LIST

### 3a. Add two new fields to registration — Step 1
File: `registration.html`

In Step 1 (`id="rs1"`), after the crew name input field, add two more input fields for Team Lead Name and Contact Number. The step should now collect 3 fields before advancing.

Add after the crew name `<input>` block:
```html
<div class="fp-lbl">TEAM LEAD NAME</div>
<input id="inp-lead" class="reg-input" type="text" autocomplete="name"
  placeholder="FULL NAME OF TEAM LEAD"
  oninput="clearErr(this)" onkeydown="if(event.key==='Enter')nxt(1)">

<div class="fp-lbl">CONTACT NUMBER</div>
<input id="inp-phone" class="reg-input" type="tel" autocomplete="tel"
  placeholder="10-DIGIT MOBILE NUMBER"
  oninput="clearErr(this)" onkeydown="if(event.key==='Enter')nxt(1)">
```

### 3b. Update `js/registration.js` — capture new fields

**Add to the `S` state object:**
```js
const S = {
  crew:   '',
  lead:   '',   // ← NEW: team lead name
  phone:  '',   // ← NEW: contact number
  inst:   '',
  events: [],
  stepVisited: [false, false, false, false],
  gngTimers: []
};
```

**Update the `nxt(1)` block** to also validate and capture lead + phone:
```js
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
}
```

**Update `runGoNoGo()`** — add lead and phone to the GO/NO-GO checklist items:
```js
const items = [
  { id: 'g1', vid: 'gv1', val: S.crew },
  { id: 'g2', vid: 'gv2', val: S.lead },   // ← NEW
  { id: 'g3', vid: 'gv3', val: S.phone },  // ← NEW
  { id: 'g4', vid: 'gv4', val: S.inst },
  { id: 'g5', vid: 'gv5', val: evtSummary || '—' },
  { id: 'g6', vid: 'gv6', val: 'CONFIRMED' },
];
```

Update `registration.html` Step 4 (GO/NO-GO list) to include matching rows for `g2`/`gv2` (TEAM LEAD) and `g3`/`gv3` (CONTACT) — following the exact same HTML pattern as the existing rows.

**Update `submit()` function** to include the new fields in `teamData`:
```js
const teamData = {
  id:        teamId,
  crew:      S.crew,
  lead:      S.lead,    // ← NEW
  phone:     S.phone,   // ← NEW
  inst:      S.inst,
  events:    S.events,
  op:        S.events[0]?.op || '',
  evt:       S.events[0]?.evt || '',
  evtId:     S.events[0]?.evtId || '',
  createdAt: new Date().toISOString(),
};
```

### 3c. Step 3 event list — show competition name highlighted, remove "OPERATION:" prefix

File: `js/registration.js` — inside `buildEvtList()`, change the `html` template for each event option.

**BEFORE (current):**
```js
html += `
  <div class="reg-opt" onclick="selEvt(this, '${d.op}', '${d.nm}', '${id}')">
    <span class="ro-bullet">○</span>
    <span class="ro-op">OPERATION: ${d.op}</span>
    <span class="ro-nm">${d.nm}</span>
  </div>
`;
```

**AFTER (new):**
```js
html += `
  <div class="reg-opt" onclick="selEvt(this, '${d.op}', '${d.nm}', '${id}')">
    <span class="ro-bullet">○</span>
    <span class="ro-nm-hi">${d.nm}</span>
  </div>
`;
```

Apply this change to **all three** event loops (techEvents, ntEvents, and the hacksprint entry). For the hacksprint entry specifically:
```js
html += `
  <div class="reg-opt" onclick="selEvt(this, '${hk.op}', '${hk.nm}', 'hacksprint')">
    <span class="ro-bullet">○</span>
    <span class="ro-nm-hi">${hk.nm} <span class="omega-badge">OMEGA</span></span>
  </div>
`;
```

**Add `.ro-nm-hi` style** to `css/registration.css`:
```css
.ro-nm-hi {
  font-family: var(--font-d);
  font-size: 12px;
  letter-spacing: .16em;
  color: var(--offwhite);
  flex: 1;
}
.reg-opt.sel .ro-nm-hi {
  color: var(--amber);
}
```

---

## 4. GOOGLE SHEETS INTEGRATION

When a team completes registration and `submit()` is called, their data must be written to the Google Sheet at:  
**`https://docs.google.com/spreadsheets/d/1lqpoLwfLfSRaSujb1KhWA19ZFk6RDxg1EoU48djLEck/edit?gid=1345111312`**

The sheet has one tab per event with these columns: `#`, `TEAM NAME`, `TEAM LEAD NAME`, `CONTACT NUMBER`, `EMAIL ADDRESS`.

**Implementation approach — Google Apps Script Web App:**

### 4a. Create `js/sheets.js` (new file)

```js
// ─── sheets.js ──────────────────────────────────────────────────────────────
// Sends registration data to Google Sheets via a deployed Apps Script Web App.
// Replace SHEETS_WEBHOOK_URL with your deployed Apps Script URL before launch.

const SHEETS_WEBHOOK_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

/**
 * Posts team registration data to Google Sheets.
 * @param {Object} teamData - the full teamData object from submit()
 * @param {string} email    - logged-in user's email from getSession()
 */
async function postToSheets(teamData, email) {
  if (!SHEETS_WEBHOOK_URL || SHEETS_WEBHOOK_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') {
    console.warn('[sheets.js] SHEETS_WEBHOOK_URL not set — skipping Google Sheets sync.');
    return;
  }

  const rows = teamData.events.map(evt => ({
    eventId:   evt.evtId,           // e.g. 'roborace'
    eventName: evt.evt,             // e.g. 'ROBO RACE'
    teamName:  teamData.crew,
    leadName:  teamData.lead,
    phone:     teamData.phone,
    email:     email || '',
    inst:      teamData.inst,
    teamId:    teamData.id,
    createdAt: teamData.createdAt,
  }));

  try {
    await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',              // Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows }),
    });
  } catch (err) {
    console.error('[sheets.js] Failed to post to Google Sheets:', err);
  }
}
```

### 4b. Add `<script>` tag in `registration.html`
Add before the closing `</body>` tag (after other scripts):
```html
<script src="js/sheets.js"></script>
```

### 4c. Call `postToSheets` inside `submit()` in `js/registration.js`
After `saveTeam(teamData)` and after resolving the session email, add:
```js
const sessionEmail = getSession();
if (typeof postToSheets === 'function') {
  postToSheets(teamData, sessionEmail || '');
}
```

### 4d. Google Apps Script to deploy (give this to the project owner)

Create a new Google Apps Script project attached to the spreadsheet and paste:

```javascript
// Google Apps Script — deploy as Web App (Anyone, even anonymous)
// Paste this into the Apps Script editor at script.google.com

const SPREADSHEET_ID = '1lqpoLwfLfSRaSujb1KhWA19ZFk6RDxg1EoU48djLEck';

// Maps evtId keys to the exact sheet tab name in the spreadsheet
const EVT_SHEET_MAP = {
  roborace:      'EVENT 01 — ROBO RACE (IRONCLAD)',
  robosoccer:    'EVENT 02 — ROBO SOCCER (GRIDLOCK)',
  robosumo:      'EVENT 03 — ROBO SUMO (IMMOVABLE)',
  linefollower:  'EVENT 04 — LINE FOLLOWER (THREADLINE)',
  maze:          'EVENT 05 — MAZE (LABYRINTH)',
  hacksprint:    'EVENT 06 — HACKSPRINT (CORE)',
  brandrumbling: 'EVENT 07 — BRAND RUMBLE (SIGNAL)',
  sharktank:     'EVENT 08 — SHARK TANK (PITCH)',
  iqwars:        'EVENT 09 — IQ WARS 2.0 (GREY MATTER)',
  waterrocket:   'EVENT 10 — WATER ROCKET (APOGEE)',
};

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    payload.rows.forEach(row => {
      const sheetName = EVT_SHEET_MAP[row.eventId];
      if (!sheetName) return;

      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) return;

      // Find next empty row after header (row 2 onwards)
      const lastRow = Math.max(sheet.getLastRow(), 2);
      const rowNum  = lastRow + 1 - 1; // sequential # (1-based, minus header)

      sheet.appendRow([
        rowNum,            // #
        row.teamName,      // TEAM NAME
        row.leadName,      // TEAM LEAD NAME
        row.phone,         // CONTACT NUMBER
        row.email,         // EMAIL ADDRESS
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Required for CORS preflight
function doGet(e) {
  return ContentService.createTextOutput('Nexovate Sheets Webhook active.');
}
```

**Deployment steps:**
1. Open the Google Sheet → Extensions → Apps Script
2. Paste the script above
3. Click Deploy → New deployment → Web App
4. Set "Execute as" = **Me**, "Who has access" = **Anyone**
5. Copy the Web App URL
6. Paste it into `js/sheets.js` as the value of `SHEETS_WEBHOOK_URL`

---

## 5. PROFILE PAGE — FULL REDESIGN

All changes are in `js/profile.js` (the HTML is rendered by JS) and `css/profile.css`.

### 5a. Fix the announcement strip

**Problem:** The `.prof-announce` scrolling text is wrapping into a multi-line block instead of staying in a single horizontal strip.

**Fix in `css/profile.css`** — ensure these styles exist for `.prof-announce`:
```css
.prof-announce {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  background: rgba(13,10,7,0.97);
  border-top: 1px solid rgba(200,136,42,0.3);
  border-bottom: 1px solid rgba(200,136,42,0.3);
  padding: 6px 0;
  margin-bottom: 0;
  font-size: 9px;
  letter-spacing: .22em;
  color: var(--amber-dk);
  font-family: var(--font-m);
}

.prof-announce-inner {
  display: inline-block;
  white-space: nowrap;
  animation: prof-tick 40s linear infinite;
}

@keyframes prof-tick {
  from { transform: translateX(100vw); }
  to   { transform: translateX(-100%); }
}
```

### 5b. Make the map link smaller

**In `css/profile.css`**, find `.prof-map-banner` and reduce it:
```css
.prof-map-banner {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 8px;
  letter-spacing: .25em;
  color: var(--blue);
  text-decoration: none;
  padding: 5px 10px;
  border: 1px solid rgba(74,110,138,0.3);
  margin: 8px 0 12px;
  font-family: var(--font-m);
  align-self: flex-start;      /* don't stretch full width */
}

.prof-map-banner svg {
  width: 10px;
  height: 10px;
  stroke: var(--blue);
  fill: none;
  stroke-width: 2;
  flex-shrink: 0;
}

.prof-map-banner:hover {
  color: var(--offwhite);
  border-color: rgba(74,110,138,0.6);
}
```

In `js/profile.js`, confirm the map banner renders inside a `<div style="text-align:left">` or similar wrapper that keeps it left-aligned and small — not stretching full width.

### 5c. Crew number beside crew name (parallel layout)

**In `css/profile.css`**, the `.prof-identity` block must be a flex row:
```css
.prof-identity {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.prof-team-block {
  flex: 1;
  min-width: 0;   /* prevent overflow */
}

.prof-team-name {
  font-family: var(--font-d);
  font-size: clamp(28px, 8vw, 56px);
  font-weight: 900;
  color: var(--offwhite);
  line-height: 1;
  text-transform: uppercase;
  word-break: break-word;
  margin: 4px 0;
}

.prof-team-inst {
  font-size: 9px;
  letter-spacing: .22em;
  color: var(--amber-dk);
  margin-top: 6px;
}

.prof-team-lbl {
  font-size: 8px;
  letter-spacing: .4em;
  color: var(--amber-dk);
}

.prof-id-badge {
  border: 1px solid var(--amber-dk);
  padding: 10px 14px;
  text-align: center;
  flex-shrink: 0;
  min-width: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.prof-id-badge-lbl {
  font-size: 7px;
  letter-spacing: .3em;
  color: var(--amber-dk);
  margin-bottom: 4px;
}

.prof-id-badge-val {
  font-family: var(--font-d);
  font-size: 28px;
  font-weight: 700;
  color: var(--amber);
  line-height: 1;
}
```

### 5d. Fix QR code — remove amber border/background

**Problem:** The `#prof-qr` element has `padding: 8px; background: var(--amber)` which creates a thick amber box around the QR code.

**In `css/profile.css`**, update `#prof-qr`:
```css
#prof-qr {
  width: 96px;
  height: 96px;
  background: var(--offwhite);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#prof-qr img,
#prof-qr canvas {
  width: 88px !important;
  height: 88px !important;
  display: block;
}
```

This keeps the QR readable on white without the thick amber frame.

### 5e. Fix HOME and LOGOUT buttons aesthetic

**In `css/profile.css`**, update `.prof-home-btn` and `.prof-logout-btn`:
```css
.prof-home-btn,
.prof-logout-btn {
  position: absolute;
  top: 16px;
  font-family: var(--font-d);
  font-size: 9px;
  letter-spacing: .24em;
  color: var(--bg);
  background: var(--amber);
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
  text-transform: uppercase;
  transition: background 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.prof-home-btn  { left: 16px; }
.prof-logout-btn { right: 16px; }

.prof-home-btn:hover,
.prof-logout-btn:hover {
  background: var(--offwhite);
}
```

Also update the **Share Profile** button (`.prof-share-btn`) to match:
```css
.prof-share-btn {
  display: block;
  width: 100%;
  margin-top: 20px;
  font-size: 11px;
  padding: 14px 20px;
  letter-spacing: .24em;
}
```
The `btn-next` base class already handles clip-path and amber bg, so `.prof-share-btn` only needs the above overrides.

### 5f. Add PAYMENT button

**In `js/profile.js`**, in the `renderProfile()` function, add this block **after** the `.prof-notice` disclaimer div and **before** the closing `</div>` of `.prof-card`:

```js
<!-- Payment CTA -->
<div class="prof-payment-wrap">
  <div class="prof-payment-lbl">ACTION REQUIRED</div>
  <button class="btn prof-payment-btn" onclick="window.open('PAYMENT_FORM_URL_HERE', '_blank', 'noopener,noreferrer')">
    ₹ COMPLETE PAYMENT
    <span class="btn-subtitle">CLICK TO PAY ENTRANCE FEE</span>
  </button>
  <div class="prof-payment-note">REGISTRATION IS ONLY CONFIRMED AFTER PAYMENT IS RECEIVED</div>
</div>
```

Replace `'PAYMENT_FORM_URL_HERE'` with the Google Form link when available.

**In `css/profile.css`**, add:
```css
.prof-payment-wrap {
  margin-top: 28px;
  text-align: center;
}

.prof-payment-lbl {
  font-size: 8px;
  letter-spacing: .45em;
  color: var(--red);
  margin-bottom: 10px;
  animation: blink-lbl 1.4s step-end infinite;
}

@keyframes blink-lbl {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

.prof-payment-btn {
  font-family: var(--font-d);
  font-size: 14px;
  letter-spacing: .28em;
  color: var(--bg);
  background: var(--amber);
  border: 2px solid var(--red);
  padding: 18px 40px;
  width: 100%;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 0 0 0 3px rgba(192,57,43,.3), 0 0 28px rgba(240,165,0,.25);
  animation: payment-pulse 1.8s ease-in-out infinite;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.prof-payment-btn:hover,
.prof-payment-btn:active {
  background: var(--offwhite);
  animation: none;
}

@keyframes payment-pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(192,57,43,.3), 0 0 20px rgba(240,165,0,.2); }
  50%       { box-shadow: 0 0 0 4px rgba(192,57,43,.5), 0 0 40px rgba(240,165,0,.5); }
}

.prof-payment-note {
  font-size: 8px;
  letter-spacing: .2em;
  color: var(--amber-dk);
  margin-top: 10px;
  opacity: 0.8;
}
```

---

## 6. NAVIGATION — REMOVE HACKSPRINT REFERENCES

### 6a. `js/navigate.js`
If the `navigate()` function has any hardcoded reference to `hacksprint`, remove it. The page simply no longer exists.

### 6b. All other HTML files
Search all `.html` files for any `href="hacksprint.html"` or `navigate('hacksprint')` and either remove the link or redirect to `registration.html`.

---

## 7. SUMMARY OF FILES CHANGED

| File | Change |
|---|---|
| `hacksprint.html` | **DELETED** |
| `dossier.html` | Footer button replaced |
| `js/schematic.js` | Remove "SUBMIT CREW MANIFEST" button from file panel |
| `js/chrome.js` | Remove hacksprint from navItems array |
| `js/registration.js` | Add lead/phone fields; step 3 event labels; call postToSheets |
| `js/sheets.js` | **NEW FILE** — Google Sheets webhook |
| `js/store.js` | `saveTeam()` — teamData now includes `lead` and `phone` |
| `registration.html` | Add inp-lead, inp-phone inputs; update GO/NO-GO rows |
| `css/base.css` | Add `.btn-subtitle` style |
| `css/registration.css` | Add `.ro-nm-hi` style |
| `css/profile.css` | Full profile layout overhaul (announce strip, map, identity, QR, buttons, payment) |
| `js/profile.js` | Add payment button block; confirm map banner is small |
| `profile.html` | No HTML changes needed (all rendered by profile.js) |

---

## 8. VARIABLES TO FILL IN AFTER DEPLOYMENT

| Variable | Location | Value |
|---|---|---|
| `SHEETS_WEBHOOK_URL` | `js/sheets.js` line 5 | Apps Script Web App URL (after deploying the script in §4d) |
| `PAYMENT_FORM_URL_HERE` | `js/profile.js` payment button onclick | Google Form URL (provided by project owner) |

---

## 9. NOTES FOR GEMINI

- **Do not change** the Supabase config, auth flow, QR library, or font imports.
- **Do not change** the visual aesthetic — amber/dark amber/off-white palette, Orbitron + IBM Plex Mono fonts, clip-path buttons. All new elements must follow this design language.
- The `navigate()` function in `js/navigate.js` accepts either a full filename (`'registration.html'`) or a page key (`'registration'`). Both work.
- The Google Sheets `fetch` uses `mode: 'no-cors'` because Apps Script CORS headers are inconsistent. This means the response cannot be read, but the write still succeeds.
- The `postToSheets` call in `submit()` is fire-and-forget (async, not awaited) so it never blocks navigation to the profile page.
- Keep all existing `store.js` / Supabase sync logic — the Sheets write is an **additional** sync, not a replacement.
