import { useState } from 'react';
import { Folder, File, ChevronRight, Star, HardDrive, Download, Image as ImageIcon, FileText, Music, Film, PanelLeftClose, PanelLeftOpen, Grid, List, Columns } from 'lucide-react';
import { ROOT, FsNode, HOME, splitPath, getNode } from '@/lib/terminalFs';

const SIDEBAR = [
  { label: 'Favorites', items: [
    { name: 'thanas', path: HOME, icon: Star },
    { name: 'Documents', path: HOME + '/Documents', icon: FileText },
    { name: 'Downloads', path: HOME + '/Downloads', icon: Download },
    { name: 'Desktop', path: HOME + '/Desktop', icon: Folder },
    { name: 'Pictures', path: HOME + '/Pictures', icon: ImageIcon },
    { name: 'Music', path: HOME + '/Music', icon: Music },
    { name: 'Movies', path: HOME + '/Movies', icon: Film },
  ]},
  { label: 'Locations', items: [
    { name: 'ThanasOS', path: '/', icon: HardDrive },
  ]},
];

type View = 'icons' | 'list' | 'columns';

export const FinderApp = () => {
  const [path, setPath] = useState<string>(HOME);
  const [view, setView] = useState<View>('columns');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const node = getNode(path);
  const parts = splitPath(path);

  // For column view, build columns from each ancestor dir
  const columns: { path: string; node: FsNode | null }[] = [];
  let cum = '';
  columns.push({ path: '/', node: ROOT });
  for (const p of parts) {
    cum += '/' + p;
    columns.push({ path: cum, node: getNode(cum) });
  }

  const renderItem = (name: string, child: FsNode, dirPath: string, isSelected: boolean) => {
    const isDir = child.type === 'dir';
    return (
      <div
        key={name}
        onClick={() => { setSelected(dirPath + '/' + name); if (isDir) setPath(dirPath === '/' ? '/' + name : dirPath + '/' + name); }}
        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-sm ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-white/10 text-neutral-200'}`}
      >
        {isDir ? <Folder className="w-4 h-4 text-blue-400" /> : <File className="w-4 h-4 text-neutral-400" />}
        <span className="truncate flex-1">{name}</span>
        {isDir && <ChevronRight className="w-3 h-3 opacity-60" />}
      </div>
    );
  };

  return (
    <div className="h-full w-full flex liquid-glass-card text-white" style={{ background: 'rgba(28,28,30,0.85)' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-52 border-r border-white/10 p-3 overflow-y-auto bg-black/20">
          {SIDEBAR.map(group => (
            <div key={group.label} className="mb-4">
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1.5 px-1">{group.label}</div>
              {group.items.map(it => {
                const Icon = it.icon;
                return (
                  <button
                    key={it.path}
                    onClick={() => setPath(it.path)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm ${path === it.path ? 'bg-blue-500/80 text-white' : 'text-white/80 hover:bg-white/10'}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{it.name}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-11 flex items-center gap-2 px-3 border-b border-white/10 bg-black/20">
          <button onClick={() => setSidebarOpen(s => !s)} className="p-1 rounded hover:bg-white/10">
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-0.5 ml-2 bg-white/5 rounded-md p-0.5">
            <button onClick={() => setView('icons')} className={`p-1 rounded ${view === 'icons' ? 'bg-white/15' : ''}`}><Grid className="w-3.5 h-3.5" /></button>
            <button onClick={() => setView('list')} className={`p-1 rounded ${view === 'list' ? 'bg-white/15' : ''}`}><List className="w-3.5 h-3.5" /></button>
            <button onClick={() => setView('columns')} className={`p-1 rounded ${view === 'columns' ? 'bg-white/15' : ''}`}><Columns className="w-3.5 h-3.5" /></button>
          </div>
          <div className="flex-1 text-center text-xs text-white/70 truncate">{path}</div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          {view === 'columns' ? (
            <div className="h-full flex overflow-x-auto">
              {columns.map((col, i) => (
                <div key={i} className="w-56 shrink-0 border-r border-white/10 overflow-y-auto p-1.5">
                  {col.node && col.node.type === 'dir' ? (
                    Object.entries(col.node.children).map(([n, c]) =>
                      renderItem(n, c, col.path, selected === col.path + '/' + n || (i < columns.length - 1 && parts[i] === n))
                    )
                  ) : col.node && col.node.type === 'file' ? (
                    <div className="p-2 text-xs text-white/70 whitespace-pre-wrap">{col.node.content}</div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : view === 'list' ? (
            <div className="p-2 overflow-y-auto h-full">
              {node && node.type === 'dir' && Object.entries(node.children).map(([n, c]) =>
                renderItem(n, c, path, selected === path + '/' + n)
              )}
            </div>
          ) : (
            <div className="p-4 grid grid-cols-5 gap-4 overflow-y-auto h-full">
              {node && node.type === 'dir' && Object.entries(node.children).map(([n, c]) => (
                <button
                  key={n}
                  onClick={() => { if (c.type === 'dir') setPath(path === '/' ? '/' + n : path + '/' + n); }}
                  className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/10"
                >
                  {c.type === 'dir' ? <Folder className="w-12 h-12 text-blue-400" /> : <File className="w-12 h-12 text-neutral-400" />}
                  <span className="text-xs text-center truncate w-full">{n}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
