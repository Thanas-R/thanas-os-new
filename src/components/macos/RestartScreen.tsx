import { useEffect } from 'react';
import turtleLogo from '@/assets/turtle-logo.png';

interface Props { onDone: () => void; durationMs?: number; }

export const RestartScreen = ({ onDone, durationMs = 10000 }: Props) => {
  useEffect(() => {
    const t = setTimeout(onDone, durationMs);
    return () => clearTimeout(t);
  }, [onDone, durationMs]);

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center">
      <img src={turtleLogo} alt="ThanasOS" className="w-32 h-32 object-contain opacity-90" />
      <div
        className="mt-10 w-[400px] max-w-[85vw] h-1 rounded bg-white/20 overflow-hidden"
        style={{ position: 'relative' }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'white',
            transformOrigin: 'left center',
            animation: `restart-fill ${durationMs}ms linear forwards`,
          }}
        />
      </div>
      <style>{`@keyframes restart-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </div>
  );
};
