import { useState } from 'react';
import Icon from './Icon';

export default function ShareModal({ profile, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}${window.location.pathname}?user=${encodeURIComponent(profile.login)}`;
  const shareText = `Check out @${profile.login}'s developer portfolio on Git-Insider 🚀`;

  function copyLink() {
    window.history.replaceState({}, '', `?user=${encodeURIComponent(profile.login)}`);
    if (navigator.clipboard) navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Share this report</h3>
          <button className="modal-close" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <p className="modal-description">
          Share <strong>@{profile.login}</strong>'s portfolio analysis with anyone.
        </p>
        <div className="share-url-box">
          <input value={shareUrl} readOnly aria-label="Share URL" />
          <button className="share-copy-btn" onClick={copyLink}>
            <Icon name={copied ? 'check' : 'copy'} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="share-social">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noreferrer"
            className="social-btn twitter"
          >
            <Icon name="twitter" /> Share on X
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="social-btn linkedin"
          >
            <Icon name="linkedin" /> Share on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
