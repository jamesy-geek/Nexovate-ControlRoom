// ─── navigate.js ───────────────────────────────────────────────────────────
// Intercepts internal link clicks, plays static-cut, then navigates.

const PAGES = {
  hero:         'index.html',
  dossier:      'dossier.html',
  hacksprint:   'hacksprint.html',
  registration: 'registration.html',
  confirmation: 'confirmation.html',
  profile:      'profile.html',
};

let soundEnabled = false;

function staticCut(callback, duration = 420) {
  const ov = document.getElementById('static-overlay');
  const cv = document.getElementById('static-canvas');
  const ctx = cv.getContext('2d');
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;

  // Amber-tinted static noise
  const img = ctx.createImageData(cv.width, cv.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() > 0.5 ? 220 : 15;
    img.data[i]   = v * 0.94;  // R
    img.data[i+1] = v * 0.65;  // G
    img.data[i+2] = 0;          // B
    img.data[i+3] = 180;        // A
  }
  ctx.putImageData(img, 0, 0);
  ov.style.display = 'block';

  if (soundEnabled) playStatic();
  setTimeout(() => {
    ov.style.display = 'none';
    if (callback) callback();
  }, duration);
}

function navigate(pageKey) {
  const url = PAGES[pageKey] || (pageKey.endsWith('.html') ? pageKey : null);
  if (!url) return;
  staticCut(() => { window.location.href = url; });
}

// Intercept all internal .nd (nav dot) clicks — handled in chrome.js
// Direct link calls: navigate('dossier') etc.
