import { useEffect, useState } from 'react';

export interface NowPlaying {
  title: string;
  artist: string;
  cover: string; // image URL
  playing: boolean;
}

import cradles from '@/assets/cradles-cover.png';

let state: NowPlaying = {
  title: 'Cradles',
  artist: 'Suburban',
  cover: cradles,
  playing: false,
};
const subs = new Set<() => void>();

export const getNowPlaying = () => state;
export const setNowPlaying = (patch: Partial<NowPlaying>) => {
  state = { ...state, ...patch };
  subs.forEach((fn) => fn());
};
export const useNowPlaying = (): NowPlaying => {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    subs.add(fn);
    return () => { subs.delete(fn); };
  }, []);
  return state;
};
