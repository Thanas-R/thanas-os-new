import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Search,
  Pencil,
  Folder,
  Cloud,
  Trash2,
  Tag,
  Lock,
  Star,
  Share,
} from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blogPosts';

type Folder = {
  id: string;
  name: string;
  icon: typeof Folder;
  filter?: (id: string) => boolean;
};

const FOLDERS: Folder[] = [
  { id: 'all', name: 'All iCloud', icon: Cloud, filter: () => true },
  { id: 'blog', name: 'Blog', icon: Folder, filter: () => true },
  { id: 'pinned', name: 'Pinned', icon: Star, filter: () => false },
  { id: 'shared', name: 'Shared', icon: Share, filter: () => false },
  { id: 'tags', name: 'Tags', icon: Tag, filter: () => false },
  { id: 'recently', name: 'Recently Deleted', icon: Trash2, filter: () => false },
];

export const NotesApp = () => {
  const [activeFolder, setActiveFolder] = useState('blog');
  const [activeId, setActiveId] = useState(BLOG_POSTS[0].id);
  const [query, setQuery] = useState('');

  const notes = useMemo(() => {
    const list = BLOG_POSTS;
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.preview.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q)
    );
  }, [query]);

  const active = notes.find(p => p.id === activeId) || notes[0];

  return (
    <div className="h-full w-full flex bg-[#1c1c1e] text-neutral-100 select-none">
      {/* PANE 1 — Folders */}
      <aside className="w-52 shrink-0 bg-[#252527] border-r border-white/5 flex flex-col">
        <div className="px-3 pt-3 pb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">iCloud</span>
        </div>
        <nav className="px-2 pb-2 space-y-0.5">
          {FOLDERS.map(f => {
            const Icon = f.icon;
            const active = activeFolder === f.id;
            const count = f.id === 'blog' || f.id === 'all' ? BLOG_POSTS.length : 0;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFolder(f.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                  active ? 'bg-yellow-500/25 text-yellow-100' : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-yellow-400' : 'text-neutral-400'}`} />
                <span className="flex-1 text-left truncate">{f.name}</span>
                {count > 0 && <span className="text-xs text-neutral-500">{count}</span>}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto px-3 py-2 border-t border-white/5 text-xs text-neutral-500 flex items-center gap-2">
          <Lock className="w-3 h-3" />
          On My Mac
        </div>
      </aside>

      {/* PANE 2 — Notes list */}
      <div className="w-72 shrink-0 bg-[#1f1f21] border-r border-white/5 flex flex-col">
        <div className="px-3 pt-3 pb-2 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-md px-2 py-1">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent outline-none text-sm placeholder-neutral-500"
            />
          </div>
          <button className="p-1.5 rounded-md hover:bg-white/10" title="New Note">
            <Pencil className="w-4 h-4 text-yellow-400" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {notes.map(n => {
            const isActive = active?.id === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setActiveId(n.id)}
                className={`w-full text-left px-3 py-2.5 border-b border-white/5 transition-colors ${
                  isActive ? 'bg-yellow-500/20' : 'hover:bg-white/5'
                }`}
              >
                <div className="font-semibold text-sm text-neutral-100 truncate">{n.title}</div>
                <div className="flex items-baseline gap-2 mt-1 text-xs">
                  <span className="text-neutral-300">{new Date(n.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="text-neutral-500 truncate">{n.preview}</span>
                </div>
              </button>
            );
          })}
          {notes.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-neutral-500">No notes</div>
          )}
        </div>
      </div>

      {/* PANE 3 — Editor / preview */}
      <div className="flex-1 flex flex-col bg-[#1c1c1e] min-w-0">
        {active ? (
          <>
            <div className="px-8 pt-6 pb-2 flex items-center justify-between border-b border-white/5">
              <div className="text-xs text-neutral-500">
                {new Date(active.date).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </div>
              <div className="flex items-center gap-1 text-neutral-400">
                <button className="p-1.5 rounded hover:bg-white/10" title="Pin"><Star className="w-4 h-4" /></button>
                <button className="p-1.5 rounded hover:bg-white/10" title="Share"><Share className="w-4 h-4" /></button>
                <button className="p-1.5 rounded hover:bg-white/10 text-red-400" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="max-w-2xl mx-auto px-10 py-8">
                <article className="prose prose-invert max-w-none
                  prose-headings:text-neutral-100
                  prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4
                  prose-p:text-neutral-200 prose-p:leading-relaxed
                  prose-a:text-yellow-400 hover:prose-a:text-yellow-300
                  prose-strong:text-neutral-100
                  prose-code:text-yellow-300 prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:font-mono
                  prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10
                  prose-blockquote:border-yellow-500 prose-blockquote:text-neutral-300
                  prose-li:text-neutral-200">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{active.content}</ReactMarkdown>
                </article>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm">
            Select a note
          </div>
        )}
      </div>
    </div>
  );
};