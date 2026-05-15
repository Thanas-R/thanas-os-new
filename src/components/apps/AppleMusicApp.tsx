import { useMemo, useState } from 'react';
import { Search, Clock, Disc, Music as MusicIcon, Radio, ListMusic, Heart, Play, Loader2 } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';
import { playTrack, preloadTrackLibrary, useNowPlaying, useTrackLibrary } from '@/lib/nowPlaying';
import type { Track } from '@/lib/nowPlaying';
import { NowPlayingPill } from '@/components/macos/NowPlayingPill';

const TAGS = ['Top Pick', 'Fun', 'Viral', 'Essential', 'Replay', 'Radio Hit','Discover'];

type MusicTone = {
  page: string;
  side: string;
  main: string;
  text: string;
  sub: string;
  border: string;
  sideHover: string;
  selected: string;
  elevated: string;
};

export const AppleMusicApp = () => {
  const { settings } = useMacOS();
  const tracks = useTrackLibrary();
  const nowPlaying = useNowPlaying();
  const [query, setQuery] = useState('');
  const dark = settings.theme === 'dark';

  const tone: MusicTone = dark
    ? { page: '#1c1c1e', side: '#252528', main: '#1c1c1e', text: '#f5f5f7', sub: '#a8a8ad', border: 'rgba(255,255,255,0.08)', sideHover: 'rgba(255,255,255,0.06)', selected: 'rgba(255,255,255,0.10)', elevated: 'rgba(255,255,255,0.045)' }
    : { page: '#ffffff', side: '#f6f6f6', main: '#ffffff', text: '#1c1c1e', sub: '#737378', border: 'rgba(0,0,0,0.10)', sideHover: 'rgba(0,0,0,0.05)', selected: '#e6e6e6', elevated: 'rgba(0,0,0,0.035)' };

  const accent = '#fa2d48';
  const normalizedQuery = query.trim().toLowerCase();
  const visibleTracks = useMemo(() => {
    if (!normalizedQuery) return tracks;
    return tracks.filter((track) =>
      [track.title, track.artist, track.album, track.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [normalizedQuery, tracks]);

  const englishTracks = visibleTracks.filter((track) => track.category !== 'Japanese / Anime');
  const japaneseTracks = visibleTracks.filter((track) => track.category === 'Japanese / Anime');
  const topPicks = visibleTracks.slice(0, 7);

  return (
    <div
      className="h-full w-full flex flex-col select-none relative"
      style={{ background: tone.page, color: tone.text, fontFamily: '-apple-system, "SF Pro Text", Roboto, sans-serif' }}
      onMouseEnter={preloadTrackLibrary}
    >
      <div className="flex-1 grid min-h-0" style={{ gridTemplateColumns: '220px 1fr' }}>
        <aside className="overflow-y-auto no-scrollbar px-2 pb-3 border-r" style={{ background: tone.side, borderColor: tone.border }}>
          <div className="w-full pr-3 pt-3 pb-2 flex justify-end">
            <div className="font-semibold text-[15px]" style={{ color: accent }}>Music</div>
          </div>

          <div className="px-2 mb-3">
            <div
              className="flex items-center gap-1.5 h-8 rounded-md px-3 shadow-sm"
              style={{
                width: '110%',
                marginLeft: '-5%',
                background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: `1px solid ${tone.border}`,
              }}
            >
              <Search className="w-3.5 h-3.5" style={{ color: tone.sub }} />
              <input
                className="bg-transparent outline-none text-[12px] flex-1 min-w-0"
                placeholder="Search songs, artists, albums"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                style={{ color: tone.text }}
              />
            </div>
          </div>

          <NavGroup>
            <NavItem tone={tone} icon={<Heart className="w-3.5 h-3.5" style={{ color: accent }} />} selected>Home</NavItem>
            <NavItem tone={tone} icon={<Disc className="w-3.5 h-3.5" style={{ color: accent }} />}>New</NavItem>
            <NavItem tone={tone} icon={<Radio className="w-3.5 h-3.5" style={{ color: accent }} />}>Radio</NavItem>
          </NavGroup>

          <NavTitle tone={tone}>Library</NavTitle>
          <NavGroup>
            <NavItem tone={tone} icon={<ListMusic className="w-3.5 h-3.5" style={{ color: accent }} />}>All Songs</NavItem>
            <NavItem tone={tone} icon={<Clock className="w-3.5 h-3.5" style={{ color: accent }} />}>Recently Added</NavItem>
            <NavItem tone={tone} icon={<MusicIcon className="w-3.5 h-3.5" style={{ color: accent }} />}>Artists</NavItem>
            <NavItem tone={tone} icon={<Disc className="w-3.5 h-3.5" style={{ color: accent }} />}>Albums</NavItem>
            <NavItem tone={tone} icon={<Heart className="w-3.5 h-3.5" style={{ color: accent }} />}>Anime Mix</NavItem>
          </NavGroup>

          <NavTitle tone={tone}>Playlists</NavTitle>
          <NavGroup>
            <NavItem tone={tone} icon={<ListMusic className="w-3.5 h-3.5" style={{ color: accent }} />}>Internet Classics</NavItem>
            <NavItem tone={tone} icon={<ListMusic className="w-3.5 h-3.5" style={{ color: accent }} />}>English Hits</NavItem>
            <NavItem tone={tone} icon={<ListMusic className="w-3.5 h-3.5" style={{ color: accent }} />}>Japanese / Anime</NavItem>
          </NavGroup>
        </aside>

        <main className="overflow-y-auto no-scrollbar px-7 pt-9 pb-32" style={{ background: tone.main }}>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h1 className="text-[28px] font-bold leading-tight">Home</h1>
              <div className="text-[12px] mt-1" style={{ color: tone.sub }}>
                {visibleTracks.length} playable previews · English hits + Japanese anime favourites
              </div>
            </div>
            <button
              onClick={() => topPicks[0] && playTrack(topPicks[0])}
              className="h-9 px-4 rounded-full text-[13px] font-semibold flex items-center gap-2"
              style={{ background: accent, color: '#fff' }}
            >
              <Play className="w-3.5 h-3.5" fill="currentColor" /> Play
            </button>
          </div>

          <SectionTitle tone={tone}>Top Picks for You</SectionTitle>
          <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))' }}>
            {topPicks.map((track, index) => (
              <AlbumCard key={`${track.title}-${track.artist}`} track={track} tag={TAGS[index % TAGS.length]} tone={tone} active={track.title === nowPlaying.title && track.artist === nowPlaying.artist} />
            ))}
          </div>

          <SectionTitle tone={tone}>Japanese / Anime Essentials</SectionTitle>
          <HorizontalTrackList tracks={japaneseTracks} tone={tone} nowPlaying={nowPlaying} />

          <SectionTitle tone={tone}>English Mix</SectionTitle>
          <HorizontalTrackList tracks={englishTracks} tone={tone} nowPlaying={nowPlaying} />

          <SectionTitle tone={tone}>Songs</SectionTitle>
          <div className="rounded-xl overflow-hidden border mb-6" style={{ borderColor: tone.border, background: tone.elevated }}>
            {visibleTracks.map((track, index) => (
              <SongRow key={`song-${track.title}-${track.artist}`} track={track} index={index + 1} tone={tone} active={track.title === nowPlaying.title && track.artist === nowPlaying.artist} />
            ))}
            {visibleTracks.length === 0 && (
              <div className="h-28 flex items-center justify-center text-[13px]" style={{ color: tone.sub }}>No songs found</div>
            )}
          </div>
        </main>
      </div>

      <NowPlayingPill dark={dark} />
    </div>
  );
};

const SectionTitle = ({ children, tone }: { children: React.ReactNode; tone: MusicTone }) => (
  <div className="text-[14px] font-semibold mb-3 flex items-center gap-2">
    {children}
    <span className="h-px flex-1" style={{ background: tone.border }} />
  </div>
);

const AlbumCard = ({ track, tag, tone, active }: { track: Track; tag: string; tone: MusicTone; active: boolean }) => (
  <button onClick={() => playTrack(track)} className="text-left group min-w-0">
    <div className="aspect-square rounded-md overflow-hidden shadow-sm relative" style={{ border: `1px solid ${active ? '#fa2d48' : tone.border}` }}>
      <img src={track.cover} alt={track.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-200" />
      {!track.previewUrl && (
        <div className="absolute right-2 bottom-2 w-6 h-6 rounded-full bg-black/45 text-white flex items-center justify-center">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        </div>
      )}
    </div>
    <div className="mt-1.5 text-[10.5px] uppercase tracking-wider truncate" style={{ color: tone.sub }}>{tag}</div>
    <div className="text-[13px] font-semibold leading-tight truncate" style={{ color: active ? '#fa2d48' : tone.text }}>{track.title}</div>
    <div className="text-[12px] truncate" style={{ color: tone.sub }}>{track.artist}</div>
  </button>
);

const HorizontalTrackList = ({ tracks, tone, nowPlaying }: { tracks: Track[]; tone: MusicTone; nowPlaying: Track }) => (
  <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
    {tracks.slice(0, 12).map((track) => (
      <button
        key={`${track.category}-${track.title}-${track.artist}`}
        onClick={() => playTrack(track)}
        className="h-[64px] rounded-lg p-2 flex items-center gap-3 text-left group"
        style={{ background: tone.elevated, border: `1px solid ${track.title === nowPlaying.title && track.artist === nowPlaying.artist ? '#fa2d48' : tone.border}` }}
      >
        <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-md object-cover shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-[12.5px] font-semibold truncate" style={{ color: track.title === nowPlaying.title && track.artist === nowPlaying.artist ? '#fa2d48' : tone.text }}>{track.title}</div>
          <div className="text-[11.5px] truncate" style={{ color: tone.sub }}>{track.artist}</div>
        </div>
        <Play className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" fill="currentColor" style={{ color: tone.sub }} />
      </button>
    ))}
  </div>
);

const SongRow = ({ track, index, tone, active }: { track: Track; index: number; tone: MusicTone; active: boolean }) => (
  <button
    onClick={() => playTrack(track)}
    className="w-full h-[54px] px-3 grid items-center text-left group border-b last:border-b-0"
    style={{ gridTemplateColumns: '34px 44px 1.4fr 1fr 90px', borderColor: tone.border, color: tone.text }}
  >
    <span className="text-[12px]" style={{ color: active ? '#fa2d48' : tone.sub }}>{active ? '▶' : index}</span>
    <img src={track.cover} alt={track.title} className="w-9 h-9 rounded object-cover" />
    <div className="min-w-0 px-3">
      <div className="text-[12.5px] font-semibold truncate" style={{ color: active ? '#fa2d48' : tone.text }}>{track.title}</div>
      <div className="text-[11px] truncate" style={{ color: tone.sub }}>{track.artist}</div>
    </div>
    <div className="text-[11.5px] truncate pr-4" style={{ color: tone.sub }}>{track.album || track.category}</div>
    <div className="text-[11px] justify-self-end flex items-center gap-1" style={{ color: tone.sub }}>
      {track.previewUrl ? '0:30' : <><Loader2 className="w-3 h-3 animate-spin" /> loading</>}
    </div>
  </button>
);

const NavTitle = ({ children, tone }: { children: React.ReactNode; tone: MusicTone }) => (
  <h3 className="text-[10.5px] uppercase tracking-wider mt-4 mb-1.5 px-2 font-semibold" style={{ color: tone.sub }}>{children}</h3>
);

const NavGroup = ({ children }: { children: React.ReactNode }) => <ul className="space-y-px">{children}</ul>;

const NavItem = ({ children, icon, selected, tone }: { children: React.ReactNode; icon?: React.ReactNode; selected?: boolean; tone: MusicTone }) => (
  <li>
    <a
      href="#"
      className="flex items-center gap-2 px-2 py-[5px] rounded text-[12.5px]"
      style={{
        background: selected ? tone.selected : 'transparent',
        color: tone.text,
        fontWeight: selected ? 600 : 400,
      }}
    >
      {icon}{children}
    </a>
  </li>
);
