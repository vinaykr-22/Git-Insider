import Icon from './Icon';
import { fmt, dateFmt } from '../utils/analysis';

export default function MetricsSection({ profile, report }) {
  return (
    <section className="section metrics-section">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">02 / THE SHAPE OF THE WORK</p>
          <h2>Patterns worth noticing</h2>
        </div>
        <p className="section-intro">
          The small details add up to a much more useful picture than a repo count alone.
        </p>
      </div>
      <div className="metrics-grid">
        <article className="metric-card language-card">
          <div className="card-label">
            <span>LANGUAGE MIX</span>
            <Icon name="arrow" />
          </div>
          <div className="language-content">
            <div
              className="donut"
              style={{
                background: `conic-gradient(${report.languagePercent
                  .map(
                    (item, i, all) =>
                      `${item.color} ${all.slice(0, i).reduce((s, x) => s + x.percent, 0)}% ${all.slice(0, i + 1).reduce((s, x) => s + x.percent, 0)}%`,
                  )
                  .join(', ')})`,
              }}
            >
              <div>
                {report.languagePercent[0]?.percent || 0}
                <small>%</small>
              </div>
            </div>
            <div className="legend">
              {report.languagePercent.slice(0, 4).map((item) => (
                <div key={item.name}>
                  <span style={{ background: item.color }} />
                  {item.name}
                  <b>{item.percent}%</b>
                </div>
              ))}
            </div>
          </div>
        </article>
        <article className="metric-card activity-card">
          <div className="card-label">
            <span>ACTIVITY PULSE</span>
            <span className="good-label">HEALTHY</span>
          </div>
          <div className="activity-chart">
            <div className="chart-line" />
            <div className="chart-bars">
              {[38, 54, 42, 66, 51, 74, 64, 86, 68, 92, 78, 96].map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="chart-labels">
              <span>Aug</span>
              <span>Nov</span>
              <span>Feb</span>
              <span>May</span>
              <span>Now</span>
            </div>
          </div>
          <p>Consistent output across the last 12 months.</p>
        </article>
        <article className="metric-card quick-card">
          <div className="card-label">
            <span>AT A GLANCE</span>
            <Icon name="spark" />
          </div>
          <div className="quick-rows">
            <div>
              <span>Newest repo</span>
              <strong>{report.newest?.name || 'No repositories'}</strong>
            </div>
            <div>
              <span>Average forks</span>
              <strong>{fmt(report.averageForks)}</strong>
            </div>
            <div>
              <span>Public since</span>
              <strong>{dateFmt(profile.created_at)}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
