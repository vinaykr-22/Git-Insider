import { useMemo } from 'react';
import Icon from './Icon';
import { categorizeRepo, LANGUAGE_COLORS } from '../utils/analysis';

export default function HealthSection({ repos, report }) {
  const healthChecks = useMemo(
    () => [
      {
        label: 'Repository descriptions',
        value: repos.filter((r) => r.description).length,
        total: repos.length,
      },
      {
        label: 'Licenses in place',
        value: repos.filter((r) => r.license).length,
        total: repos.length,
      },
      {
        label: 'Topic tags',
        value: repos.filter((r) => r.topics?.length).length,
        total: repos.length,
      },
      { label: 'Active in the last year', value: report.recent, total: repos.length },
    ],
    [repos, report.recent],
  );

  const categories = useMemo(
    () =>
      Object.entries(
        repos.reduce((acc, repo) => {
          const cat = categorizeRepo(repo);
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {}),
      ).sort((a, b) => b[1] - a[1]),
    [repos],
  );

  const overallHealth = Math.round(
    (healthChecks.reduce(
      (sum, check) => sum + (check.total ? check.value / check.total : 0),
      0,
    ) /
      healthChecks.length) *
      100,
  );

  return (
    <section className="section health-section">
      <div className="health-panel">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">04 / PORTFOLIO HEALTH</p>
            <h2>
              Make the signal <em>stronger.</em>
            </h2>
          </div>
          <span className="health-score">{overallHealth}%</span>
        </div>
        <div className="health-checks">
          {healthChecks.map((check) => (
            <div className="health-check" key={check.label}>
              <div>
                <span>{check.label}</span>
                <strong>
                  {check.value}/{check.total}
                </strong>
              </div>
              <div className="health-meter">
                <i
                  style={{
                    width: `${check.total ? (check.value / check.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="category-panel">
        <p className="eyebrow">PROJECT MIX</p>
        <h3>
          Different problems,
          <br />
          <em>different muscles.</em>
        </h3>
        <div className="category-list">
          {categories.slice(0, 5).map(([cat, count], index) => (
            <div key={cat}>
              <span
                className="category-dot"
                style={{ background: LANGUAGE_COLORS[index] }}
              />
              {cat}
              <b>{count}</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
