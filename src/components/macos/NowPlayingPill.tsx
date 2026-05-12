// Floating now-playing pill — used inside the Apple Music app only.
import { useNowPlaying, togglePlay, nextTrack, prevTrack } from '@/lib/nowPlaying';
import { IoPlay, IoPlayForward, IoPlayBack } from 'react-icons/io5';
import { Pause, Heart } from 'lucide-react';

export const NowPlayingPill = ({ dark = false }: { dark?: boolean }) => {
  const np = useNowPlaying();

  const bg = dark ? 'rgba(28,28,32,0.72)' : 'rgba(255,255,255,0.72)';
  const txt = dark ? '#fff' : '#1c1c1e';
  const sub = dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)';
  const border = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const btnHover = dark ? 'hover:bg-white/15' : 'hover:bg-black/10';
  const accent = '#fa2d48';

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 rounded-full pl-1.5 pr-3 py-1.5 flex items-center gap-3 select-none"
      style={{
        width: 'min(560px, 92%)',
        background: bg,
        color: txt,
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: `1px solid ${border}`,
        boxShadow: '0 10px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.18)',
      }}
    >
      <img src={np.cover} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-black/10" />
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-semibold truncate leading-tight">{np.title}</div>
        <div className="text-[11px] truncate" style={{ color: sub }}>{np.artist}</div>
        <div className="mt-1 h-[3px] rounded-full overflow-hidden" style={{ background: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }}>
          <div className="h-full rounded-full" style={{ width: '34%', background: accent }} />
        </div>
      </div>
      <button onClick={prevTrack} className={`p-1.5 rounded-full ${btnHover}`}><IoPlayBack className="w-4 h-4" /></button>
      <button onClick={togglePlay} className={`p-2 rounded-full ${btnHover}`}>
        {np.playing ? <Pause className="w-4 h-4" fill="currentColor" /> : <IoPlay className="w-4 h-4" />}
      </button>
      <button onClick={nextTrack} className={`p-1.5 rounded-full ${btnHover}`}><IoPlayForward className="w-4 h-4" /></button>
      <button className={`p-1.5 rounded-full ${btnHover}`}><Heart className="w-4 h-4" /></button>
    </div>
  );
};
