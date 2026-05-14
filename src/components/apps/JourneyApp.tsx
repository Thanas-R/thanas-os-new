import { useState, useEffect, useMemo } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';

const SITE_URL = 'https://thanas.vercel.app/';

export const JourneyApp = () => {
  const [loading, setLoading] = useState(true);
  const { settings } = useMacOS();

  const iframeSrc = useMemo(() => {
    const theme = settings.theme === 'dark' ? 'dark' : 'light';
    const sep = SITE_URL.includes('?') ? '&' : '?';
    return `${SITE_URL}${sep}theme=${theme}`;
  }, [settings.theme]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const isDark = settings.theme === 'dark';

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${isDark ? 'bg-neutral-900' : 'bg-white'}`}>
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center z-10 ${isDark ? 'bg-neutral-900' : 'bg-white'}`} />
      )}

      <div
        className="absolute pointer-events-none"
        style={{
          top: 8, left: 8, width: 64, height: 28, borderRadius: 999,
          background: isDark ? 'rgba(22,27,34,0.78)' : 'rgba(245,245,247,0.85)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          zIndex: 5,
        }}
      />

      <iframe
        key={iframeSrc}
        src={iframeSrc}
        title="Journey"
        className="absolute inset-0 w-full h-full border-0"
        style={{ colorScheme: isDark ? 'dark' : 'light' }}
        onLoad={() => setLoading(false)}
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};
