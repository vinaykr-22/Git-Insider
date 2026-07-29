import { useMemo, useState } from 'react';
import Icon from './Icon';
import { generateBadgeSVG } from '../utils/analysis';

export default function BadgeSection({ profile, report }) {
  const [copied, setCopied] = useState('');

  const topLang = report.languagePercent[0]?.name || '';
  const badgeSVG = useMemo(
    () => generateBadgeSVG(profile.login, report.score, topLang),
    [profile.login, report.score, topLang],
  );
  const badgeDataUri = useMemo(
    () => `data:image/svg+xml,${encodeURIComponent(badgeSVG)}`,
    [badgeSVG],
  );

  const markdownSnippet = `![Git-Insider Score](${badgeDataUri})`;
  const htmlSnippet = `<img src="${badgeDataUri}" alt="Git-Insider Score: ${report.score}/100" />`;

  function copyText(text, label) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  }

  function downloadBadge() {
    const blob = new Blob([badgeSVG], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `git-insider-${profile.login}-badge.svg`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <section className="section badge-section">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">
            <Icon name="badge" /> README BADGE
          </p>
          <h2>
            Show your score <em>everywhere.</em>
          </h2>
        </div>
        <p className="section-intro">
          Add a dynamic badge to your GitHub profile README to showcase your portfolio
          score.
        </p>
      </div>
      <div className="badge-content">
        <div className="badge-preview">
          <p className="mini-label">PREVIEW</p>
          <div className="badge-preview-box">
            <img src={badgeDataUri} alt={`Git-Insider badge for ${profile.login}`} />
          </div>
          <button className="outline-button badge-download" onClick={downloadBadge}>
            <Icon name="download" /> Download SVG
          </button>
        </div>
        <div className="badge-snippets">
          <div className="badge-snippet">
            <div className="badge-snippet-header">
              <span className="mini-label">MARKDOWN</span>
              <button
                className="badge-copy-btn"
                onClick={() => copyText(markdownSnippet, 'md')}
              >
                <Icon name={copied === 'md' ? 'check' : 'copy'} />
                {copied === 'md' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="badge-code">{markdownSnippet}</pre>
          </div>
          <div className="badge-snippet">
            <div className="badge-snippet-header">
              <span className="mini-label">HTML</span>
              <button
                className="badge-copy-btn"
                onClick={() => copyText(htmlSnippet, 'html')}
              >
                <Icon name={copied === 'html' ? 'check' : 'copy'} />
                {copied === 'html' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="badge-code">{htmlSnippet}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
