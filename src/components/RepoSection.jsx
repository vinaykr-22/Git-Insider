import { useState, useMemo } from 'react';
import Icon from './Icon';
import { fmt, getRepoScore, LANGUAGE_COLORS } from '../utils/analysis';

export default function RepoSection({ repos, report, onShare }) {
  const [showAll, setShowAll] = useState(false);
  const [repoQuery, setRepoQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('quality');

  const languages = useMemo(
    () => ['all', ...new Set(repos.map((r) => r.language).filter(Boolean))],
    [repos],
  );

  const filteredRepos = useMemo(
    () =>
      repos
        .filter((repo) => {
          const haystack =
            `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
          return (
            haystack.includes(repoQuery.toLowerCase()) &&
            (languageFilter === 'all' || repo.language === languageFilter)
          );
        })
        .sort((a, b) =>
          sortBy === 'stars'
            ? b.stargazers_count - a.stargazers_count
            : sortBy === 'updated'
              ? new Date(b.updated_at) - new Date(a.updated_at)
              : getRepoScore(b) - getRepoScore(a),
        ),
    [repos, repoQuery, languageFilter, sortBy],
  );

  return (
    <section className="section repos-section" id="repositories">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">03 / REPOSITORY QUALITY</p>
          <h2>The work, up close</h2>
        </div>
        <div className="repo-actions">
          <button className="text-button" onClick={onShare}>
            Share report <Icon name="arrow" />
          </button>
          <button className="text-button" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show less' : `View all ${repos.length} repositories`}{' '}
            <Icon name="arrow" />
          </button>
        </div>
      </div>
      <div className="repo-toolbar">
        <input
          value={repoQuery}
          onChange={(e) => setRepoQuery(e.target.value)}
          placeholder="Search repositories, topics, descriptions"
          aria-label="Search repositories"
        />
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          aria-label="Filter by language"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang === 'all' ? 'All languages' : lang}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort repositories"
        >
          <option value="quality">Sort: quality score</option>
          <option value="stars">Sort: most stars</option>
          <option value="updated">Sort: recently updated</option>
        </select>
      </div>
      <div className="repo-list">
        {(showAll ? filteredRepos : filteredRepos.slice(0, 4)).map((repo) => (
          <a
            className="repo-row"
            key={repo.id || repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
          >
            <div className="repo-name">
              <span className="repo-icon">
                <Icon name="fork" />
              </span>
              <div>
                <h3>{repo.name}</h3>
                <p>{repo.description || 'No description yet.'}</p>
              </div>
            </div>
            <div className="repo-language">
              <span
                style={{
                  background:
                    LANGUAGE_COLORS[
                      (report.languages.findIndex(([name]) => name === repo.language) + 6) %
                        6
                    ],
                }}
              />
              {repo.language || 'Other'}
            </div>
            <div className="repo-stat">
              <Icon name="star" /> {fmt(repo.stargazers_count)}
            </div>
            <div className="repo-stat">
              <Icon name="fork" /> {fmt(repo.forks_count)}
            </div>
            <div className="repo-score">
              <span>QUALITY</span>
              <strong>{getRepoScore(repo)}</strong>
            </div>
            <Icon name="arrow" />
          </a>
        ))}
        {!filteredRepos.length && (
          <p className="empty-state">No repositories match that search.</p>
        )}
      </div>
    </section>
  );
}
