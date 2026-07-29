import Icon from './Icon';

export default function Hero({ username, setUsername, loading, loadProfile, error, report, profile }) {
  function handleSubmit(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    loadProfile(username);
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            GITHUB PORTFOLIO INTELLIGENCE <span className="eyebrow-dot" />
          </p>
          <h1>
            See the signal
            <br />
            <em>behind the code.</em>
          </h1>
          <p className="hero-text">
            A clearer read on how someone builds, ships, and grows. Turn a GitHub profile
            into a portfolio that speaks for itself.
          </p>
          <form className="search-box" onSubmit={handleSubmit}>
            <span className="search-icon">
              <Icon name="search" />
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a GitHub username"
              aria-label="GitHub username"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Reading...' : 'Analyze'} <Icon name="arrow" />
            </button>
          </form>
          {error && <p className="error-text">{error}</p>}
          <p className="search-note">
            <span className="live-dot" /> Public profiles only. No sign-in required.
          </p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="art-card art-card-score">
            <span className="mini-label">PORTFOLIO SCORE</span>
            <strong>
              {profile ? report.score : '--'}
              <small>/100</small>
            </strong>
            <span className="score-status">
              {profile ? (report.score >= 80 ? 'Strong signal' : 'Room to grow') : 'Ready to analyze'} <Icon name="arrow" />
            </span>
          </div>
          <div className="art-card art-card-languages">
            <span className="mini-label">LANGUAGES</span>
            <div className="art-bars">
              {profile && report.languagePercent.length > 0 ? (
                report.languagePercent.slice(0, 3).map((language) => (
                  <div className="art-bar" key={language.name}>
                    <span>{language.name}</span>
                    <b
                      style={{
                        width: `${Math.max(language.percent, 18)}%`,
                        background: language.color,
                      }}
                    />
                  </div>
                ))
              ) : (
                <p style={{ margin: '10px 0 0', fontSize: '10px', color: 'var(--muted)' }}>
                  Enter a username above to analyze
                </p>
              )}
            </div>
          </div>
          <div className="art-caption">
            REPO
            <br />
            HEALTH <span>+</span>
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <span>READING THE DETAILS THAT MATTER</span>
        <span>QUALITY</span>
        <span>ACTIVITY</span>
        <span>CRAFT</span>
        <span>IMPACT</span>
      </section>
    </>
  );
}
