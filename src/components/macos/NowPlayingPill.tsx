// Floating now-playing controller — used inside the Apple Music app only.
// Rounded square pill, working seek slider, synced system volume, centered over the main pane.
import { useMacOS } from '@/contexts/MacOSContext';
import { useNowPlaying, togglePlay, nextTrack, prevTrack, seekTo } from '@/lib/nowPlaying';
import { IoPlay, IoPlayForward, IoPlayBack, IoVolumeMedium } from 'react-icons/io5';
import { Pause, Heart } from 'lucide-react';

export const NowPlayingPill = ({ dark = false }: { dark?: boolean }) => {
  const { settings, updateSettings } = useMacOS();
  const np = useNowPlaying();
  const progress = Math.max(0, Math.min(100, (np.progress || 0) * 100));
  const volume = Math.max(0, Math.min(100, settings.volume ?? 65));

  const bg = dark ? 'rgba(28,28,32,0.55)' : 'rgba(255,255,255,0.55)';
  const txt = dark ? '#fff' : '#1c1c1e';
  const sub = dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
  const border = dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.55)';
  const btnHover = dark ? 'hover:bg-white/15' : 'hover:bg-black/10';
  const trackBg = dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.10)';
  const accent = '#fa2d48';

  return (
    <div
      className="absolute bottom-4 z-30 rounded-2xl pl-2 pr-3 py-2 flex items-center gap-3 select-none"
      style={{
        left: 'calc(220px + (100% - 220px) / 2)',
        transform: 'translateX(-50%)',
        width: 'min(720px, calc(100% - 240px))',
        background: bg,
        color: txt,
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: `1px solid ${border}`,
        boxShadow: '0 14px 38px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.18)',
      }}
    >
      <img src={np.cover} alt="" className="w-11 h-11 rounded-lg object-cover ring-1 ring-black/10" />
      <div className="min-w-0 flex-[1.4]">
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
            aria-label="Seek song"
          />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={prevTrack} className={`p-1.5 rounded-lg ${btnHover}`} aria-label="Previous song"><IoPlayBack className="w-4 h-4" /></button>
        <button onClick={togglePlay} className={`p-2 rounded-lg ${btnHover}`} aria-label={np.playing ? 'Pause song' : 'Play song'}>
          {np.playing ? <Pause className="w-4 h-4" fill="currentColor" /> : <IoPlay className="w-4 h-4" />}
        </button>
        <button onClick={nextTrack} className={`p-1.5 rounded-lg ${btnHover}`} aria-label="Next song"><IoPlayForward className="w-4 h-4" /></button>
      </div>
      <div className="hidden md:flex items-center gap-2 w-[140px]">
        <IoVolumeMedium className="w-4 h-4 shrink-0" style={{ color: sub }} />
        <div className="relative h-[6px] flex-1">
          <div className="absolute inset-0 rounded-full" style={{ background: trackBg }} />
          <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${volume}%`, background: dark ? '#fff' : '#1c1c1e' }} />
          <input
            type="range"
            min={0} max={100} value={volume}
            onChange={(event) => updateSettings({ volume: Number(event.target.value) })}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Music volume"
          />
        </div>
      </div>
      <button className={`p-1.5 rounded-lg ${btnHover}`} aria-label="Love song"><Heart className="w-4 h-4" /></button>
    </div>
  );
};
