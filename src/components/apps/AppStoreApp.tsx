import { Github, ExternalLink, Check, Download } from 'lucide-react';
import { PROJECTS } from '@/lib/projects';
import { useInstalledProjects, installProject, uninstallProject, setPendingSafariUrl } from '@/lib/installedApps';
import { useMacOS } from '@/contexts/MacOSContext';

export const AppStoreApp = () => {
  const installed = useInstalledProjects();
  const { openApp } = useMacOS();

  return (
    <div className="h-full w-full flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <div className="px-8 py-6 border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">App Store</h1>
        <p className="text-sm text-neutral-500 mt-1">Install my projects to your Launchpad.</p>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {PROJECTS.map(p => {
            const isInstalled = installed.includes(p.id);
            return (
              <div
                key={p.id}
                className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={p.favicon} alt={p.name} className="w-10 h-10" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{p.name}</div>
                      <div className="text-xs text-neutral-500 truncate">{p.description}</div>
                    </div>
                    <button
                      onClick={() => isInstalled ? uninstallProject(p.id) : installProject(p.id)}
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                        isInstalled
                          ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-red-100 hover:text-red-700'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isInstalled ? (<><Check className="w-3 h-3" /> Installed</>) : (<><Download className="w-3 h-3" /> Get</>)}
                    </button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => { setPendingSafariUrl(p.liveUrl); openApp('safari'); }}
                      className="text-xs px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Open
                    </button>
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
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
  );
};
