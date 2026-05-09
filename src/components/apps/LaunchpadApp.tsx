import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMacOS } from '@/contexts/MacOSContext';
import { useInstalledProjects, setPendingSafariUrl } from '@/lib/installedApps';
import { getProject } from '@/lib/projects';
import finderIcon from '@/assets/finder-icon.png';
import aboutIcon from '@/assets/about-icon.png';
import techIcon from '@/assets/tech-icon.png';
import projectsIcon from '@/assets/projects-icon.png';
import journeyIcon from '@/assets/journey-icon.png';
import githubIcon from '@/assets/github-icon.png';
import linkedinIcon from '@/assets/linkedin-icon.png';
import contactIcon from '@/assets/contact-icon.png';
import settingsIcon from '@/assets/settings-icon.png';
import terminalIcon from '@/assets/terminal-icon.png';
import safariIcon from '@/assets/safari-icon.png';
import notesIcon from '@/assets/notes-icon.png';
import appstoreIcon from '@/assets/appstore-icon.png';
import launchpadIcon from '@/assets/launchpad-icon.png';

export const APP_ICONS: Record<string, string> = {
  finder: finderIcon,
  about: aboutIcon,
  technologies: techIcon,
  projects: projectsIcon,
  journey: journeyIcon,
  github: githubIcon,
  linkedin: linkedinIcon,
  contact: contactIcon,
  settings: settingsIcon,
  terminal: terminalIcon,
  safari: safariIcon,
  notes: notesIcon,
  appstore: appstoreIcon,
  launchpad: launchpadIcon,
};

const COLS = 7;
const ROWS = 5;
const PER_PAGE = COLS * ROWS;

/**
 * Fullscreen macOS-style Launchpad overlay.
 * Mounted at the Desktop level, controlled via context.launchpadOpen.
 */
export const LaunchpadOverlay = () => {
  const { apps, openApp, launchpadOpen, setLaunchpadOpen } = useMacOS();
  const installed = useInstalledProjects();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => {
    const core = apps
      .filter(a => a.id !== 'launchpad')
      .map(a => ({ id: a.id, name: a.name, icon: APP_ICONS[a.id], kind: 'app' as const, url: '' }));
    const projects = installed
      .map(getProject)
      .filter(Boolean)
      .map(p => ({ id: `proj:${p!.id}`, name: p!.name, icon: p!.favicon, kind: 'project' as const, url: p!.liveUrl }));
    const all = [...core, ...projects];
    if (!query) return all;
    return all.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
  }, [apps, installed, query]);

  const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const visible = items.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  useEffect(() => {
    if (launchpadOpen) {
      setQuery('');
      setPage(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [launchpadOpen]);

  useEffect(() => {
    if (!launchpadOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLaunchpadOpen(false);
      if (e.key === 'ArrowRight' && page < pages - 1) setPage(p => p + 1);
      if (e.key === 'ArrowLeft' && page > 0) setPage(p => p - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [launchpadOpen, page, pages, setLaunchpadOpen]);

  const handleOpen = (item: typeof items[number]) => {
    setLaunchpadOpen(false);
    if (item.kind === 'project') {
      setPendingSafariUrl(item.url);
      openApp('safari');
    } else {
      openApp(item.id);
    }
  };

  return (
    <AnimatePresence>
      {launchpadOpen && (
        <motion.div
          key="launchpad"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.25 }}
          onClick={() => setLaunchpadOpen(false)}
          className="fixed inset-0 z-[200] flex flex-col items-center"
          style={{
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          }}
        >
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="pt-16 pb-10"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(0); }}
              onClick={(e) => e.stopPropagation()}
              placeholder="Search"
              className="w-80 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xl text-white placeholder-white/60 text-center outline-none border border-white/20 text-sm"
            />
          </motion.div>

          {/* Grid */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 w-full max-w-6xl px-12 grid items-start"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridAutoRows: '7rem',
              gap: '1.5rem 1rem',
              alignContent: 'start',
            }}
          >
            <AnimatePresence mode="popLayout">
              {visible.map((item, i) => (
                <motion.button
                  key={`${page}:${item.id}`}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.015, duration: 0.18 }}
                  onClick={() => handleOpen(item)}
                  className="flex flex-col items-center gap-2 group focus:outline-none"
                >
                  <div className="w-[88px] h-[88px] rounded-[22px] overflow-hidden bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                    {item.icon ? (
                      <img src={item.icon} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl text-white">App</div>
                    )}
                  </div>
                  <span className="text-white text-[12px] text-center [text-shadow:0_1px_3px_rgba(0,0,0,0.6)] max-w-[7rem] truncate">
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Page dots */}
          {pages > 1 && (
            <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 pb-8">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === page ? 'bg-white scale-110' : 'bg-white/35 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}

          {!pages || pages <= 1 ? <div className="pb-8" /> : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Kept for backward compatibility — opening 'launchpad' app routes to the overlay via context.
export const LaunchpadApp = LaunchpadOverlay;