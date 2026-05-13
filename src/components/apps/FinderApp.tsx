import { useState, useEffect } from 'react';
import { ChevronRight, Star, HardDrive, Download, Image as ImageIcon, FileText, Music, Film, Grid, List, Columns, X, Trash2 } from 'lucide-react';
import { ROOT, FsNode, HOME, splitPath, getNode } from '@/lib/terminalFs';
import folderIcon from '@/assets/folder-icon.png';
import documentIcon from '@/assets/document-icon.png';
import { useTrashed, restoreApp } from '@/lib/dock';
import { useMacOS } from '@/contexts/MacOSContext';
import { APP_ICONS } from '@/components/apps/LaunchpadApp';

const FolderImg = ({ size = 18 }: { size?: number }) => (
  <img src={folderIcon} alt="folder" width={size} height={size} className="object-contain shrink-0" style={{ width: size, height: size }} />
);
const FileImg = ({ size = 18 }: { size?: number }) => (
  <img src={documentIcon} alt="file" width={size} height={size} className="object-contain shrink-0" style={{ width: size, height: size }} />
);

const TRASH_PATH = '__trash__';

const SIDEBAR = [
  { label: 'Favorites', items: [
    { name: 'thanas', path: HOME, icon: Star },
    { name: 'Documents', path: HOME + '/Documents', icon: FileText },
    { name: 'Downloads', path: HOME + '/Downloads', icon: Download },
    { name: 'Desktop', path: HOME + '/Desktop', icon: FileText },
    { name: 'Pictures', path: HOME + '/Pictures', icon: ImageIcon },
    { name: 'Music', path: HOME + '/Music', icon: Music },
    { name: 'Movies', path: HOME + '/Movies', icon: Film },
  ]},
  { label: 'Locations', items: [
    { name: 'ThanasOS', path: '/', icon: HardDrive },
  ]},
  { label: 'System', items: [
    { name: 'Trash', path: TRASH_PATH, icon: Trash2 },
  ]},
];

type View = 'icons' | 'list' | 'columns';

