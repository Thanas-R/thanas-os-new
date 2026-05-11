import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Github,
  ExternalLink,
  Check,
  Download,
  Compass,
  Gamepad2,
  Brush,
  Briefcase,
  Play,
  Code2,
  LayoutGrid,
  ArrowDownToLine,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PROJECTS } from '@/lib/projects';
import googleIcon from '@/assets/google-icon-new.png';
import {
  useInstalledProjects,
  installProject,
  uninstallProject,
  useGoogleInstalled,
  installGoogleApp,
  uninstallGoogleApp,
  setPendingSafariUrl,
} from '@/lib/installedApps';
import { useMacOS } from '@/contexts/MacOSContext';

const NAV = [
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'arcade', label: 'Arcade', icon: Gamepad2 },
  { id: 'create', label: 'Create', icon: Brush },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'play', label: 'Play', icon: Play },
  { id: 'develop', label: 'Develop', icon: Code2 },
  { id: 'categories', label: 'Categories', icon: LayoutGrid },
  { id: 'updates', label: 'Updates', icon: ArrowDownToLine },
];

export const AppStoreApp = () => {
  const installed = useInstalledProjects();
  const googleInstalled = useGoogleInstalled();
  const { openApp, updateSettings } = useMacOS();
  const [section, setSection] = useState('discover');
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Listen for spotlight launches that target a specific project / Google
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

  const list = useMemo(() => {
    return PROJECTS.filter(
      p =>
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const featured = list[0];

  const installGoogle = () => {
    installGoogleApp();
    updateSettings({ googleInstalled: true });
  };
  const uninstallGoogle = () => {
    uninstallGoogleApp();
    updateSettings({ googleInstalled: false, defaultBrowser: 'safari' });
  };

  const showGoogleCard =
    !query ||
    'google'.includes(query.toLowerCase()) ||
    'browser'.includes(query.toLowerCase());

  return (
    <div className="h-full w-full flex bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Sidebar */}
      <aside
        className={`shrink-0 transition-all duration-300 overflow-hidden bg-neutral-100/80 dark:bg-neutral-900/60 backdrop-blur-xl border-r border-black/5 dark:border-white/10 flex flex-col ${
          sidebarOpen ? 'w-56' : 'w-0'
        }`}
      >
        <div className="px-3 py-3 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white dark:bg-neutral-800 shadow-sm">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>
        <nav className="flex-1 px-2 py-2 space-y-0.5">
          {NAV.map(n => {
            const I = n.icon;
            const active = section === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  active
                    ? 'bg-neutral-200 dark:bg-neutral-700/60 text-neutral-900 dark:text-white'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/60'
                }`}
              >
                <I className="w-4 h-4" />
                {n.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto relative">
        <button
          onClick={() => setSidebarOpen(s => !s)}
          className="absolute top-3 left-3 z-10 p-1.5 rounded-md bg-white/80 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-700 backdrop-blur shadow-sm"
          title="Toggle sidebar"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Featured hero */}
        {featured && section === 'discover' && (
          <div className="pl-16 pr-8 pt-8 pb-6 border-b border-black/5 dark:border-white/10">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Featured Project
            </div>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-white dark:bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0 shadow-md ring-1 ring-black/5">
                <img src={featured.favicon} alt={featured.name} className="w-14 h-14" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl font-bold">{featured.name}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {featured.description}
                </div>
                <div className="flex gap-2 mt-3">
                  <InstallButton id={featured.id} installed={installed.includes(featured.id)} />
                  <button
                    onClick={() => {
                      setPendingSafariUrl(featured.liveUrl);
                      openApp('safari');
                    }}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Apps section — Google as a standalone app */}
        {showGoogleCard && (
          <div className="pl-16 pr-8 pt-6">
            <h2 className="text-lg font-semibold mb-4">Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex gap-3 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10">
                <div className="w-14 h-14 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-black/5 dark:ring-white/10">
                  <img src={googleIcon} alt="Google" className="w-10 h-10 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">Google</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        Fast, modern web browser by Google. Adds to your dock.
                      </div>
                    </div>
                    <button
                      onClick={() => (googleInstalled ? uninstallGoogle() : installGoogle())}
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                        googleInstalled
                          ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-red-100 hover:text-red-700'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {googleInstalled ? (
                        <><Check className="w-3 h-3" /> Installed</>
                      ) : (
                        <><Download className="w-3 h-3" /> Get</>
                      )}
                    </button>
                  </div>
                  {googleInstalled && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => openApp('google')}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Open
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects */}
        <div className="pl-16 pr-8 py-6">
          <h2 className="text-lg font-semibold mb-4">All Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {list.map(p => {
              const isInstalled = installed.includes(p.id);
              return (
                <div
                  key={p.id}
                  ref={(el) => { cardRefs.current[p.id] = el; }}
                  className={`flex gap-3 p-3 rounded-xl bg-white dark:bg-neutral-900 border transition-all ${
                    highlightId === p.id
                      ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-lg'
                      : 'border-black/5 dark:border-white/10 hover:shadow-sm'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={p.favicon} alt={p.name} className="w-9 h-9" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{p.name}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {p.description}
                        </div>
                      </div>
                      <InstallButton id={p.id} installed={isInstalled} />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          setPendingSafariUrl(p.liveUrl);
                          openApp('safari');
                        }}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Open
                      </button>
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                      >
                        <Github className="w-3 h-3" /> GitHub
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const InstallButton = ({ id, installed }: { id: string; installed: boolean }) => (
  <button
    onClick={() => (installed ? uninstallProject(id) : installProject(id))}
    className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
      installed
        ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-red-100 hover:text-red-700'
        : 'bg-blue-500 text-white hover:bg-blue-600'
    }`}
  >
    {installed ? (
      <>
        <Check className="w-3 h-3" /> Installed
      </>
    ) : (
      <>
        <Download className="w-3 h-3" /> Get
      </>
    )}
  </button>
);
