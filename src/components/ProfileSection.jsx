import Icon from './Icon';
import { fmt } from '../utils/analysis';

export default function ProfileSection({ profile, report, isDemo }) {
  return (
    <section className="section profile-section" id="analysis">
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 / PROFILE READ</p>
          <h2>
            A quick read on <em>{profile.login}</em>
          </h2>
        </div>
        <span className="demo-badge">
          {isDemo ? 'DEMO PROFILE' : 'LIVE ANALYSIS'} <span />
        </span>
      </div>
      <div className="profile-grid">
        <article className="profile-card">
          <div className="profile-top">
            <img src={profile.avatar_url} alt="" className="avatar" />
            <div>
              <h3>{profile.name || profile.login}</h3>
              <p className="handle">@{profile.login}</p>
            </div>
            <a
              className="external-link"
              href={`https://github.com/${profile.login}`}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="arrow" />
            </a>
          </div>
          <p className="bio">
            {profile.bio || 'This developer keeps their profile intentionally quiet.'}
          </p>
          <div className="profile-meta">
            <span>
              <i className="meta-icon">@</i>
              {profile.company || 'Independent'}
            </span>
            <span>
              <i className="meta-icon">
                <Icon name="globe" />
              </i>
              {profile.location || 'Earth'}
            </span>
          </div>
          <div className="profile-stats">
            <div>
              <strong>{fmt(profile.followers)}</strong>
              <span>Followers</span>
            </div>
            <div>
              <strong>{fmt(profile.following)}</strong>
              <span>Following</span>
            </div>
            <div>
              <strong>{fmt(profile.public_repos)}</strong>
              <span>Repositories</span>
            </div>
          </div>
        </article>
        <div className="score-card">
          <div className="score-card-head">
            <span className="eyebrow">OVERALL PORTFOLIO SCORE</span>
            <span className="score-ring-label">A-</span>
          </div>
          <div className="score-number">
            {report.score}
            <small>/100</small>
          </div>
          <div className="score-meter">
            <span style={{ width: `${report.score}%` }} />
          </div>
          <p>
            {report.score >= 80
              ? 'A strong, credible portfolio with clear evidence of shipping.'
              : 'A promising portfolio with a few opportunities to make the signal stronger.'}
          </p>
          <div className="score-foot">
            <span>
              <Icon name="check" /> {report.recent} active this year
            </span>
            <span>
              <Icon name="star" /> {fmt(report.averageStars)} avg stars
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
