# ANTIGRAVITY PROMPT — NEXOVATE v5 · FULL MOBILE COMPATIBILITY FIX

## CONTEXT

Nexovate v5 is a static HTML/CSS/JS site. Files live flat in the project root with `css/` and `js/` subfolders. The aesthetic is Phosphor Terminal / CRT — amber-on-dark, Orbitron + IBM Plex Mono, fixed chrome bars. A mobile nav bar (`#mobile-nav`) already exists. The viewport meta tag is already present on all pages.

**Primary complaint:** The Mission Dossier page (`dossier.html` + `css/dossier.css`) is broken on mobile. The schematic SVG (viewBox 720×410) renders at ~52% scale on a 375px phone — all module labels become 3–4px equivalent, modules are untappable, and the file panel collapses. Secondary: several other cross-page issues across the chrome, hero, registration, and hacksprint pages.

**Constraint:** Animations must use only `transform` and `opacity`. No custom cursors. Two-color discipline: amber (`#F0A500` / `#C8882A`) and blue (`#4A6E8A`) only for accent — no new colors. All fixes self-contained in CSS unless JS is structurally necessary.

---

## FILES TO MODIFY

### 1. `css/dossier.css` — PRIMARY FIX (FULL REWRITE OF MOBILE SECTION)

**Problem:** On mobile, the 720×410 SVG schematic scales to ~52% width, making all module rects (~30px wide) render at ~16px — untappable and unreadable. The `.sch-panel` has a fixed `height: 300px` which clips the already-tiny SVG further. The `.file-panel` below has no `min-height` so it collapses when empty.

**Solution:** On mobile, **hide the SVG schematic entirely** and inject a vertical scrollable module list that calls `selMod()`. The file panel becomes a persistent panel below. The module list is purely CSS-driven off existing HTML structure plus new mobile-only additions (see dossier.html change below).

**Changes to `css/dossier.css`:**

Replace the existing mobile section (everything inside `@media (max-width: 768px)`) with this full block. Also add the mobile module list styles:

```css
/* ── MOBILE MODULE LIST (hidden on desktop) ── */
#mobile-module-list {
  display: none;
}

@media (max-width: 768px) {
  /* Grid stacks: module list → file panel */
  .dossier-grid {
    grid-template-columns: 1fr;
    border: none;
    gap: 0;
    min-height: unset;
  }

  /* Hide SVG schematic on mobile — untappable at this scale */
  .sch-panel {
    display: none;
  }

  /* Show mobile module list instead */
  #mobile-module-list {
    display: block;
    border: 1px solid rgba(240,165,0,.18);
    background: rgba(240,165,0,.015);
    margin-bottom: 0;
  }

  .mml-lbl {
    font-size: 8px;
    letter-spacing: .35em;
    color: var(--amber-dk);
    padding: 10px 16px 6px;
    display: block;
    border-bottom: 1px solid rgba(240,165,0,.1);
  }

  .mml-section {
    font-size: 7px;
    letter-spacing: .4em;
    color: var(--blue);
    padding: 8px 16px 4px;
    opacity: .7;
  }

  .mml-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(240,165,0,.08);
    cursor: pointer;
    transition: background 0.15s;
    min-height: 56px; /* large tap target */
    -webkit-tap-highlight-color: transparent;
  }

  .mml-item:active {
    background: rgba(240,165,0,.08);
  }

  .mml-item.sel {
    background: rgba(240,165,0,.07);
    border-bottom-color: rgba(240,165,0,.2);
  }

  .mml-item.sel .mml-op {
    color: var(--amber);
  }

  .mml-item.nt { /* non-technical: blue accent */
    border-left: 2px solid transparent;
  }

  .mml-item.nt.sel {
    border-left-color: var(--blue);
    background: rgba(74,110,138,.07);
  }

  .mml-item.nt .mml-op {
    color: var(--blue);
  }

  .mml-item.nt.sel .mml-op {
    color: var(--offwhite);
  }

  .mml-left {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .mml-op {
    font-family: var(--font-d);
    font-size: 11px;
    letter-spacing: .18em;
    color: var(--amber-dk);
  }

  .mml-nm {
    font-size: 9px;
    letter-spacing: .14em;
    color: var(--amber-dk);
    opacity: .7;
  }

  .mml-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .mml-id {
    font-size: 7px;
    letter-spacing: .3em;
    color: rgba(240,165,0,.4);
  }

  .mml-prize {
    font-family: var(--font-d);
    font-size: 10px;
    color: var(--amber);
  }

  .mml-arrow {
    font-size: 12px;
    color: var(--amber-dk);
    opacity: .4;
    margin-left: 10px;
    transition: opacity 0.15s, transform 0.15s;
  }

  .mml-item.sel .mml-arrow {
    opacity: 1;
    transform: translateX(2px);
  }

  /* File panel: fixed height so it always shows, scrollable */
  .file-panel {
    border: 1px solid rgba(240,165,0,.18);
    border-top: none;
    min-height: 280px;
    max-height: 60vh;
    overflow-y: auto;
    font-size: 11px;
  }

  /* Footer button: full width on mobile */
  .dossier-footer {
    margin-top: 16px;
  }

  .dossier-footer .btn-primary {
    width: 100%;
    display: block;
    text-align: center;
    font-size: 11px;
    padding: 16px 20px;
    clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
  }
}
```

