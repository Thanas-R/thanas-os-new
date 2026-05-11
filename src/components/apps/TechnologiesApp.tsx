import { useState } from 'react';
import { Loader2 } from 'lucide-react';

// Internal VS Code-style code browser. Loads the project in vscode.dev
// without exposing the underlying repo URL anywhere in the UI.
const VSCODE_SRC = 'https://vscode.dev/github/Thanas-R/ThanasOS';

export const TechnologiesApp = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e] text-neutral-200">
      {/* VS Code-style title bar */}
      <div className="h-9 flex items-center justify-between px-3 bg-[#3c3c3c] border-b border-black/40 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[12px] text-neutral-300 ml-3 font-medium">Code Editor</span>
        </div>
        <div className="text-[11px] text-neutral-400">Workspace</div>
        <div className="w-12" />
      </div>

      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#1e1e1e] z-10">
            <Loader2 className="w-6 h-6 animate-spin text-[#3794ff]" />
            <div className="text-[12px] text-neutral-400">Loading workspace…</div>
          </div>
        )}
        <iframe
          src={VSCODE_SRC}
          title="Code Editor"
          className="w-full h-full border-0"
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};
