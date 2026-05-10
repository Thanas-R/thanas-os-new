import { useEffect, useState } from 'react';

const STORAGE_KEY = 'thanasos-installed-projects';
const GOOGLE_KEY = 'thanasos-google-installed';
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

// --- Google app install state (separate from project installs) ---
const readGoogle = () => {
  try { return localStorage.getItem(GOOGLE_KEY) === '1'; } catch { return false; }
};

export const installGoogleApp = () => {
  localStorage.setItem(GOOGLE_KEY, '1');
  listeners.forEach(fn => fn());
};
export const uninstallGoogleApp = () => {
  localStorage.setItem(GOOGLE_KEY, '0');
  listeners.forEach(fn => fn());
};
export const isGoogleInstalled = readGoogle;

export const useGoogleInstalled = () => {
  const [v, setV] = useState<boolean>(readGoogle);
  useEffect(() => {
    const fn = () => setV(readGoogle());
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return v;
};

// Safari URL handoff — set before opening Safari to preload a page
let pendingUrl: string | null = null;
export const setPendingSafariUrl = (url: string | null) => { pendingUrl = url; };
export const consumePendingSafariUrl = () => {
  const u = pendingUrl;
  pendingUrl = null;
  return u;
};
