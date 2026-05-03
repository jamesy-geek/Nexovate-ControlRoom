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
    <svg width="280" height="280" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="cp1" d="M 40,140 A 100,100 0 0,1 240,140"/>
        <path id="cp2" d="M 52,155 A 100,100 0 0,0 228,155"/>
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
        <textPath href="#cp1" startOffset="50%" text-anchor="middle">${crew}</textPath>
      </text>
      <text fill="#C8882A" font-family="'Orbitron',monospace" font-size="9" letter-spacing="2.5">
        <textPath href="#cp2" startOffset="50%" text-anchor="middle">${op}</textPath>
      </text>
      <text x="140" y="188" text-anchor="middle" fill="rgba(240,165,0,.45)" font-family="monospace" font-size="7" letter-spacing="2.5">NEXOVATE 2026</text>
    </svg>
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
