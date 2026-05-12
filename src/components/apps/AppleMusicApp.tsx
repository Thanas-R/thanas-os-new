import { Search, Clock, Disc, Music as MusicIcon, Radio, ListMusic, Heart } from 'lucide-react';
// MusicIcon kept for nav rows (Songs/Artists). Header label icon removed per design.
import { useMacOS } from '@/contexts/MacOSContext';
import { TRACKS, playTrack } from '@/lib/nowPlaying';
import { NowPlayingPill } from '@/components/macos/NowPlayingPill';

const TAGS = ['Top Picks for You', 'Made for You', 'Featuring Oasis', 'Trending', 'New Music Mix', 'Made for You'];

export const AppleMusicApp = () => {
  const { settings } = useMacOS();
  const dark = settings.theme === 'dark';

  const tone = dark
    ? { page: '#1c1c1e', side: '#252528', main: '#1c1c1e', text: '#f5f5f7', sub: '#a8a8ad', border: 'rgba(255,255,255,0.08)', sideHover: 'rgba(255,255,255,0.06)', selected: 'rgba(255,255,255,0.10)' }
    : { page: '#ffffff', side: '#f6f6f6', main: '#ffffff', text: '#1c1c1e', sub: '#737378', border: 'rgba(0,0,0,0.10)', sideHover: 'rgba(0,0,0,0.05)', selected: '#e6e6e6' };

  const accent = '#fa2d48';

  return (
    <div
      className="h-full w-full flex flex-col select-none relative"
      style={{ background: tone.page, color: tone.text, fontFamily: '-apple-system, "SF Pro Text", Roboto, sans-serif' }}
    >
      <div className="flex-1 grid min-h-0" style={{ gridTemplateColumns: '220px 1fr' }}>
        {/* Sidebar */}
        <aside className="overflow-y-auto no-scrollbar px-2 pb-3 border-r" style={{ background: tone.side, borderColor: tone.border }}>
          {/* Traffic-light row: leave room on left, Music label to the right */}
          <div className="pl-[78px] pr-2 pt-3 pb-2">
            <div className="font-semibold text-[15px]" style={{ color: accent }}>Music</div>
          </div>
          <div className="px-2 mb-3">
            <div className="flex items-center gap-1.5 h-8 rounded-full px-3 shadow-sm"
              style={{
                width: '110%',
                marginLeft: '-5%',
                background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: `1px solid ${tone.border}`,
              }}>
              <Search className="w-3.5 h-3.5" style={{ color: tone.sub }} />
              <input className="bg-transparent outline-none text-[12px] flex-1 min-w-0" placeholder="Search" style={{ color: tone.text }} />
            </div>
          </div>

          <NavGroup>
            <NavItem tone={tone} accent={accent} icon={<Heart className="w-3.5 h-3.5" style={{ color: accent }} />} selected>Home</NavItem>
            <NavItem tone={tone} accent={accent} icon={<Disc className="w-3.5 h-3.5" style={{ color: accent }} />}>New</NavItem>
            <NavItem tone={tone} accent={accent} icon={<Radio className="w-3.5 h-3.5" style={{ color: accent }} />}>Radio</NavItem>
          </NavGroup>

          <NavTitle tone={tone}>Library</NavTitle>
          <NavGroup>
            <NavItem tone={tone} accent={accent} icon={<ListMusic className="w-3.5 h-3.5" style={{ color: accent }} />}>Pins</NavItem>
            <NavItem tone={tone} accent={accent} icon={<Clock className="w-3.5 h-3.5" style={{ color: accent }} />}>Recently Added</NavItem>
            <NavItem tone={tone} accent={accent} icon={<MusicIcon className="w-3.5 h-3.5" style={{ color: accent }} />}>Artists</NavItem>
            <NavItem tone={tone} accent={accent} icon={<Disc className="w-3.5 h-3.5" style={{ color: accent }} />}>Albums</NavItem>
            <NavItem tone={tone} accent={accent} icon={<MusicIcon className="w-3.5 h-3.5" style={{ color: accent }} />}>Songs</NavItem>
            <NavItem tone={tone} accent={accent} icon={<Heart className="w-3.5 h-3.5" style={{ color: accent }} />}>Made for You</NavItem>
          </NavGroup>

          <NavTitle tone={tone}>Playlists</NavTitle>
          <NavGroup>
            <NavItem tone={tone} accent={accent} icon={<ListMusic className="w-3.5 h-3.5" style={{ color: accent }} />}>All Playlists</NavItem>
            <NavItem tone={tone} accent={accent} icon={<ListMusic className="w-3.5 h-3.5" style={{ color: accent }} />}>Work</NavItem>
            <NavItem tone={tone} accent={accent} icon={<ListMusic className="w-3.5 h-3.5" style={{ color: accent }} />}>Pop Chill</NavItem>
          </NavGroup>
        </aside>

        {/* Main */}
        <main className="overflow-y-auto no-scrollbar px-7 pt-9 pb-24" style={{ background: tone.main }}>
          <h1 className="text-[28px] font-bold mb-5">Home</h1>

          <div className="text-[14px] font-semibold mb-3">Top Picks for You</div>
          <div className="grid grid-cols-4 gap-5 mb-7">
            {TRACKS.slice(0, 4).map((a, i) => (
              <button key={a.title} onClick={() => playTrack(a)} className="text-left group">
                <div className="aspect-square rounded-md overflow-hidden shadow-sm relative" style={{ border: `1px solid ${tone.border}` }}>
                  <img src={a.cover} alt={a.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
                </div>
                <div className="mt-1.5 text-[11px] uppercase tracking-wider" style={{ color: tone.sub }}>{TAGS[i]}</div>
                <div className="text-[13px] font-semibold leading-tight truncate">{a.title}</div>
                <div className="text-[12px] truncate" style={{ color: tone.sub }}>{a.artist}</div>
              </button>
            ))}
          </div>

          <div className="text-[14px] font-semibold mb-3">Recently Played</div>
          <div className="grid grid-cols-5 gap-4">
            {TRACKS.map((a) => (
              <button key={'r-' + a.title} onClick={() => playTrack(a)} className="text-left group">
                <div className="aspect-square rounded-md overflow-hidden shadow-sm" style={{ border: `1px solid ${tone.border}` }}>
                  <img src={a.cover} alt={a.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
                </div>
                <div className="mt-1.5 text-[12px] font-semibold truncate">{a.title}</div>
                <div className="text-[11px] truncate" style={{ color: tone.sub }}>{a.artist}</div>
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* Floating bottom pill — inside Apple Music only */}
      <NowPlayingPill dark={dark} />
    </div>
  );
};

const NavTitle = ({ children, tone }: { children: React.ReactNode; tone: any }) => (
  <h3 className="text-[10.5px] uppercase tracking-wider mt-4 mb-1.5 px-2 font-semibold" style={{ color: tone.sub }}>{children}</h3>
);
const NavGroup = ({ children }: { children: React.ReactNode }) => <ul className="space-y-px">{children}</ul>;
const NavItem = ({ children, icon, selected, tone }: { children: React.ReactNode; icon?: React.ReactNode; selected?: boolean; tone: any; accent: string }) => (
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