---

### 2. `dossier.html` — ADD MOBILE MODULE LIST

**Location:** Inside `<div class="dossier-grid">`, **before** the `<div class="sch-panel">` block, add a new `<div id="mobile-module-list">`. This is hidden on desktop via `display: none` and shown only on mobile via the CSS above.

**Insert this block immediately before `<div class="sch-panel">`:**

```html
<!-- MOBILE MODULE LIST — shown instead of SVG schematic on small screens -->
<div id="mobile-module-list">
  <span class="mml-lbl">NEXOVATE 2026 · SELECT MODULE TO ACCESS MISSION FILE</span>

  <div class="mml-section">── TECHNICAL OPERATIONS ──</div>

  <div class="mml-item" id="mml-roborace" onclick="selMod('roborace'); mmlSel(this)">
    <div class="mml-left">
      <span class="mml-op">IRONCLAD</span>
      <span class="mml-nm">ROBO RACE</span>
    </div>
    <div class="mml-right">
      <span class="mml-id">A-1</span>
      <span class="mml-prize">₹30K</span>
    </div>
    <span class="mml-arrow">›</span>
  </div>

  <div class="mml-item" id="mml-robosoccer" onclick="selMod('robosoccer'); mmlSel(this)">
    <div class="mml-left">
      <span class="mml-op">GRIDLOCK</span>
      <span class="mml-nm">ROBO SOCCER</span>
    </div>
    <div class="mml-right">
      <span class="mml-id">A-2</span>
      <span class="mml-prize">₹30K</span>
    </div>
    <span class="mml-arrow">›</span>
  </div>

  <div class="mml-item" id="mml-robosumo" onclick="selMod('robosumo'); mmlSel(this)">
    <div class="mml-left">
      <span class="mml-op">IMMOVABLE</span>
      <span class="mml-nm">ROBO SUMO · PRIORITY</span>
    </div>
    <div class="mml-right">
      <span class="mml-id">A-3</span>
      <span class="mml-prize">₹20K</span>
    </div>
    <span class="mml-arrow">›</span>
  </div>

  <div class="mml-item" id="mml-linefollower" onclick="selMod('linefollower'); mmlSel(this)">
    <div class="mml-left">
      <span class="mml-op">THREADLINE</span>
      <span class="mml-nm">LINE FOLLOWER</span>
    </div>
    <div class="mml-right">
      <span class="mml-id">A-4</span>
      <span class="mml-prize">₹20K</span>
    </div>
    <span class="mml-arrow">›</span>
  </div>

  <div class="mml-item" id="mml-maze" onclick="selMod('maze'); mmlSel(this)">
    <div class="mml-left">
      <span class="mml-op">LABYRINTH</span>
      <span class="mml-nm">MAZE</span>
    </div>
    <div class="mml-right">
      <span class="mml-id">A-5</span>
      <span class="mml-prize">₹20K</span>
    </div>
    <span class="mml-arrow">›</span>
  </div>

  <div class="mml-item" id="mml-hacksprint" onclick="selMod('hacksprint'); mmlSel(this)"
       style="border-top: 1px solid rgba(240,165,0,.25); background: rgba(240,165,0,.02);">
    <div class="mml-left">
      <span class="mml-op" style="color: var(--amber);">CORE · HACKSPRINT</span>
      <span class="mml-nm">[ OMEGA PROTOCOL ]</span>
    </div>
    <div class="mml-right">
      <span class="mml-id">OMEGA</span>
      <span class="mml-prize">₹50K</span>
    </div>
    <span class="mml-arrow">›</span>
  </div>

  <div class="mml-section" style="margin-top: 4px;">── GROUND OPERATIONS ──</div>

  <div class="mml-item nt" id="mml-brandrumbling" onclick="selMod('brandrumbling'); mmlSel(this)">
    <div class="mml-left">
      <span class="mml-op">SIGNAL</span>
      <span class="mml-nm">BRAND RUMBLE</span>
    </div>
    <div class="mml-right">
      <span class="mml-id">B-1</span>
      <span class="mml-prize" style="color: var(--blue);">₹10K</span>
    </div>
    <span class="mml-arrow" style="color: var(--blue);">›</span>
  </div>

  <div class="mml-item nt" id="mml-sharktank" onclick="selMod('sharktank'); mmlSel(this)">
    <div class="mml-left">
      <span class="mml-op">PITCH</span>
      <span class="mml-nm">SHARK TANK</span>
    </div>
    <div class="mml-right">
      <span class="mml-id">B-2</span>
      <span class="mml-prize" style="color: var(--blue);">₹10K</span>
    </div>
    <span class="mml-arrow" style="color: var(--blue);">›</span>
  </div>

  <div class="mml-item nt" id="mml-iqwars" onclick="selMod('iqwars'); mmlSel(this)">
    <div class="mml-left">
      <span class="mml-op">GREY MATTER</span>
      <span class="mml-nm">IQ WARS 2.0</span>
    </div>
    <div class="mml-right">
      <span class="mml-id">B-3</span>
      <span class="mml-prize" style="color: var(--blue);">₹10K</span>
    </div>
    <span class="mml-arrow" style="color: var(--blue);">›</span>
  </div>

  <div class="mml-item nt" id="mml-waterrocket" onclick="selMod('waterrocket'); mmlSel(this)">
    <div class="mml-left">
      <span class="mml-op">APOGEE</span>
      <span class="mml-nm">WATER ROCKET</span>
    </div>
    <div class="mml-right">
      <span class="mml-id">B-4</span>
      <span class="mml-prize" style="color: var(--blue);">₹10K</span>
    </div>
    <span class="mml-arrow" style="color: var(--blue);">›</span>
  </div>
</div>
```

