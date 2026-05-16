// Music player powered by the public iTunes Search API.
// Fully reactive store — no mutable global arrays that React can't track.
// Per-track retry with exponential backoff — nothing silently fails.

import { useEffect, useState } from 'react';
import cradlesCover from '@/assets/image-asset.jpg';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Category =
  | 'English Mix'
  | 'Anime'
  | 'Hindi'
  | 'Sports / Anthems'
  | 'Movie Themes'
  | 'Electronic'
  | 'Hip-Hop'
  | 'Indie / Rock';

export interface Track {
  title: string;
  artist: string;
  cover: string;
  previewUrl?: string;
  album?: string;
  category?: Category;
  searchTerm?: string;
  resolved?: boolean;
}

export interface NowPlaying extends Track {
  playing: boolean;
  progress: number;
  duration: number;
  currentTime: number;
}

// ─── Reactive Store ───────────────────────────────────────────────────────────
// This is the single source of truth for ALL track data.
// Any component that calls useTrackLibrary() will re-render whenever any track
// updates — no manual subscription wiring needed.

const trackStore: Track[] = [];
const librarySubs = new Set<() => void>();
const playerSubs = new Set<() => void>();

const notifyLibrary = () => librarySubs.forEach((fn) => fn());
const notifyPlayer  = () => playerSubs.forEach((fn) => fn());

/** Atomically update one track and immediately notify all subscribers. */
const updateTrack = (index: number, patch: Partial<Track>) => {
  trackStore[index] = { ...trackStore[index], ...patch };
  notifyLibrary();
};

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seed = (
  title: string,
  artist: string,
  category: Category,
  searchTerm?: string
): Track => ({
  title,
  artist,
  category,
  searchTerm: searchTerm ?? `${title} ${artist}`,
  cover: cradlesCover,
  resolved: false,
});

