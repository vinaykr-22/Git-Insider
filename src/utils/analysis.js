export const LANGUAGE_COLORS = ['#e36d4c', '#1e7c68', '#e9b949', '#466db2', '#a98bce', '#9a9b94'];

export const fmt = (n) =>
  new Intl.NumberFormat('en', {
    notation: n > 999 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(n || 0);

export const dateFmt = (date) =>
  new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(date));

export const ago = (date) => {
  const days = Math.max(0, Math.floor((Date.now() - new Date(date)) / 86400000));
  return days < 30 ? `${days}d ago` : `${Math.floor(days / 30)}mo ago`;
};

export function getRepoScore(repo) {
  return Math.min(
    100,
    (repo.description ? 15 : 0) +
      (repo.license ? 10 : 0) +
      (repo.topics?.length ? 10 : 0) +
      Math.min(15, Math.round(repo.stargazers_count / 100)) +
      Math.min(10, Math.round(repo.forks_count / 100)) +
      (new Date(repo.updated_at) > new Date(Date.now() - 365 * 86400000) ? 20 : 5) +
      (repo.name.length > 3 && !repo.name.includes('repo') ? 10 : 5) +
      20,
  );
}

export function analyze(profile, repos = []) {
  const safeRepos = Array.isArray(repos) ? repos : [];
  const languageCounts = safeRepos.reduce((acc, repo) => {
    if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
    return acc;
  }, {});
  const languages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);
  const total = safeRepos.length || 1;
  const scores = safeRepos.map(getRepoScore);
  const score = safeRepos.length
    ? Math.round(scores.reduce((sum, item) => sum + item, 0) / total)
    : 0;
  const recent = safeRepos.filter(
    (repo) => new Date(repo.updated_at).getFullYear() === new Date().getFullYear(),
  ).length;

  return {
    languages,
    languagePercent: languages.map(([name, count]) => ({
      name,
      percent: Math.round((count / total) * 100),
      color:
        LANGUAGE_COLORS[languages.findIndex(([item]) => item === name)] || LANGUAGE_COLORS[5],
    })),
    score,
    recent,
    averageStars: safeRepos.length
      ? Math.round(safeRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0) / total)
      : 0,
    averageForks: safeRepos.length
      ? Math.round(safeRepos.reduce((sum, repo) => sum + repo.forks_count, 0) / total)
      : 0,
    newest:
      safeRepos
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at),
        )[0] || null,
    oldest:
      safeRepos
        .slice()
        .sort(
          (a, b) =>
            new Date(a.created_at || a.updated_at) - new Date(b.created_at || b.updated_at),
        )[0] || null,
    topRepo: safeRepos.slice().sort((a, b) => b.stargazers_count - a.stargazers_count)[0] || null,
    profile,
    repos: safeRepos,
  };
}

export function categorizeRepo(repo) {
  const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
  if (/ai|ml|machine|neural|llm|model/.test(text)) return 'AI / ML';
  if (/mobile|android|ios|react native|flutter/.test(text)) return 'Mobile';
  if (/api|backend|server|node|django|fastapi|rails/.test(text)) return 'Backend';
  if (/cli|command line|terminal/.test(text)) return 'CLI';
  if (/devops|docker|kubernetes|terraform|github action/.test(text)) return 'DevOps';
  if (/game|unity|phaser|godot/.test(text)) return 'Games';
  if (/web|site|frontend|react|css|html|next/.test(text)) return 'Web';
  return 'Open source';
}

/* ── Tech Stack Detection ────────────────────────────────────────── */

