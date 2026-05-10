import { useState, useEffect, useRef, useMemo } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import { Search, ArrowRight, LayoutGrid, Folder, Activity, Files } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_ICONS } from '@/components/apps/LaunchpadApp';
import { PROJECTS } from '@/lib/projects';
import { setPendingSafariUrl, useInstalledProjects } from '@/lib/installedApps';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { label: 'Apps', icon: <LayoutGrid className="w-5 h-5" /> },
  { label: 'Files', icon: <Folder className="w-5 h-5" /> },
  { label: 'Actions', icon: <Activity className="w-5 h-5" /> },
  { label: 'Clipboard', icon: <Files className="w-5 h-5" /> },
];

export const Spotlight = ({ isOpen, onClose }: SpotlightProps) => {
  const { apps, openApp } = useMacOS();
  const installed = useInstalledProjects();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    const appResults = apps
      .filter(a => !q || a.name.toLowerCase().includes(q))
      .map(a => ({ kind: 'app' as const, id: a.id, name: a.name, desc: 'Application', icon: APP_ICONS[a.id], url: '' }));
    const projResults = PROJECTS
      .filter(p => installed.includes(p.id))
      .filter(p => !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .map(p => ({ kind: 'project' as const, id: p.id, name: p.name, desc: p.description, icon: p.favicon, url: p.liveUrl }));
    return [...appResults, ...projResults];
  }, [apps, installed, query]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
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
  }, [isOpen, results, activeIdx, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl mx-4"
          >
            {/* Pill row */}
            <motion.div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="flex items-center justify-end gap-3"
            >
              {/* Search pill */}
              <motion.div
                layout
                className="flex-1 flex items-center gap-3 px-5 py-3 rounded-full liquid-glass-card text-white"
              >
                <Search className="w-5 h-5 text-white/70" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Spotlight Search"
                  className="flex-1 bg-transparent text-base outline-none text-white placeholder-white/50 font-light"
                />
              </motion.div>

              {/* Shortcut chips appear on hover when no query */}
              <AnimatePresence>
                {hovered && !query && SHORTCUTS.map((s, idx) => (
                  <motion.button
                    key={s.label}
                    layout
                    initial={{ scale: 0.6, opacity: 0, x: -20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0.6, opacity: 0, x: 20 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    title={s.label}
                    className="w-12 h-12 rounded-full liquid-glass-card text-white flex items-center justify-center hover:bg-white/10"
                  >
                    {s.icon}
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Results */}
            {(query || hovered) && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-3xl overflow-hidden liquid-glass-card max-h-96 overflow-y-auto"
              >
                {results.slice(0, 8).map((r, idx) => (
                  <button
                    key={`${r.kind}:${r.id}`}
                    onClick={() => launch(r)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      idx === activeIdx ? 'bg-blue-500/80 text-white' : 'text-white/90 hover:bg-white/5'
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
