const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const CACHE_PREFIX = 'gi_cache_';

function getToken() {
  try {
    return localStorage.getItem('gi_token') || '';
  } catch {
    return '';
  }
}

function getCached(username) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + username.toLowerCase());
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + username.toLowerCase());
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

function setCache(username, data) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + username.toLowerCase(),
      JSON.stringify({ timestamp: Date.now(), data }),
    );
  } catch {
    /* quota exceeded — ignore */
  }
}

export function clearCache() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) keys.push(key);
    }
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {
    /* ignore */
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem('gi_token', token);
    else localStorage.removeItem('gi_token');
  } catch {
    /* ignore */
  }
}

export function getStoredToken() {
  return getToken();
}

export async function fetchProfile(username) {
  const clean = username.trim();
  if (!clean) throw new Error('Please enter a username.');

  // Check cache first
  const cached = getCached(clean);
  if (cached) return cached;

  const headers = { Accept: 'application/vnd.github+json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const [profileRes, repoRes] = await Promise.all([
    fetch(`https://api.github.com/users/${encodeURIComponent(clean)}`, { headers }),
    fetch(
      `https://api.github.com/users/${encodeURIComponent(clean)}/repos?per_page=100&sort=updated`,
      { headers },
    ),
  ]);

  if (!profileRes.ok) {
    if (profileRes.status === 404)
      throw new Error('We could not find that GitHub profile.');
    if (profileRes.status === 403 || profileRes.status === 429)
      throw new Error(
        'GitHub rate limit reached. Add a personal access token in Settings or try again later.',
      );
    throw new Error(`GitHub error: ${profileRes.status}`);
  }

  const profile = await profileRes.json();
  const repos = await repoRes.json();
  const data = { profile, repos: Array.isArray(repos) ? repos : [] };

  setCache(clean, data);
  return data;
}

export async function getRateLimit() {
  const headers = { Accept: 'application/vnd.github+json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch('https://api.github.com/rate_limit', { headers });
    if (!res.ok) return null;
    const data = await res.json();
    return data.rate;
  } catch {
    return null;
  }
}
