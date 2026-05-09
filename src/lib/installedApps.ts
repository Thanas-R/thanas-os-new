import { useEffect, useState } from 'react';

const STORAGE_KEY = 'thanasos-installed-projects';
const listeners = new Set<() => void>();

const read = (): string[] => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
};

const write = (ids: string[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  listeners.forEach(fn => fn());
};

export const installProject = (id: string) => {
  const cur = read();
  if (!cur.includes(id)) write([...cur, id]);
};

export const uninstallProject = (id: string) => {
  write(read().filter(x => x !== id));
};

export const isInstalled = (id: string) => read().includes(id);

export const useInstalledProjects = () => {
  const [ids, setIds] = useState<string[]>(read);
  useEffect(() => {
    const fn = () => setIds(read());
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return ids;
};

// Safari URL handoff — set before opening Safari to preload a page
let pendingUrl: string | null = null;
export const setPendingSafariUrl = (url: string | null) => { pendingUrl = url; };
export const consumePendingSafariUrl = () => {
  const u = pendingUrl;
  pendingUrl = null;
  return u;
};
