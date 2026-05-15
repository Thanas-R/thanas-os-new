// Music player powered by the public iTunes Search API.
// Returns 30-second preview URLs (AAC) that we play via an HTMLAudioElement.
import { useEffect, useState } from 'react';
import cradlesCover from '@/assets/cradles-cover.png';
import encoreCover from '@/assets/album-encore.png';
import bringitondownCover from '@/assets/album-bringitondown.png';
import physicalCover from '@/assets/album-physical.png';
import cryinglightningCover from '@/assets/album-cryinglightning.png';

export interface Track {
  title: string;
  artist: string;
  cover: string;
  previewUrl?: string;
}

export interface NowPlaying extends Track {
  playing: boolean;
  progress: number; // 0..1
  duration: number; // seconds
  currentTime: number; // seconds
}

// Initial seed; replaced with live iTunes data on first load.
export const TRACKS: Track[] = [
  { title: 'Cradles', artist: 'Sub Urban', cover: cradlesCover },
  { title: 'Mockingbird', artist: 'Eminem', cover: encoreCover },
  { title: 'Bring It On Down', artist: 'Oasis', cover: bringitondownCover },
  { title: 'Physical', artist: 'Dua Lipa', cover: physicalCover },
  { title: 'Crying Lightning', artist: 'Arctic Monkeys', cover: cryinglightningCover },
];

let state: NowPlaying = {
  ...TRACKS[0],
  playing: false,
  progress: 0,
  duration: 30,
  currentTime: 0,
};

const subs = new Set<() => void>();
const notify = () => subs.forEach((fn) => fn());

// ---- Singleton audio element (browser-only) ----
let audio: HTMLAudioElement | null = null;
const getAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;
  if (!audio) {
    audio = new Audio();
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';
    audio.addEventListener('timeupdate', () => {
      if (!audio) return;
      const dur = audio.duration || 30;
      state = {
        ...state,
        currentTime: audio.currentTime,
        duration: dur,
        progress: dur ? audio.currentTime / dur : 0,
      };
      notify();
    });
    audio.addEventListener('ended', () => { nextTrack(); });
    audio.addEventListener('play', () => { state = { ...state, playing: true }; notify(); });
    audio.addEventListener('pause', () => { state = { ...state, playing: false }; notify(); });
  }
  return audio;
};

// ---- iTunes Search ----
const searchITunes = async (term: string): Promise<Partial<Track> | null> => {
  try {
    const r = await fetch(`https://itunes.apple.com/search?media=music&limit=1&term=${encodeURIComponent(term)}`);
    const j = await r.json();
    const item = j.results?.[0];
    if (!item) return null;
    const cover = (item.artworkUrl100 || '').replace('100x100', '600x600');
    return { title: item.trackName, artist: item.artistName, cover, previewUrl: item.previewUrl };
  } catch { return null; }
};

// Enrich the seed list once at startup so previews are available.
let enriched = false;
const enrichTracks = async () => {
  if (enriched || typeof window === 'undefined') return;
  enriched = true;
  await Promise.all(
    TRACKS.map(async (t, i) => {
      const r = await searchITunes(`${t.title} ${t.artist}`);
      if (r?.previewUrl) {
        TRACKS[i] = { ...t, previewUrl: r.previewUrl, cover: r.cover || t.cover };
        if (state.title === t.title && state.artist === t.artist) {
          state = { ...state, ...TRACKS[i] };
          notify();
        }
      }
    })
  );
};
if (typeof window !== 'undefined') {
  setTimeout(() => { enrichTracks(); }, 0);
}

export const getNowPlaying = () => state;

export const playTrack = async (t: Track) => {
  state = { ...state, ...t, playing: true, progress: 0, currentTime: 0 };
  notify();
  const a = getAudio();
  if (!a) return;
  let url = t.previewUrl;
  if (!url) {
    const r = await searchITunes(`${t.title} ${t.artist}`);
    if (r?.previewUrl) {
      url = r.previewUrl;
      const idx = TRACKS.findIndex((x) => x.title === t.title && x.artist === t.artist);
      if (idx >= 0) TRACKS[idx] = { ...TRACKS[idx], previewUrl: url, cover: r.cover || TRACKS[idx].cover };
      state = { ...state, previewUrl: url, cover: r.cover || state.cover };
      notify();
    }
  }
  if (url) {
    a.src = url;
    try { await a.play(); } catch { /* autoplay blocked */ }
  }
};

export const togglePlay = async () => {
  const a = getAudio();
  if (!a) return;
  if (!a.src && state.previewUrl) a.src = state.previewUrl;
  if (!a.src) {
    // Lazy-load the current track's preview
    const r = await searchITunes(`${state.title} ${state.artist}`);
    if (r?.previewUrl) {
      a.src = r.previewUrl;
      state = { ...state, previewUrl: r.previewUrl };
      notify();
    }
  }
  if (a.paused) { try { await a.play(); } catch { /* ignore */ } }
  else { a.pause(); }
};

export const seekTo = (fraction: number) => {
  const a = getAudio();
  if (!a) return;
  const dur = a.duration || state.duration || 30;
  a.currentTime = Math.max(0, Math.min(dur, fraction * dur));
};

const currentIndex = () => {
  const i = TRACKS.findIndex((t) => t.title === state.title && t.artist === state.artist);
  return i < 0 ? 0 : i;
};
export const nextTrack = () => { void playTrack(TRACKS[(currentIndex() + 1) % TRACKS.length]); };
export const prevTrack = () => { void playTrack(TRACKS[(currentIndex() - 1 + TRACKS.length) % TRACKS.length]); };

export const useNowPlaying = (): NowPlaying => {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    subs.add(fn);
    return () => { subs.delete(fn); };
  }, []);
  return state;
};
