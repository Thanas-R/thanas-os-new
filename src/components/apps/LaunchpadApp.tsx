import { useState, useMemo } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import { useInstalledProjects } from '@/lib/installedApps';
import { getProject } from '@/lib/projects';
import { setPendingSafariUrl } from '@/lib/installedApps';
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

export const LaunchpadApp = () => {
  const { apps, openApp, closeWindow, windows } = useMacOS();
  const installed = useInstalledProjects();
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    const core = apps
      .filter(a => a.id !== 'launchpad')
      .map(a => ({ id: a.id, name: a.name, icon: APP_ICONS[a.id], kind: 'app' as const, url: '' }));
    const projects = installed
      .map(getProject)
      .filter(Boolean)
      .map(p => ({ id: `proj:${p!.id}`, name: p!.name, icon: p!.favicon, kind: 'project' as const, url: p!.liveUrl }));
    return [...core, ...projects].filter(i =>
      i.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [apps, installed, query]);

  const handleOpen = (item: typeof items[number]) => {
    if (item.kind === 'project') {
      setPendingSafariUrl(item.url);
      openApp('safari');
    } else {
      openApp(item.id);
    }
    // close launchpad
    const lp = windows.find(w => w.appId === 'launchpad');
    if (lp) closeWindow(lp.id);
  };

  return (
    <div className="h-full w-full flex flex-col bg-black/30 backdrop-blur-2xl">
      <div className="pt-8 pb-4 flex justify-center">
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search"
          className="w-72 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl text-white placeholder-white/60 text-center outline-none border border-white/20"
        />
      </div>
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-6 gap-x-4 gap-y-6 max-w-4xl mx-auto">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => handleOpen(item)}
              className="flex flex-col items-center gap-2 group focus:outline-none"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform shadow-lg">
                {item.icon ? (
                  <img src={item.icon} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                )}
              </div>
              <span className="text-white text-xs text-center drop-shadow-md max-w-[6rem] truncate">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
