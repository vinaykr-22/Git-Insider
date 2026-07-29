import { useState, useEffect } from 'react';
import Icon from './Icon';
import { getStoredToken, setToken, clearCache, getRateLimit } from '../api/github';

export default function SettingsModal({ isOpen, onClose }) {
  const [tokenValue, setTokenValue] = useState('');
  const [rateLimit, setRateLimit] = useState(null);
  const [saved, setSaved] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTokenValue(getStoredToken());
      setSaved(false);
      setCleared(false);
      getRateLimit().then(setRateLimit);
    }
  }, [isOpen]);

  function handleSaveToken() {
    setToken(tokenValue.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // Refresh rate limit
    getRateLimit().then(setRateLimit);
  }

  function handleRemoveToken() {
    setToken('');
    setTokenValue('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    getRateLimit().then(setRateLimit);
  }

  function handleClearCache() {
    clearCache();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Icon name="settings" /> Settings
          </h3>
          <button className="modal-close" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        {/* GitHub Token */}
        <div className="settings-group">
          <label className="settings-label">GitHub Personal Access Token</label>
          <p className="settings-help">
            Adding a token raises the API rate limit from 60 to 5,000 requests/hour. Your
            token is stored locally in your browser only — it is never sent to any
            third-party server.
          </p>
          <div className="settings-token-row">
            <input
              type="password"
              value={tokenValue}
              onChange={(e) => setTokenValue(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              aria-label="GitHub token"
            />
            <button className="outline-button" onClick={handleSaveToken}>
              <Icon name={saved ? 'check' : 'check'} />
              {saved ? 'Saved!' : 'Save'}
            </button>
            {tokenValue && (
              <button className="outline-button settings-remove" onClick={handleRemoveToken}>
                <Icon name="close" /> Remove
              </button>
            )}
          </div>
        </div>

        {/* Rate Limit Status */}
        <div className="settings-group">
          <label className="settings-label">API Rate Limit</label>
          {rateLimit ? (
            <div className="settings-rate">
              <div className="settings-rate-bar">
                <div
                  className="settings-rate-fill"
                  style={{
                    width: `${(rateLimit.remaining / rateLimit.limit) * 100}%`,
                  }}
                />
              </div>
              <span>
                <strong>{rateLimit.remaining}</strong> / {rateLimit.limit} remaining
              </span>
              <span className="settings-rate-reset">
                Resets {new Date(rateLimit.reset * 1000).toLocaleTimeString()}
              </span>
            </div>
          ) : (
            <p className="settings-help">Unable to fetch rate limit status.</p>
          )}
        </div>

        {/* Cache Management */}
        <div className="settings-group">
          <label className="settings-label">Cache Management</label>
          <p className="settings-help">
            Profile data is cached for 1 hour to reduce API usage. Clear the cache to
            fetch fresh data.
          </p>
          <button className="outline-button" onClick={handleClearCache}>
            <Icon name={cleared ? 'check' : 'close'} />
            {cleared ? 'Cache cleared!' : 'Clear cache'}
          </button>
        </div>
      </div>
    </div>
  );
}
