import { useState, useMemo, useEffect } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import { useInstalledProjects } from '@/lib/installedApps';
import { getProject } from '@/lib/projects';
import { setPendingSafariUrl } from '@/lib/installedApps';
import finderIcon from '@/assets/finder-icon.png';
import aboutIcon from '@/assets/user-profile-icon.png';
import techIcon from '@/assets/vscode-icon.png';
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
import controlPanelIcon from '@/assets/settings-icon.png';
import calculatorNewIcon from '@/assets/calculator-new-icon.png';
import googleNewIcon from '@/assets/google-icon-new.png';

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
  controlpanel: controlPanelIcon,
  calculator: calculatorNewIcon,
  google: googleNewIcon,
};

const PAGE_SIZE = 28;

export const LaunchpadApp = () => {
  const { apps, openApp, closeWindow, windows } = useMacOS();
  const installed = useInstalledProjects();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const items = useMemo(() => {
    const core = apps
      .filter(a => a.id !== 'launchpad')
      .map(a => ({
        id: a.id,
        name: a.name,
        icon: APP_ICONS[a.id],
        kind: 'app' as const,
        url: ''
      }));

    const projects = installed
      .map(getProject)
      .filter(Boolean)
      .map(p => ({
        id: `proj:${p!.id}`,
        name: p!.name,
        icon: p!.favicon,
        kind: 'project' as const,
        url: p!.liveUrl
      }));

    return [...core, ...projects].filter(i =>
      i.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [apps, installed, query]);

  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleOpen = (item: typeof items[number]) => {
    if (item.kind === 'project') {
      setPendingSafariUrl(item.url);
      openApp('safari');
    } else {
      openApp(item.id);
    }

    const lp = windows.find(w => w.appId === 'launchpad');
    if (lp) closeWindow(lp.id);
  };

  const dismiss = () => {
    const lp = windows.find(w => w.appId === 'launchpad');
    if (lp) closeWindow(lp.id);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [windows]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(60px) saturate(160%)',
        WebkitBackdropFilter: 'blur(60px) saturate(160%)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div className="pt-10 pb-6 flex justify-center">
        <input
          autoFocus
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="Search"
          className="w-80 px-5 py-2 rounded-full liquid-glass-dark text-white placeholder-white/50 text-center outline-none text-sm"
        />
      </div>

      <div className="flex-1 px-12 pb-2 overflow-hidden">
        <div className="grid grid-cols-7 gap-x-4 gap-y-8 max-w-5xl mx-auto">
          {pageItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => handleOpen(item)}
              className="flex flex-col items-center gap-2 group focus:outline-none"
              style={{
                animation: `launchpadItemIn 0.35s cubic-bezier(0.2,0.7,0.2,1) both`,
                animationDelay: `${idx * 18}ms`
              }}
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl group-hover:scale-110 group-active:scale-95 transition-transform">
                {item.icon ? (
                  <img src={item.icon} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/10 text-3xl">
                    📦
                  </div>
                )}
              </div>
              <span className="text-white text-[12px] text-center drop-shadow-lg max-w-[6rem] truncate">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {pages > 1 && (
        <div className="pb-6 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === page ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};