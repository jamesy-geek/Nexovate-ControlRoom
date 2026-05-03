// ─── sheets.js ──────────────────────────────────────────────────────────────
// Sends registration data to Google Sheets via a deployed Apps Script Web App.
// Replace SHEETS_WEBHOOK_URL with your deployed Apps Script URL before launch.

const SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzotG7sBEtZAFnReT-OAIcoD-oFp8JOpkIN_QmigRQ-BHYR6LnMAxrrt8F_nRRasHFV5g/exec';

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
    eventId: evt.evtId,           // e.g. 'roborace'
    eventName: evt.evt,             // e.g. 'ROBO RACE'
    teamName: teamData.crew,
    leadName: teamData.lead,
    phone: teamData.phone,
    email: email || '',
    inst: teamData.inst,
    teamId: teamData.id,
    createdAt: teamData.createdAt,
  }));

  try {
    await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ rows }),
    });
    console.log('[sheets.js] Data sent to sync.');
  } catch (err) {
    console.error('[sheets.js] Sync failed:', err);
  }
}