const renderMarkdown = (md: string) => {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = md.split('\n');
  const out: string[] = [];
  let inCode = false;
  for (const raw of lines) {
    if (raw.trim().startsWith('```')) { inCode = !inCode; out.push(inCode ? '<pre class="bg-black/40 rounded-lg p-3 my-2 text-[12px] overflow-x-auto"><code>' : '</code></pre>'); continue; }
    if (inCode) { out.push(escape(raw) + '\n'); continue; }
    let l = escape(raw);
    if (/^### /.test(l)) { out.push(`<h3 class="text-base font-semibold mt-3 mb-1">${l.slice(4)}</h3>`); continue; }
    if (/^## /.test(l)) { out.push(`<h2 class="text-lg font-semibold mt-4 mb-1.5">${l.slice(3)}</h2>`); continue; }
    if (/^# /.test(l)) { out.push(`<h1 class="text-xl font-bold mt-2 mb-2">${l.slice(2)}</h1>`); continue; }
    if (/^[-*] /.test(l)) { out.push(`<li class="ml-5 list-disc text-[13px]">${l.slice(2)}</li>`); continue; }
    if (/^\s*$/.test(l)) { out.push('<br/>'); continue; }
    l = l.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    l = l.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    l = l.replace(/`([^`]+)`/g, '<code class="bg-white/10 rounded px-1 text-[12px]">$1</code>');
    out.push(`<p class="text-[13px] leading-relaxed">${l}</p>`);
  }
  return out.join('\n');
};

export const FinderApp = () => {
  const [path, setPath] = useState<string>(HOME);
  const [view, setView] = useState<View>('icons');
  const [selected, setSelected] = useState<string | null>(null);
  const [openedFile, setOpenedFile] = useState<{ name: string; content: string } | null>(null);

  const node = getNode(path);
  const parts = splitPath(path);

  const columns: { path: string; node: FsNode | null }[] = [];
  let cum = '';
  columns.push({ path: '/', node: ROOT });
  for (const p of parts) {
    cum += '/' + p;
    columns.push({ path: cum, node: getNode(cum) });
  }

  const openItem = (name: string, child: FsNode, dirPath: string) => {
    if (child.type === 'dir') {
      setPath(dirPath === '/' ? '/' + name : dirPath + '/' + name);
    } else {
      setOpenedFile({ name, content: child.content });
    }
  };

  const renderItem = (name: string, child: FsNode, dirPath: string, isSelected: boolean) => {
    const isDir = child.type === 'dir';
    return (
      <div
        key={name}
        onClick={() => { setSelected(dirPath + '/' + name); openItem(name, child, dirPath); }}
        className={`flex items-center gap-2.5 px-2 py-1.5 rounded cursor-pointer text-[14px] ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-white/10 text-neutral-200'}`}
      >
        <span className="w-5 h-5 flex items-center justify-center shrink-0">
          {isDir ? <FolderImg size={20} /> : <FileImg size={18} />}
        </span>
        <span className="truncate flex-1 leading-none">{name}</span>
        {isDir && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
      </div>
    );
  };

  const isMd = openedFile && /\.(md|markdown)$/i.test(openedFile.name);

  return (
    <div className="h-full w-full flex liquid-glass-card text-white relative" style={{ background: 'rgba(28,28,30,0.85)' }}>
      {/* Sidebar — extends to top, hosts the traffic lights overlay above the Favorites header */}
      <div className="w-48 border-r border-white/10 pl-2.5 pr-2.5 pb-2.5 overflow-y-auto bg-black/20 thin-scrollbar"
        style={{ paddingTop: 38 }}>
        {SIDEBAR.map(group => (
          <div key={group.label} className="mb-3">
            <div className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mb-1.5 px-1">{group.label}</div>
            {group.items.map(it => {
              const Icon = it.icon;
              return (
                <button
                  key={it.path}
                  onClick={() => setPath(it.path)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-[13.5px] ${path === it.path ? 'bg-blue-500/80 text-white' : 'text-white/85 hover:bg-white/10'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{it.name}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-9 flex items-center gap-2 px-3 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-0.5 bg-white/5 rounded-md p-0.5">
            <button onClick={() => setView('icons')} className={`p-1 rounded ${view === 'icons' ? 'bg-white/15' : ''}`}><Grid className="w-3.5 h-3.5" /></button>
            <button onClick={() => setView('list')} className={`p-1 rounded ${view === 'list' ? 'bg-white/15' : ''}`}><List className="w-3.5 h-3.5" /></button>
            <button onClick={() => setView('columns')} className={`p-1 rounded ${view === 'columns' ? 'bg-white/15' : ''}`}><Columns className="w-3.5 h-3.5" /></button>
          </div>
          <div className="flex-1 flex items-center gap-1 text-[12px] text-white/70 truncate min-w-0">
            {parts.length === 0 ? <span>/</span> : parts.map((p, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="opacity-60">/</span>
                <button
                  onClick={() => setPath('/' + parts.slice(0, i + 1).join('/'))}
                  className="hover:text-white truncate"
                >{p}</button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {view === 'columns' ? (
            <div className="h-full flex overflow-x-auto">
              {columns.map((col, i) => (
                <div key={i} className="w-52 shrink-0 border-r border-white/10 overflow-y-auto p-1.5">
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
            <div className="p-4 grid grid-cols-5 gap-3 overflow-y-auto h-full content-start">
              {node && node.type === 'dir' && Object.entries(node.children).map(([n, c]) => (
                <button
                  key={n}
                  onClick={() => openItem(n, c, path)}
                  className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10"
                >
                  {c.type === 'dir' ? <FolderImg size={68} /> : <FileImg size={56} />}
                  <span className="text-[13px] text-center truncate w-full">{n}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* File viewer overlay */}
      {openedFile && (
        <div
          className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setOpenedFile(null)}
        >
          <div
            className="bg-neutral-900 text-white rounded-xl shadow-2xl w-[80%] max-w-2xl max-h-[85%] flex flex-col border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-10 flex items-center justify-between px-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-[12.5px]">
                <FileImg size={16} />
                <span className="font-medium">{openedFile.name}</span>
              </div>
              <button onClick={() => setOpenedFile(null)} className="p-1 rounded hover:bg-white/10"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-auto p-5">
              {isMd ? (
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(openedFile.content) }} />
              ) : (
                <pre className="whitespace-pre-wrap text-[12.5px] font-mono text-white/85">{openedFile.content || '(empty file)'}</pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
