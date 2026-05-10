import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppleHelloEffect } from '@/components/effects/AppleHelloEffect';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen = ({ onEnter }: WelcomeScreenProps) => {
  // Preload every asset (wallpapers, icons, profile) while the Hello plays.
  useImagePreloader();
  const [phase, setPhase] = useState<'hello' | 'info' | 'exiting'>('hello');

  const handleHelloComplete = useCallback(() => {
    setTimeout(() => setPhase('info'), 400);
  }, []);

  const handleEnter = async () => {
    setPhase('exiting');
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.log('Fullscreen request failed:', err);
    }
    setTimeout(onEnter, 600);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
      style={{
        backdropFilter: 'blur(50px) saturate(180%)',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 'hello' && (
          <motion.div
            key="hello"
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <AppleHelloEffect
              className="h-28 md:h-36 text-white"
              speed={0.8}
              onAnimationComplete={handleHelloComplete}
            />
          </motion.div>
        )}

        {phase === 'info' && (
          <motion.div
            key="info"
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.97 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Time */}
            <div className="text-[100px] md:text-[120px] font-extralight text-white leading-none tracking-tight">
              {formatTime(now)}
            </div>
            <div className="text-xl md:text-2xl font-light text-white/80 mt-1 tracking-wide">
              {formatDate(now)}
            </div>

            {/* Subtitle */}
            <motion.p
              className="text-white/60 text-sm mt-8 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ThanasOS
            </motion.p>

            {/* Disclaimer */}
            <motion.div
              className="mt-6 px-4 py-2 rounded-xl text-xs text-white/50 backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Best viewed on desktop · Mobile not optimized
            </motion.div>

            {/* Enter */}
            <motion.button
              onClick={handleEnter}
              className="mt-10 h-12 px-10 text-sm font-medium text-white rounded-full cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(20px)',
              }}
              whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.22)' }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              Enter
            </motion.button>

            {/* Bottom hint */}
            <motion.p
              className="absolute bottom-8 text-white/40 text-xs tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Click Enter to explore
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
