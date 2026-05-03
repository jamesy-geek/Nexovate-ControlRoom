import os

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
        <!-- SVG Mission Patch placeholder (you can copy the one from reference later if needed, but the spec says "SVG from Reference" maybe? Wait, let's look at the MD: it had SVG code for the hero patch) -->
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

      <button class="btn btn-primary" onclick="navigate('dossier')">INITIATE MISSION BRIEFING</button>

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

print("Created index.html")
