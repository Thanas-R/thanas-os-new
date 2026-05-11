import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  LayoutGrid,
  Folder,
  Globe,
  Settings as Cog,
} from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';
import { APP_ICONS } from '@/components/apps/LaunchpadApp';
import { PROJECTS } from '@/lib/projects';
import { setPendingSafariUrl, useInstalledProjects } from '@/lib/installedApps';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
}

type ShortcutId = 'apps' | 'files' | 'web' | 'settings';

interface SearchResult {
  kind: 'app' | 'project';
  id: string;
  name: string;
  description: string;
  icon?: string;
  url?: string;
}

const SHORTCUTS: { id: ShortcutId; label: string; icon: React.ReactNode }[] = [
  { id: 'apps', label: 'Apps', icon: <LayoutGrid className="w-5 h-5" /> },
  { id: 'files', label: 'Files', icon: <Folder className="w-5 h-5" /> },
  { id: 'web', label: 'Web', icon: <Globe className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Cog className="w-5 h-5" /> },
];

export const Spotlight = ({ isOpen, onClose }: SpotlightProps) => {
  const { apps, openApp } = useMacOS();
  const installed = useInstalledProjects();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const appResults: SearchResult[] = apps
      .filter(a => a.name.toLowerCase().includes(q))
      .map(a => ({
        kind: 'app', id: a.id, name: a.name,
        description: 'Application', icon: APP_ICONS[a.id],
      }));
    const projectResults: SearchResult[] = PROJECTS
      .filter(p => installed.includes(p.id))
      .filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .map(p => ({
        kind: 'project', id: p.id, name: p.name,
        description: p.description, icon: p.favicon, url: p.liveUrl,
      }));
    return [...appResults, ...projectResults];
  }, [apps, installed, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  useEffect(() => { setActiveIdx(0); }, [query]);

  const launch = (r: SearchResult) => {
    if (r.kind === 'project' && r.url) {
      setPendingSafariUrl(r.url);
      openApp('safari');
    } else {
      openApp(r.id);
    }
    onClose();
  };

  const handleShortcut = (id: ShortcutId) => {
    if (id === 'apps') openApp('launchpad');
    else if (id === 'files') openApp('finder');
    else if (id === 'web') openApp('safari');
    else openApp('settings');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(results.length - 1, i + 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)); }
      if (e.key === 'Enter' && results[activeIdx]) { e.preventDefault(); launch(results[activeIdx]); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, results, activeIdx]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="spotlight-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-[18vh]"
          style={{
            background: 'rgba(0,0,0,0.18)',
            backdropFilter: 'blur(18px) saturate(140%)',
            WebkitBackdropFilter: 'blur(18px) saturate(140%)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl mx-4"
          >
            {/* Glass pill container */}
            <div
              className="rounded-[28px] overflow-hidden"
              style={{
                background: 'rgba(28,28,32,0.55)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.14)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 h-[60px]">
                <Search className="w-5 h-5 text-white/70 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Spotlight Search"
                  className="flex-1 bg-transparent outline-none text-white text-lg placeholder-white/40"
                />
              </div>

              {/* Shortcut chips (only when no query) */}
              {!query && (
                <div className="border-t border-white/10 px-3 py-3 flex items-center gap-2">
                  {SHORTCUTS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleShortcut(s.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/12 text-white/85 text-sm transition-colors"
                    >
                      {s.icon}
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Results */}
              {query && results.length > 0 && (
                <div className="border-t border-white/10 max-h-[50vh] overflow-y-auto py-2 px-2">
                  {results.map((r, i) => (
                    <button
                      key={`${r.kind}:${r.id}`}
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => launch(r)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                        i === activeIdx ? 'bg-white/12 text-white' : 'text-white/85 hover:bg-white/6'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/10 shrink-0 flex items-center justify-center">
                        {r.icon ? (
                          <img src={r.icon} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Search className="w-4 h-4 text-white/70" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{r.name}</div>
                        <div className={`text-xs truncate ${i === activeIdx ? 'text-white/75' : 'text-white/50'}`}>
                          {r.description}
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 ${i === activeIdx ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  ))}
                </div>
              )}

              {query && results.length === 0 && (
                <div className="border-t border-white/10 px-5 py-6 text-white/50 text-sm">
                  No results for "{query}"
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
