import os

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

# Get the SVG from Reference/index.html
ref_index = read_file('Reference/index.html')
# We know the SVG starts at <svg id="sch-svg" and ends at </svg> after <!-- Legend -->
start_idx = ref_index.find('<svg id="sch-svg"')
end_idx = ref_index.find('</svg>', start_idx) + 6
schematic_svg = ref_index[start_idx:end_idx]


HEAD_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{TITLE} · NEXOVATE 2026</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/chrome.css">
  <link rel="stylesheet" href="css/transitions.css">
  <link rel="stylesheet" href="{PAGE_CSS}">
  
  <script src="js/navigate.js"></script>
  <script src="js/chrome.js"></script>
{PAGE_JS}
</head>
<body data-page="{PAGE_ID}">
  <main class="page">
{BODY}
  </main>
{INLINE_SCRIPT}
</body>
</html>
"""

def make_page(filename, title, page_id, page_css, page_js, body, inline_script=""):
    content = HEAD_TEMPLATE.format(
        TITLE=title,
        PAGE_ID=page_id,
        PAGE_CSS=page_css,
        PAGE_JS=page_js,
        BODY=body,
        INLINE_SCRIPT=inline_script
    )
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

# --- index.html ---
hero_body = """    <div id="hero-content">
      <div id="patch-wrap">
        <!-- SVG Mission Patch -->
        <svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
            <circle cx="110" cy="110" r="106" fill="none" stroke="#C8882A" stroke-width="1" stroke-dasharray="8,4" />
            <circle cx="110" cy="110" r="98" fill="#0D0A07" />
            <circle cx="110" cy="110" r="98" fill="none" stroke="#F0A500" stroke-width="2" />
            <circle cx="110" cy="110" r="90" fill="none" stroke="#C8882A" stroke-width="0.5" />
            <g fill="#F0A500" opacity="0.6">
                <circle cx="35" cy="75" r="1.5" />
                <circle cx="55" cy="45" r="1" />
                <circle cx="85" cy="30" r="1.5" />
                <circle cx="185" cy="75" r="1.5" />
                <circle cx="165" cy="45" r="1" />
                <circle cx="135" cy="30" r="1.5" />
                <circle cx="30" cy="130" r="1" />
                <circle cx="190" cy="130" r="1" />
            </g>
            <path d="M 60,165 L 110,35 L 160,165 Z" fill="none" stroke="#F0A500" stroke-width="2" />
            <path d="M 75,125 L 145,125" stroke="#F0A500" stroke-width="1.5" />
            <rect x="98" y="98" width="24" height="24" fill="rgba(240,165,0,0.15)" stroke="#F0A500" stroke-width="1.5" />
            <circle cx="110" cy="110" r="4" fill="#F0A500" />
            <path d="M 35,110 A 75,75 0 0,0 185,110" fill="none" stroke="#4A6E8A" stroke-width="1" stroke-dasharray="4,4" />
        </svg>
      </div>

      <div class="classify">INTERCOLLEGIATE TECHNICAL FEST &nbsp;&middot;&nbsp; CLUB ENNOVATE &nbsp;&middot;&nbsp; 2026</div>

      <h1 class="ttl" style="font-size:38px; margin-bottom:12px;">
        <span class="amber">NEXOVATE</span><br>
        <span class="dim">MISSION CONTROL</span>
      </h1>

      <p class="hero-sub">
        <span>MAY 22–23, 2026</span> &nbsp;&middot;&nbsp; PESCE MANDYA LAUNCH SITE<br>
        PRIZE MANIFEST: <span>₹2,00,000</span> &nbsp;&middot;&nbsp; <span>10</span> ACTIVE OPERATIONS
      </p>

      <button class="btn btn-primary" onclick="navigate('dossier.html')">INITIATE MISSION BRIEFING</button>

      <div class="hero-footer">
        10 OPERATIONS &nbsp;&middot;&nbsp; ₹2,00,000 PRIZE MANIFEST &nbsp;&middot;&nbsp; HACKSPRINT 6.0 &nbsp;&middot;&nbsp; 24HRS
      </div>
    </div>"""

make_page(
    'index.html',
    title='LAUNCH CONTROL',
    page_id='hero',
    page_css='css/hero.css',
    page_js='',
    body=hero_body
)

# --- dossier.html ---
dossier_body = """    <div class="dossier-hdr">
      <span class="section-lbl">NEXOVATE 2026 · OPERATION OVERVIEW</span>
      <div class="section-ttl">MISSION DOSSIER</div>
      <p>SELECT A MODULE ON THE SCHEMATIC TO ACCESS MISSION FILE</p>
    </div>

    <div class="dossier-grid">
      <!-- SCHEMATIC -->
      <div class="sch-panel">
        <span class="sch-lbl">NEXOVATE ORBITAL STATION · REF: NXV-2026-ALPHA · ALL MODULES CLICKABLE</span>
        """ + schematic_svg + """
      </div>
      
      <!-- FILE PANEL -->
      <div class="file-panel" id="file-panel">
        <div class="fp-placeholder">
          <pre>┌─────────────────┐
