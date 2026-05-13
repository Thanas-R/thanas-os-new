import { useEffect, useState } from 'react';

const ORDER_KEY = 'thanasos-dock-order';
const TRASH_KEY = 'thanasos-trashed-apps';

const listeners = new Set<() => void>();
const notify = () => listeners.forEach(fn => fn());

const readArr = (key: string): string[] => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : [];
  } catch { return []; }
};
const writeArr = (key: string, arr: string[]) => {
  localStorage.setItem(key, JSON.stringify(arr));
  notify();
};

export const getDockOrder = (): string[] => readArr(ORDER_KEY);
export const setDockOrder = (ids: string[]) => writeArr(ORDER_KEY, ids);

export const getTrashed = (): string[] => readArr(TRASH_KEY);
export const trashApp = (id: string) => {
  const t = readArr(TRASH_KEY);
  if (!t.includes(id)) writeArr(TRASH_KEY, [...t, id]);
  // also remove from dock order
  const order = readArr(ORDER_KEY);
  if (order.includes(id)) writeArr(ORDER_KEY, order.filter(x => x !== id));
};
export const restoreApp = (id: string) => {
  writeArr(TRASH_KEY, readArr(TRASH_KEY).filter(x => x !== id));
};
export const isTrashed = (id: string) => readArr(TRASH_KEY).includes(id);

export const useDockOrder = () => {
  const [v, setV] = useState<string[]>(getDockOrder);
  useEffect(() => {
    const fn = () => setV(getDockOrder());
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return v;
};
export const useTrashed = () => {
  const [v, setV] = useState<string[]>(getTrashed);
  useEffect(() => {
    const fn = () => setV(getTrashed());
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return v;
};

// Apps that cannot be trashed/removed (system essentials)
export const PROTECTED_APPS = new Set(['finder', 'launchpad', 'settings', 'appstore']);