const TECH_PATTERNS = {
  Frameworks: {
    React: /\breact\b/i,
    'Next.js': /\bnext\.?js\b/i,
    Vue: /\bvue\b/i,
    Angular: /\bangular\b/i,
    Svelte: /\bsvelte\b/i,
    Django: /\bdjango\b/i,
    Flask: /\bflask\b/i,
    FastAPI: /\bfastapi\b/i,
    Express: /\bexpress\b/i,
    Rails: /\brails\b/i,
    Spring: /\bspring\b/i,
    Laravel: /\blaravel\b/i,
    Flutter: /\bflutter\b/i,
    'React Native': /\breact.native\b/i,
    Gatsby: /\bgatsby\b/i,
    Nuxt: /\bnuxt\b/i,
    Remix: /\bremix\b/i,
    Astro: /\bastro\b/i,
    Electron: /\belectron\b/i,
    Tauri: /\btauri\b/i,
  },
  Databases: {
    PostgreSQL: /\bpostgres(?:ql)?\b/i,
    MongoDB: /\bmongo(?:db)?\b/i,
    MySQL: /\bmysql\b/i,
    Redis: /\bredis\b/i,
    SQLite: /\bsqlite\b/i,
    Firebase: /\bfirebase\b/i,
    Supabase: /\bsupabase\b/i,
    DynamoDB: /\bdynamodb\b/i,
    Prisma: /\bprisma\b/i,
  },
  'DevOps & Cloud': {
    Docker: /\bdocker\b/i,
    Kubernetes: /\bkubernetes\b|\bk8s\b/i,
    AWS: /\baws\b/i,
    GCP: /\bgcp\b|\bgoogle.cloud\b/i,
    Azure: /\bazure\b/i,
    Terraform: /\bterraform\b/i,
    'GitHub Actions': /\bgithub.action/i,
    'CI/CD': /\bci.?cd\b|\bjenkins\b/i,
    Vercel: /\bvercel\b/i,
    Netlify: /\bnetlify\b/i,
    Nginx: /\bnginx\b/i,
  },
  'AI & ML': {
    TensorFlow: /\btensorflow\b/i,
    PyTorch: /\bpytorch\b/i,
    OpenAI: /\bopenai\b/i,
    LangChain: /\blangchain\b/i,
    'Hugging Face': /\bhugging.?face\b|\btransformers\b/i,
    'scikit-learn': /\bscikit\b|\bsklearn\b/i,
    Keras: /\bkeras\b/i,
    LLM: /\bllm\b/i,
  },
  Testing: {
    Jest: /\bjest\b/i,
    Cypress: /\bcypress\b/i,
    Playwright: /\bplaywright\b/i,
    Vitest: /\bvitest\b/i,
    pytest: /\bpytest\b/i,
    Mocha: /\bmocha\b/i,
  },
  Tools: {
    GraphQL: /\bgraphql\b/i,
    'REST API': /\brest\b.*\bapi\b|\brestful\b/i,
    WebSocket: /\bwebsocket\b/i,
    gRPC: /\bgrpc\b/i,
    Webpack: /\bwebpack\b/i,
    Vite: /\bvite\b/i,
    TypeScript: /\btypescript\b/i,
    Tailwind: /\btailwind\b/i,
    Sass: /\bsass\b|\bscss\b/i,
    Storybook: /\bstorybook\b/i,
  },
};

export function detectTechStack(repos) {
  const found = {};
  const allText = repos
    .map(
      (repo) =>
        `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')} ${repo.language || ''}`,
    )
    .join(' ');

  for (const [category, techs] of Object.entries(TECH_PATTERNS)) {
    for (const [name, pattern] of Object.entries(techs)) {
      if (pattern.test(allText)) {
        if (!found[category]) found[category] = [];
        found[category].push(name);
      }
    }
  }

  // Add top languages as detected tech
  const langCounts = repos.reduce((acc, repo) => {
    if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
    return acc;
  }, {});
  const topLangs = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang]) => lang);
  if (topLangs.length) {
    found.Languages = topLangs;
  }

  return found;
}

/* ── SVG Badge Generator ─────────────────────────────────────────── */

export function generateBadgeSVG(username, score, topLanguage) {
  const grade =
    score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : 'C';
  const gradeColor =
    score >= 80 ? '#1e7c68' : score >= 60 ? '#e9b949' : '#e36d4c';
  const labelWidth = 100;
  const scoreWidth = 80;
  const langWidth = topLanguage ? topLanguage.length * 7.2 + 20 : 0;
  const totalWidth = labelWidth + scoreWidth + langWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="22" role="img" aria-label="Git-Insider: ${score}/100">
  <title>Git-Insider: ${score}/100</title>
  <linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
  <clipPath id="r"><rect width="${totalWidth}" height="22" rx="4" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="22" fill="#2a3a34"/>
    <rect x="${labelWidth}" width="${scoreWidth}" height="22" fill="${gradeColor}"/>
    ${topLanguage ? `<rect x="${labelWidth + scoreWidth}" width="${langWidth}" height="22" fill="#466db2"/>` : ''}
    <rect width="${totalWidth}" height="22" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="15" fill="#fff">Git-Insider</text>
    <text x="${labelWidth + scoreWidth / 2}" y="15" font-weight="bold">${grade} · ${score}</text>
    ${topLanguage ? `<text x="${labelWidth + scoreWidth + langWidth / 2}" y="15">${topLanguage}</text>` : ''}
  </g>
</svg>`;
}
