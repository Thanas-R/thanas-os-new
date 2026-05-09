import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BLOG_POSTS } from '@/lib/blogPosts';

export const NotesApp = () => {
  const [activeId, setActiveId] = useState(BLOG_POSTS[0].id);
  const active = BLOG_POSTS.find(p => p.id === activeId)!;

  return (
    <div className="h-full w-full flex bg-[#fdf6d8]">
      {/* Sidebar */}
      <div className="w-64 bg-[#f3eab8] border-r border-yellow-700/20 flex flex-col">
        <div className="px-4 py-3 border-b border-yellow-700/20">
          <div className="text-xs uppercase tracking-wider text-yellow-900/60 font-semibold">Blog</div>
          <div className="text-sm text-yellow-900/80 mt-0.5">{BLOG_POSTS.length} notes</div>
        </div>
        <div className="flex-1 overflow-auto">
          {BLOG_POSTS.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`w-full text-left px-4 py-3 border-b border-yellow-700/10 transition-colors ${
                activeId === p.id ? 'bg-yellow-300/60' : 'hover:bg-yellow-200/50'
              }`}
            >
              <div className="font-semibold text-yellow-950 text-sm truncate">{p.title}</div>
              <div className="flex gap-2 mt-1">
                <span className="text-xs text-yellow-900/60">{p.date}</span>
                <span className="text-xs text-yellow-900/50 truncate">{p.preview}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="flex-1 overflow-auto bg-[#fffbe6]">
        <div className="max-w-2xl mx-auto px-10 py-10">
          <div className="text-xs text-yellow-900/50 mb-4">{active.date}</div>
          <article className="prose prose-yellow max-w-none prose-headings:text-yellow-950 prose-p:text-yellow-950/90 prose-a:text-blue-700 prose-code:text-pink-700 prose-code:bg-yellow-200/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-yellow-950 prose-pre:text-yellow-50 prose-blockquote:border-yellow-600 prose-blockquote:text-yellow-900/80">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{active.content}</ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
};
