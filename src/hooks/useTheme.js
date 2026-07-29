import { useState, useEffect } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      // Check URL param first
      const params = new URLSearchParams(window.location.search);
      if (params.get('dark') === '1') return true;
      if (params.get('dark') === '0') return false;
      // Then check localStorage
      const saved = localStorage.getItem('gi_theme');
      if (saved) return saved === 'dark';
      // Finally fall back to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try {
      localStorage.setItem('gi_theme', dark ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }, [dark]);

  return [dark, setDark];
}
