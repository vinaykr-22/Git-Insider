import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useProfile } from './hooks/useProfile';
import Header from './components/Header';
import Hero from './components/Hero';
import ProfileSection from './components/ProfileSection';
import MetricsSection from './components/MetricsSection';
import RepoSection from './components/RepoSection';
import HealthSection from './components/HealthSection';
import TechStackSection from './components/TechStackSection';
import InsightSection from './components/InsightSection';
import ExportSection from './components/ExportSection';
import BadgeSection from './components/BadgeSection';
import CompareMode from './components/CompareMode';
import ShareModal from './components/ShareModal';
import SettingsModal from './components/SettingsModal';

function App() {
  const [dark, setDark] = useTheme();
  const {
    username, setUsername,
    profile, repos,
    loading, error, isDemo,
    report, loadProfile,
  } = useProfile();

  const [viewMode, setViewMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('compare') ? 'compare' : 'single';
  });
  const [shareOpen, setShareOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState('');

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function handleLoadProfile(arg) {
    if (arg && typeof arg.preventDefault === 'function') {
      arg.preventDefault();
    }
    const nameToLoad = typeof arg === 'string' ? arg : username;
    loadProfile(nameToLoad);
  }

  return (
    <div className="app-shell">
      <Header
        dark={dark}
        setDark={setDark}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <main id="top">
        {viewMode === 'compare' ? (
          <CompareMode />
        ) : (
          <>
            <Hero
              username={username}
              setUsername={setUsername}
              loading={loading}
              loadProfile={handleLoadProfile}
              error={error}
              report={report}
              profile={profile}
            />
            {profile ? (
              <>
                <ProfileSection profile={profile} report={report} isDemo={isDemo} />
                <MetricsSection profile={profile} report={report} />
                <RepoSection
                  repos={repos}
                  report={report}
                  onShare={() => setShareOpen(true)}
                />
                <HealthSection repos={repos} report={report} />
                <TechStackSection repos={repos} />
                <InsightSection report={report} />
                <BadgeSection profile={profile} report={report} />
                <ExportSection
                  profile={profile}
                  repos={repos}
                  report={report}
                  showToast={showToast}
                />
              </>
            ) : (
              <section className="section empty-landing-section">
                <div className="empty-landing-card">
                  <h3>Ready for GitHub portfolio intelligence</h3>
                  <p>
                    Enter any public GitHub handle above (such as <code>octocat</code>, <code>torvalds</code>, or <code>gaearon</code>) to analyze repository quality, technology stack, and activity signals.
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <footer id="about">
        <a className="brand" href="#top">
          <span className="brand-mark">GI</span>
          <span>git-insider</span>
        </a>
        <p>Read the work. Find the signal.</p>
        <span>Built for people who build.</span>
      </footer>
      <ShareModal
        profile={profile}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
