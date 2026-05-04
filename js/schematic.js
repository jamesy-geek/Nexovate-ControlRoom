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
    <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
    <div style="font-size:8.5px;letter-spacing:.3em;color:var(--amber-dk);margin:8px 0;">MISSION FILE · REF: ${d.ref}</div>
    <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
    <div class="fp-op">${d.nm}</div>
    <div style="font-size:8.5px;letter-spacing:.2em;color:var(--amber-dk);margin-bottom:4px;">OPERATION: ${d.op} · MODULE: ${d.mod}</div>
    <div class="fp-type">${d.type}</div>
    <div class="div-line" style="margin-top:10px;">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
    <div class="fp-tagline" style="margin-top:10px;">"${d.tag}"</div>
    <div class="fp-obj">${d.obj}</div>
    <div class="div-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
    <div style="margin-top:8px;font-size:10px;line-height:2.1;">
      <span class="fp-lbl">CREW &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="fp-val">${d.crew} PERSONNEL</span><br>
      <span class="fp-lbl">PRIZE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="fp-prize" style="font-size:14px;">${d.prize}</span><br>
      <span class="fp-lbl">MISSION LEAD </span><span class="fp-val">${d.lead}</span><br>
      <span class="fp-lbl">COMMS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="fp-val">${d.comms}</span>
    </div>
    <div class="div-line" style="margin-top:10px;">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
    <div class="fp-status">STATUS: ACCEPTING CREW APPLICATIONS</div>
    <button class="btn btn-file" onclick="regFor('${id}')">SUBMIT CREW MANIFEST</button>
  `;
}

function regFor(id) {
  sessionStorage.setItem('preselect', id);
  navigate('registration');
}

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
