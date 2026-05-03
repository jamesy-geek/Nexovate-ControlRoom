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
