import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchProfile } from '../api/github';
import { analyze } from '../utils/analysis';

const DEMO_PROFILE = {
  login: 'octocat',
  name: 'The Octocat',
  bio: 'GitHub mascot, open source explorer, and professional octopus.',
  avatar_url:
    'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  followers: 1128,
  following: 9,
  public_repos: 8,
  public_gists: 2,
  location: 'San Francisco, CA',
  company: '@github',
  blog: 'github.blog',
  created_at: '2011-01-25T18:44:36Z',
};

const DEMO_REPOS = [
  {
    name: 'Hello-World',
    description: 'My first repository on GitHub!',
    stargazers_count: 218,
    forks_count: 86,
    language: 'Ruby',
    open_issues_count: 1,
    size: 32,
    updated_at: '2026-07-24T12:00:00Z',
    topics: ['tutorial', 'getting-started'],
    license: { spdx_id: 'MIT' },
    default_branch: 'master',
    html_url: 'https://github.com/octocat/Hello-World',
  },
  {
    name: 'Spoon-Knife',
    description: 'This repo is for demonstration purposes only.',
    stargazers_count: 12800,
    forks_count: 13800,
    language: 'HTML',
    open_issues_count: 4,
    size: 106,
    updated_at: '2026-06-19T12:00:00Z',
    topics: ['demo', 'html', 'css'],
    license: { spdx_id: 'MIT' },
    default_branch: 'main',
    html_url: 'https://github.com/octocat/Spoon-Knife',
  },
  {
    name: 'octocat.github.io',
    description: 'The home of the Octocat on the web.',
    stargazers_count: 84,
    forks_count: 26,
    language: 'JavaScript',
    open_issues_count: 0,
    size: 2840,
    updated_at: '2026-04-09T12:00:00Z',
    topics: ['website', 'github-pages'],
    license: { spdx_id: 'MIT' },
    default_branch: 'main',
    html_url: 'https://github.com/octocat/octocat.github.io',
  },
  {
    name: 'linguist',
    description:
      "Language Savant. If your repository's language is being incorrectly reported, send us a pull request!",
    stargazers_count: 12500,
    forks_count: 4400,
    language: 'Ruby',
    open_issues_count: 29,
    size: 16500,
    updated_at: '2026-02-22T12:00:00Z',
    topics: ['language', 'github', 'linguistics'],
    license: { spdx_id: 'MIT' },
    default_branch: 'main',
    html_url: 'https://github.com/github-linguist/linguist',
  },
  {
    name: 'hubot',
    description: 'A customizable life embetterment robot.',
    stargazers_count: 22000,
    forks_count: 3100,
    language: 'CoffeeScript',
    open_issues_count: 17,
    size: 6800,
    updated_at: '2025-11-13T12:00:00Z',
    topics: ['bot', 'automation'],
    license: { spdx_id: 'MIT' },
    default_branch: 'main',
    html_url: 'https://github.com/github/hubot',
  },
];

export function useProfile() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const report = useMemo(() => analyze(profile, repos), [profile, repos]);

  const loadProfile = useCallback(
    async (name) => {
      const cleanName = (typeof name === 'string' ? name : username).trim();
      if (!cleanName) {
        setError('Please enter a GitHub username.');
        return;
      }
      setLoading(true);
      setError('');
      setIsDemo(false);
      try {
        const data = await fetchProfile(cleanName);
        setProfile(data.profile);
        setRepos(data.repos);
        setUsername(cleanName);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [username],
  );

  // Auto-load from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    if (userParam) {
      setUsername(userParam);
      loadProfile(userParam);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    username,
    setUsername,
    profile,
    repos,
    loading,
    error,
    isDemo,
    report,
    loadProfile,
  };
}
