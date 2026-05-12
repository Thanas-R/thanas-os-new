import { useEffect, useState } from 'react';
import cradles from '@/assets/cradles-cover.png';
import encore from '@/assets/album-encore.png';
import bringitondown from '@/assets/album-bringitondown.png';
import physical from '@/assets/album-physical.png';
import cryinglightning from '@/assets/album-cryinglightning.png';

export interface Track {
  title: string;
  artist: string;
  cover: string;
}

export interface NowPlaying extends Track {
  playing: boolean;
}

export const TRACKS: Track[] = [
  { title: 'Cradles', artist: 'Suburban', cover: cradles },
  { title: 'Mockingbird', artist: 'Eminem', cover: encore },
  { title: 'Bring It On Down', artist: 'Oasis', cover: bringitondown },
  { title: 'Physical', artist: 'Dua Lipa', cover: physical },
  { title: 'Crying Lightning', artist: 'Arctic Monkeys', cover: cryinglightning },
];

let state: NowPlaying = { ...TRACKS[0], playing: false };
const subs = new Set<() => void>();
const notify = () => subs.forEach((fn) => fn());

export const getNowPlaying = () => state;
export const setNowPlaying = (patch: Partial<NowPlaying>) => {
  state = { ...state, ...patch };
  notify();
};
export const playTrack = (t: Track) => {
  state = { ...state, ...t, playing: true };
  notify();
};
export const togglePlay = () => {
  state = { ...state, playing: !state.playing };
  notify();
};
const currentIndex = () => {
  const i = TRACKS.findIndex((t) => t.title === state.title && t.artist === state.artist);
  return i < 0 ? 0 : i;
};
export const nextTrack = () => {
  const next = TRACKS[(currentIndex() + 1) % TRACKS.length];
  state = { ...state, ...next, playing: true };
  notify();
};
export const prevTrack = () => {
  const prev = TRACKS[(currentIndex() - 1 + TRACKS.length) % TRACKS.length];
  state = { ...state, ...prev, playing: true };
  notify();
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
