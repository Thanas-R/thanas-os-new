import { Search, Clock, Disc, Music as MusicIcon, Radio, ListMusic, Heart, Volume2, Shuffle, Repeat } from 'lucide-react';
import { IoPlay, IoPause, IoPlayForward, IoPlayBack } from 'react-icons/io5';
import { useMacOS } from '@/contexts/MacOSContext';
import { useNowPlaying, setNowPlaying } from '@/lib/nowPlaying';
import cradles from '@/assets/cradles-cover.png';
import encore from '@/assets/album-encore.png';
import bringitondown from '@/assets/album-bringitondown.png';
import physical from '@/assets/album-physical.png';
import cryinglightning from '@/assets/album-cryinglightning.png';

const ARTWORKS = [
  { artist: 'Suburban', song: 'Cradles', img: cradles, tag: 'Top Picks for You' },
  { artist: 'Eminem', song: 'Mockingbird', img: encore, tag: 'Made for You' },
  { artist: 'Oasis', song: 'Bring It On Down', img: bringitondown, tag: 'Featuring Oasis' },
  { artist: 'Dua Lipa', song: 'Physical', img: physical, tag: 'Trending' },
  { artist: 'Arctic Monkeys', song: 'Crying Lightning', img: cryinglightning, tag: 'New Music Mix' },
  { artist: 'The Weeknd', song: 'Blinding Lights', img: cradles, tag: 'Made for You' },
];

const RECENT = ARTWORKS.slice(0, 6);

