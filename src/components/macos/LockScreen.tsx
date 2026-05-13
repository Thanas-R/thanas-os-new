import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import wallpaperLock from '@/assets/wallpaper-2.jpg';

interface Props { onUnlock: () => void; }

export const LockScreen = ({ onUnlock }: Props) => {
  // Warm caches while the lock screen sits idle
  useImagePreloader();
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
      className="fixed inset-0 z-[9998] select-none cursor-pointer overflow-hidden"
      initial={{ y: 0 }}
      animate={{ y: exiting ? '-100%' : 0 }}
      transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
      onClick={unlock}
      style={{ backgroundColor: '#000' }}
    >
      {/* Full-bleed wallpaper as <img> to avoid any bottom bleed/gap */}
      <img
        src={wallpaperLock}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Subtle vignette for legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.35) 100%)' }}
      />

      <div className="relative z-10 h-full w-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-start pt-[14vh] text-white pointer-events-none">
          <div
            className="text-[18px] tracking-wide opacity-95"
            style={{ fontFamily: "'Inter', -apple-system, sans-serif", fontWeight: 400 }}
          >
            {date}
          </div>
          <div
            className="text-[140px] leading-none mt-1 tracking-tight"
            style={{ fontFamily: "'Inter', -apple-system, sans-serif", fontWeight: 300 }}
          >
            {time}
          </div>
        </div>

        <div className="pb-20 flex justify-center">
          <motion.button
            onClick={(e) => { e.stopPropagation(); unlock(); }}
            className="px-12 h-12 rounded-full text-white text-[14px]"
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.28)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              fontWeight: 500,
              fontFamily: "'Inter', -apple-system, sans-serif",
            }}
            whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.26)' }}
            whileTap={{ scale: 0.97 }}
          >
            Enter
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
