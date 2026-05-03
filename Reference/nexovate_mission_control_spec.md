# NEXOVATE 2026: MISSION CONTROL
### Full Design Specification — Apollo-Era Retro NASA Direction

---

> The entire website is framed as a NASA mission launch. Not metaphorically — structurally.
> The visual grammar, the copy, the transitions, the registration flow — all of it borrows
> from the Apollo programme: mission patches, telemetry readouts, GO/NO-GO polls,
> reel-to-reel computers, and that particular brand of 1960s institutional optimism.
> The logic is airtight: you're coming to Nexovate to launch something — an idea, a robot,
> a team. That's a mission. Lean into it completely.

---

## THE HERO — LAUNCH CONTROL

You land on the page and it feels like walking into Mission Control at 3am, two hours before a launch window.

The background is near-black with a very slight warm brown undertone — not pure digital black, but the darkness of a room lit only by CRT monitors. Across the top of the screen, a horizontal ticker tape scrolls continuously, white text on black, old teletype font:

```
NEXOVATE 2026 · MISSION STATUS: GO · PESCE MANDYA LAUNCH SITE · MAY 15–16 · ALL SYSTEMS NOMINAL · PRIZE MANIFEST: ₹2,00,000 · AWAITING CREW CONFIRMATION · T-MINUS INITIATED · NEXOVATE 2026 · MISSION STATUS: GO · ...
```

Center screen: a large circular **mission patch** fades in — the kind sewn onto astronaut jackets. Inside the patch: "NEXOVATE 2026" arched at the top, "PESCE MANDYA" at the bottom, a stylized rocket or station schematic in the center, stars around the border. It feels hand-drawn, slightly rough — screen-printed, not vector-perfect. This is the logo. It's the first thing you see.

Below the patch, in amber teletype font — the countdown:

```
T-MINUS  14 : 22 : 07
LAUNCH WINDOW: MAY 15, 2026 · 09:00 HRS
```

Below that, a single wide button — not a modern UI button. It looks like a physical backlit console key, slightly bevelled, with a satisfying press animation:

```
[ INITIATE MISSION BRIEFING ]
```

Clicking it triggers a transition: the screen goes to static for exactly half a second — the kind of static you'd get switching between analogue feeds in a 1960s broadcast — and the mission briefing section sweeps in. That static-cut is the transition language for the entire site.

There is no hero image. No photo of students. No stock photography. The patch and the teletype are the entire hero. Restraint is the point — the Apollo programme was restrained. The confidence came from precision, not decoration.

---

## EVENTS — THE MISSION DOSSIER

This is the centrepiece section. It works in two layers.

**Layer 1: The Station Schematic**
The left two-thirds of the screen shows a blueprint-style technical illustration of a space station — rendered in amber lines on dark background, like a diagram printed on aged paper. The station has distinct labelled modules, one per event. The line art is hand-drafted in aesthetic — slightly imperfect, with dimension callouts and reference numbers in the margins like a real NASA schematic.

The modules are arranged logically:
- The main truss runs horizontally through the center
- Technical event modules attach above and below the truss
- Non-technical modules form a separate "Ground Operations Ring" in the lower section
- Hacksprint 6.0 occupies the Central Reactor Core — the largest module, dead center

**Layer 2: The Mission File Panel**
The right one-third of the screen shows a mission file readout panel — styled like a CRT terminal display. Amber text. Monospace. When you click a module on the schematic, it highlights (the amber lines brighten, a dashed selection border pulses around it), and the right panel updates with the mission file for that event.

The mission file is structured exactly like a real NASA mission document:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISSION FILE · REF: NXV-2026-001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPERATION:      IRONCLAD
MODULE:         PROPULSION SYSTEMS
CLASSIFICATION: TECHNICAL · FIELD OPERATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISSION OBJECTIVE:
Navigate a specially designed track at maximum
velocity. Obstacle clearance mandatory.
Fastest completion time wins. No violations.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREW REQUIREMENT:    2 – 4 PERSONNEL
MISSION VALUE:       ₹30,000
MISSION LEAD:        HITESH K M
COMMS:               8904902088
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATUS:   ACCEPTING CREW APPLICATIONS