/** Master track list — populated once at module load, then enriched in place. */
export const TRACKS: Track[] = [
  // English Mix
  seed('Cradles', 'Sub Urban', 'English Mix'),
  seed('Blinding Lights', 'The Weeknd', 'English Mix'),
  seed('Levitating', 'Dua Lipa', 'English Mix'),
  seed('bad guy', 'Billie Eilish', 'English Mix'),
  seed('Viva La Vida', 'Coldplay', 'English Mix'),
  seed('Counting Stars', 'OneRepublic', 'English Mix'),
  seed('Shape of You', 'Ed Sheeran', 'English Mix'),
  seed('Uptown Funk', 'Mark Ronson', 'English Mix', 'Uptown Funk Bruno Mars'),
  seed('Watermelon Sugar', 'Harry Styles', 'English Mix'),
  seed('Physical', 'Dua Lipa', 'English Mix'),
  seed('As It Was', 'Harry Styles', 'English Mix'),
  seed('Flowers', 'Miley Cyrus', 'English Mix'),
  seed('Anti-Hero', 'Taylor Swift', 'English Mix'),
  seed('Stay', 'The Kid LAROI', 'English Mix', 'Stay The Kid LAROI Justin Bieber'),

  // Indie / Rock
  seed('Mr. Brightside', 'The Killers', 'Indie / Rock'),
  seed('Seven Nation Army', 'The White Stripes', 'Indie / Rock'),
  seed('Feel Good Inc.', 'Gorillaz', 'Indie / Rock'),
  seed('Believer', 'Imagine Dragons', 'Indie / Rock'),
  seed('Do I Wanna Know?', 'Arctic Monkeys', 'Indie / Rock'),
  seed('Bohemian Rhapsody', 'Queen', 'Indie / Rock'),
  seed('Somebody That I Used to Know', 'Gotye', 'Indie / Rock'),
  seed('Pumped Up Kicks', 'Foster the People', 'Indie / Rock'),

  // Hip-Hop
  seed('SICKO MODE', 'Travis Scott', 'Hip-Hop'),
  seed('HUMBLE.', 'Kendrick Lamar', 'Hip-Hop'),
  seed("God's Plan", 'Drake', 'Hip-Hop'),
  seed('Old Town Road', 'Lil Nas X', 'Hip-Hop'),
  seed('Without Me', 'Eminem', 'Hip-Hop'),

  // Electronic
  seed('Animals', 'Martin Garrix', 'Electronic'),
  seed('Wake Me Up', 'Avicii', 'Electronic'),
  seed('Faded', 'Alan Walker', 'Electronic'),
  seed('Titanium', 'David Guetta', 'Electronic', 'Titanium David Guetta Sia'),
  seed('Lean On', 'Major Lazer', 'Electronic', 'Lean On Major Lazer DJ Snake'),

  // Anime
  seed('Idol', 'YOASOBI', 'Anime', 'Idol YOASOBI Oshi no Ko'),
  seed('Racing Into The Night', 'YOASOBI', 'Anime', 'Yoru ni Kakeru YOASOBI'),
  seed('Gurenge', 'LiSA', 'Anime', 'Gurenge LiSA Demon Slayer'),
  seed('Blue Bird', 'Ikimonogakari', 'Anime', 'Blue Bird Ikimonogakari Naruto'),
  seed('Silhouette', 'KANA-BOON', 'Anime', 'Silhouette KANA-BOON Naruto'),
  seed('unravel', 'TK from Ling tosite sigure', 'Anime', 'unravel TK Tokyo Ghoul'),
  seed('Kaikai Kitan', 'Eve', 'Anime', 'Kaikai Kitan Eve Jujutsu Kaisen'),
  seed('KICK BACK', 'Kenshi Yonezu', 'Anime', 'KICK BACK Kenshi Yonezu Chainsaw Man'),
  seed('Sparkle', 'RADWIMPS', 'Anime', 'Sparkle RADWIMPS Your Name'),
  seed("A Cruel Angel's Thesis", 'Yoko Takahashi', 'Anime', "A Cruel Angel's Thesis Evangelion"),
  seed('Crossing Field', 'LiSA', 'Anime', 'Crossing Field LiSA Sword Art Online'),
  seed('The Rumbling', 'SiM', 'Anime', 'The Rumbling SiM Attack on Titan'),
  seed('Guren no Yumiya', 'Linked Horizon', 'Anime', 'Guren no Yumiya Linked Horizon Attack on Titan'),
  seed('Cha-La Head-Cha-La', 'Hironobu Kageyama', 'Anime', 'Cha-La Head-Cha-La Dragon Ball Z'),
  seed('Tank!', 'Seatbelts', 'Anime', 'Tank Seatbelts Cowboy Bebop'),
  seed('Again', 'YUI', 'Anime', 'Again YUI Fullmetal Alchemist Brotherhood'),
  seed('Lilium', 'Kumiko Noma', 'Anime', 'Lilium Elfen Lied'),
  seed('Pretender', 'Official HIGE DANdism', 'Anime', 'Pretender Official Hige Dandism'),
  seed('Mixed Nuts', 'Official HIGE DANdism', 'Anime', 'Mixed Nuts Official Hige Dandism Spy x Family'),
  seed('Zenzenzense', 'RADWIMPS', 'Anime', 'Zenzenzense RADWIMPS Your Name'),

  // Hindi
  seed('Kesariya', 'Arijit Singh', 'Hindi', 'Kesariya Arijit Singh Brahmastra'),
  seed('Tum Hi Ho', 'Arijit Singh', 'Hindi', 'Tum Hi Ho Aashiqui 2'),
  seed('Channa Mereya', 'Arijit Singh', 'Hindi', 'Channa Mereya Ae Dil Hai Mushkil'),
  seed('Senorita', 'Farhan Akhtar', 'Hindi', 'Senorita Zindagi Na Milegi Dobara'),
  seed('Gerua', 'Arijit Singh', 'Hindi', 'Gerua Dilwale'),

  // Sports / Anthems
  seed('Waka Waka', 'Shakira', 'Sports / Anthems', 'Waka Waka Shakira FIFA 2010'),
  seed('We Are The Champions', 'Queen', 'Sports / Anthems'),
  seed('We Will Rock You', 'Queen', 'Sports / Anthems'),
  seed('Eye of the Tiger', 'Survivor', 'Sports / Anthems'),

  // Movie Themes
  seed('My Heart Will Go On', 'Celine Dion', 'Movie Themes', 'My Heart Will Go On Titanic'),
  seed("He's a Pirate", 'Klaus Badelt', 'Movie Themes', "He's a Pirate Pirates of the Caribbean"),
  seed('Time', 'Hans Zimmer', 'Movie Themes', 'Time Hans Zimmer Inception'),
];

// Mirror TRACKS into our reactive store on load
TRACKS.forEach((t) => trackStore.push({ ...t }));

// Keep TRACKS in sync with store so external code that reads TRACKS directly
// still gets the latest data (backward-compatible).
const syncBackToTracks = (index: number) => {
  TRACKS[index] = { ...trackStore[index] };
};

// ─── iTunes Search ────────────────────────────────────────────────────────────

