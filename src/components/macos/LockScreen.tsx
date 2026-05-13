import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import wallpaperLock from '@/assets/wallpaper-valley.jpg';

interface Props { onUnlock: () => void; }

export const LockScreen = ({ onUnlock }: Props) => {
  const [now, setNow] = useState(new Date());
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const unlock = async () => {
    if (exiting) return;
    setExiting(true);
    try { await document.documentElement.requestFullscreen(); } catch { /* ignore */ }
    setTimeout(onUnlock, 700);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9998] select-none cursor-pointer flex flex-col"
      style={{
        backgroundImage: `url(${wallpaperLock})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      initial={{ y: 0 }}
      animate={{ y: exiting ? '-100%' : 0 }}
      transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
      onClick={unlock}
    >
      <div className="flex-1 flex flex-col items-center justify-start pt-[14vh] text-white pointer-events-none">
        <div className="text-[18px] font-light tracking-wide opacity-95" style={{ fontFamily: "'Inter', -apple-system, sans-serif", fontWeight: 400 }}>
          {date}
        </div>
        <div className="text-[140px] leading-none mt-1 tracking-tight" style={{ fontFamily: "'Inter', -apple-system, sans-serif", fontWeight: 300 }}>
          {time}
        </div>
      </div>

      <div className="pb-16 flex justify-center pointer-events-none">
        <motion.button
          onClick={(e) => { e.stopPropagation(); unlock(); }}
          className="px-12 h-12 rounded-full text-white text-[14px] pointer-events-auto"
          style={{
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.28)',
            backdropFilter: 'blur(14px)',
            fontWeight: 500,
            fontFamily: "'Inter', -apple-system, sans-serif",
          }}
          whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.26)' }}
          whileTap={{ scale: 0.97 }}
        >
          Enter
        </motion.button>
      </div>
    </motion.div>
  );
};