[ SUBMIT CREW MANIFEST ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

The "SUBMIT CREW MANIFEST" button is the registration CTA for that specific event.

---

## COMPLETE MODULE MAP

All ten events mapped into the Apollo mission language:

| Module Name | Operation Codename | Event | Type |
|---|---|---|---|
| PROPULSION SYSTEMS | OPERATION: IRONCLAD | Robo Race | Technical |
| FIELD OPERATIONS BAY | OPERATION: GRIDLOCK | Robo Soccer | Technical |
| TRACTION & TORQUE LAB | OPERATION: IMMOVABLE | Robo Sumo | Technical |
| GUIDANCE & NAVIGATION | OPERATION: THREADLINE | Line Follower | Technical |
| PATHFINDING MODULE | OPERATION: LABYRINTH | Maze | Technical |
| BRAND FABRICATION LAB | OPERATION: SIGNAL | Rapid Brand Rumbling | Non-Technical |
| RESOURCE ACQUISITION | OPERATION: PITCH | Shark Tank | Non-Technical |
| ANALYTICAL SYSTEMS | OPERATION: GREY MATTER | IQ Wars 2.0 | Non-Technical |
| LAUNCH SYSTEMS | OPERATION: APOGEE | Water Rocket | Non-Technical |
| CENTRAL REACTOR CORE | OPERATION: IGNITION | Hacksprint 6.0 | Hackathon |

---

## MISSION COPY — ALL TEN EVENTS

These are the event descriptions rewritten in Apollo mission dossier language. Each has a flavour line and a mission briefing.

---

**OPERATION: IRONCLAD · ROBO RACE**
*"Speed is mission-critical. Hesitation is failure."*
Your vehicle must complete a purpose-built track at maximum velocity. The course includes lateral obstacles, tight cornering sections, and speed traps. Completion time is the sole metric. One violation and the clock keeps running — without you. Crew of 2 to 4. Mission value: ₹30,000.

---

**OPERATION: GRIDLOCK · ROBO SOCCER**
*"The field is contested. Control it."*
Two crews. One ball. A fixed time window to push it into the opponent's goalpost using remote-operated ground vehicles. This is a mission of real-time strategy, mechanical control, and adaptability under pressure. The team that reads the field faster wins. Crew of 2 to 4. Mission value: ₹30,000.

---

**OPERATION: IMMOVABLE · ROBO SUMO**
*"Traction. Torque. Dominance."*
Two machines enter a marked arena. One leaves. Victory requires pushing the opposing unit beyond the designated boundary zone using force, positioning, and mechanical superiority. No weapons. No compromises. Pure engineering muscle. Crew of 2 to 4. Mission value: ₹20,000.

---

**OPERATION: THREADLINE · LINE FOLLOWER**
*"The path is given. Precision is everything."*
Design and deploy an autonomous unit capable of detecting and tracking a defined path without human input during the run. This is a mission of programming discipline, sensor calibration, and engineering patience. The machine must think for itself — correctly. Crew of 2 to 4. Mission value: ₹20,000.

---

**OPERATION: LABYRINTH · MAZE**
*"Every dead end is data. Adapt."*
Navigate a remotely controlled vehicle through a walled maze faster than your competitors. The course is intentionally disorienting. Bluetooth and radio control permitted. Four-wheel drive recommended. Obstacle detection sensors are your instruments — read them well. Crew of 2 to 4. Mission value: ₹20,000.

---

**OPERATION: SIGNAL · RAPID BRAND RUMBLING**
*"Transmit clearly or get lost in noise."*
Your crew has a limited mission window to construct a complete brand identity from a given problem statement. Deliverables: logo, color palette, UI/UX language, typography system, and advertising content. Judged on creative coherence and presentation clarity. Crew of 2 to 4. Mission value: ₹10,000.

---

**OPERATION: PITCH · SHARK TANK**
*"You have three minutes to change the trajectory."*
Develop a viable startup concept, build a pitch deck, and present it to a panel of evaluators simulating a real-world funding environment. Ideas are judged on innovation depth, scalability of model, and execution credibility. One person can carry a mission. Crew of 1 to 4. Mission value: ₹10,000.

---

**OPERATION: GREY MATTER · IQ WARS 2.0**
*"Logic is the only instrument that doesn't malfunction."*
Consecutive rounds of structured intellectual combat — logical reasoning, rapid problem-solving, and general knowledge retrieval under strict time pressure. Participants face quizzes, puzzles, and rapid-fire assessment sequences. Accuracy under compression is the metric. Crew of 1 to 2. Mission value: ₹10,000.

---

**OPERATION: APOGEE · WATER ROCKET**
*"Controlled force. Calculated trajectory. Maximum range."*
Design and launch a water-pressure propulsion system aimed at maximum range and target accuracy. The principles are real: aerodynamics, propulsion mechanics, pressure management. So are the consequences of getting them wrong. Crew of 2 to 4. Mission value: ₹10,000.

---

## HACKSPRINT 6.0 — THE CENTRAL REACTOR CORE

When the user scrolls to this section or clicks the Central Reactor Core on the schematic, the transition is different from all other sections.

The screen cuts to a feed of amber static. Then: a voice-style teletype message prints across the screen, character by character — as if being transmitted:

```
MISSION CONTROL TO ALL STATIONS.
THIS IS A PRIORITY TRANSMISSION.

OPERATION: IGNITION IS NOW ACTIVE.
CLASSIFICATION: OMEGA LEVEL.
DURATION: 24 HOURS CONTINUOUS.

THIS IS NOT A DRILL.
```

The section that follows is visually distinct from the rest of the site. The background shifts from near-black to deep amber — the entire section glows like the inside of a rocket engine. White text instead of amber. The station schematic in the background is replaced with a trajectory arc — a long parabolic curve traced in white, showing a spacecraft's path from launch to orbit.

The Hacksprint details are laid out as a formal mission brief:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPERATION: IGNITION · MISSION PARAMETERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISSION CLASS:      OMEGA · UNRESTRICTED
DURATION:           24 HOURS CONTINUOUS OPERATION
CREW REQUIREMENT:   3 – 4 PERSONNEL
MISSION VALUE:      ₹60,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVE MISSION DOMAINS:

  DOMAIN A · ARTIFICIAL INTELLIGENCE
  DOMAIN B · AGRICULTURE & HEALTHCARE TECHNOLOGY
  DOMAIN C · INTERNET OF THINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISSION PHASES:

  PHASE 1 — PROBLEM ACQUISITION     [0–2 HRS]
  PHASE 2 — SYSTEMS DEVELOPMENT     [2–20 HRS]
  PHASE 3 — MISSION PRESENTATION    [20–24 HRS]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISSION LEADS:  SONAL H · ASHWIN S
COMMS:          9591787616 · 8951728170
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

At the bottom, the registration button is styled differently from all others — it looks like the physical launch key on an Apollo console. Large. Red-bordered. Backlit:

```
[ INITIATE CREW REGISTRATION · OPERATION IGNITION ]
```

Clicking it does a full-page white flash — the classic "launch flash" — and takes you to the registration screen.

---

## REGISTRATION — CREW ASSIGNMENT

Registration is not a form. It is a formal crew assignment process — structured exactly like the multi-step NASA crew selection briefings documented in mission archives.

The screen is divided: left side shows the station schematic (dimmed, with the selected event's module pulsing softly). Right side is the active input panel. Each step prints in with a typewriter effect before the input field appears.

**Step 1 of 4 — Crew Designation**
```
MISSION CONTROL: PLEASE CONFIRM CREW DESIGNATION.
This is the identifier by which your team will be
logged in the official mission manifest.

CREW DESIGNATION: [________________]
```

**Step 2 of 4 — Launch Site**
```
MISSION CONTROL: CONFIRM LAUNCH SITE.
Your institution of origin for mission record purposes.

LAUNCH SITE (INSTITUTION): [________________]
```

**Step 3 of 4 — Mission Assignment**
```
MISSION CONTROL: SELECT PRIMARY MISSION.
Choose the operation your crew is volunteering for.
Each crew may submit for one primary mission.

  ○ OPERATION: IRONCLAD     (Robo Race)
  ○ OPERATION: GRIDLOCK     (Robo Soccer)
  ○ OPERATION: IMMOVABLE    (Robo Sumo)
  ○ OPERATION: THREADLINE   (Line Follower)
  ○ OPERATION: LABYRINTH    (Maze)
  ○ OPERATION: SIGNAL       (Rapid Brand Rumbling)
  ○ OPERATION: PITCH        (Shark Tank)
  ○ OPERATION: GREY MATTER  (IQ Wars 2.0)
  ○ OPERATION: APOGEE       (Water Rocket)
  ○ OPERATION: IGNITION     (Hacksprint 6.0)
```

**Step 4 of 4 — GO/NO-GO Poll**
This is the detail that makes the whole thing sing. The final step before submission is a GO/NO-GO poll — exactly as conducted before every Apollo launch. A list of mission parameters appears, and each one shows GO in amber:

```
MISSION CONTROL: CONDUCTING PRE-LAUNCH GO/NO-GO POLL.

  CREW DESIGNATION ·········· GO ✓
  LAUNCH SITE ················ GO ✓
  MISSION ASSIGNMENT ········· GO ✓
  TEAM READINESS ············· GO ✓

ALL STATIONS: GO FOR LAUNCH.
```

The submit button, after this screen:
```
[ LAUNCH CONFIRMED · COMMIT TO MISSION ]
```

**On submit:** a full-screen sequence plays. The screen goes dark. Then a large mission patch generates — circular, with the crew's team name arched at the top, their selected operation codename in the center, "NEXOVATE 2026 · PESCE MANDYA" at the bottom. Below it:

```
CREW MANIFEST ACCEPTED.
MISSION CONTROL CONFIRMS: [CREW NAME] IS GO FOR [OPERATION NAME].
REPORT TO PESCE MANDYA LAUNCH SITE · MAY 15, 2026.

SAVE YOUR MISSION PATCH ↓
```

The patch is shareable. People will post it. That's intentional.

---

## THE COUNTDOWN — T-MINUS TIMER

Fixed element. Present on every section. Positioned dead-center at the top of every screen — never in a corner, never small. It reads:

```
T-MINUS  14 : 22 : 07
```

Amber digits. Monospace. Slightly oversized. The label above it alternates every 10 seconds between:
- `LAUNCH WINDOW OPENS IN`
- `MAY 15 · 09:00 HRS · PESCE MANDYA`

The digits tick in real time. When you're under 24 hours, the label changes to `FINAL COUNTDOWN`. When under 1 hour, it turns white and pulses slightly. The tension builds passively the entire time you're on the site.

---

## VISUAL LANGUAGE

**Color Palette — The Apollo Console**
The palette is pulled directly from 1960s Mission Control photography and Apollo-era printed materials. Warm, analog, slightly aged.

| Role | Color | Description |
|---|---|---|
| Background | `#0D0A07` | Near-black with warm brown undertone |
| Primary Text | `#F0A500` | Amber — the color of CRT phosphor monitors |
| Secondary Text | `#C8882A` | Darker amber for labels and secondary copy |
| Accent / Alert | `#E8E0D0` | Warm off-white for highlights and mission-critical text |
| Danger / Warning | `#C0392B` | Muted red — used sparingly for warnings only |
| Blueprint Lines | `#4A6E8A` | Muted steel blue — used only in schematic illustrations |
| Module Glow | `#F0A500` at 30% opacity | For the selected state on the schematic |

No bright white. No pure black. No neon. The warmth comes from the amber — everything feels lit from within.

**Typography — Two Fonts, No More**

- **Display / Headings:** `Bebas Neue` or `Orbitron` — but specifically the condensed, tall variant. Used for operation names, section headers, countdown digits. All caps. Tracked wide. Feels like stencilled mission lettering.
- **Body / Terminals:** `Courier Prime` or `IBM Plex Mono` — for all mission file copy, form inputs, readout panels, the teletype ticker. Every word that looks like it came out of a printer in 1969 uses this font.
- **No mixing.** If it's a heading, it's Bebas. If it's body text or data, it's Courier. The two fonts never appear in the same size or weight.

**Texture — The Analog Layer**
Three texture layers applied globally at low opacity:

1. **Film grain overlay** — very subtle, ~8% opacity. Makes the screen feel like it's being projected rather than displayed. This alone changes the entire mood.
2. **Faint horizontal scanlines** — 1px lines, 2px gap, 4% opacity. Not the aggressive VHS scanlines — just a whisper of CRT physics.
3. **Blueprint grid on schematic sections only** — light grid lines, `#4A6E8A` at 6% opacity, visible only behind the station schematic illustration.

**Illustrations**
The station schematic is the only major illustration and it needs to be done properly. Not an icon set. Not a 3D render. An actual technical line drawing — amber lines on dark background, dimension callouts, module labels in stencil type, reference numbers. It can be SVG with styled strokes, or it can be a commissioned illustration scanned and processed. Either way, it should look like something from an actual NASA engineering document.

The mission patch (hero + registration confirmation) is the second illustration. Circular. Slightly distressed edges. Hand-lettered aesthetic — can be done in Illustrator with texture overlays. This is the one element people will share.

**Transitions — The Static Cut**
Every section-to-section transition uses the same pattern: 0.4 seconds of amber-tinted static (CSS noise animation or a looping video at very low file size), then the new section snaps in. It sounds like changing channels on analogue television. No slide animations, no fades, no scroll-triggered reveals — just the hard cut with static. It's jarring in exactly the right way.

**Microinteractions**
- Hovering a module on the schematic: the amber lines brighten, a dashed border pulses around the module (2px dashed amber, pulsing in opacity). Cursor changes to a crosshair.
- Clicking a module: a brief flash of the module name in large type before the mission file panel updates.
- Hovering any button: the button backlight intensifies slightly, like a physical console key being pressed partway.
- The GO/NO-GO poll items check off one by one with a half-second delay between each — you watch them confirm. Don't skip this. It's the best moment on the page.
- Ticker tape scrolls continuously, pauses for 2 seconds when you hover it, then resumes.

**Sound Design (Muted by Default)**
All sounds off by default. Small speaker icon top-right. If enabled:
- Page load: a short radio static burst, then silence
- Section transition: a click-and-static sound, like changing an analogue channel
- Module selection on schematic: a short electronic blip — the kind from 60s computer films
- GO/NO-GO items checking off: a quiet typewriter key press for each one
- Registration submit: a recording of an actual launch countdown finishing, fading into crowd applause
Speaker icon is small, unobtrusive, never mentioned in the UI — just there for people who find it.

---

## THE FLOW — START TO FINISH

```
LAND
  → Ticker tape scrolling. Mission patch center screen. T-minus counting.
  → [ INITIATE MISSION BRIEFING ] button pulsing softly.

PRESS START
  → Static cut transition (0.4s amber static)
  → Mission Dossier section: station schematic left, mission file panel right.

BROWSE EVENTS
  → Click modules on the schematic.
  → Mission file panel updates with each click.
  → Non-technical events in Ground Operations Ring below.
  → Central Reactor Core (Hacksprint) glows the whole time — can't be missed.

SCROLL TO HACKSPRINT
  → Static cut. Priority transmission teletype sequence.
  → Amber-tinted section. Trajectory arc background.
  → Full mission brief. Launch key register button.

CLICK REGISTER (any event)
  → Static cut to registration.
  → Typewriter-reveal crew assignment steps, one by one.
  → GO/NO-GO poll checks off before submission.
  → [ LAUNCH CONFIRMED ] submit.

SUBMIT
  → White flash.
  → Mission patch generates with team name + operation name.
  → "SAVE YOUR MISSION PATCH" download prompt.
  → Done. Every beat has an Apollo equivalent. Nothing breaks the metaphor.
```

---

## APPENDIX — QUICK REFERENCE

| Event | Operation | Type | Crew | Prize | Lead | Contact |
|---|---|---|---|---|---|---|
| Robo Race | IRONCLAD | Technical | 2–4 | ₹30,000 | Hitesh K M | 8904902088 |
| Robo Soccer | GRIDLOCK | Technical | 2–4 | ₹30,000 | Yashas P & Ubair | 9901793968, 6360541947 |
| Robo Sumo | IMMOVABLE | Technical | 2–4 | ₹20,000 | Paramesh H N | 9448176290 |
| Line Follower | THREADLINE | Technical | 2–4 | ₹20,000 | Chiranth | 9448176290 |
| Maze | LABYRINTH | Technical | 2–4 | ₹20,000 | Deeksha G Y & Manoj | 9353415303, 9035052726 |
| Rapid Brand Rumbling | SIGNAL | Non-Technical | 2–4 | ₹10,000 | Kishan S | 8296557523 |
| Shark Tank | PITCH | Non-Technical | 1–4 | ₹10,000 | Saroj | 8873250798 |
| IQ Wars 2.0 | GREY MATTER | Non-Technical | 1–2 | ₹10,000 | Kunal M K & Aishwarya S | 7795687774, 7411260022 |
| Water Rocket | APOGEE | Non-Technical | 2–4 | ₹10,000 | P Harshit Rao | 9933806575 |
| Hacksprint 6.0 | IGNITION | Hackathon | 3–4 | ₹60,000 | Sonal H & Ashwin S | 9591787616, 8951728170 |

**Total Prize Manifest: ₹2,00,000**
**Launch Site: PESCE Mandya**
**Launch Window: May 15–16, 2026**