│  SELECT MODULE  │
│  ON SCHEMATIC   │
└─────────────────┘</pre>
          <div>CLICK ANY MODULE TO<br>ACCESS MISSION FILE<span style="animation:blink 1s step-end infinite;display:inline-block">_</span></div>
        </div>
      </div>
    </div>
    
    <div class="dossier-footer">
      <button class="btn btn-primary" onclick="navigate('hacksprint.html')">PROCEED TO OPERATION IGNITION ›</button>
    </div>"""

make_page(
    'dossier.html',
    title='MISSION DOSSIER',
    page_id='dossier',
    page_css='css/dossier.css',
    page_js='  <script src="js/events-data.js"></script>\n  <script src="js/schematic.js"></script>',
    body=dossier_body,
    inline_script='<style>@keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }</style>'
)

# --- hacksprint.html ---
hacksprint_body = """    <div class="tx-block" id="tx-block">
      <span class="tx-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
      <span class="tx-line">MISSION CONTROL TO ALL STATIONS.</span>
      <span class="tx-line">THIS IS A PRIORITY TRANSMISSION.</span>
      <span class="tx-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
      <span class="tx-line">OPERATION: IGNITION IS NOW ACTIVE.</span>
      <span class="tx-line">CLASSIFICATION: OMEGA LEVEL · 24 HOURS CONTINUOUS.</span>
      <span class="tx-line">THIS IS NOT A DRILL.</span>
    </div>

    <div class="hack-brief" id="hack-brief">
      <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <div class="fp-op">HACKSPRINT 6.0</div>
      <div style="font-size:9px;letter-spacing:.3em;color:var(--amber-dk);margin-bottom:14px;">OPERATION: IGNITION · OMEGA CLEARANCE</div>
      <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <br>
      <span class="fp-lbl">MISSION CLASS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="fp-val">OMEGA · UNRESTRICTED</span><br>
      <span class="fp-lbl">DURATION &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="fp-val">24 HOURS CONTINUOUS OPERATION</span><br>
      <span class="fp-lbl">CREW REQUIREMENT &nbsp;</span><span class="fp-val">3 – 4 PERSONNEL</span><br>
      <span class="fp-lbl">MISSION VALUE &nbsp;&nbsp;&nbsp;&nbsp;</span><span class="fp-prize">₹60,000</span><br>
      <br>
      <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <br>
      <div style="font-size:9px;letter-spacing:.3em;color:var(--amber-dk);margin-bottom:8px;">ACTIVE MISSION DOMAINS:</div>
      <div class="hack-domain">DOMAIN A · ARTIFICIAL INTELLIGENCE</div>
      <div class="hack-domain">DOMAIN B · AGRICULTURE & HEALTHCARE TECHNOLOGY</div>
      <div class="hack-domain">DOMAIN C · INTERNET OF THINGS</div>
      <br>
      <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <br>
      <div style="font-size:9px;letter-spacing:.3em;color:var(--amber-dk);margin-bottom:8px;">MISSION PHASES:</div>
      <div class="hack-phase-row"><span>PHASE 1 — PROBLEM ACQUISITION</span><span>[0–2 HRS]</span></div>
      <div class="hack-phase-row"><span>PHASE 2 — SYSTEMS DEVELOPMENT</span><span>[2–20 HRS]</span></div>
      <div class="hack-phase-row"><span>PHASE 3 — MISSION PRESENTATION</span><span>[20–24 HRS]</span></div>
      <br>
      <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      <br>
      <span class="fp-lbl">MISSION LEADS &nbsp;</span><span class="fp-val">SONAL H · ASHWIN S</span><br>
      <span class="fp-lbl">COMMS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="fp-val">9591787616 · 8951728170</span>
      <br>
      <button class="btn btn-omega" onclick="regFor('OPERATION: IGNITION','HACKSPRINT 6.0')">
        INITIATE CREW REGISTRATION · OPERATION IGNITION
      </button>
    </div>"""

hacksprint_js = """<script>
  function regFor(op, evt) {
    sessionStorage.setItem('reg_op', op);
    sessionStorage.setItem('reg_evt', evt);
    navigate('registration.html');
  }
