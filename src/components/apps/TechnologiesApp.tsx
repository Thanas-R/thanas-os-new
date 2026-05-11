import { useState, useEffect } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';

// VS Code app: loads the project repo via the github1s VS Code-style web editor.
// We avoid showing the underlying repo URL in the UI and remove every
// browser-style chrome row so it feels like the native app.
//
// Note: vscode.dev sets X-Frame-Options that block iframe embedding. github1s
// is the closest open alternative that renders a VS Code interface in an
// iframe-friendly way. If even that ever blocks framing, the fallback CTA
// below opens the editor in a new tab.
const EDITOR_SRC = 'https://github1s.com/Thanas-R/thanas-OS';

export const TechnologiesApp = () => {
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);

  // If the iframe doesn't fire onLoad within 6s, assume the host blocked us.
  useEffect(() => {
    const t = setTimeout(() => {
      if (loading) setBlocked(true);
    }, 6000);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e] text-neutral-200">
      <div className="flex-1 relative">
        {loading && !blocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#1e1e1e] z-10">
            <Loader2 className="w-6 h-6 animate-spin text-[#3794ff]" />
            <div className="text-[12px] text-neutral-400">Loading workspace…</div>
          </div>
        )}

        {blocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#1e1e1e] text-center px-6">
            <div className="text-[15px] font-semibold">Editor blocked from embedding</div>
            <div className="text-[12.5px] text-neutral-400 max-w-md">
              Your browser prevented the workspace from loading inside this window.
              Open it in a new tab to continue.
            </div>
            <button
              onClick={() => window.open(EDITOR_SRC, '_blank', 'noopener,noreferrer')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0e639c] hover:bg-[#1177bb] text-white text-[13px]"
            >
              <ExternalLink className="w-4 h-4" /> Open Workspace
            </button>
          </div>
        ) : (
          <iframe
            src={EDITOR_SRC}
            title="Workspace"
            className="w-full h-full border-0"
            onLoad={() => { setLoading(false); setBlocked(false); }}
            referrerPolicy="no-referrer"
            allow="clipboard-read; clipboard-write"
          />
        )}
      </div>
    </div>
  );
};