**Also update the placeholder text in `#file-panel`** to be mobile-aware. Replace the current `fp-placeholder` inner div text from:

```html
<div>CLICK ANY MODULE TO<br>ACCESS MISSION FILE<span ...>_</span></div>
```

to:

```html
<div>TAP A MODULE ABOVE TO<br>ACCESS MISSION FILE<span style="animation:blink 1s step-end infinite;display:inline-block">_</span></div>
```

(The word CLICK → TAP is friendlier on mobile. Desktop still reads "SELECT A MODULE ON THE SCHEMATIC" from the header anyway.)

---

### 3. `js/schematic.js` — ADD `mmlSel()` HELPER

At the **bottom** of `js/schematic.js`, append this function. It handles the `.sel` class for the mobile module list without touching the desktop SVG logic:

```javascript
// Mobile module list — highlight selected item
function mmlSel(el) {
  document.querySelectorAll('.mml-item').forEach(function(i) { i.classList.remove('sel'); });
  el.classList.add('sel');
  // Scroll file panel into view on mobile
  var fp = document.getElementById('file-panel');
  if (fp && window.innerWidth <= 768) {
    setTimeout(function() { fp.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
  }
}
```

---

### 4. `css/chrome.css` — TMINUS + SOUND BTN MOBILE FIXES

**Problem 1:** `#tminus` uses `white-space: nowrap` and `width: auto` — on narrow phones the countdown digits (e.g. `04D 22H 15M 09S`) at 20px Orbitron can overflow or crowd the chrome bar.

**Problem 2:** `#sound-btn` is pinned at `right: 16px, top: 33px` on all screen sizes — on mobile this overlaps with `#tminus` visually.

**Add to the existing `@media (max-width: 768px)` block** (the one that already has `#tminus-dig { font-size: 15px }`):

```css
@media (max-width: 768px) {
  #tminus-dig { font-size: 15px; }

  /* Prevent tminus from overflowing viewport width */
  #tminus {
    max-width: calc(100vw - 40px);
    padding: 4px 14px 6px;
  }

  /* Shrink label to save vertical space */
  #tminus-lbl {
    font-size: 7px;
    letter-spacing: .25em;
  }

  /* Move sound button below ticker, left side — avoids tminus overlap */
  #sound-btn {
    top: 30px;
    right: auto;
    left: 10px;
    opacity: 0.45;
  }
}
```

---

### 5. `css/base.css` — PAGE BOTTOM PADDING MOBILE AUDIT

**Current state:** `@media (max-width: 768px) { .page { padding: 90px 20px 80px; } }` — the 80px bottom already accounts for `#mobile-nav` (52px). This is correct. **No change needed here.**

However, confirm `.ttl` (the display heading) does not overflow on narrow screens. **Add** to the existing mobile breakpoint:

```css
@media (max-width: 768px) {
  .page { padding: 90px 20px 80px; } /* existing — keep */

  /* Prevent Orbitron display titles overflowing on narrow screens */
  .ttl {
    font-size: clamp(16px, 5.5vw, 26px);
    letter-spacing: .1em;
  }
}
```

---

### 6. `css/hacksprint.css` — TRANSMISSION OVERLAY + CONTENT MOBILE