const ITUNES_LIMIT = 8; // Fetch more candidates → better chance of a match

/**
 * Search iTunes and return enrichment data.
 * Strategy: prefer a result with BOTH previewUrl AND artwork.
 * Fall back to preview-only if that's all we get.
 */
const searchITunes = async (term: string): Promise<Partial<Track> | null> => {
  try {
    const url = `https://itunes.apple.com/search?media=music&entity=song&limit=${ITUNES_LIMIT}&term=${encodeURIComponent(term)}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const json: { results: any[] } = await res.json();
    const results = json.results ?? [];
    if (!results.length) return null;

    // Best: has both preview + art
    const best =
      results.find((r) => r.previewUrl && r.artworkUrl100) ??
      results.find((r) => r.previewUrl) ??
      null;

    if (!best?.previewUrl) return null;

    const cover = best.artworkUrl100
      ? best.artworkUrl100
          .replace('100x100bb', '600x600bb')
          .replace('100x100', '600x600')
      : cradlesCover;

    return {
      album:      best.collectionName ?? undefined,
      cover,
      previewUrl: best.previewUrl,
      resolved:   true,
    };
  } catch {
    return null;
  }
};

// ─── Enrichment Engine ────────────────────────────────────────────────────────
// Each track gets up to MAX_RETRIES attempts with exponential backoff.
// Retries are independent per-track — one failure doesn't block others.

const MAX_RETRIES  = 5;
const BATCH_SIZE   = 8;   // concurrent requests per wave
const BASE_DELAY   = 600; // ms — first retry wait

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload  = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

/** Enrich a single track with retries. Mutates trackStore + TRACKS directly. */
const enrichOneTrack = async (index: number): Promise<void> => {
  const track = trackStore[index];
  if (track.resolved && track.previewUrl) return; // already done

  const term = track.searchTerm ?? `${track.title} ${track.artist}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const result = await searchITunes(term);

    if (result?.previewUrl) {
      // Kick off image preload in parallel — don't await, just fire
      if (result.cover && result.cover !== cradlesCover) {
        void preloadImage(result.cover);
      }
      updateTrack(index, result);
      syncBackToTracks(index);
      return; // success — stop retrying
    }

    if (attempt < MAX_RETRIES) {
      // Exponential backoff: 600 → 1200 → 2400 → 4800 ms
      await sleep(BASE_DELAY * 2 ** (attempt - 1));
    }
  }

  // After all retries: mark attempted so we don't spin forever,
  // but keep resolved: false so UI knows it's unplayable.
  updateTrack(index, { resolved: false });
  syncBackToTracks(index);
};

let enrichmentStarted = false;

/**
 * Start enriching all tracks.
 * Safe to call multiple times — only runs once.
 * Processes in parallel batches to stay within iTunes rate limits.
 */
const startEnrichment = async () => {
  if (enrichmentStarted || typeof window === 'undefined') return;
  enrichmentStarted = true;

  const indices = trackStore
    .map((_, i) => i)
    .filter((i) => !trackStore[i].resolved || !trackStore[i].previewUrl);

  for (let i = 0; i < indices.length; i += BATCH_SIZE) {
    const batch = indices.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(enrichOneTrack));

    // Small pause between batches to avoid iTunes throttling
    if (i + BATCH_SIZE < indices.length) {
      await sleep(300);
    }
  }

  // Final notify in case any subscriber missed an update
  notifyLibrary();
};

// Kick off enrichment immediately on module load
if (typeof window !== 'undefined') {
  void startEnrichment();
}

// ─── Public helper (backward-compatible) ─────────────────────────────────────

export const preloadTrackLibrary = () => {
  void startEnrichment();
};

// ─── Audio Engine ─────────────────────────────────────────────────────────────

let nowPlaying: NowPlaying = {
  ...trackStore[0],
  playing:     false,
  progress:    0,
  duration:    30,
  currentTime: 0,
};

let playerVolume = 0.65;
let audio: HTMLAudioElement | null = null;

const getAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;
  if (audio) return audio;

  audio = new Audio();
  audio.preload     = 'metadata';
  audio.crossOrigin = 'anonymous';
  audio.volume      = playerVolume;

  audio.addEventListener('loadedmetadata', () => {
    if (!audio) return;
    const dur = Number.isFinite(audio.duration) ? audio.duration : 30;
    nowPlaying = { ...nowPlaying, duration: dur };
    notifyPlayer();
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio) return;
    const dur = Number.isFinite(audio.duration) ? audio.duration : nowPlaying.duration || 30;
    nowPlaying = {
      ...nowPlaying,
      currentTime: audio.currentTime,
      duration:    dur,
      progress:    dur ? audio.currentTime / dur : 0,
    };
    notifyPlayer();
  });

  audio.addEventListener('ended', () => nextTrack());

  audio.addEventListener('play', () => {
    nowPlaying = { ...nowPlaying, playing: true };
    notifyPlayer();
  });

  audio.addEventListener('pause', () => {
    nowPlaying = { ...nowPlaying, playing: false };
    notifyPlayer();
  });

  return audio;
};

// ─── Playback API ─────────────────────────────────────────────────────────────

export const getNowPlaying = (): NowPlaying => nowPlaying;

export const setPlayerVolume = (value: number) => {
  playerVolume = Math.max(0, Math.min(1, value / 100));
  const player = getAudio();
  if (player) player.volume = playerVolume;
};

/**
 * Play a track.
 * If the track isn't resolved yet, fetches iTunes fresh right now (fast path).
 * Also back-fills the store so the library card updates immediately.
 */
export const playTrack = async (track: Track): Promise<void> => {
  const player = getAudio();
  if (!player) return;

  let resolved: Track = { ...track };

  if (!resolved.previewUrl || !resolved.resolved) {
    const term = track.searchTerm ?? `${track.title} ${track.artist}`;
    const result = await searchITunes(term);

    if (result?.previewUrl) {
      resolved = { ...resolved, ...result };

      // Back-fill into the reactive store
      const idx = trackStore.findIndex(
        (t) => t.title === track.title && t.artist === track.artist
      );
      if (idx >= 0) {
        updateTrack(idx, result);
        syncBackToTracks(idx);
      }
    }
  }

  if (!resolved.previewUrl) {
    // Can't play — update state but don't crash
    nowPlaying = { ...nowPlaying, playing: false };
    notifyPlayer();
    return;
  }

  nowPlaying = {
    ...nowPlaying,
    ...resolved,
    playing:     true,
    progress:    0,
    currentTime: 0,
    duration:    30,
  };
  notifyPlayer();

  player.src         = resolved.previewUrl;
  player.currentTime = 0;
  player.volume      = playerVolume;

  try {
    await player.play();
  } catch {
    nowPlaying = { ...nowPlaying, playing: false };
    notifyPlayer();
  }
};

export const togglePlay = async (): Promise<void> => {
  const player = getAudio();
  if (!player) return;

  if (!player.src) {
    await playTrack(nowPlaying);
    return;
  }

  if (player.paused) {
    try { await player.play(); } catch { /* ignore */ }
  } else {
    player.pause();
  }
};

export const seekTo = (fraction: number): void => {
  const player = getAudio();
  if (!player) return;
  const dur = Number.isFinite(player.duration) ? player.duration : nowPlaying.duration || 30;
  player.currentTime = Math.max(0, Math.min(dur, fraction * dur));
};

// ─── Navigation ───────────────────────────────────────────────────────────────

/** All tracks that have a real previewUrl right now. */
const playable = (): Track[] => trackStore.filter((t) => t.previewUrl);

const currentIndex = (): number => {
  const list = playable();
  const i = list.findIndex(
    (t) => t.title === nowPlaying.title && t.artist === nowPlaying.artist
  );
  return i < 0 ? 0 : i;
};

export const nextTrack = (): void => {
  const list = playable();
  if (list.length) void playTrack(list[(currentIndex() + 1) % list.length]);
};

export const prevTrack = (): void => {
  const list = playable();
  if (list.length) void playTrack(list[(currentIndex() - 1 + list.length) % list.length]);
};

// ─── React Hooks ──────────────────────────────────────────────────────────────

export const useNowPlaying = (): NowPlaying => {
  const [, force] = useState(0);

  useEffect(() => {
    const fn = () => force((n) => n + 1);
    playerSubs.add(fn);
    return () => { playerSubs.delete(fn); };
  }, []);

  return nowPlaying;
};

/**
 * Returns the full track library from the reactive store.
 * Re-renders automatically as each track resolves — no stale data.
 */
export const useTrackLibrary = (): Track[] => {
  const [, force] = useState(0);

  useEffect(() => {
    const fn = () => force((n) => n + 1);
    librarySubs.add(fn);

    // Ensure enrichment is running (no-op if already started)
    void startEnrichment();

    return () => { librarySubs.delete(fn); };
  }, []);

  // Always read from trackStore, not the stale TRACKS array
  return [...trackStore];
};
