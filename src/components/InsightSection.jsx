import Icon from './Icon';

export default function InsightSection({ report }) {
  return (
    <section className="section insight-section">
      <div className="insight-intro">
        <p className="eyebrow">05 / THE INSIDER TAKE</p>
        <h2>
          Useful feedback,
          <br />
          <em>not empty praise.</em>
        </h2>
        <p>
          Every profile gets a practical read based on what is actually visible in the work:
          consistency, clarity, and proof of craft.
        </p>
      </div>
      <div className="insight-list">
        <article>
          <span className="insight-number">01</span>
          <div>
            <span className="insight-type">STRENGTH</span>
            <h3>Clear project momentum</h3>
            <p>
              {report.recent
                ? `${report.recent} repositories updated this year suggests this portfolio is still moving.`
                : 'A focused set of projects can become a stronger story with more recent activity.'}
            </p>
          </div>
          <Icon name="check" />
        </article>
        <article>
          <span className="insight-number">02</span>
          <div>
            <span className="insight-type">OPPORTUNITY</span>
            <h3>Make the first read count</h3>
            <p>
              Lead with a pinned project that has a crisp README, a live demo, and one
              sentence on the problem it solves.
            </p>
          </div>
          <Icon name="arrow" />
        </article>
        <article>
          <span className="insight-number">03</span>
          <div>
            <span className="insight-type">NEXT MOVE</span>
            <h3>Show how you ship</h3>
            <p>
              Add a small CI workflow, tests, or a deployment story. These are high-signal
              details for a recruiter skimming fast.
            </p>
          </div>
          <Icon name="spark" />
        </article>
      </div>
    </section>
  );
}
