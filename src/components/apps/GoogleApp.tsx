import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Lock, Star, Bookmark as BookmarkIcon, MoreVertical, Plus, Mic, Search } from 'lucide-react';
import { registerAppMenus } from '@/types/macos';
import { useMacOS } from '@/contexts/MacOSContext';
import { consumePendingSafariUrl } from '@/lib/installedApps';
import { PROJECTS } from '@/lib/projects';

interface Tab {
  id: string;
  url: string;
  title: string;
  loading: boolean;
  history: string[];
  histIdx: number;
  content?: string; // proxied html
}

const HOMEPAGE = 'about:home';
const PRANK_URL = 'about:prank';
const PROXIES = [
  { url: 'https://corsproxy.io/?', type: 'raw' as const },
  { url: 'https://api.codetabs.com/v1/proxy?quest=', type: 'raw' as const },
  { url: 'https://api.allorigins.win/get?url=', type: 'json' as const },
];

const PRANK_DOC = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>well, well, well...</title>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Fraunces:ital,wght@0,400;0,900&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
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
</style></head><body>
<div class="dots"></div><div class="fade"></div>
<main><div>
<span class="kicker">well, well, well...</span>
<h1><span class="ital">Haha, looks like i</span><br/><span class="accent">sniped your domain</span></h1>
<p class="lead">no worries though, this is just a friendly reminder to secure your domains early.</p>
<p class="sub">send me a dm and i'll hand it back, free of charge :)</p>
<a class="discord" href="https://discord.com" target="_blank" rel="noreferrer"><span class="label">DISCORD</span>DarkSpacePirate</a>
</div></main></body></html>`;

const DEFAULT_FAVORITES = [
  { url: 'https://en.wikipedia.org/', title: 'Wikipedia', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Wikipedia-logo-v2.svg' },
  { url: 'https://www.bing.com/', title: 'Bing', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Bing_Fluent_Logo.svg' },
  { url: 'https://www.amazon.com/', title: 'Amazon', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg' },
  { url: 'https://discord.com/', title: 'Discord', icon: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.svg' },
  { url: 'https://www.reddit.com/', title: 'Reddit', icon: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png' },
  { url: 'https://store.steampowered.com/', title: 'Steam', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg' },
  { url: 'https://github.com/', title: 'GitHub', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg' },
  { url: 'https://www.youtube.com/', title: 'YouTube', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/YouTube_social_white_squircle.svg' },
];

const PRANK_HOSTS = ['darkspacepirate.dev', 'thanas.dev', 'thsh.dev'];

const normalizeUrl = (input: string): string => {
  const s = input.trim();
  if (!s) return 'about:blank';
  if (s === HOMEPAGE) return s;
  if (/^https?:\/\//i.test(s)) {
    try {
      const host = new URL(s).hostname.toLowerCase();
      if (PRANK_HOSTS.some(h => host === h || host.endsWith('.' + h))) return PRANK_URL;
    } catch { /* ignore */ }
    return s;
  }
  if (s.includes('.') && !s.includes(' ')) {
    const lower = s.toLowerCase();
    if (PRANK_HOSTS.some(h => lower === h || lower.endsWith('.' + h))) return PRANK_URL;
    return 'https://' + s;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(s)}`;
};

