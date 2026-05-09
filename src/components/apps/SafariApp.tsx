import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Plus, Lock, Share, X } from 'lucide-react';
import { PROJECTS } from '@/lib/projects';
import { consumePendingSafariUrl } from '@/lib/installedApps';

interface Tab {
  id: string;
  url: string;
  title: string;
}

const START_PAGE = 'thanasos://favorites';

const newTab = (url = START_PAGE, title = 'Favorites'): Tab => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  url,
  title,
});

export const SafariApp = () => {
  const initial = useRef<Tab>(null as unknown as Tab);
  if (!initial.current) {
    const pending = consumePendingSafariUrl();
    initial.current = pending
      ? newTab(pending, new URL(pending).hostname)
      : newTab();
  }
  const [tabs, setTabs] = useState<Tab[]>([initial.current]);
  const [activeId, setActiveId] = useState(initial.current.id);
  const [addressBar, setAddressBar] = useState(initial.current.url);
  const active = tabs.find(t => t.id === activeId)!;

  useEffect(() => {
    setAddressBar(active.url);
  }, [active.url, activeId]);

  const updateActive = (patch: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === activeId ? { ...t, ...patch } : t));
  };

  const navigate = (rawUrl: string) => {
    let url = rawUrl.trim();
    if (!url) return;
    if (url === 'favorites' || url === 'thanasos://favorites') {
      updateActive({ url: START_PAGE, title: 'Favorites' });
      return;
    }
    if (!/^https?:\/\//.test(url) && !url.startsWith('thanasos://')) {
      url = 'https://' + url;
    }
    let title = url;
    try { title = new URL(url).hostname; } catch {}
    updateActive({ url, title });
  };

  const addTab = () => {
    const t = newTab();
    setTabs(prev => [...prev, t]);
    setActiveId(t.id);
  };

  const closeTab = (id: string) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id);
      if (next.length === 0) { const t = newTab(); setActiveId(t.id); return [t]; }
      if (id === activeId) setActiveId(next[next.length - 1].id);
      return next;
    });
  };

  const isFavorites = active.url === START_PAGE;

  return (
    <div className="h-full w-full flex flex-col bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl">
      {/* Tab strip */}
      <div className="flex items-center gap-1 px-3 pt-2 bg-neutral-100/80 dark:bg-neutral-800/60 border-b border-black/10 dark:border-white/10">
        {tabs.map(t => (
          <div
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-md text-xs cursor-pointer max-w-[160px] ${
              t.id === activeId
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-white/50'
            }`}
          >
            <span className="truncate flex-1">{t.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(t.id); }}
                className="opacity-0 group-hover:opacity-100 hover:bg-black/10 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        <button onClick={addTab} className="p-1 ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-neutral-100/90 dark:bg-neutral-900/80 border-b border-black/10 dark:border-white/10 backdrop-blur-xl">
        <button className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md text-neutral-500 dark:text-neutral-400" disabled><ArrowLeft className="w-4 h-4" /></button>
        <button className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md text-neutral-500 dark:text-neutral-400" disabled><ArrowRight className="w-4 h-4" /></button>
        <form
          onSubmit={(e) => { e.preventDefault(); navigate(addressBar); }}
          className="flex-1 flex items-center gap-2 bg-white dark:bg-neutral-800 rounded-lg px-3 py-1 border border-black/5 dark:border-white/10 max-w-2xl mx-auto"
        >
          <Lock className="w-3 h-3 text-neutral-500" />
          <input
            value={addressBar}
            onChange={(e) => setAddressBar(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[13px] text-neutral-800 dark:text-neutral-100 text-center"
            placeholder="Search or enter website name"
          />
          <button type="button" onClick={() => navigate(active.url)} className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded">
            <RotateCw className="w-3.5 h-3.5 text-neutral-500" />
          </button>
        </form>
        <button className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md text-neutral-600 dark:text-neutral-300"><Share className="w-4 h-4" /></button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-neutral-950">
        {isFavorites ? (
          <div className="h-full overflow-auto p-10">
            <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-8">Favorites</h1>
            <div className="grid grid-cols-4 gap-6 max-w-3xl">
              {PROJECTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { updateActive({ url: p.liveUrl, title: p.name }); }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-black/5 dark:border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                    <img src={p.favicon} alt={p.name} className="w-10 h-10" />
                  </div>
                  <span className="text-xs text-neutral-700 dark:text-neutral-300">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <iframe
            key={active.url}
            src={active.url}
            title={active.title}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        )}
      </div>
    </div>
  );
};
