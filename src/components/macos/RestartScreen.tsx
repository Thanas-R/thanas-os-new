import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import turtleLogo from '@/assets/turtle-logo.png';

interface Props { onDone: () => void; durationMs?: number; }

/** Restart sequence:
 *   1. Black non-interactable "off" screen (~1.4s)
 *   2. Fade in macOS-style boot loader with logo + spinner that fills durationMs
 */
export const RestartScreen = ({ onDone, durationMs = 10000 }: Props) => {
  const [phase, setPhase] = useState<'off' | 'boot'>('off');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('boot'), 1400);
    const t2 = setTimeout(onDone, durationMs);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone, durationMs]);

  const bootMs = Math.max(1000, durationMs - 1400);

  return (
    <div className="fixed inset-0 z-[10000] bg-black">
      <AnimatePresence mode="wait">
        {phase === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <img src={turtleLogo} alt="ThanasOS" className="w-28 h-28 object-contain opacity-95" />
            <div className="mt-12">
              <Spinner />
            </div>
            <div
              className="mt-10 w-[260px] h-[3px] rounded-full bg-white/15 overflow-hidden"
              style={{ position: 'relative' }}
            >
              <div
                style={{
                  position: 'absolute', inset: 0, background: 'white',
                  transformOrigin: 'left center',
                  animation: `restart-fill ${bootMs}ms linear forwards`,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes restart-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes mac-spin-fade { 0% { background-color: #69717d; } 100% { background-color: transparent; } }
        .mac-spinner { font-size: 28px; position: relative; display: inline-block; width: 1em; height: 1em; }
        .mac-spinner .blade { position: absolute; left: 0.4629em; bottom: 0; width: 0.074em; height: 0.2777em; border-radius: 0.5em; transform-origin: center -0.2222em; animation: mac-spin-fade 1s infinite linear; }
      `}</style>
    </div>
  );
};

const Spinner = () => (
  <div className="mac-spinner">
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="blade"
        style={{ transform: `rotate(${i * 30}deg)`, animationDelay: `${i * 0.083}s` }}
      />
    ))}
  </div>
);

export const MacSpinner = ({ size = 32, color = '#69717d' }: { size?: number; color?: string }) => (
  <>
    <div className="mac-spinner" style={{ fontSize: size, color }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="blade"
          style={{ transform: `rotate(${i * 30}deg)`, animationDelay: `${i * 0.083}s`, background: color }}
        />
      ))}
    </div>
    <style>{`
      @keyframes mac-spin-fade-2 { 0% { opacity: 1; } 100% { opacity: 0; } }
      .mac-spinner .blade { animation: mac-spin-fade-2 1s infinite linear !important; }
    `}</style>
  </>
);