const escapeHtml = (s: string) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const getFavicon = (url: string): string => {
  if (!url || url.startsWith('about:')) return '';
  const fav = DEFAULT_FAVORITES.find(f => url.startsWith(f.url));
  if (fav) return fav.icon;
  try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`; } catch { return ''; }
};

const fetchWithTimeout = async (resource: string, timeout = 4500) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(resource, { signal: controller.signal });
    return res;
  } finally { clearTimeout(id); }
};

const raceProxies = (targetUrl: string): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    let remaining = PROXIES.length;
    let settled = false;
    PROXIES.forEach(async (p) => {
      try {
        const res = await fetchWithTimeout(p.url + encodeURIComponent(targetUrl));
        if (!res.ok) throw new Error('status ' + res.status);
        let text = '';
        if (p.type === 'json') { const json = await res.json(); text = json.contents; }
        else { text = await res.text(); }
        if (!text || text.length < 50) throw new Error('empty');
        if (!settled) { settled = true; resolve(text); }
      } catch {
        if (--remaining === 0 && !settled) reject(new Error('all proxies failed'));
      }
    });
  });

const newTab = (url = HOMEPAGE): Tab => ({
  id: 't-' + Math.random().toString(36).slice(2, 9),
  url, title: 'New Tab', loading: false, history: [url], histIdx: 0,
});

import { useBookmarks } from '@/lib/bookmarks';

export const GoogleApp = () => {
  const { settings, updateSettings } = useMacOS();
  const { bookmarks, has: hasBookmark, toggle: toggleBookmark } = useBookmarks();
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const pending = consumePendingSafariUrl();
    return [pending ? { ...newTab(normalizeUrl(pending)) } : newTab()];
  });
  const [activeId, setActiveId] = useState<string>(tabs[0].id);
  const [addressBar, setAddressBar] = useState('');
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [light, setLight] = useState(false);

  const active = tabs.find(t => t.id === activeId)!;

  useEffect(() => {
    setAddressBar(active.url === HOMEPAGE ? '' : active.url);
  }, [active.url, activeId]);

  const updateTab = useCallback((id: string, patch: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  }, []);

  const navigate = useCallback(async (id: string, url: string, pushHistory = true) => {
    const norm = normalizeUrl(url);
    setTabs(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (pushHistory) {
        const hist = t.history.slice(0, t.histIdx + 1).concat(norm);
        return { ...t, url: norm, loading: true, history: hist, histIdx: hist.length - 1, content: undefined, title: norm === HOMEPAGE ? 'New Tab' : 'Loading…' };
      }
      return { ...t, url: norm, loading: true, content: undefined, title: norm === HOMEPAGE ? 'New Tab' : 'Loading…' };
    }));

    if (norm === HOMEPAGE) {
      updateTab(id, { loading: false, title: 'New Tab' });
      return;
    }

    try {
      let content = await raceProxies(norm);
      if (!content.toLowerCase().includes('<base')) {
        if (content.toLowerCase().includes('<head')) {
          content = content.replace(/<head[^>]*>/i, m => `${m}<base href="${norm}" target="_self">`);
        } else {
          content = `<base href="${norm}" target="_self">` + content;
        }
      }
      // Inject link interceptor: route clicks to parent so we can navigate via proxy
      const interceptor = `<script>(function(){
        document.addEventListener('click',function(e){
          var a=e.target&&e.target.closest&&e.target.closest('a');
          if(!a||!a.href) return;
          if(a.target==='_blank'){ e.preventDefault(); window.parent.postMessage({type:'gnav',url:a.href},'*'); return; }
          e.preventDefault(); window.parent.postMessage({type:'gnav',url:a.href},'*');
        },true);
        document.addEventListener('submit',function(e){
          var f=e.target; if(!f||f.tagName!=='FORM') return;
          try{ var u=new URL(f.action||location.href); var fd=new FormData(f);
            fd.forEach(function(v,k){u.searchParams.set(k,v);});
            e.preventDefault(); window.parent.postMessage({type:'gnav',url:u.toString()},'*');
          }catch(_){}
        },true);
      })();<\/script>`;
      content = content.replace(/<\/body>/i, interceptor + '</body>');
      if (!/<\/body>/i.test(content)) content += interceptor;
      const m = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      let title = norm;
      try { title = m ? m[1].trim() : new URL(norm).hostname; } catch {}
      updateTab(id, { loading: false, content, title });
    } catch {
      updateTab(id, {
        loading: false,
        title: 'Connection Failed',
        content: `<!doctype html><html><body style="font-family:Roboto,sans-serif;background:${light ? '#fff' : '#202124'};color:${light ? '#202124' : '#e8eaed'};display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><div style="background:${light ? '#f1f3f4' : '#292a2d'};padding:40px;border-radius:8px;text-align:center;max-width:500px;"><h2 style="margin:0 0 12px;">This site can't be reached</h2><p style="opacity:0.7;"><b>${escapeHtml(norm)}</b> took too long to respond.</p></div></body></html>`,
      });
    }
  }, [light, updateTab]);

  // Listen for nav messages from iframe
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data && e.data.type === 'gnav' && typeof e.data.url === 'string') {
        navigate(activeId, e.data.url);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [activeId, navigate]);

  // initial load for first tab
  useEffect(() => {
    if (active.url !== HOMEPAGE && !active.content && !active.loading) {
      navigate(active.id, active.url, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTab = () => {
    const t = newTab();
    setTabs(p => [...p, t]);
    setActiveId(t.id);
  };
  const closeTab = (id: string) => {
    setTabs(prev => {
      if (prev.length === 1) { const n = newTab(); setActiveId(n.id); return [n]; }
      const next = prev.filter(t => t.id !== id);
      if (id === activeId) setActiveId(next[next.length - 1].id);
      return next;
    });
  };

  const back = () => {
    if (active.histIdx > 0) {
      const idx = active.histIdx - 1;
      const url = active.history[idx];
      updateTab(active.id, { histIdx: idx });
      navigate(active.id, url, false);
    }
  };
  const forward = () => {
    if (active.histIdx < active.history.length - 1) {
      const idx = active.histIdx + 1;
      const url = active.history[idx];
      updateTab(active.id, { histIdx: idx });
      navigate(active.id, url, false);
    }
  };

  const goHome = () => navigate(active.id, HOMEPAGE);
  const reload = () => navigate(active.id, active.url, false);

  // Menus
  useEffect(() => {
    registerAppMenus('google', {
      File: [
        { label: 'New Tab', shortcut: '⌘T', action: addTab },
        { label: 'Close Tab', shortcut: '⌘W', action: () => closeTab(active.id) },
        { separator: true },
        { label: 'Reload', shortcut: '⌘R', action: reload },
      ],
      Edit: [
        { label: 'Cut', shortcut: '⌘X', action: () => document.execCommand('cut') },
        { label: 'Copy', shortcut: '⌘C', action: () => document.execCommand('copy') },
        { label: 'Paste', shortcut: '⌘V', action: () => document.execCommand('paste') },
      ],
      View: [
        { label: light ? 'Switch to Dark' : 'Switch to Light', action: () => setLight(l => !l) },
        { label: showBookmarks ? 'Hide Bookmarks Bar' : 'Show Bookmarks Bar', action: () => setShowBookmarks(s => !s) },
      ],
      Window: [
        { label: 'Make Default Browser', action: () => updateSettings({ defaultBrowser: 'google' }) },
        { label: 'Use Safari as Default', action: () => updateSettings({ defaultBrowser: 'safari' }) },
      ],
    });
    return () => registerAppMenus('google', null);
  }, [active.id, light, showBookmarks, updateSettings]);

  // Theme tokens (Chrome dark default)
  const tk = light ? {
    bg: '#fff', frame: '#dee1e6', toolbar: '#fff', tabText: '#1f1f1f',
    tabHover: '#f2f2f2', inactive: '#474747', urlbar: '#f1f3f4', urlText: '#1f1f1f',
    icon: '#474747', border: '#dadce0', menuBg: '#fff', menuHover: '#f1f3f4', accent: '#1a73e8', card: '#f1f3f4',
  } : {
    bg: '#202124', frame: '#000', toolbar: '#35363a', tabText: '#e8eaed',
    tabHover: 'rgba(255,255,255,0.08)', inactive: '#9aa0a6', urlbar: '#202124', urlText: '#e8eaed',
    icon: '#e8eaed', border: '#5f6368', menuBg: '#292a2d', menuHover: '#3c4043', accent: '#8ab4f8', card: '#303134',
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden" style={{ background: tk.bg, color: tk.tabText, fontFamily: 'Roboto, system-ui, sans-serif' }}>
      {/* TAB STRIP */}
      <div className="flex items-end gap-1.5 px-3 pt-2 shrink-0" style={{ background: tk.frame, height: 42 }}>
        {tabs.map(t => {
          const isActive = t.id === activeId;
          let fav = getFavicon(t.url);
          if (t.url === HOMEPAGE) fav = 'https://www.google.com/favicon.ico';
          return (
            <div
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className="flex items-center gap-2.5 px-3 cursor-default flex-1 max-w-[240px] min-w-[140px]"
              style={{
                height: 34, background: isActive ? tk.toolbar : 'transparent',
                color: isActive ? tk.tabText : tk.inactive,
                borderTopLeftRadius: 8, borderTopRightRadius: 8,
                fontSize: 12, position: 'relative', zIndex: isActive ? 1 : 0,
              }}
              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = tk.tabHover; }}
              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              {t.loading
                ? <div className="w-3.5 h-3.5 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: tk.accent, borderRightColor: tk.accent, borderBottomColor: 'rgba(128,128,128,0.2)', borderLeftColor: 'rgba(128,128,128,0.2)' }} />
                : fav ? <img src={fav} alt="" className="w-4 h-4 rounded-full object-contain" /> : <div className="w-4 h-4" />}
              <span className="flex-1 truncate" style={{ fontSize: 12 }}>{t.title}</span>
              {tabs.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); closeTab(t.id); }} className="w-4 h-4 rounded-full flex items-center justify-center text-sm hover:bg-black/20 dark:hover:bg-white/20" style={{ opacity: 0.7 }}>×</button>
              )}
            </div>
          );
        })}
        <button
          onClick={addTab}
          title="New tab"
          className="w-7 h-7 mb-1 rounded-full flex items-center justify-center hover:bg-white/10"
          style={{ color: tk.tabText }}
        ><Plus className="w-4 h-4" /></button>
      </div>

      {/* NAV TOOLBAR */}
      <div className="flex items-center gap-2 px-3 py-2 shrink-0" style={{ background: tk.toolbar }}>
        <NavBtn onClick={back} disabled={active.histIdx <= 0} color={tk.icon}><ArrowLeft className="w-4 h-4" /></NavBtn>
        <NavBtn onClick={forward} disabled={active.histIdx >= active.history.length - 1} color={tk.icon}><ArrowRight className="w-4 h-4" /></NavBtn>
        <NavBtn onClick={reload} color={tk.icon}><RotateCw className="w-4 h-4" /></NavBtn>
        <NavBtn onClick={goHome} color={tk.icon}><Home className="w-4 h-4" /></NavBtn>

        <div className="flex-1 mx-1">
          <form
            onSubmit={(e) => { e.preventDefault(); navigate(active.id, addressBar); }}
            className="flex items-center px-3 transition-all"
            style={{
              height: 34, borderRadius: 99, background: tk.urlbar,
              border: '1px solid transparent',
            }}
          >
            {active.loading ? (
              <div className="w-4 h-4 rounded-full border-2 animate-spin shrink-0" style={{ borderColor: tk.border, borderTopColor: tk.accent }} />
            ) : (
              <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: tk.icon, opacity: 0.7 }} />
            )}
            <input
              value={addressBar}
              onChange={(e) => setAddressBar(e.target.value)}
              placeholder="Search Google or type a URL"
              className="flex-1 bg-transparent border-none outline-none mx-2 text-[14px]"
              style={{ color: tk.urlText, fontFamily: 'inherit' }}
            />
            <button
              type="button"
              onClick={() => {
                if (active.url !== HOMEPAGE && /^https?:\/\//.test(active.url)) {
                  toggleBookmark({ name: active.title || active.url, url: active.url });
                }
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/10"
              style={{ color: hasBookmark(active.url) ? '#f59e0b' : tk.icon, opacity: hasBookmark(active.url) ? 1 : 0.7 }}
              title={hasBookmark(active.url) ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Star className="w-4 h-4" fill={hasBookmark(active.url) ? 'currentColor' : 'none'} />
            </button>
          </form>
        </div>

        <NavBtn onClick={() => setShowBookmarks(s => !s)} color={tk.icon}><BookmarkIcon className="w-4 h-4" /></NavBtn>
        <div className="relative">
          <NavBtn onClick={() => setShowMenu(s => !s)} color={tk.icon}><MoreVertical className="w-4 h-4" /></NavBtn>
          {showMenu && (
            <div
              className="absolute top-full right-0 mt-2 w-72 rounded-lg shadow-2xl py-2 z-50"
              style={{ background: tk.menuBg, color: tk.tabText }}
              onMouseLeave={() => setShowMenu(false)}
            >
              <MenuRow label="New tab" onClick={() => { setShowMenu(false); addTab(); }} />
              <MenuRow label="New window" disabled />
              <div style={{ height: 1, background: tk.border, opacity: 0.3, margin: '8px 0' }} />
              <MenuRow label="Bookmarks" onClick={() => { setShowMenu(false); setShowBookmarks(true); }} />
              <MenuRow label="History" disabled />
              <div style={{ height: 1, background: tk.border, opacity: 0.3, margin: '8px 0' }} />
              <MenuRow label={light ? 'Switch to Dark Mode' : 'Switch to Light Mode'} onClick={() => { setLight(l => !l); setShowMenu(false); }} />
              <MenuRow
                label={settings.defaultBrowser === 'google' ? 'Default browser: Google' : 'Make Default Browser'}
                onClick={() => { updateSettings({ defaultBrowser: settings.defaultBrowser === 'google' ? 'safari' : 'google' }); setShowMenu(false); }}
              />
            </div>
          )}
        </div>
      </div>

      {/* BOOKMARKS BAR */}
      {showBookmarks && (
        <div className="flex items-center gap-1 px-3 py-1.5 shrink-0 overflow-x-auto" style={{ background: tk.toolbar }}>
          {bookmarks.map(b => (
            <button
              key={b.url}
              onClick={() => navigate(active.id, b.url)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] hover:bg-black/10"
              style={{ color: tk.icon }}
            >
              <img src={`https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(b.url).hostname; } catch { return ''; } })()}&sz=32`} alt="" className="w-4 h-4 object-contain" />
              {b.name}
            </button>
          ))}
          {DEFAULT_FAVORITES.map(f => (
            <button
              key={f.url}
              onClick={() => navigate(active.id, f.url)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] hover:bg-black/10"
              style={{ color: tk.icon }}
            >
              <img src={f.icon} alt="" className="w-4 h-4 object-contain" style={{ filter: f.title === 'GitHub' && !light ? 'invert(1)' : undefined }} />
              {f.title}
            </button>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div className="flex-1 relative overflow-hidden" style={{ background: tk.bg }}>
        {active.url === HOMEPAGE ? (
          <NewTabPage tk={tk} light={light} onNavigate={(u) => navigate(active.id, u)} />
        ) : active.content ? (
          <iframe
            key={active.id + ':' + active.histIdx}
            srcDoc={active.content}
            sandbox="allow-forms allow-scripts allow-popups allow-same-origin allow-modals"
            className="w-full h-full border-0 bg-white"
            title={active.title}
          />
        ) : (
          <div className="flex items-center justify-center h-full" style={{ color: tk.inactive }}>
            <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: tk.border, borderTopColor: tk.accent }} />
          </div>
        )}
      </div>

    </div>
  );
};

const NavBtn = ({ children, onClick, disabled, color }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; color: string }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30 hover:bg-black/10 dark:hover:bg-white/10"
    style={{ color }}
  >{children}</button>
);

const MenuRow = ({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`px-5 py-2.5 text-[14px] ${disabled ? 'opacity-50 cursor-default' : 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/10'}`}
  >{label}</div>
);

const NewTabPage = ({ tk, onNavigate }: { tk: ReturnType<typeof Object> & Record<string, string>; light: boolean; onNavigate: (u: string) => void }) => {
  const [q, setQ] = useState('');
  const tiles = PROJECTS.slice(0, 8).map(p => ({ title: p.name, url: p.liveUrl, icon: p.favicon }));
  return (
    <div className="h-full w-full flex flex-col items-center overflow-auto" style={{ background: tk.bg, paddingTop: '12vh' }}>
      <img
        src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
        alt="Google"
        className="mb-9"
        style={{ width: 272, height: 92 }}
      />
      <form
        onSubmit={(e) => { e.preventDefault(); onNavigate(q); }}
        className="w-full max-w-[560px] mx-4 flex items-center px-4 mb-7 transition-shadow"
        style={{ height: 46, background: tk.menuBg, border: `1px solid ${tk.border}`, borderRadius: 24 }}
      >
        <Search className="w-5 h-5" style={{ color: '#9aa0a6' }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search Google or type a URL"
          className="flex-1 bg-transparent border-none outline-none mx-3 text-[16px]"
          style={{ color: tk.tabText }}
        />
        <Mic className="w-5 h-5 cursor-pointer" style={{ color: tk.accent }} />
      </form>
      <div className="flex flex-wrap justify-center gap-3 max-w-[640px] px-4 pb-12">
        {tiles.map((f: { title: string; url: string; icon: string }) => (
          <button
            key={f.url}
            onClick={() => onNavigate(f.url)}
            className="flex flex-col items-center gap-2 p-3 rounded-lg transition-colors"
            style={{ width: 96 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = tk.card; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center p-1.5 overflow-hidden" style={{ background: '#fff' }}>
              <img src={f.icon} alt="" className="w-9 h-9 object-contain" />
            </div>
            <div className="text-[12px] truncate w-full text-center" style={{ color: tk.tabText }}>{f.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
