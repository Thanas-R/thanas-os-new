import { useState, useEffect, useRef, useMemo } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import { Search, ArrowRight, LayoutGrid, Folder, Globe, Settings as Cog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_ICONS } from '@/components/apps/LaunchpadApp';
import { PROJECTS } from '@/lib/projects';
import { setPendingSafariUrl, useInstalledProjects } from '@/lib/installedApps';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
}

type ShortcutId = 'apps' | 'files' | 'web' | 'settings';
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

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const appResults = apps
      .filter(a => a.name.toLowerCase().includes(q))
      .map(a => ({ kind: 'app' as const, id: a.id, name: a.name, desc: 'Application', icon: APP_ICONS[a.id], url: '' }));
    const projResults = PROJECTS
      .filter(p => installed.includes(p.id))
      .filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .map(p => ({ kind: 'project' as const, id: p.id, name: p.name, desc: p.description, icon: p.favicon, url: p.liveUrl }));
    return [...appResults, ...projResults];
  }, [apps, installed, query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery('');
      setActiveIdx(0);
    }
  }, [isOpen]);

  useEffect(() => { setActiveIdx(0); }, [query]);

  const launch = (r: typeof results[number]) => {
    if (r.kind === 'project') {
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
    else if (id === 'settings') openApp('settings');
    onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(results.length - 1, i + 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)); }
      if (e.key === 'Enter' && results[activeIdx]) { e.preventDefault(); launch(results[activeIdx]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, results, activeIdx, onClose]);

  const showChips = !query;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 bg-black/25 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Goo SVG filter */}
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <defs>
              <filter id="spotlight-goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>

          <motion.div
            initial={{ y: -12, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl mx-4"
          >
            {/* Pill row — search stays put, chips morph in/out via goo */}
            <div className="relative" style={{ filter: 'url(#spotlight-goo)' }}>
              <div className="flex items-center gap-3">
                {/* Search pill — fixed width, no layout animation so text doesn't move */}
                <div
                  className="flex-1 flex items-center gap-3 px-5 py-3 rounded-full text-white"
                  style={{
                    background: 'rgba(28,28,32,0.65)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <Search className="w-5 h-5 text-white/70 shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Spotlight Search"
                    className="flex-1 bg-transparent text-base outline-none text-white placeholder-white/45 font-light"
                  />
                </div>

                {/* Chip cluster — animates on query toggle, smoothly */}
                <AnimatePresence mode="popLayout">
                  {showChips && SHORTCUTS.map((s, idx) => (
                    <motion.button
                      key={s.id}
                      initial={{ scale: 0.4, x: -60 - idx * 8, opacity: 0 }}
                      animate={{ scale: 1, x: 0, opacity: 1 }}
                      exit={{ scale: 0.4, x: -40, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 320,
                        damping: 24,
                        delay: idx * 0.04,
                      }}
                      onClick={() => handleShortcut(s.id)}
                      title={s.label}
                      className="w-12 h-12 shrink-0 rounded-full text-white flex items-center justify-center hover:scale-110 transition-transform"
                      style={{
                        background: 'rgba(28,28,32,0.65)',
                        backdropFilter: 'blur(40px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                    >
                      {s.icon}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Results pane */}
            <AnimatePresence>
              {query && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="mt-3 rounded-3xl overflow-hidden max-h-96 overflow-y-auto"
                  style={{
                    background: 'rgba(28,28,32,0.65)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {results.slice(0, 8).map((r, idx) => (
                    <button
                      key={`${r.kind}:${r.id}`}
                      onClick={() => launch(r)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        idx === activeIdx ? 'bg-blue-500/85 text-white' : 'text-white/90 hover:bg-white/5'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/10 shrink-0 flex items-center justify-center">
                        {r.icon ? <img src={r.icon} alt="" className="w-full h-full object-cover" /> : <Search className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{r.name}</div>
                        <div className={`text-xs truncate ${idx === activeIdx ? 'text-white/80' : 'text-white/50'}`}>{r.desc}</div>
                      </div>
                      <ArrowRight className={`w-4 h-4 ${idx === activeIdx ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
