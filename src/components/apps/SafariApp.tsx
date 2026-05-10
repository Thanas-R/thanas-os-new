import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Plus, Lock, Share, X } from 'lucide-react';
import { PROJECTS } from '@/lib/projects';
import { consumePendingSafariUrl } from '@/lib/installedApps';
import prankIcon from '@/assets/prank-pichu-icon.png';

interface Tab {
  id: string;
  url: string;
  title: string;
  history: string[];
  histIdx: number;
}

const START_PAGE = 'thanasos://favorites';
const SEARCH_PAGE = 'https://www.google.com/search?igu=1&q=';

const PROJECT_HOSTS = new Set(
  PROJECTS.map(p => { try { return new URL(p.liveUrl).hostname; } catch { return ''; } }).filter(Boolean)
);

const buildPrankSrcDoc = () => `
<!DOCTYPE html><html><head><meta charset="utf-8"/><title>well, well, well…</title>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Fraunces:ital,wght@0,400;0,900;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box}html,body{margin:0;padding:0;height:100%;overflow:hidden}
body{font-family:'Inter',sans-serif;color:#0a0a0a;background:#fafafa;-webkit-font-smoothing:antialiased}
::selection{background:#30A65B;color:#0a0a0a}
.dots{position:fixed;inset:0;background-image:radial-gradient(circle,#c8c8c8 1.2px,transparent 1.4px);background-size:22px 22px;z-index:0;pointer-events:none}
.fade{position:fixed;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse 55% 50% at 50% 50%,rgba(250,250,250,1) 0%,rgba(250,250,250,.55) 60%,rgba(250,250,250,0) 85%);backdrop-filter:blur(6px)}
main{position:relative;z-index:2;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}
.wrap{max-width:760px;width:100%}
.kicker{font-family:'Caveat',cursive;font-size:clamp(28px,3.4vw,40px);color:#6b6b6b;transform:rotate(-3deg);display:inline-block;margin-bottom:-6px}
h1{font-family:'Fraunces',serif;font-weight:900;font-size:clamp(40px,6.2vw,78px);line-height:.98;letter-spacing:-.03em;margin:8px 0 22px}
h1 .ital{font-style:italic;font-weight:400;color:#2a2a2a}
h1 .accent{background:linear-gradient(180deg,transparent 62%,#fff177 62%,#fff177 92%,transparent 92%);padding:0 6px}
.lead{font-size:clamp(15px,1.25vw,17px);color:#4a4a4a;max-width:560px;margin:0 auto 12px;line-height:1.6}
.sub{font-family:'Caveat',cursive;font-size:clamp(20px,1.8vw,24px);color:#888;margin:4px 0 26px}
.discord{display:inline-flex;align-items:center;gap:14px;background:#0a0a0a;color:#fff;text-decoration:none;padding:14px 22px;border-radius:14px;font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:500;box-shadow:0 8px 24px -10px rgba(0,0,0,.35)}
.discord .label{font-family:'Inter',sans-serif;font-size:12px;color:#9a9a9a;text-transform:uppercase;letter-spacing:.18em;margin-right:4px;border-right:1px solid #2a2a2a;padding-right:12px}
.socials{margin-top:26px;display:flex;gap:22px;align-items:center;justify-content:center}
.socials a{color:#6a6a6a;text-decoration:none;font-size:13px;letter-spacing:.04em}
.socials a:hover{color:#0a0a0a}
footer{position:fixed;bottom:14px;left:0;right:0;text-align:center;font-family:'Caveat',cursive;font-size:16px;color:#a8a8a8;z-index:2}
.avatar{width:64px;height:64px;border-radius:16px;margin-bottom:14px;image-rendering:pixelated;box-shadow:0 6px 18px -6px rgba(0,0,0,.35)}
</style></head><body>
<div class="dots"></div><div class="fade"></div>
<main><div class="wrap">
  <img class="avatar" src="${window.location.origin}/prank-pichu.png" onerror="this.style.display='none'"/>
  <span class="kicker">well, well, well...</span>
  <h1><span class="ital">Haha... looks like i</span><br/><span class="accent">sniped your domain</span></h1>
  <p class="lead">no worries though — this is just a friendly reminder to secure your domains early. if you wait too long, someone else might claim your username before you do.</p>
  <p class="sub">send me a dm and i'll hand it back, free of charge :)</p>
  <a class="discord" href="https://discord.com" target="_blank" rel="noreferrer"><span class="label">DISCORD</span>DarkSpacePirate</a>
  <div class="socials">
    <a href="https://github.com/Thanas-R" target="_blank" rel="noreferrer">github</a>
    <a href="https://thanas.vercel.app" target="_blank" rel="noreferrer">portfolio</a>
    <a href="https://www.linkedin.com/in/thanas-r" target="_blank" rel="noreferrer">linkedin</a>
  </div>
</div></main>
<footer>made with ☕ &amp; mischief</footer>
</body></html>`;

