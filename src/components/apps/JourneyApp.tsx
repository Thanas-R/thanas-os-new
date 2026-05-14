import { useState, useEffect } from 'react';
import { MacSpinner } from '@/components/macos/RestartScreen';

const SITE_URL = 'https://thanas.vercel.app/';

export const JourneyApp = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-white dark:bg-neutral-900">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-neutral-900 z-10">
          <MacSpinner size={42} color="#69717d" />
        </div>
      )}

      <div
        className="absolute pointer-events-none"
        style={{
          top: 8, left: 8, width: 64, height: 28, borderRadius: 999,
          background: 'rgba(22,27,34,0.78)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          zIndex: 5,
        }}
      />

      <iframe
        src={SITE_URL}
        title="Journey"
        className="absolute inset-0 w-full h-full border-0"
        onLoad={() => setLoading(false)}
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};
