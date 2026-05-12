import { useNowPlaying, setNowPlaying } from '@/lib/nowPlaying';
import { useMacOS } from '@/contexts/MacOSContext';
import { IoPlay, IoPlayForward, IoPlayBack } from 'react-icons/io5';
import { Pause, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const NowPlayingPill = () => {
  const np = useNowPlaying();
  const { settings } = useMacOS();
  const [hidden, setHidden] = useState(false);
  const dark = settings.theme === 'dark';

  const bg = dark ? 'rgba(28,28,32,0.55)' : 'rgba(255,255,255,0.55)';
  const txt = dark ? '#fff' : '#1c1c1e';
  const sub = dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)';
  const border = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const btnHover = dark ? 'hover:bg-white/15' : 'hover:bg-black/10';

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="fixed bottom-28 right-5 z-[150] rounded-full pl-1.5 pr-2 py-1.5 flex items-center gap-2.5 select-none"
          style={{
            background: bg,
            color: txt,
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: `1px solid ${border}`,
            boxShadow: '0 10px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          <img src={np.cover} alt="" className="w-9 h-9 rounded-full object-cover ring-1 ring-black/10" />
          <div className="min-w-0 max-w-[140px] pr-1">
            <div className="text-[12px] font-semibold truncate leading-tight">{np.title}</div>
            <div className="text-[10.5px] truncate" style={{ color: sub }}>{np.artist}</div>
          </div>
          <button className={`p-1 rounded-full ${btnHover}`}><IoPlayBack className="w-3.5 h-3.5" /></button>
          <button onClick={() => setNowPlaying({ playing: !np.playing })} className={`p-1.5 rounded-full ${btnHover}`}>
            {np.playing ? <Pause className="w-4 h-4" fill="currentColor" /> : <IoPlay className="w-4 h-4" />}
          </button>
          <button className={`p-1 rounded-full ${btnHover}`}><IoPlayForward className="w-3.5 h-3.5" /></button>
          <button onClick={() => setHidden(true)} className={`p-1 rounded-full ${btnHover}`}><X className="w-3 h-3" /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
