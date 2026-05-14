import { useState, useMemo, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { IoCloudDownloadOutline } from 'react-icons/io5';
import { PROJECTS } from '@/lib/projects';
import {
  useInstalledProjects,
  installProject,
  setPendingSafariUrl,
} from '@/lib/installedApps';
import { useMacOS } from '@/contexts/MacOSContext';

export const AppStoreApp = () => {
  const installed = useInstalledProjects();
  const { openApp } = useMacOS();
  const [query, setQuery] = useState('');
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const fn = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d?.appId !== 'appstore') return;
      const pid = d?.payload?.projectId;
      if (pid) {
        setHighlightId(pid);
        setTimeout(() => {
          cardRefs.current[pid]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80);
        setTimeout(() => setHighlightId(null), 2200);
      }
    };
    window.addEventListener('spotlight:open', fn);
    return () => window.removeEventListener('spotlight:open', fn);
  }, []);

  const list = useMemo(
    () =>
      PROJECTS.filter(
        p =>
          !query ||
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  // Split into two equal columns
  const half = Math.ceil(list.length / 2);
  const colA = list.slice(0, half);
  const colB = list.slice(half);

  const renderCard = (p: typeof PROJECTS[number]) => {
    const isInstalled = installed.includes(p.id);
    return (
      <div
        key={p.id}
        ref={(el) => { cardRefs.current[p.id] = el; }}
        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
          highlightId === p.id
            ? 'bg-blue-500/10 ring-2 ring-blue-500/40'
            : 'hover:bg-black/[.04] dark:hover:bg-white/[.05]'
        }`}
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
          <img src={p.favicon} alt={p.name} className="w-9 h-9 object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {p.name}
          </div>
          <div className="text-[12px] text-neutral-500 dark:text-neutral-400 truncate">
            {p.description}
          </div>
        </div>
        {isInstalled ? (
          <button
            onClick={() => {
              setPendingSafariUrl(p.liveUrl);
              openApp('safari');
            }}
            className="shrink-0 px-4 py-1 rounded-full text-[12px] font-semibold bg-neutral-200/70 dark:bg-neutral-700/70 text-blue-600 dark:text-blue-400 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          >
            Open
          </button>
        ) : (
          <button
            onClick={() => installProject(p.id)}
            title="Get"
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            <IoCloudDownloadOutline className="w-[22px] h-[22px]" strokeWidth={18} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full flex bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-neutral-100/80 dark:bg-neutral-900/60 backdrop-blur-xl border-r border-black/5 dark:border-white/10 flex flex-col">
        <div className="px-3 pt-[38px] pb-2 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white dark:bg-neutral-800 shadow-sm">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent outline-none text-sm min-w-0"
            />
          </div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-auto thin-scrollbar text-[13px]">
          <div className="px-3 py-1.5 rounded-md bg-neutral-200 dark:bg-neutral-700/60 font-medium">
            Discover
          </div>
        </nav>
      </aside>

      {/* Main two-column list */}
      <div className="flex-1 overflow-auto thin-scrollbar">
        <div className="px-8 pt-8 pb-6">
          <h1 className="text-[26px] font-bold tracking-tight">Discover</h1>
          <div className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-1">
            Browse and install Thanas's projects.
          </div>
        </div>
        <div className="px-5 pb-10 grid grid-cols-1 md:grid-cols-2 gap-x-3">
          <div className="flex flex-col">{colA.map(renderCard)}</div>
          <div className="flex flex-col">{colB.map(renderCard)}</div>
        </div>
      </div>
    </div>
  );
};