export const AppleMusicApp = () => {
  const np = useNowPlaying();
  const { settings, updateSettings } = useMacOS();

  const play = (a: { artist: string; song: string; img: string }) => {
    setNowPlaying({ title: a.song, artist: a.artist, cover: a.img, playing: true });
  };

  return (
    <div className="h-full w-full flex flex-col bg-white text-neutral-900 select-none" style={{ fontFamily: '-apple-system, "SF Pro Text", Roboto, sans-serif' }}>
      {/* Top transport bar (macOS Music app style) */}
      <div className="h-[58px] flex items-center px-4 gap-3 border-b border-black/10" style={{ background: 'linear-gradient(180deg,#fafafa,#ececec)' }}>
        <div className="flex items-center gap-3 text-neutral-700">
          <button className="hover:text-black"><Shuffle className="w-4 h-4" /></button>
          <button className="hover:text-black"><IoPlayBack className="w-5 h-5" /></button>
          <button onClick={() => setNowPlaying({ playing: !np.playing })} className="hover:text-black">
            {np.playing ? <IoPause className="w-6 h-6" /> : <IoPlay className="w-6 h-6" />}
          </button>
          <button className="hover:text-black"><IoPlayForward className="w-5 h-5" /></button>
          <button className="hover:text-black"><Repeat className="w-4 h-4" /></button>
        </div>

        {/* LCD */}
        <div className="flex-1 max-w-[520px] mx-auto h-10 rounded-md border border-black/10 bg-white flex items-center px-2 gap-2 shadow-inner">
          <img src={np.cover} alt="" className="w-7 h-7 rounded-sm object-cover" />
          <div className="flex-1 min-w-0 text-center leading-tight">
            <div className="text-[12px] font-semibold truncate">{np.title}</div>
            <div className="text-[10.5px] text-neutral-500 truncate">{np.artist}</div>
            <div className="mt-0.5 h-[3px] bg-black/10 rounded-full overflow-hidden mx-2">
              <div className="h-full bg-[#fa2d48] rounded-full" style={{ width: '33%' }} />
            </div>
          </div>
          <Heart className="w-4 h-4 text-neutral-500" />
        </div>

        <div className="flex items-center gap-2 w-[180px]">
          <Volume2 className="w-4 h-4 text-neutral-600" />
          <input
            type="range" min={0} max={100}
            value={settings.volume ?? 65}
            onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
            className="w-full accent-[#fa2d48]"
          />
        </div>
      </div>

      <div className="flex-1 grid min-h-0" style={{ gridTemplateColumns: '220px 1fr' }}>
        {/* Sidebar */}
        <aside className="overflow-y-auto thin-scrollbar px-2 py-3 border-r border-black/10" style={{ background: '#f6f6f6' }}>
          <div className="flex items-center gap-1 px-2 pb-2 text-[#fa2d48] font-semibold text-[15px]">
            <MusicIcon className="w-4 h-4" /> Music
          </div>
          <div className="px-2 mb-3">
            <div className="flex items-center gap-1.5 h-8 rounded-full px-3 shadow-sm"
              style={{
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(0,0,0,0.06)',
              }}>
              <Search className="w-3.5 h-3.5 text-neutral-500" />
              <input className="bg-transparent outline-none text-[12px] flex-1" placeholder="Search" />
            </div>
          </div>

          <NavGroup>
            <NavItem icon={<Heart className="w-3.5 h-3.5 text-[#fa2d48]" />} selected>Home</NavItem>
            <NavItem icon={<Disc className="w-3.5 h-3.5 text-[#fa2d48]" />}>New</NavItem>
            <NavItem icon={<Radio className="w-3.5 h-3.5 text-[#fa2d48]" />}>Radio</NavItem>
          </NavGroup>

          <NavTitle>Library</NavTitle>
          <NavGroup>
            <NavItem icon={<ListMusic className="w-3.5 h-3.5 text-[#fa2d48]" />}>Pins</NavItem>
            <NavItem icon={<Clock className="w-3.5 h-3.5 text-[#fa2d48]" />}>Recently Added</NavItem>
            <NavItem icon={<MusicIcon className="w-3.5 h-3.5 text-[#fa2d48]" />}>Artists</NavItem>
            <NavItem icon={<Disc className="w-3.5 h-3.5 text-[#fa2d48]" />}>Albums</NavItem>
            <NavItem icon={<MusicIcon className="w-3.5 h-3.5 text-[#fa2d48]" />}>Songs</NavItem>
            <NavItem icon={<Heart className="w-3.5 h-3.5 text-[#fa2d48]" />}>Made for You</NavItem>
          </NavGroup>

          <NavTitle>Playlists</NavTitle>
          <NavGroup>
            <NavItem icon={<ListMusic className="w-3.5 h-3.5 text-[#fa2d48]" />}>All Playlists</NavItem>
            <NavItem icon={<ListMusic className="w-3.5 h-3.5 text-[#fa2d48]" />}>Work</NavItem>
            <NavItem icon={<ListMusic className="w-3.5 h-3.5 text-[#fa2d48]" />}>Kids stuff</NavItem>
            <NavItem icon={<ListMusic className="w-3.5 h-3.5 text-[#fa2d48]" />}>Olivia's Best</NavItem>
            <NavItem icon={<ListMusic className="w-3.5 h-3.5 text-[#fa2d48]" />}>Pop Chill</NavItem>
          </NavGroup>
        </aside>

        {/* Main */}
        <main className="overflow-y-auto thin-scrollbar px-7 py-5 bg-white">
          <h1 className="text-[28px] font-bold mb-5">Home</h1>

          <div className="text-[14px] font-semibold mb-3">Top Picks for You</div>
          <div className="grid grid-cols-4 gap-5 mb-7">
            {ARTWORKS.slice(0, 4).map((a) => (
              <button key={a.song} onClick={() => play(a)} className="text-left group">
                <div className="aspect-square rounded-md overflow-hidden shadow-sm border border-black/5 relative">
                  <img src={a.img} alt={a.song} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
                </div>
                <div className="mt-1.5 text-[11px] uppercase tracking-wider text-neutral-500">{a.tag}</div>
                <div className="text-[13px] font-semibold leading-tight truncate">{a.song}</div>
                <div className="text-[12px] text-neutral-500 truncate">{a.artist}</div>
              </button>
            ))}
          </div>

          <div className="text-[14px] font-semibold mb-3">Recently Played</div>
          <div className="grid grid-cols-6 gap-4">
            {RECENT.map((a) => (
              <button key={'r-' + a.song} onClick={() => play(a)} className="text-left group">
                <div className="aspect-square rounded-md overflow-hidden border border-black/5 shadow-sm">
                  <img src={a.img} alt={a.song} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
                </div>
                <div className="mt-1.5 text-[12px] font-semibold truncate">{a.song}</div>
                <div className="text-[11px] text-neutral-500 truncate">{a.artist}</div>
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

const NavTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[10.5px] uppercase tracking-wider text-neutral-500 mt-4 mb-1.5 px-2 font-semibold">{children}</h3>
);
const NavGroup = ({ children }: { children: React.ReactNode }) => <ul className="space-y-px">{children}</ul>;
const NavItem = ({ children, icon, selected }: { children: React.ReactNode; icon?: React.ReactNode; selected?: boolean }) => (
  <li>
    <a href="#" className={`flex items-center gap-2 px-2 py-[5px] rounded text-[12.5px] ${selected ? 'bg-[#e6e6e6] text-black font-medium' : 'text-neutral-700 hover:bg-black/5'}`}>
      {icon}{children}
    </a>
  </li>
);