</script>"""

make_page(
    'hacksprint.html',
    title='OPERATION IGNITION',
    page_id='hacksprint',
    page_css='css/hacksprint.css',
    page_js='',
    body=hacksprint_body,
    inline_script=hacksprint_js
)

# --- registration.html ---
registration_body = """    <div class="reg-wrap">
      <div style="text-align:center;margin-bottom:44px;">
        <span class="section-lbl">CREW ASSIGNMENT PROTOCOL</span>
        <div class="section-ttl">CREW MANIFEST</div>
      </div>

      <!-- Step 1 -->
      <div class="reg-step on" id="rs1">
        <div class="step-ind">STEP 01 OF 04 &nbsp;·&nbsp; CREW DESIGNATION</div>
        <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <br>
        <div class="reg-prompt">MISSION CONTROL: PLEASE CONFIRM CREW DESIGNATION.<br>THIS IS THE IDENTIFIER BY WHICH YOUR TEAM WILL BE<br>LOGGED IN THE OFFICIAL MISSION MANIFEST.</div>
        <div class="fp-lbl">CREW DESIGNATION:</div>
        <input class="reg-input" id="inp-crew" type="text" placeholder="ENTER TEAM NAME" autocomplete="off" />
        <br><br>
        <button class="btn btn-next" onclick="nxt(1)">CONFIRM DESIGNATION ›</button>
      </div>

      <!-- Step 2 -->
      <div class="reg-step" id="rs2">
        <div class="step-ind">STEP 02 OF 04 &nbsp;·&nbsp; LAUNCH SITE</div>
        <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <br>
        <div class="reg-prompt">MISSION CONTROL: CONFIRM LAUNCH SITE.<br>YOUR INSTITUTION OF ORIGIN FOR MISSION RECORDS.</div>
        <div class="fp-lbl">LAUNCH SITE (INSTITUTION):</div>
        <input class="reg-input" id="inp-inst" type="text" placeholder="ENTER COLLEGE / INSTITUTION" autocomplete="off" />
        <br><br>
        <button class="btn btn-next" onclick="nxt(2)">CONFIRM LAUNCH SITE ›</button>
      </div>

      <!-- Step 3 -->
      <div class="reg-step" id="rs3">
        <div class="step-ind">STEP 03 OF 04 &nbsp;·&nbsp; MISSION ASSIGNMENT</div>
        <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <br>
        <div class="reg-prompt">MISSION CONTROL: SELECT PRIMARY MISSION.</div>
        <div class="reg-opts" id="reg-opts">
          <!-- Populated by JS -->
        </div>
        <button class="btn btn-next" onclick="nxt(3)">CONFIRM MISSION ›</button>
      </div>

      <!-- Step 4 -->
      <div class="reg-step" id="rs4">
        <div class="step-ind">STEP 04 OF 04 &nbsp;·&nbsp; PRE-LAUNCH GO/NO-GO POLL</div>
        <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <br>
        <div class="reg-prompt">MISSION CONTROL: CONDUCTING PRE-LAUNCH GO/NO-GO POLL.<br>ALL STATIONS CONFIRM STATUS.</div>
        <div class="gng-item" id="g1"><span class="gng-lbl">CREW DESIGNATION &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="gng-status">GO ✓</span></div>
        <div class="gng-item" id="g2"><span class="gng-lbl">LAUNCH SITE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="gng-status">GO ✓</span></div>
        <div class="gng-item" id="g3"><span class="gng-lbl">MISSION ASSIGNMENT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="gng-status">GO ✓</span></div>
        <div class="gng-item" id="g4"><span class="gng-lbl">TEAM READINESS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="gng-status">GO ✓</span></div>
        <div id="gng-final">ALL STATIONS: GO FOR LAUNCH.</div>
        <button class="btn btn-next full danger" id="launch-btn" style="display:none;" onclick="submit()">
          LAUNCH CONFIRMED · COMMIT TO MISSION
        </button>
      </div>
    </div>"""

make_page(
    'registration.html',
    title='CREW REGISTRATION',
    page_id='registration',
    page_css='css/registration.css',
    page_js='  <script src="js/events-data.js"></script>\n  <script src="js/registration.js"></script>',
    body=registration_body
)

# --- confirmation.html ---
confirmation_body = """    <div id="conf-patch">
      <!-- Generated by JS -->
    </div>
    <div class="conf-accepted">CREW MANIFEST ACCEPTED.</div>
    <div class="conf-crew" id="conf-crew">
      <!-- Generated by JS -->
    </div>
    <div class="conf-report">REPORT TO PESCE MANDYA LAUNCH SITE · MAY 22, 2026</div>
    <br>
    <button class="btn btn-next" style="margin-top:18px;" onclick="navigate('index.html')">← RETURN TO MISSION CONTROL</button>"""

make_page(
    'confirmation.html',
    title='MISSION CONFIRMED',
    page_id='confirmation',
    page_css='css/confirmation.css',
    page_js='  <script src="js/confirmation.js"></script>',
    body=confirmation_body
)

print("Generated all HTML files successfully.")
