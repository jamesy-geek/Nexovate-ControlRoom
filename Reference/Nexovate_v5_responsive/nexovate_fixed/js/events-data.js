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
