import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const SITE_URL = 'https://thanas.vercel.app/';

export const JourneyApp = () => {
  const [loading, setLoading] = useState(true);

  // Iframe load may not fire instantly; hide loader after timeout regardless
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-white">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      )}

      {/* Floating frosted pill behind traffic lights — like GitHub app */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 11, left: 8, width: 64, height: 22, borderRadius: 999,
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