const newTab = (url = START_PAGE, title = 'Favorites'): Tab => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  url, title, history: [url], histIdx: 0,
});

const isUrlLike = (s: string) => /^[a-z]+:\/\//i.test(s) || /^[\w-]+(\.[\w-]+)+(\/.*)?$/i.test(s);

const isProjectHost = (url: string) => {
  try { return PROJECT_HOSTS.has(new URL(url).hostname); } catch { return false; }
};

export const SafariApp = () => {
  const initial = useRef<Tab>(null as unknown as Tab);
  if (!initial.current) {
    const pending = consumePendingSafariUrl();
    initial.current = pending ? newTab(pending, (() => { try { return new URL(pending).hostname; } catch { return pending; } })()) : newTab();
  }
  const [tabs, setTabs] = useState<Tab[]>([initial.current]);
  const [activeId, setActiveId] = useState(initial.current.id);
  const [addressBar, setAddressBar] = useState(initial.current.url);
  const active = tabs.find(t => t.id === activeId)!;

  useEffect(() => { setAddressBar(active.url); }, [active.url, activeId]);

  const updateActive = (patch: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === activeId ? { ...t, ...patch } : t));
  };

  const goTo = (url: string, title: string) => {
    setTabs(prev => prev.map(t => {
      if (t.id !== activeId) return t;
      const newHist = t.history.slice(0, t.histIdx + 1).concat(url);
      return { ...t, url, title, history: newHist, histIdx: newHist.length - 1 };
    }));
  };

  const navigate = (raw: string) => {
    let input = raw.trim();
    if (!input) return;
    if (input === 'favorites' || input === 'thanasos://favorites') {
      goTo(START_PAGE, 'Favorites');
      return;
    }
    let url: string;
    if (isUrlLike(input)) {
      url = /^https?:\/\//.test(input) ? input : 'https://' + input;
    } else {
      url = SEARCH_PAGE + encodeURIComponent(input);
    }
    let title = url;
    try { title = new URL(url).hostname; } catch {}
    goTo(url, title);
  };

  const back = () => {
    if (active.histIdx > 0) {
      const idx = active.histIdx - 1;
      const url = active.history[idx];
      updateActive({ url, histIdx: idx, title: (() => { try { return new URL(url).hostname; } catch { return url; } })() });
    }
  };
  const forward = () => {
    if (active.histIdx < active.history.length - 1) {
      const idx = active.histIdx + 1;
      const url = active.history[idx];
      updateActive({ url, histIdx: idx, title: (() => { try { return new URL(url).hostname; } catch { return url; } })() });
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

  const isFavorites = active.url === START_PAGE;
  const isExternalNonProject = !isFavorites && /^https?:\/\//.test(active.url) && !isProjectHost(active.url) && !active.url.startsWith(SEARCH_PAGE);

  return (
    <div className="h-full w-full flex flex-col bg-white/85 dark:bg-neutral-900/85 backdrop-blur-2xl">
      {/* Tab strip */}
      <div className="flex items-center gap-1 px-3 pt-2 bg-neutral-100/80 dark:bg-neutral-800/60 border-b border-black/10 dark:border-white/10">
        {tabs.map(t => (
          <div
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer max-w-[180px] ${
              t.id === activeId
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-white/50 dark:hover:bg-neutral-700/40'
            }`}
          >
            <span className="truncate flex-1">{t.title}</span>
            {tabs.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); closeTab(t.id); }} className="opacity-0 group-hover:opacity-100 hover:bg-black/10 rounded p-0.5">
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
        <button onClick={back} disabled={active.histIdx === 0} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md text-neutral-700 dark:text-neutral-300 disabled:opacity-30"><ArrowLeft className="w-4 h-4" /></button>
        <button onClick={forward} disabled={active.histIdx >= active.history.length - 1} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md text-neutral-700 dark:text-neutral-300 disabled:opacity-30"><ArrowRight className="w-4 h-4" /></button>
        <form onSubmit={(e) => { e.preventDefault(); navigate(addressBar); }} className="flex-1 flex items-center gap-2 bg-white dark:bg-neutral-800 rounded-full px-3 py-1 border border-black/5 dark:border-white/10 max-w-2xl mx-auto">
          <Lock className="w-3 h-3 text-neutral-500" />
          <input
            value={addressBar}
            onChange={(e) => setAddressBar(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[13px] text-neutral-800 dark:text-neutral-100 text-center"
            placeholder="Search Google or enter website"
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
                <button key={p.id} onClick={() => goTo(p.liveUrl, p.name)} className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-black/5 dark:border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                    <img src={p.favicon} alt={p.name} className="w-12 h-12 object-cover" />
                  </div>
                  <span className="text-xs text-neutral-700 dark:text-neutral-300">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : isExternalNonProject ? (
          <iframe key={active.url + '-prank'} title="domain-expansion" srcDoc={buildPrankSrcDoc()} className="w-full h-full border-0 bg-white" />
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
