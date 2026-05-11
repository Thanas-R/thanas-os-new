import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft, ArrowRight, RotateCw, Plus, Lock, Star, X, Sidebar, Home,
  Share, BookOpen, MoreHorizontal, Loader2,
} from 'lucide-react';
import { PROJECTS } from '@/lib/projects';
import { consumePendingSafariUrl } from '@/lib/installedApps';
import { useBookmarks } from '@/lib/bookmarks';
import { registerAppMenus } from '@/types/macos';

interface Tab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  loading: boolean;
  history: string[];
  histIdx: number;
}

const START_PAGE = 'thanasos://favorites';
const SEARCH_PAGE = 'https://duckduckgo.com/?q=';

const PROJECT_HOSTS = new Set(
  PROJECTS.map(p => { try { return new URL(p.liveUrl).hostname; } catch { return ''; } }).filter(Boolean)
);
const isProjectHost = (url: string) => {
  try { return PROJECT_HOSTS.has(new URL(url).hostname); } catch { return false; }
};

const PROXIES = (url: string) => [
  `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  `https://corsproxy.io/?${encodeURIComponent(url)}`,
  `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`,
];

// Bookmarks now live in localStorage via useBookmarks()

const PRANK_DOC = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>well, well, well...</title>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Fraunces:ital,wght@0,400;0,900;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box}html,body{margin:0;padding:0;height:100%;overflow:hidden}
body{font-family:'Inter',sans-serif;background:#0d0d10;color:#f5f5f5;-webkit-font-smoothing:antialiased}
.dots{position:fixed;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,0.08) 1.2px,transparent 1.4px);background-size:22px 22px;z-index:0;pointer-events:none}
.fade{position:fixed;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse 55% 50% at 50% 50%,rgba(13,13,16,0.6) 0%,rgba(13,13,16,0.3) 60%,rgba(13,13,16,0) 85%);backdrop-filter:blur(6px)}
main{position:relative;z-index:2;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;transform:scale(0.9)}
.kicker{font-family:'Caveat',cursive;font-size:clamp(24px,3vw,34px);color:#cfcfcf;transform:rotate(-3deg);display:inline-block;margin-bottom:-6px}
h1{font-family:'Fraunces',serif;font-weight:900;font-size:clamp(34px,5.4vw,68px);line-height:.98;letter-spacing:-.03em;margin:8px 0 22px;color:#fff}
h1 .ital{font-style:italic;font-weight:400;color:#d8d8d8}
h1 .accent{background:linear-gradient(180deg,transparent 62%,#fff177 62%,#fff177 92%,transparent 92%);padding:0 6px;color:#0a0a0a}
.lead{font-size:clamp(14px,1.1vw,16px);color:#bdbdbd;max-width:560px;margin:0 auto 12px;line-height:1.6}
.sub{font-family:'Caveat',cursive;font-size:clamp(18px,1.6vw,22px);color:#a0a0a0;margin:4px 0 26px}
.discord{display:inline-flex;align-items:center;gap:14px;background:#fff;color:#0a0a0a;text-decoration:none;padding:13px 20px;border-radius:14px;font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:500}
.discord .label{font-family:'Inter',sans-serif;font-size:11px;color:#777;text-transform:uppercase;letter-spacing:.18em;margin-right:4px;border-right:1px solid #d4d4d4;padding-right:12px}
.socials{margin-top:24px;display:flex;gap:22px;justify-content:center}
.socials a{color:#a8a8a8;text-decoration:none;font-size:13px}.socials a:hover{color:#fff}
</style></head><body>
<div class="dots"></div><div class="fade"></div>
<main><div>
<span class="kicker">well, well, well...</span>
<h1><span class="ital">Haha, looks like i</span><br/><span class="accent">sniped your domain</span></h1>
<p class="lead">no worries though, this is just a friendly reminder to secure your domains early.</p>
<p class="sub">send me a dm and i'll hand it back, free of charge :)</p>
<a class="discord" href="https://discord.com" target="_blank" rel="noreferrer"><span class="label">DISCORD</span>DarkSpacePirate</a>
<div class="socials">
<a href="https://github.com/Thanas-R" target="_blank" rel="noreferrer">github</a>
<a href="https://thanas.vercel.app" target="_blank" rel="noreferrer">portfolio</a>
<a href="https://www.linkedin.com/in/thanas-r" target="_blank" rel="noreferrer">linkedin</a>
</div>
</div></main></body></html>`;

const isUrlLike = (s: string) => /^[a-z]+:\/\//i.test(s) || /^[\w-]+(\.[\w-]+)+(\/.*)?$/i.test(s);

const newTab = (url = START_PAGE, title = 'Favorites'): Tab => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  url, title, loading: false, history: [url], histIdx: 0,
});

const faviconFor = (url: string): string | undefined => {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=32`;
  } catch { return undefined; }
};

export const SafariApp = () => {
  const initial = useRef<Tab | null>(null);
  if (!initial.current) {
    const pending = consumePendingSafariUrl();
    initial.current = pending
      ? newTab(pending, (() => { try { return new URL(pending).hostname; } catch { return pending; } })())
      : newTab();
  }
  const { bookmarks, has: hasBookmark, toggle: toggleBookmark } = useBookmarks();
  const [tabs, setTabs] = useState<Tab[]>([initial.current]);
  const [activeId, setActiveId] = useState(initial.current.id);
  const [addressBar, setAddressBar] = useState(initial.current.url);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showBookmarksBar, setShowBookmarksBar] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [proxyHtml, setProxyHtml] = useState<Record<string, string>>({});
  const active = tabs.find(t => t.id === activeId)!;

  useEffect(() => { setAddressBar(active.url); }, [active.url, activeId]);

  const updateActive = useCallback((patch: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === activeId ? { ...t, ...patch } : t));
  }, [activeId]);

  const goTo = useCallback((url: string, title: string) => {
    setTabs(prev => prev.map(t => {
      if (t.id !== activeId) return t;
      const newHist = t.history.slice(0, t.histIdx + 1).concat(url);
      return { ...t, url, title, favicon: faviconFor(url), loading: url !== START_PAGE, history: newHist, histIdx: newHist.length - 1 };
    }));
  }, [activeId]);

  const navigate = (raw: string) => {
    const input = raw.trim();
    if (!input) return;
    if (input === 'favorites' || input === START_PAGE) { goTo(START_PAGE, 'Favorites'); return; }
    let url: string;
    if (isUrlLike(input)) url = /^https?:\/\//.test(input) ? input : 'https://' + input;
    else url = SEARCH_PAGE + encodeURIComponent(input);
    let title = url;
    try { title = new URL(url).hostname; } catch { /* noop */ }
    goTo(url, title);
  };

  const back = () => {
    if (active.histIdx > 0) {
      const idx = active.histIdx - 1;
      const url = active.history[idx];
      updateActive({ url, histIdx: idx, loading: url !== START_PAGE, title: (() => { try { return new URL(url).hostname; } catch { return url; } })() });
    }
  };
  const forward = () => {
    if (active.histIdx < active.history.length - 1) {
      const idx = active.histIdx + 1;
      const url = active.history[idx];
      updateActive({ url, histIdx: idx, loading: url !== START_PAGE, title: (() => { try { return new URL(url).hostname; } catch { return url; } })() });
    }
  };

  const addTab = () => { const t = newTab(); setTabs(p => [...p, t]); setActiveId(t.id); };
  const closeTab = (id: string) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id);
      if (next.length === 0) { const t = newTab(); setActiveId(t.id); return [t]; }
      if (id === activeId) setActiveId(next[next.length - 1].id);
      return next;
    });
  };

  // Proxy/fetch race for non-iframeable, non-project external pages
  const isFavorites = active.url === START_PAGE;
  const isExternalNonProject = !isFavorites && /^https?:\/\//.test(active.url) && !isProjectHost(active.url) && !active.url.startsWith(SEARCH_PAGE);

  useEffect(() => {
    if (!isExternalNonProject) return;
    const target = active.url;
    if (proxyHtml[target]) { updateActive({ loading: false }); return; }
    let cancelled = false;
    updateActive({ loading: true });
    const race = new Promise<string>((resolve, reject) => {
      let pending = PROXIES(target).length;
      PROXIES(target).forEach(p => {
        fetch(p, { method: 'GET' })
          .then(r => r.ok ? r.text() : Promise.reject(r.status))
          .then(t => resolve(t))
          .catch(() => { pending -= 1; if (pending === 0) reject(new Error('all proxies failed')); });
      });
    });
    race
      .then(text => {
        if (cancelled) return;
        // Inject base href so relative assets resolve
        const withBase = text.replace(/<head[^>]*>/i, m => `${m}<base href="${target}"/>`);
        setProxyHtml(prev => ({ ...prev, [target]: withBase }));
        updateActive({ loading: false });
      })
      .catch(() => { if (!cancelled) updateActive({ loading: false }); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.url, isExternalNonProject]);

  // Iframe load → flip loading off
  const onIframeLoad = () => updateActive({ loading: false });

  useEffect(() => {
    registerAppMenus('safari', {
      File: [
        { label: 'New Tab', shortcut: '⌘T', action: addTab },
        { label: 'Close Tab', shortcut: '⌘W', action: () => closeTab(activeId) },
      ],
      Edit: [
        { label: 'Cut', shortcut: '⌘X', action: () => document.execCommand('cut') },
        { label: 'Copy', shortcut: '⌘C', action: () => document.execCommand('copy') },
        { label: 'Paste', shortcut: '⌘V', action: () => document.execCommand('paste') },
      ],
      View: [
        { label: 'Reload Page', shortcut: '⌘R', action: () => navigate(active.url) },
        { label: showBookmarksBar ? 'Hide Bookmarks Bar' : 'Show Bookmarks Bar', action: () => setShowBookmarksBar(s => !s) },
        { label: showSidebar ? 'Hide Sidebar' : 'Show Sidebar', action: () => setShowSidebar(s => !s) },
      ],
      Window: [
        { label: 'Home', action: () => goTo(START_PAGE, 'Favorites') },
      ],
    });
    return () => registerAppMenus('safari', null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, active.url, showBookmarksBar, showSidebar]);

  return (
    <div className="h-full w-full flex flex-col bg-background text-foreground">
      {/* Tab strip */}
      <div className="flex items-center gap-1 px-2 pt-1.5 bg-neutral-200/70 dark:bg-neutral-800/70 border-b border-black/10 dark:border-white/10">
        {tabs.map(t => (
          <div
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg text-[13px] cursor-pointer max-w-[260px] min-w-[170px] ${
              t.id === activeId
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-white/40 dark:hover:bg-neutral-700/40'
            }`}
          >
            {t.loading ? (
              <Loader2 className="w-3 h-3 animate-spin shrink-0 text-blue-500" />
            ) : t.favicon ? (
              <img src={t.favicon} alt="" className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-sm bg-neutral-400/30 shrink-0" />
            )}
            <span className="truncate flex-1">{t.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(t.id); }}
                className="opacity-0 group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5"
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
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100/80 dark:bg-neutral-900/80 border-b border-black/10 dark:border-white/10 backdrop-blur-xl">
        <ToolbarBtn onClick={() => setShowSidebar(s => !s)}><Sidebar className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={back} disabled={active.histIdx === 0}><ArrowLeft className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={forward} disabled={active.histIdx >= active.history.length - 1}><ArrowRight className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => navigate(active.url)}><RotateCw className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => goTo(START_PAGE, 'Favorites')}><Home className="w-4 h-4" /></ToolbarBtn>

        {/* URL pill */}
        <form
          onSubmit={(e) => { e.preventDefault(); navigate(addressBar); }}
          className="flex-1 flex items-center gap-2 bg-white dark:bg-neutral-800 rounded-md px-3 py-1 border border-black/5 dark:border-white/10 max-w-2xl mx-auto"
        >
          {active.loading ? <Loader2 className="w-3 h-3 text-blue-500 animate-spin" /> : <Lock className="w-3 h-3 text-neutral-500" />}
          <input
            value={addressBar}
            onChange={(e) => setAddressBar(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[13px] text-neutral-800 dark:text-neutral-100 text-center"
            placeholder="Search or enter website name"
          />
          <button
            type="button"
            onClick={() => {
              if (!isFavorites && /^https?:\/\//.test(active.url)) {
                toggleBookmark({ name: active.title || active.url, url: active.url });
              }
            }}
            className={`p-0.5 ${hasBookmark(active.url) ? 'text-yellow-500' : 'text-neutral-500 hover:text-yellow-500'}`}
            title={hasBookmark(active.url) ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Star className="w-3.5 h-3.5" fill={hasBookmark(active.url) ? 'currentColor' : 'none'} />
          </button>
        </form>

        <ToolbarBtn onClick={() => setShowBookmarksBar(s => !s)}><BookOpen className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => navigator.share?.({ url: active.url }).catch(() => {})}><Share className="w-4 h-4" /></ToolbarBtn>
        <div className="relative">
          <ToolbarBtn onClick={() => setShowMenu(s => !s)}><MoreHorizontal className="w-4 h-4" /></ToolbarBtn>
          {showMenu && (
            <div
              className="absolute right-0 top-9 w-48 rounded-xl shadow-2xl py-1 z-50 text-[13px]"
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
              onMouseLeave={() => setShowMenu(false)}
            >
              <MenuItem onClick={() => { addTab(); setShowMenu(false); }}>New Tab</MenuItem>
              <MenuItem onClick={() => { setShowBookmarksBar(s => !s); setShowMenu(false); }}>{showBookmarksBar ? 'Hide' : 'Show'} Bookmarks Bar</MenuItem>
              <MenuItem onClick={() => { goTo(START_PAGE, 'Favorites'); setShowMenu(false); }}>Home Page</MenuItem>
              <div className="my-1 border-t border-black/10" />
              <MenuItem onClick={() => { navigate(active.url); setShowMenu(false); }}>Reload</MenuItem>
            </div>
          )}
        </div>
      </div>

      {/* Bookmarks bar */}
      {showBookmarksBar && (
        <div className="flex items-center gap-1 px-3 py-1 bg-neutral-50/80 dark:bg-neutral-900/60 border-b border-black/10 dark:border-white/10 overflow-x-auto">
          {bookmarks.map(b => (
            <button
              key={b.url}
              onClick={() => navigate(b.url)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-[12px] text-neutral-700 dark:text-neutral-300 whitespace-nowrap"
            >
              <img src={faviconFor(b.url)} alt="" className="w-3.5 h-3.5" />
              {b.name}
            </button>
          ))}
        </div>
      )}

      {/* Body: optional sidebar + content */}
      <div className="flex-1 flex overflow-hidden">
        {showSidebar && (
          <aside className="w-56 shrink-0 bg-neutral-100/80 dark:bg-neutral-900/60 border-r border-black/10 dark:border-white/10 p-2 overflow-auto">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 px-2 py-1">Bookmarks</div>
            {bookmarks.map(b => (
              <button
                key={b.url}
                onClick={() => navigate(b.url)}
                className="w-full flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-[12.5px] text-left"
              >
                <img src={faviconFor(b.url)} alt="" className="w-4 h-4" />
                <span className="truncate">{b.name}</span>
              </button>
            ))}
          </aside>
        )}

        <div className="flex-1 overflow-hidden bg-white dark:bg-neutral-950">
          {isFavorites ? (
            <div className="h-full overflow-auto py-12 px-6 flex flex-col items-center">
              <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-8 text-center">Favorites</h1>
              <div className="grid grid-cols-4 gap-x-8 gap-y-6 mb-12 mx-auto place-items-center">
                {PROJECTS.map(p => (
                  <button key={p.id} onClick={() => goTo(p.liveUrl, p.name)} className="flex flex-col items-center gap-2 group w-24">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-black/5 dark:border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                      <img src={p.favicon} alt={p.name} className="w-12 h-12 object-cover" />
                    </div>
                    <span className="text-xs text-neutral-700 dark:text-neutral-300 text-center truncate w-full">{p.name}</span>
                  </button>
                ))}
              </div>
              <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-4 uppercase tracking-wider">Bookmarks</h2>
              <div className="grid grid-cols-6 gap-x-6 gap-y-4 mx-auto place-items-center">
                {bookmarks.map(b => (
                  <button key={b.url} onClick={() => navigate(b.url)} className="flex flex-col items-center gap-1.5 group w-20">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-800 border border-black/5 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <img src={faviconFor(b.url)} alt={b.name} className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] text-neutral-700 dark:text-neutral-300 text-center truncate w-full">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : isExternalNonProject ? (
            proxyHtml[active.url] ? (
              <iframe
                key={active.url + '-proxy'}
                title={active.title}
                srcDoc={proxyHtml[active.url]}
                className="w-full h-full border-0 bg-white"
                onLoad={onIframeLoad}
                sandbox="allow-scripts allow-forms allow-popups"
              />
            ) : active.loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-neutral-500">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <div className="text-[13px]">Loading {(() => { try { return new URL(active.url).hostname; } catch { return active.url; } })()}…</div>
              </div>
            ) : (
              <iframe
                key={active.url + '-prank'}
                title="domain-expansion"
                srcDoc={PRANK_DOC}
                className="w-full h-full border-0 bg-white"
                onLoad={onIframeLoad}
              />
            )
          ) : (
            <iframe
              key={active.url}
              src={active.url}
              title={active.title}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={onIframeLoad}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ToolbarBtn = ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-md text-neutral-700 dark:text-neutral-300 disabled:opacity-30 disabled:hover:bg-transparent"
  >
    {children}
  </button>
);

const MenuItem = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-3 py-1.5 hover:bg-blue-500 hover:text-white text-neutral-800"
  >
    {children}
  </button>
);
