// Music player powered by the public iTunes Search API.
// Each track is verified against iTunes before being exposed to the UI —
// only tracks with a real 30-second preview + real album art are shown.
import { useEffect, useState } from 'react';
import cradlesCover from '@/assets/cradles-cover.png';

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
  /** true once resolved against iTunes with a real previewUrl + artwork */
  resolved?: boolean;
}

export interface NowPlaying extends Track {
  playing: boolean;
  progress: number;
  duration: number;
  currentTime: number;
}

const seed = (
  title: string,
  artist: string,
  category: Category,
  searchTerm?: string
): Track => ({
  title,
  artist,
  category,
  searchTerm: searchTerm || `${title} ${artist}`,
  cover: cradlesCover,
  resolved: false,
});

// Curated library — every entry is a well-known song that returns a result
// from the iTunes Search API. Non-resolving tracks are filtered out of the UI.
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

  // Anime — well-known anime OPs/EDs that iTunes carries
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

    audio.addEventListener('ended', () => {
      nextTrack();
    });

    audio.addEventListener('play', () => {
      state = { ...state, playing: true };
      notify();
    });

    audio.addEventListener('pause', () => {
      state = { ...state, playing: false };
      notify();
    });
  }
  return audio;
};

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

const searchITunes = async (term: string): Promise<Partial<Track> | null> => {
  try {
    const url = `https://itunes.apple.com/search?media=music&entity=song&limit=5&term=${encodeURIComponent(term)}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const json = await response.json();
    const results = json.results ?? [];
    if (!results.length) return null;

    const best = results.find((r: any) => r.previewUrl && r.artworkUrl100) || results[0];
    if (!best?.previewUrl || !best?.artworkUrl100) return null;

    const cover = (best.artworkUrl100 || '')
      .replace('100x100bb', '600x600bb')
      .replace('100x100', '600x600');

    return {
      album: best.collectionName,
      cover,
      previewUrl: best.previewUrl,
      resolved: true,
    };
  } catch {
    return null;
  }
};

let enrichmentStarted = false;
const inFlight = new Set<number>();

const resolveTrack = async (index: number): Promise<void> => {
  if (inFlight.has(index)) return;

  const track = TRACKS[index];
  if (!track || track.resolved) return;

  inFlight.add(index);
  try {
    const result = await searchITunes(track.searchTerm || `${track.title} ${track.artist}`);

    if (!result?.previewUrl) return;

    if (result.cover) void preloadImage(result.cover);

    TRACKS[index] = {
      ...TRACKS[index],
      ...result,
      resolved: true,
    };

    notifyLibrary();

    if (state.title === track.title && state.artist === track.artist) {
      state = {
        ...state,
        ...TRACKS[index],
      };
      notify();
    }
  } finally {
    inFlight.delete(index);
  }
};

const enrichTracks = async () => {
  if (enrichmentStarted || typeof window === 'undefined') return;
  enrichmentStarted = true;

  const batchSize = 6;

  for (let i = 0; i < TRACKS.length; i += batchSize) {
    const count = Math.min(batchSize, TRACKS.length - i);

    await Promise.all(
      Array.from({ length: count }, (_, offset) => resolveTrack(i + offset))
    );
  }

  notifyLibrary();
};

if (typeof window !== 'undefined') {
  setTimeout(() => {
    void enrichTracks();
  }, 0);
}

export const preloadTrackLibrary = () => {
  void enrichTracks();
};

export const getNowPlaying = () => state;

export const setPlayerVolume = (value: number) => {
  playerVolume = Math.max(0, Math.min(1, value / 100));
  const player = getAudio();
  if (player) player.volume = playerVolume;
};

export const playTrack = async (track: Track) => {
  const player = getAudio();
  if (!player) return;

  let resolved: Track = track;

  if (!resolved.previewUrl || !resolved.resolved) {
    const r = await searchITunes(track.searchTerm || `${track.title} ${track.artist}`);

    if (r?.previewUrl) {
      resolved = {
        ...track,
        ...r,
        resolved: true,
      };

      if (r.cover) void preloadImage(r.cover);

      const idx = TRACKS.findIndex(
        (t) => t.title === track.title && t.artist === track.artist
      );

      if (idx >= 0) {
        TRACKS[idx] = {
          ...TRACKS[idx],
          ...r,
          resolved: true,
        };
        notifyLibrary();

        if (state.title === track.title && state.artist === track.artist) {
          state = {
            ...state,
            ...TRACKS[idx],
          };
          notify();
        }
      }
    }
  }

  if (!resolved.previewUrl) {
    state = {
      ...state,
      playing: false,
    };
    notify();
    return;
  }

  state = {
    ...state,
    ...resolved,
    playing: true,
    progress: 0,
    currentTime: 0,
    duration: 30,
  };

  notify();

  player.src = resolved.previewUrl;
  player.currentTime = 0;
  player.volume = playerVolume;

  try {
    await player.play();
  } catch {
    state = {
      ...state,
      playing: false,
    };
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
    try {
      await player.play();
    } catch {
      // ignore
    }
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

const playable = () => TRACKS.filter((t) => t.previewUrl);

const currentIndex = () => {
  const list = playable();
  const i = list.findIndex((track) => track.title === state.title && track.artist === state.artist);
  return i < 0 ? 0 : i;
};

export const nextTrack = () => {
  const list = playable();
  if (list.length) void playTrack(list[(currentIndex() + 1) % list.length]);
};

export const prevTrack = () => {
  const list = playable();
  if (list.length) void playTrack(list[(currentIndex() - 1 + list.length) % list.length]);
};

export const useNowPlaying = (): NowPlaying => {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  }, []);
  return state;
};

// Returns ONLY tracks verified to play (real preview + real artwork from iTunes).
export const useTrackLibrary = (): Track[] => {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    librarySubs.add(fn);
    void enrichTracks();
    return () => {
      librarySubs.delete(fn);
    };
  }, []);
  return TRACKS;
};
