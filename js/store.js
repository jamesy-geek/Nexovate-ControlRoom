// ─── store.js ───────────────────────────────────────────────────────────────
// localStorage persistence layer for Nexovate team profiles.

const STORE_KEY = 'nexovate_teams';

/**
 * Returns all teams as an object keyed by teamId.
 */
function getAllTeams() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch {
    return {};
  }
}

/**
 * Saves a team. Overwrites if same id exists.
 * @param {Object} teamData - { id, crew, inst, op, evt, evtId, createdAt }
 */
function saveTeam(teamData) {
  const teams = getAllTeams();
  teams[teamData.id] = teamData;
  localStorage.setItem(STORE_KEY, JSON.stringify(teams));

  // Sync to Supabase in the background
  if (window.supabaseClient) {
    window.supabaseClient.from('teams').upsert([teamData]).then(({error}) => {
      if (error) console.error('Supabase team sync error:', error);
    });
  }
}

/**
 * Retrieves a single team by ID.
 * @param {string} id
 * @returns {Object|null}
 */
function getTeam(id) {
  const teams = getAllTeams();
  return teams[id] || null;
}

/**
 * Deletes a team by ID (admin use).
 */
function deleteTeam(id) {
  const teams = getAllTeams();
  delete teams[id];
  localStorage.setItem(STORE_KEY, JSON.stringify(teams));
}

// ── Auth Data Model ────────────────────────────────────────────────────────

const AUTH_KEY = 'nexovate_auth_users';
const SESSION_KEY = 'nexovate_session';

// User object shape:
// {
//   email: string (lowercase, trimmed — used as unique key),
//   passwordHash: string (SHA-256 hex of password),
//   teamId: string | null,         // linked team ID after registration
//   createdAt: ISO string
// }

function getAllUsers() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || '{}'); }
  catch { return {}; }
}

function saveUser(user) {
  const users = getAllUsers();
  users[user.email] = user;
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));

  // Sync to Supabase in the background
  if (window.supabaseClient) {
    window.supabaseClient.from('users').upsert([user]).then(({error}) => {
      if (error) console.error('Supabase user sync error:', error);
    });
  }
}

function getUser(email) {
  return getAllUsers()[email.toLowerCase().trim()] || null;
}

function setSession(email) {
  sessionStorage.setItem(SESSION_KEY, email.toLowerCase().trim());
}

function getSession() {
  return sessionStorage.getItem(SESSION_KEY) || null;
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// Link a teamId to a user account after registration
function linkTeamToUser(email, teamId) {
  const user = getUser(email);
  if (!user) return;
  user.teamId = teamId;
  saveUser(user);
}
