import Icon from './Icon';
import { fmt, getRepoScore, categorizeRepo } from '../utils/analysis';

export default function ExportSection({ profile, repos, report, showToast }) {
  function downloadReport(format) {
    const payload = {
      profile,
      portfolioScore: report.score,
      repositories: repos.map((repo) => ({
        name: repo.name,
        category: categorizeRepo(repo),
        qualityScore: getRepoScore(repo),
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
      })),
    };
    const markdown = `# Git-Insider report: ${profile.login}\n\nPortfolio score: **${report.score}/100**\n\n## Snapshot\n- ${repos.length} public repositories\n- ${fmt(profile.followers)} followers\n- ${report.recent} repositories updated this year\n\n## Repositories\n${repos.map((repo) => `- **${repo.name}** (${getRepoScore(repo)}/100) - ${repo.description || 'No description'}`).join('\n')}\n`;
    const blob = new Blob(
      [format === 'json' ? JSON.stringify(payload, null, 2) : markdown],
      { type: format === 'json' ? 'application/json' : 'text/markdown' },
    );
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `git-insider-${profile.login}.${format === 'json' ? 'json' : 'md'}`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(`${format.toUpperCase()} report downloaded`);
  }

  function printResume() {
    window.print();
  }

  return (
    <section className="section resume-section">
      <div>
        <p className="eyebrow">06 / READY FOR THE NEXT STEP?</p>
        <h2>
          Turn the profile
          <br />
          <em>into a story.</em>
        </h2>
      </div>
      <div className="resume-copy">
        <p>
          Use this read to shape a sharper resume, a better README, or a more confident
          conversation with your next team.
        </p>
        <div className="export-actions">
          <button className="outline-button" onClick={() => downloadReport('json')}>
            <Icon name="download" /> JSON
          </button>
          <button className="outline-button" onClick={() => downloadReport('md')}>
            <Icon name="download" /> Markdown
          </button>
          <button className="outline-button" onClick={printResume}>
            <Icon name="download" /> Print Resume
          </button>
        </div>
      </div>
    </section>
  );
}
