// ─── auth.js ────────────────────────────────────────────────────────────────
// Auth module for Nexovate. No backend. localStorage-based.

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const hashBuf = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function signUp(email, password) {
  email = email.toLowerCase().trim();
  if (!email || !password) return { ok: false, err: 'ALL FIELDS REQUIRED' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, err: 'INVALID EMAIL FORMAT' };
  if (password.length < 6) return { ok: false, err: 'PASSWORD MIN 6 CHARACTERS' };
  if (getUser(email)) return { ok: false, err: 'ACCOUNT ALREADY EXISTS · LOGIN INSTEAD' };

  const passwordHash = await hashPassword(password);
  saveUser({ email, passwordHash, teamId: null, createdAt: new Date().toISOString() });
  setSession(email);
  return { ok: true, email };
}

async function logIn(email, password) {
  email = email.toLowerCase().trim();
  if (!email || !password) return { ok: false, err: 'ALL FIELDS REQUIRED' };
  const user = getUser(email);
  if (!user) return { ok: false, err: 'ACCOUNT NOT FOUND · SIGN UP FIRST' };
  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) return { ok: false, err: 'INCORRECT PASSWORD' };
  setSession(email);
  return { ok: true, email, teamId: user.teamId };
}

function logOut() {
  clearSession();
  window.location.href = 'index.html';
}

function getLoggedInUser() {
  const email = getSession();
  if (!email) return null;
  return getUser(email);
}

// ─── Auth Gate UI logic ─────────────────────────────────────────────────────

function authShowTab(tab) {
  document.getElementById('auth-login-form').style.display = tab === 'login' ? '' : 'none';
  document.getElementById('auth-signup-form').style.display = tab === 'signup' ? '' : 'none';
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  authClearErr();
}

function authClearErr() {
  const errL = document.getElementById('auth-err-l');
  const errS = document.getElementById('auth-err-s');
  if (errL) errL.textContent = '';
  if (errS) errS.textContent = '';
}

async function authDoLogin() {
  const btn = document.getElementById('auth-login-btn');
  btn.disabled = true;
  btn.textContent = 'AUTHENTICATING...';

  const email    = document.getElementById('auth-email-l').value;
  const password = document.getElementById('auth-pass-l').value;
  const result   = await logIn(email, password);

  if (!result.ok) {
    document.getElementById('auth-err-l').textContent = result.err;
    btn.disabled = false;
    btn.textContent = 'INITIATE LOGIN';
    return;
  }

  // Logged in — check if user already has a team
  if (result.teamId) {
    // Redirect to existing profile
    if (typeof staticCut === 'function') {
      staticCut(() => { window.location.href = 'profile.html?id=' + result.teamId; });
    } else {
      window.location.href = 'profile.html?id=' + result.teamId;
    }
  } else {
    // Show registration form
    authGatePassed();
  }
}

async function authDoSignup() {
  const btn = document.getElementById('auth-signup-btn');
  btn.disabled = true;
  btn.textContent = 'CREATING ACCOUNT...';

  const email  = document.getElementById('auth-email-s').value;
  const pass1  = document.getElementById('auth-pass-s').value;
  const pass2  = document.getElementById('auth-pass-s2').value;

  if (pass1 !== pass2) {
    document.getElementById('auth-err-s').textContent = 'PASSWORDS DO NOT MATCH';
    btn.disabled = false;
    btn.textContent = 'CREATE ACCOUNT';
    return;
  }

  const result = await signUp(email, pass1);

  if (!result.ok) {
    document.getElementById('auth-err-s').textContent = result.err;
    btn.disabled = false;
    btn.textContent = 'CREATE ACCOUNT';
    return;
  }

  // Account created — show registration form
  authGatePassed();
}

function authGatePassed() {
  // Hide gate, show registration flow
  const gate = document.getElementById('auth-gate');
  const regContent = document.getElementById('reg-content');
  if (gate) gate.style.display = 'none';
  if (regContent) regContent.style.display = '';
  if (typeof setStep === 'function') setStep(1); // proceed to step 1
}

// Call this on DOMContentLoaded in registration.html
function authGateInit() {
  const user = getLoggedInUser();

  if (!user) {
    // Not logged in — show gate, hide registration
    document.getElementById('auth-gate').style.display = '';
    document.getElementById('reg-content').style.display = 'none';
  } else if (user.teamId) {
    // Already registered — redirect to profile immediately
    window.location.href = 'profile.html?id=' + user.teamId;
  } else {
    // Logged in but not registered — show registration
    document.getElementById('auth-gate').style.display = 'none';
    document.getElementById('reg-content').style.display = '';
    if (typeof setStep === 'function') setStep(1);
  }
}
