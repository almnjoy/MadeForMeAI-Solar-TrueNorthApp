// Authentik OIDC client — PKCE flow, no external library
// Env vars required:
//   VITE_AUTHENTIK_URL       e.g. https://auth.madeformeai.com
//   VITE_AUTHENTIK_CLIENT_ID  from Authentik provider config
//   VITE_AUTHENTIK_REDIRECT_URI  e.g. https://truenorth.madeformeai.com/callback

const AUTHENTIK_URL = import.meta.env.VITE_AUTHENTIK_URL;
const CLIENT_ID = import.meta.env.VITE_AUTHENTIK_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_AUTHENTIK_REDIRECT_URI;
const APP_SLUG = 'truenorth'; // must match Authentik application slug

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

  const res = 