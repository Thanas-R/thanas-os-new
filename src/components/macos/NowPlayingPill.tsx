// Floating now-playing controller — used inside the Apple Music app only.
// Rounded square pill (not full-pill), reduced transparency, working seek slider,
// horizontally centered on the RIGHT half of the app window (i.e. centered over the main pane).
import { useNowPlaying, togglePlay, nextTrack, prevTrack, seekTo } from '@/lib/nowPlaying';
import { IoPlay, IoPlayForward, IoPlayBack } from 'react-icons/io5';
import { Pause, Heart } from 'lucide-react';

export const NowPlayingPill = ({ dark = false }: { dark?: boolean }) => {
  const np = useNowPlaying();
  const progress = Math.max(0, Math.min(100, (np.progress || 0) * 100));

  const bg = dark ? 'rgba(28,28,32,0.95)' : 'rgba(255,255,255,0.95)';
  const txt = dark ? '#fff' : '#1c1c1e';
  const sub = dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)';
  const border = dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)';
  const btnHover = dark ? 'hover:bg-white/15' : 'hover:bg-black/10';
  const trackBg = dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.10)';
  const accent = '#fa2d48';

  // Sidebar is 220px wide → center over remaining (right) area: left = 220 + (100% - 220) / 2
  return (
    <div
      className="absolute bottom-4 z-30 rounded-2xl pl-2 pr-3 py-2 flex items-center gap-3 select-none"
      style={{
        left: 'calc(220px + (100% - 220px) / 2)',
        transform: 'translateX(-50%)',
        width: 'min(520px, calc(100% - 240px))',
        background: bg,
        color: txt,
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: `1px solid ${border}`,
        boxShadow: '0 14px 38px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.18)',
      }}
    >
      <img src={np.cover} alt="" className="w-11 h-11 rounded-lg object-cover ring-1 ring-black/10" />
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-semibold truncate leading-tight">{np.title}</div>
        <div className="text-[11px] truncate" style={{ color: sub }}>{np.artist}</div>
        <div className="mt-1.5 relative h-[6px]">
          <div className="absolute inset-0 rounded-full" style={{ background: trackBg }} />
          <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${progress}%`, background: accent }} />
          <input
            type="range"
            min={0} max={1000} value={Math.round(progress * 10)}
            onChange={(e) => seekTo(Number(e.target.value) / 1000)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
      <button onClick={prevTrack} className={`p-1.5 rounded-lg ${btnHover}`}><IoPlayBack className="w-4 h-4" /></button>
      <button onClick={togglePlay} className={`p-2 rounded-lg ${btnHover}`}>
        {np.playing ? <Pause className="w-4 h-4" fill="currentColor" /> : <IoPlay className="w-4 h-4" />}
      </button>
      <button onClick={nextTrack} className={`p-1.5 rounded-lg ${btnHover}`}><IoPlayForward className="w-4 h-4" /></button>
      <button className={`p-1.5 rounded-lg ${btnHover}`}><Heart className="w-4 h-4" /></button>
    </div>
  );
};
