// Music player powered by the public iTunes Search API.
// Returns 30-second preview URLs (AAC) that we play via a singleton HTMLAudioElement.
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
  album?: string;
  category?: 'English Mix' | 'Japanese / Anime';
  searchTerm?: string;
}

export interface NowPlaying extends Track {
  playing: boolean;
  progress: number; // 0..1
  duration: number; // seconds
  currentTime: number; // seconds
}

const fallbackCovers = [
  cradlesCover,
  physicalCover,
  cryinglightningCover,
  bringitondownCover,
  encoreCover,
];

const seedTrack = (
  title: string,
  artist: string,
  category: Track['category'],
  index: number,
  searchTerm = `${title} ${artist}`,
): Track => ({
  title,
  artist,
  category,
  searchTerm,
  cover: fallbackCovers[index % fallbackCovers.length],
});

// Curated preview library. Artwork + preview URLs are hydrated from iTunes on load.
export const TRACKS: Track[] = [
  seedTrack('Cradles', 'Sub Urban', 'English Mix', 0),
  seedTrack('Crab Rave', 'Noisestorm', 'English Mix', 1),
  seedTrack('Blinding Lights', 'The Weeknd', 'English Mix', 2),
  seedTrack('Levitating', 'Dua Lipa', 'English Mix', 3),
  seedTrack('bad guy', 'Billie Eilish', 'English Mix', 4),
  seedTrack('Viva La Vida', 'Coldplay', 'English Mix', 5),
  seedTrack('Mr. Brightside', 'The Killers', 'English Mix', 6),
  seedTrack('Seven Nation Army', 'The White Stripes', 'English Mix', 7),
  seedTrack('Feel Good Inc.', 'Gorillaz', 'English Mix', 8),
  seedTrack('Numb', 'LINKIN PARK', 'English Mix', 9),
  seedTrack('Lose Yourself', 'Eminem', 'English Mix', 10),
  seedTrack('Believer', 'Imagine Dragons', 'English Mix', 11),
  seedTrack('Counting Stars', 'OneRepublic', 'English Mix', 12),
  seedTrack('Bring It On Down', 'Oasis', 'English Mix', 13),
  seedTrack('Physical', 'Dua Lipa', 'English Mix', 14),
  seedTrack('Crying Lightning', 'Arctic Monkeys', 'English Mix', 15),
  seedTrack('Idol', 'YOASOBI', 'Japanese / Anime', 16, 'Idol YOASOBI Oshi no Ko'),
  seedTrack('Racing Into The Night', 'YOASOBI', 'Japanese / Anime', 17, 'Yoru ni Kakeru YOASOBI'),
  seedTrack('Gurenge', 'LiSA', 'Japanese / Anime', 18, 'Gurenge LiSA Demon Slayer'),
  seedTrack('Blue Bird', 'Ikimonogakari', 'Japanese / Anime', 19, 'Blue Bird Ikimonogakari Naruto'),
  seedTrack('Silhouette', 'KANA-BOON', 'Japanese / Anime', 20, 'Silhouette KANA-BOON Naruto'),
  seedTrack('unravel', 'TK from Ling tosite sigure', 'Japanese / Anime', 21, 'unravel TK from Ling tosite sigure Tokyo Ghoul'),
  seedTrack('Kaikai Kitan', 'Eve', 'Japanese / Anime', 22, 'Kaikai Kitan Eve Jujutsu Kaisen'),
  seedTrack('KICK BACK', 'Kenshi Yonezu', 'Japanese / Anime', 23, 'KICK BACK Kenshi Yonezu Chainsaw Man'),
  seedTrack('Sparkle', 'RADWIMPS', 'Japanese / Anime', 24, 'Sparkle RADWIMPS Your Name'),
  seedTrack('Again', 'YUI', 'Japanese / Anime', 25, 'Again YUI Fullmetal Alchemist Brotherhood'),
  seedTrack("A Cruel Angel's Thesis", 'Yoko Takahashi', 'Japanese / Anime', 26, "A Cruel Angel's Thesis Yoko Takahashi Evangelion"),
  seedTrack('Hikaru Nara', 'Goose house', 'Japanese / Anime', 27, 'Hikaru Nara Goose house Your Lie in April'),
  seedTrack('Crossing Field', 'LiSA', 'Japanese / Anime', 28, 'Crossing Field LiSA Sword Art Online'),
  seedTrack('The Rumbling', 'SiM', 'Japanese / Anime', 29, 'The Rumbling SiM Attack on Titan'),
];

let state: NowPlaying = {
  ...TRACKS[0],
  playing: false,
  progress: 0,
  duration: 30,
  currentTime: 0,
};

