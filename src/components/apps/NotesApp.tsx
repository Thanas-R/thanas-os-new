import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, ChevronRight, Search, FolderOpen, Lock, Pin, Trash2, PenSquare, Folder } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blogPosts';

export const NotesApp = () => {
  const [activeId, setActiveId] = useState(BLOG_POSTS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const active = BLOG_POSTS.find(p => p.id === activeId)!;

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.appId === 'notes' && detail?.payload?.noteId) {
        setActiveId(detail.payload.noteId);
      }
    };
    window.addEventListener('spotlight:open', handler);
    return () => window.removeEventListener('spotlight:open', handler);
  }, []);

  const filtered = BLOG_POSTS.filter(
    p => !query || p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="h-full w-full flex bg-[#1c1c1e] text-neutral-100">
      {/* Folder sidebar */}
      <aside
        className={`shrink-0 transition-all duration-300 overflow-hidden bg-[#262528] border-r border-white/5 flex flex-col ${
          sidebarOpen ? 'w-48' : 'w-0'
        }`}
      >
        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">iCloud</div>
        </div>
        <div className="px-2 space-y-0.5">
          {[
            { icon: FolderOpen, label: 'All iCloud', active: true },
            { icon: Pin, label: 'Pinned' },
            { icon: Lock, label: 'Locked' },
            { icon: Trash2, label: 'Recently Deleted' },
          ].map(it => {
            const I = it.icon;
            return (
              <button
                key={it.label}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] ${
                  it.active ? 'bg-yellow-600/30 text-yellow-100' : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                <I className="w-3.5 h-3.5" />
                {it.label}
              </button>
            );
          })}
        </div>
        <div className="px-3 pt-5 text-[10px] uppercase tracking-wider text-neutral-500">
          Folders
        </div>
        <div className="px-2 mt-1 space-y-0.5">
          {['Notes', 'Blog', 'Drafts'].map(f => (
            <button
              key={f}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] text-neutral-300 hover:bg-white/5 text-left"
            >
              <Folder className="w-3.5 h-3.5" />
              {f}
            </button>
          ))}
        </div>
      </aside>

      {/* Notes list */}
      <aside className="w-72 shrink-0 bg-[#1f1e21] border-r border-white/5 flex flex-col">
        <div className="flex items-center gap-2 px-3 pt-2 pb-3">
          <button
            onClick={() => setSidebarOpen(s => !s)}
            className="p-1 rounded hover:bg-white/10 text-neutral-300"
            title="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div className="flex-1 flex items-center gap-2 px-2 py-1 rounded-md bg-white/5">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent outline-none text-xs text-white placeholder-neutral-500"
            />
          </div>
          <button className="p-1 rounded hover:bg-white/10 text-neutral-300">
            <PenSquare className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`w-full text-left px-4 py-2.5 border-b border-white/5 transition-colors ${
                activeId === p.id ? 'bg-yellow-700/30' : 'hover:bg-white/5'
              }`}
            >
              <div className="font-semibold text-[13px] text-white truncate">{p.title}</div>
              <div className="flex gap-2 mt-0.5 text-[11px] text-neutral-400">
                <span>{p.date}</span>
                <span className="truncate">{p.preview}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Editor / Markdown view */}
      <div className="flex-1 overflow-auto bg-[#1c1c1e]">
        <div className="max-w-2xl mx-auto px-10 py-10">
          <div className="text-[11px] text-neutral-500 mb-4 text-center">{active.date}</div>
          <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-neutral-200 prose-a:text-blue-400 prose-code:text-emerald-300 prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-black/60 prose-pre:text-neutral-100 prose-blockquote:border-yellow-500 prose-blockquote:text-neutral-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{active.content}</ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
};
