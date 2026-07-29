import { useState, useMemo } from 'react';
import Icon from './Icon';
import { fetchProfile } from '../api/github';
import { analyze, fmt, LANGUAGE_COLORS } from '../utils/analysis';

function MiniProfile({ data, report, loading, error }) {
  if (loading) {
    return (
      <div className="compare-card compare-loading">
        <div className="compare-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="compare-card compare-error">
        <p>{error}</p>
      </div>
    );
  }
  if (!data) return null;

  const { profile, repos } = data;

  return (
    <div className="compare-card">
      <div className="compare-avatar-row">
        <img src={profile.avatar_url} alt="" className="compare-avatar" />
        <div>
          <h3>{profile.name || profile.login}</h3>
          <p className="handle">@{profile.login}</p>
        </div>
      </div>
      <p className="compare-bio">
        {profile.bio || 'No bio provided.'}
      </p>
      <div className="compare-score-ring">
        <div className="compare-score-value">{report.score}</div>
        <span>/ 100</span>
      </div>
      <div className="compare-stats">
        <div>
          <strong>{fmt(profile.followers)}</strong>
          <span>Followers</span>
        </div>
        <div>
          <strong>{repos.length}</strong>
          <span>Repos</span>
        </div>
        <div>
          <strong>{fmt(report.averageStars)}</strong>
          <span>Avg Stars</span>
        </div>
        <div>
          <strong>{report.recent}</strong>
          <span>Active '26</span>
        </div>
      </div>
      <div className="compare-languages">
        <p className="mini-label">TOP LANGUAGES</p>
        <div className="compare-lang-bars">
          {report.languagePercent.slice(0, 4).map((lang, i) => (
            <div key={lang.name} className="compare-lang-row">
              <span className="compare-lang-name">
                <i style={{ background: LANGUAGE_COLORS[i] }} />
                {lang.name}
              </span>
              <div className="compare-lang-track">
                <div
                  className="compare-lang-fill"
                  style={{
                    width: `${lang.percent}%`,
                    background: LANGUAGE_COLORS[i],
                  }}
                />
              </div>
              <span className="compare-lang-pct">{lang.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CompareMode() {
  const [userA, setUserA] = useState('');
  const [userB, setUserB] = useState('');
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [errorA, setErrorA] = useState('');
  const [errorB, setErrorB] = useState('');

  const reportA = useMemo(
    () => (dataA ? analyze(dataA.profile, dataA.repos) : null),
    [dataA],
  );
  const reportB = useMemo(
    () => (dataB ? analyze(dataB.profile, dataB.repos) : null),
    [dataB],
  );

  async function handleCompare(e) {
    e.preventDefault();
    if (!userA.trim() || !userB.trim()) return;

    // Update URL
    window.history.replaceState(
      {},
      '',
      `?compare=${encodeURIComponent(userA.trim())},${encodeURIComponent(userB.trim())}`,
    );

    setErrorA('');
    setErrorB('');
    setLoadingA(true);
    setLoadingB(true);

    try {
      const result = await fetchProfile(userA.trim());
      setDataA(result);
    } catch (err) {
      setErrorA(err.message);
    } finally {
      setLoadingA(false);
    }

    try {
      const result = await fetchProfile(userB.trim());
      setDataB(result);
    } catch (err) {
      setErrorB(err.message);
    } finally {
      setLoadingB(false);
    }
  }

  // Auto-load from URL params
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const compare = params.get('compare');
    if (compare) {
      const [a, b] = compare.split(',');
      if (a && b) {
        setUserA(a);
        setUserB(b);
        // Trigger compare on next tick
        setTimeout(() => {
          const form = document.getElementById('compare-form');
          if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
        }, 100);
      }
    }
  });

  return (
    <section className="section compare-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <Icon name="compare" /> COMPARE PROFILES
          </p>
          <h2>
            Side by side, <em>signal vs signal.</em>
          </h2>
        </div>
      </div>
      <form className="compare-form" id="compare-form" onSubmit={handleCompare}>
        <div className="compare-inputs">
          <div className="compare-input-group">
            <label>Profile A</label>
            <input
              value={userA}
              onChange={(e) => setUserA(e.target.value)}
              placeholder="e.g. octocat"
              aria-label="First username"
            />
          </div>
          <span className="compare-vs">VS</span>
          <div className="compare-input-group">
            <label>Profile B</label>
            <input
              value={userB}
              onChange={(e) => setUserB(e.target.value)}
              placeholder="e.g. torvalds"
              aria-label="Second username"
            />
          </div>
          <button type="submit" disabled={loadingA || loadingB}>
            {loadingA || loadingB ? 'Comparing...' : 'Compare'}{' '}
            <Icon name="arrow" />
          </button>
        </div>
      </form>
      {(dataA || dataB || loadingA || loadingB || errorA || errorB) && (
        <div className="compare-results">
          <MiniProfile
            data={dataA}
            report={reportA}
            loading={loadingA}
            error={errorA}
          />
          <div className="compare-divider">
            <span>VS</span>
          </div>
          <MiniProfile
            data={dataB}
            report={reportB}
            loading={loadingB}
            error={errorB}
          />
        </div>
      )}
      {reportA && reportB && (
        <div className="compare-bars-section">
          <p className="eyebrow">HEAD-TO-HEAD</p>
          {[
            {
              label: 'Portfolio Score',
              a: reportA.score,
              b: reportB.score,
              max: 100,
            },
            {
              label: 'Avg Stars',
              a: reportA.averageStars,
              b: reportB.averageStars,
              max: Math.max(reportA.averageStars, reportB.averageStars) || 1,
            },
            {
              label: 'Repositories',
              a: dataA.repos.length,
              b: dataB.repos.length,
              max: Math.max(dataA.repos.length, dataB.repos.length) || 1,
            },
            {
              label: 'Active This Year',
              a: reportA.recent,
              b: reportB.recent,
              max: Math.max(reportA.recent, reportB.recent) || 1,
            },
          ].map((metric) => (
            <div className="compare-metric-row" key={metric.label}>
              <span className="compare-metric-label">{metric.label}</span>
              <div className="compare-bar-pair">
                <div className="compare-bar-track">
                  <div
                    className="compare-bar-fill bar-a"
                    style={{ width: `${(metric.a / metric.max) * 100}%` }}
                  />
                </div>
                <div className="compare-bar-values">
                  <span className={metric.a >= metric.b ? 'winner' : ''}>
                    {fmt(metric.a)}
                  </span>
                  <span className={metric.b > metric.a ? 'winner' : ''}>
                    {fmt(metric.b)}
                  </span>
                </div>
                <div className="compare-bar-track">
                  <div
                    className="compare-bar-fill bar-b"
                    style={{ width: `${(metric.b / metric.max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