const subs = new Set<() => void>();
const librarySubs = new Set<() => void>();
const notify = () => subs.forEach((fn) => fn());
const notifyLibrary = () => librarySubs.forEach((fn) => fn());

let playerVolume = 0.65;

// ---- Singleton audio element (browser-only) ----
let audio: HTMLAudioElement | null = null;
const getAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;
  if (!audio) {
    audio = new Audio();
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';
    audio.volume = playerVolume;
    audio.addEventListener('loadedmetadata', () => {
      if (!audio) return;
      const dur = Number.isFinite(audio.duration) ? audio.duration : 30;
      state = { ...state, duration: dur };
      notify();
    });
    audio.addEventListener('timeupdate', () => {
      if (!audio) return;
      const dur = Number.isFinite(audio.duration) ? audio.duration : state.duration || 30;
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

const updateTrackInLibrary = (track: Track, patch: Partial<Track>) => {
  const index = TRACKS.findIndex((t) => t.title === track.title && t.artist === track.artist);
  const next = { ...track, ...patch };
  if (index >= 0) {
    TRACKS[index] = { ...TRACKS[index], ...patch };
    notifyLibrary();
    return TRACKS[index];
  }
  return next;
};

// ---- iTunes Search ----
const searchITunes = async (term: string): Promise<Partial<Track> | null> => {
  try {
    const url = `https://itunes.apple.com/search?media=music&entity=song&limit=10&term=${encodeURIComponent(term)}`;
    const response = await fetch(url);
    const json = await response.json();
    const item = json.results?.find((result: { previewUrl?: string }) => Boolean(result.previewUrl)) ?? json.results?.[0];
    if (!item?.previewUrl) return null;
    const cover = (item.artworkUrl100 || '').replace('100x100bb', '600x600bb').replace('100x100', '600x600');
    return {
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName,
      cover,
      previewUrl: item.previewUrl,
    };
  } catch {
    return null;
  }
};

const resolvePlayableTrack = async (track: Track) => {
  if (track.previewUrl) return track;
  const result = await searchITunes(track.searchTerm || `${track.title} ${track.artist}`);
  if (!result?.previewUrl) return track;
  return updateTrackInLibrary(track, result);
};

// Enrich the seed list once at startup so previews + artwork are available.
let enriched = false;
const enrichTracks = async () => {
  if (enriched || typeof window === 'undefined') return;
  enriched = true;

  await Promise.all(
    TRACKS.map(async (track) => {
      const resolved = await resolvePlayableTrack(track);
      if (state.title === track.title && state.artist === track.artist) {
        state = { ...state, ...resolved };
        notify();
      }
    }),
  );
  notifyLibrary();
};

if (typeof window !== 'undefined') {
  setTimeout(() => { void enrichTracks(); }, 0);
}

export const preloadTrackLibrary = () => { void enrichTracks(); };
export const getNowPlaying = () => state;

export const setPlayerVolume = (value: number) => {
  playerVolume = Math.max(0, Math.min(1, value / 100));
  const player = getAudio();
  if (player) player.volume = playerVolume;
};

export const playTrack = async (track: Track) => {
  state = { ...state, ...track, playing: false, progress: 0, currentTime: 0, duration: 30 };
  notify();

  const player = getAudio();
  if (!player) return;

  const resolved = await resolvePlayableTrack(track);
  if (!resolved.previewUrl) {
    state = { ...state, ...resolved, playing: false };
    notify();
    return;
  }

  state = { ...state, ...resolved, playing: true, progress: 0, currentTime: 0, duration: 30 };
  notify();
  player.src = resolved.previewUrl;
  player.currentTime = 0;
  player.volume = playerVolume;

  try {
    await player.play();
  } catch {
    state = { ...state, playing: false };
    notify();
  }
};

export const togglePlay = async () => {
  const player = getAudio();
  if (!player) return;

  if (!player.src) {
    await playTrack(state);
    return;
  }

  if (player.paused) {
    try { await player.play(); } catch { /* ignore browser gesture restrictions */ }
  } else {
    player.pause();
  }
};

export const seekTo = (fraction: number) => {
  const player = getAudio();
  if (!player) return;
  const dur = Number.isFinite(player.duration) ? player.duration : state.duration || 30;
  player.currentTime = Math.max(0, Math.min(dur, fraction * dur));
};

const currentIndex = () => {
  const i = TRACKS.findIndex((track) => track.title === state.title && track.artist === state.artist);
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

export const useTrackLibrary = (): Track[] => {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    librarySubs.add(fn);
    void enrichTracks();
    return () => { librarySubs.delete(fn); };
  }, []);
  return TRACKS;
};
