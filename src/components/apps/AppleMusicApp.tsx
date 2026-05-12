import { Search, Clock, Disc, Music as MusicIcon, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';
import { useNowPlaying, setNowPlaying } from '@/lib/nowPlaying';
import cradles from '@/assets/cradles-cover.png';

const ARTWORKS = [
  { artist: 'Suburban', song: 'Cradles', img: cradles },
  { artist: 'Eminem', song: 'Mockingbird', img: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/35/The_Eminem_Show.jpg/220px-The_Eminem_Show.jpg' },
  { artist: 'Oasis', song: 'Bring It On Down', img: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/16/OasisDefinitelyMaybealbumcover.jpg/220px-OasisDefinitelyMaybealbumcover.jpg' },
  { artist: 'The Weeknd', song: 'Blinding Lights', img: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png' },
  { artist: 'Dua Lipa', song: 'Physical', img: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dua_Lipa_-_Physical.png' },
  { artist: 'Arctic Monkeys', song: 'Crying Lightning', img: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Arctic_Monkeys_-_Humbug.png' },
  { artist: 'Gorillaz', song: 'Dirty Harry', img: 'https://upload.wikimedia.org/wikipedia/en/f/fa/Gorillaz_-_Demon_Days.png' },
  { artist: 'The 1975', song: 'If You\u2019re Too Shy', img: 'https://upload.wikimedia.org/wikipedia/en/f/fa/The_1975_-_Notes_on_a_Conditional_Form.png' },
  { artist: 'Red Hot Chili Peppers', song: 'Wet Sand', img: 'https://upload.wikimedia.org/wikipedia/en/4/4c/RedHotChiliPeppersStadiumArcadium.jpg' },
];

export const AppleMusicApp = () => {
  const np = useNowPlaying();
  const { settings, updateSettings } = useMacOS();

  const play = (a: { artist: string; song: string; img: string }) => {
    setNowPlaying({ title: a.song, artist: a.artist, cover: a.img, playing: true });
  };

  return (
    <div
      className="h-full w-full flex flex-col text-white select-none"
      style={{ background: 'linear-gradient(180deg,#2a1820 0%,#1b0d12 60%,#0c0709 100%)', fontFamily: 'Roboto, -apple-system, sans-serif' }}
    >
      <div className="flex-1 grid" style={{ gridTemplateColumns: '220px 1fr' }}>
        {/* Sidebar */}
        <aside className="px-5 pt-3 pb-24 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <NavGroup>
            <NavItem selected>Listen now</NavItem>
            <NavItem>Browse</NavItem>
            <NavItem>Radio</NavItem>
          </NavGroup>
          <NavTitle>Library</NavTitle>
          <NavGroup>
            <NavItem icon={<Clock className="w-4 h-4 opacity-80" />}>Recents</NavItem>
            <NavItem icon={<Disc className="w-4 h-4 opacity-80" />}>Albums</NavItem>
            <NavItem icon={<MusicIcon className="w-4 h-4 opacity-80" />}>Songs</NavItem>
          </NavGroup>
          <NavTitle>Playlists</NavTitle>
          <NavGroup>
            <NavItem>Summer</NavItem>
            <NavItem>Smasher vol.III</NavItem>
            <NavItem>Vibes</NavItem>
          </NavGroup>
        </aside>

        {/* Main */}
        <main className="px-7 pt-3 pb-32 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.18)' }}>
          <div className="flex items-center mb-6">
            <div className="flex-1 flex items-center gap-2 border-b border-white/15 pb-1">
              <Search className="w-5 h-5" />
              <input
                placeholder="Search"
                className="bg-transparent outline-none flex-1 text-[18px] font-medium placeholder-white/70"
              />
            </div>
          </div>
          <h1 className="text-[44px] font-bold mb-5">Listen now</h1>
          <div className="grid grid-cols-3 gap-6">
            {ARTWORKS.map((a) => (
              <button
                key={a.song}
                onClick={() => play(a)}
                className="relative h-[260px] rounded-xl overflow-hidden group text-left"
                style={{ background: `url(${a.img}) center/cover no-repeat` }}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition" />
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(10px)' }}
                >
                  <div className="text-[13px] font-semibold text-black tracking-wide">{a.artist}</div>
                  <div className="text-[12px] text-black/80">{a.song}</div>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* Player */}
      <div
        className="absolute left-5 right-5 bottom-5 rounded-xl px-4 py-3 flex items-center gap-4"
        style={{ background: 'rgba(45,45,50,0.9)', backdropFilter: 'blur(12px)' }}
      >
        <img src={np.cover} alt="" className="w-14 h-14 rounded-md object-cover" />
        <div className="min-w-0 w-44">
          <div className="text-[13px] font-semibold truncate">{np.title}</div>
          <div className="text-[12px] text-white/70 truncate">{np.artist}</div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center gap-5 mb-2">
            <button className="hover:opacity-70"><SkipBack className="w-4 h-4" fill="white" /></button>
            <button onClick={() => setNowPlaying({ playing: !np.playing })} className="hover:opacity-70">
              {np.playing ? <Pause className="w-5 h-5" fill="white" /> : <Play className="w-5 h-5" fill="white" />}
            </button>
            <button className="hover:opacity-70"><SkipForward className="w-4 h-4" fill="white" /></button>
          </div>
          <div className="flex items-center gap-3 w-full text-[11px] text-white/80">
            <span>1:12</span>
            <div className="flex-1 h-[5px] bg-white/20 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '33%', background: 'linear-gradient(90deg,#017bff,#03b0ff)' }} />
            </div>
            <span>3:24</span>
          </div>
        </div>
        <div className="flex items-center gap-2 w-40">
          <Volume2 className="w-4 h-4" />
          <input
            type="range" min={0} max={100}
            value={settings.volume ?? 65}
            onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
            className="w-full accent-white"
          />
        </div>
      </div>
    </div>
  );
};

const NavTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[12px] text-white/70 mb-2 mt-6 px-2 font-medium">{children}</h3>
);
const NavGroup = ({ children }: { children: React.ReactNode }) => <ul className="space-y-0.5">{children}</ul>;
const NavItem = ({ children, icon, selected }: { children: React.ReactNode; icon?: React.ReactNode; selected?: boolean }) => (
  <li>
    <a href="#" className={`flex items-center gap-3 px-2.5 py-1.5 rounded-md text-[14px] ${selected ? 'bg-black/30' : 'hover:bg-black/20'}`}>
      {icon}{children}
    </a>
  </li>
);