**Problem 1:** `#tx-overlay` centers text fine but `#tx-lines` at `font-size: 13px` + `letter-spacing: .28em` runs wide on 375px phones — lines may overflow horizontally.

**Problem 2:** `#tx-skip` at `bottom: 32px; right: 32px` — fine, but on very small screens (320px) it may get too close to the edge.

**Problem 3:** `.hack-op` at `font-size: 32px` with `.22em` letter-spacing = ~39px effective per character — overflows on 320px phones.

**Problem 4:** `.btn-omega` has `padding: 18px 52px` — on a 320px phone the button hits the panel edges.

**Add at the bottom of `css/hacksprint.css`:**

```css
@media (max-width: 768px) {
  /* Transmission overlay text */
  #tx-lines {
    font-size: 11px;
    letter-spacing: .18em;
    padding: 0 20px;
    line-height: 2;
  }

  .tx-large {
    font-size: 13px;
    letter-spacing: .16em;
  }

  .tx-red {
    font-size: 12px;
    letter-spacing: .22em;
  }

  #tx-skip {
    bottom: 80px; /* clear mobile-nav */
    right: 20px;
  }

  /* Main content scaling */
  .hack-op {
    font-size: clamp(20px, 7vw, 32px);
    letter-spacing: .14em;
  }

  .hack-sub {
    font-size: 11px;
    letter-spacing: .22em;
  }

  .hack-brief {
    padding: 18px 16px;
    font-size: 10.5px;
  }

  .btn-omega {
    padding: 16px 28px;
    font-size: 11px;
    letter-spacing: .2em;
    width: 100%;
  }
}
```

---

### 7. `css/registration.css` — MINOR ADDITIONS

The registration CSS already has a solid `@media (max-width: 600px)` block. Two gaps remain:

**Problem 1:** `.reg-panel` has `padding: 32px` which the breakpoint reduces to `20px 16px` — but at 320px the panel still has `border` and `max-width: 580px` → overflows. The panel already `width: 100%` so this is fine, but `box-sizing` should be confirmed.

**Problem 2:** `.gng-final-text` at `font-size: 14px` with `.22em` letter-spacing is fine but on 320px could wrap awkwardly.

**Append inside the existing `@media (max-width: 600px)` block** in `css/registration.css`:

```css
  /* Ensure panel doesn't overflow on 320px devices */
  .reg-panel {
    max-width: 100%;
    box-sizing: border-box;
  }

  /* GO/NO-GO final text scale */
  .gng-final-text {
    font-size: 12px;
    letter-spacing: .16em;
  }

  /* Confirmation step action row: stack buttons on mobile */
  .reg-actions {
    flex-direction: column;
    gap: 10px;
  }
```

---

### 8. `css/auth.css` — QUICK AUDIT

No specific issues reported, but confirm: if `auth.css` contains any fixed-width containers or absolute-positioned overlays, ensure they have `max-width: 100%; box-sizing: border-box` at mobile breakpoints. If the auth forms are already `width: 100%` and stack vertically, no change is needed.

---

## EXECUTION ORDER

Apply in this exact sequence to avoid cascade conflicts:

1. `css/base.css` — `.ttl` clamp
2. `css/chrome.css` — `#tminus` + `#sound-btn` mobile
3. `css/hacksprint.css` — append mobile block
4. `css/registration.css` — append inside existing `@media (max-width: 600px)`
5. `css/dossier.css` — replace mobile section (full rewrite as above)
6. `dossier.html` — insert `#mobile-module-list` HTML before `.sch-panel`; update placeholder text
7. `js/schematic.js` — append `mmlSel()` at bottom

---

## VALIDATION CHECKLIST

After applying all changes, verify the following at viewport width 375px (iPhone SE) and 390px (iPhone 14):

- [ ] `dossier.html`: Schematic SVG is not visible; module list is visible and scrollable; tapping any row populates the file panel below; file panel auto-scrolls into view after tap; PROCEED button spans full width
- [ ] All pages: Orbitron titles do not overflow viewport horizontally
- [ ] All pages: `#tminus` countdown does not overflow or clip
- [ ] `hacksprint.html`: Transmission overlay text is fully readable; skip button clears `#mobile-nav`
- [ ] `registration.html`: All steps render within panel; buttons are ≥52px tap height; GO/NO-GO step is readable
- [ ] `index.html` (hero): Hero content is centered; badge floats; CTA button is full width or centered

---

## DO NOT TOUCH

- Desktop layout (all breakpoints apply to `max-width: 768px` or `max-width: 600px` only)
- The SVG schematic markup in `dossier.html` — desktop view must be unchanged
- `js/schematic.js` `selMod()` function — only append `mmlSel()`; do not modify existing logic
- Color palette — no new colors; amber and blue only
- Animation properties — transform and opacity only
- `#mobile-nav` — already correct; no changes
