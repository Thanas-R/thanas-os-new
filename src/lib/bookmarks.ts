import { useEffect, useState } from 'react';

export interface Bookmark {
  name: string;
  url: string;
}

const KEY = 'thanasos.bookmarks';

const DEFAULTS: Bookmark[] = [
  { name: 'Portfolio', url: 'https://thanas.vercel.app' },
  { name: 'GitHub', url: 'https://github.com/Thanas-R' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/thanasr/' },
  { name: 'YouTube', url: 'https://www.youtube.com' },
  { name: 'Amazon', url: 'https://www.amazon.com' },
  { name: 'Reddit', url: 'https://www.reddit.com' },
  { name: 'Apple', url: 'https://www.apple.com' },
  { name: 'Wikipedia', url: 'https://en.wikipedia.org' },
];

const read = (): Bookmark[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULTS;
  } catch { return DEFAULTS; }
};

const listeners = new Set<() => void>();

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(read);

  useEffect(() => {
    const fn = () => setBookmarks(read());
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  const persist = (next: Bookmark[]) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
    setBookmarks(next);
    listeners.forEach(fn => fn());
  };

  const has = (url: string) => bookmarks.some(b => b.url === url);

  const add = (b: Bookmark) => {
    if (has(b.url)) return;
    persist([...bookmarks, b]);
  };
  const remove = (url: string) => persist(bookmarks.filter(b => b.url !== url));
  const toggle = (b: Bookmark) => has(b.url) ? remove(b.url) : add(b);

  return { bookmarks, add, remove, toggle, has };
};
