// Authentik OIDC client — PKCE flow, no external library
const AUTHENTIK_URL = import.meta.env.VITE_AUTHENTIK_URL;
const CLIENT_ID = import.meta.env.VITE_AUTHENTIK_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_AUTHENTIK_REDIRECT_URI;
const APP_SLUG = 'truenorth';

// ── PKCE helpers ─────────────────────────────────────────────────────────────

function generateRandomString(length = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values).map(v => chars[v % chars.length]).join('');
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// ── Auth flow ─────────────────────────────────────────────────────────────────

export async function initiateLogin() {
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(16);

  sessionStorage.setItem('pkce_verifier', codeVerifier);
  sessionStorage.setItem('pkce_state', state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  });

  window.location.href = `${AUTHENTIK_URL}/application/o/${APP_SLUG}/authorize/?${params}`;
}

export async function exchangeCode(code, state) {
  const storedState = sessionStorage.getItem('pkce_state');
  const codeVerifier = sessionStorage.getItem('pkce_verifier');

  if (!codeVerifier) throw new Error('No code verifier found — session may have expired');
  if (state !== storedState) throw new Error('State mismatch — possible CSRF');

  sessionStorage.removeItem('pkce_state');
  sessionStorage.removeItem('pkce_verifier');

  const res = await fetch(`${AUTHENTIK_URL}/application/o/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: codeVerifier,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${body}`);
  }

  return res.json();
}

// ── Token / user helpers ──────────────────────────────────────────────────────

export function parseIdToken(idToken) {
  try {
    const payload = idToken.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    throw new Error('Failed to parse id_token');
  }
}

export function storeAuth(tokenData) {
  const claims = parseIdToken(tokenData.id_token);

  const groups = claims.groups || [];
  const isAdmin = groups.some(g => g.toLowerCase().includes('admin'));

  const user = {
    id: claims.sub,
    email: claims.email || '',
    name: claims.name || claims.preferred_username || claims.email || 'User',
    groups,
    role: isAdmin ? 'admin' : 'user',
  };

  sessionStorage.setItem('auth_access_token', tokenData.access_token);
  sessionStorage.setItem('auth_user', JSON.stringify(user));

  return user;
}

export function getStoredAuth() {
  const token = sessionStorage.getItem('auth_access_token');
  const userRaw = sessionStorage.getItem('auth_user');
  if (!token || !userRaw) return null;
  try {
    return { token, user: JSON.parse(userRaw) };
  } catch {
    return null;
  }
}

export function clearAuth() {
  sessionStorage.removeItem('auth_access_token');
  sessionStorage.removeItem('auth_user');
}

export function buildLogoutUrl() {
  const params = new URLSearchParams({
    post_logout_redirect_uri: window.location.origin,
  });
  return `${AUTHENTIK_URL}/application/o/${APP_SLUG}/end-session/?${params}`;
}
