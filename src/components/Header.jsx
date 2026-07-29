import Icon from './Icon';

export default function Header({ dark, setDark, viewMode, setViewMode, onOpenSettings }) {
  function handleNavClick(e, targetId) {
    if (viewMode === 'compare') {
      e.preventDefault();
      setViewMode('single');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = `#${targetId}`;
        }
      }, 100);
    }
  }

  return (
    <nav className="topbar">
      <a className="brand" href="#top" onClick={() => setViewMode('single')}>
        <span className="brand-mark">GI</span>
        <span>git-insider</span>
      </a>
      <div className="nav-links">
        <a href="#analysis" onClick={(e) => handleNavClick(e, 'analysis')}>
          Analysis
        </a>
        <a href="#repositories" onClick={(e) => handleNavClick(e, 'repositories')}>
          Repositories
        </a>
        <button
          className={`nav-compare-btn${viewMode === 'compare' ? ' active' : ''}`}
          onClick={() => setViewMode(viewMode === 'compare' ? 'single' : 'compare')}
        >
          <Icon name="compare" /> Compare
        </button>
        <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>
          About
        </a>
      </div>
      <div className="nav-actions">
        <button
          className="theme-toggle"
          onClick={onOpenSettings}
          aria-label="Open settings"
        >
          <Icon name="settings" />
        </button>
        <button
          className="theme-toggle"
          onClick={() => setDark(!dark)}
          aria-label="Toggle color theme"
        >
          <Icon name={dark ? 'sun' : 'moon'} />
        </button>
      </div>
    </nav>
  );
}
