import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Pause, Maximize2, Monitor } from 'lucide-react';
import { IoIosWifi } from 'react-icons/io';
import { IoPlay, IoPlayForward, IoPlayBack, IoBluetooth } from 'react-icons/io5';
import { useMacOS } from '@/contexts/MacOSContext';
import { useNowPlaying, togglePlay, nextTrack, prevTrack } from '@/lib/nowPlaying';
import airdropIcon from '@/assets/airdrop-icon-new.png';

if (typeof window !== 'undefined') { const i = new Image(); i.src = airdropIcon; }

interface Props { open: boolean; onClose: () => void; }

export const ControlCenter = ({ open, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { settings, updateSettings } = useMacOS();
  const np = useNowPlaying();
  const [stage, setStage] = useState(false);
  const [mirror, setMirror] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    setTimeout(() => document.addEventListener('mousedown', onDown), 0);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-9 right-3 z-[300] rounded-[26px] p-3 text-white"
          style={{
            width: 380,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 24px 70px -10px rgba(0,0,0,0.55)',
          }}
        >
          {/* Row 1: Wi-Fi tile  +  Now Playing tile */}
          <div className="grid gap-2.5" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <Glass className="px-3 py-2.5 flex items-center gap-2.5">
              <button
                onClick={() => updateSettings({ wifi: !settings.wifi })}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${settings.wifi ? 'bg-white text-blue-500' : 'bg-white/30 text-white'}`}
              >
                <IoIosWifi className="w-5 h-5" />
              </button>
              <div className="leading-tight">
                <div className="text-[12.5px] font-semibold">Wi-Fi</div>
                <div className="text-[10.5px] text-white/75">{settings.wifi ? 'Home' : 'Off'}</div>
              </div>
            </Glass>

            <Glass className="px-2.5 py-2 flex items-center gap-2">
              <img src={np.cover} alt="" className="w-10 h-10 rounded-md object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-[11.5px] font-semibold truncate">{np.title}</div>
                <div className="text-[10px] text-white/75 truncate">{np.artist}</div>
                <div className="flex items-center gap-2 mt-1 text-white">
                  <button onClick={prevTrack} className="hover:text-white/80"><IoPlayBack className="w-3.5 h-3.5" /></button>
                  <button onClick={togglePlay} className="hover:text-white/80">
                    {np.playing ? <Pause className="w-4 h-4" fill="currentColor" /> : <IoPlay className="w-4 h-4" />}
                  </button>
                  <button onClick={nextTrack} className="hover:text-white/80"><IoPlayForward className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </Glass>
          </div>

          {/* Row 2: BT + AirDrop circles  |  Focus pill + 2 squares */}
          <div className="grid gap-2.5 mt-2.5" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <Glass className="flex items-center justify-around py-2.5">
              <CircleBtn active={settings.bluetooth} onClick={() => updateSettings({ bluetooth: !settings.bluetooth })}>
                <IoBluetooth className="w-5 h-5" />
              </CircleBtn>
              <CircleBtn active={settings.airdrop} onClick={() => updateSettings({ airdrop: !settings.airdrop })}>
                <img src={airdropIcon} alt="" className="w-5 h-5 object-contain" style={{ filter: settings.airdrop ? 'none' : 'brightness(0) invert(1)' }} />
              </CircleBtn>
            </Glass>

            <div className="grid gap-2.5" style={{ gridTemplateColumns: '1.4fr 1fr 1fr' }}>
              <Glass className="px-2.5 flex items-center gap-1.5">
                <button onClick={() => updateSettings({ focus: !settings.focus })} className={`w-7 h-7 rounded-full flex items-center justify-center ${settings.focus ? 'bg-white text-violet-600' : 'bg-white/25'}`}>
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11.5px] font-medium">Focus</span>
              </Glass>
              <SquareBtn active={stage} onClick={() => setStage((v) => !v)}><Maximize2 className="w-4 h-4" /></SquareBtn>
              <SquareBtn active={mirror} onClick={() => setMirror((v) => !v)}><Monitor className="w-4 h-4" /></SquareBtn>
            </div>
          </div>

          {/* Display */}
          <Slider
            label="Display"
            value={settings.brightness ?? 80}
            onChange={(v) => updateSettings({ brightness: v })}
          />
          {/* Sound */}
          <Slider
            label="Sound"
            value={settings.volume ?? 65}
            onChange={(v) => updateSettings({ volume: v })}
          />

          <div className="text-center text-[11px] text-white/70 mt-2 mb-0.5">Edit Controls</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Glass = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl ${className}`}
    style={{
      background: 'rgba(255,255,255,0.18)',
      border: '1px solid rgba(255,255,255,0.22)',
      backdropFilter: 'blur(20px) saturate(180%)',
    }}
  >
    {children}
  </div>
);

const CircleBtn = ({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-white text-blue-500' : 'bg-white/30 text-white hover:bg-white/40'}`}
  >
    {children}
  </button>
);

const SquareBtn = ({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`rounded-2xl flex items-center justify-center h-full ${active ? 'bg-white/35' : 'bg-white/18 hover:bg-white/28'}`}
    style={{ border: '1px solid rgba(255,255,255,0.22)' }}
  >
    {children}
  </button>
);

const Slider = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div
    className="rounded-2xl px-4 pt-2.5 pb-3 mt-2.5"
    style={{
      background: 'rgba(255,255,255,0.18)',
      border: '1px solid rgba(255,255,255,0.22)',
      backdropFilter: 'blur(20px) saturate(180%)',
    }}
  >
    <div className="text-[12.5px] font-semibold mb-2">{label}</div>
    <div className="relative h-7 flex items-center">
      <div
        className="absolute inset-x-0 h-7 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.18)' }}
      >
        <div className="h-full" style={{ width: `${value}%`, background: 'rgba(255,255,255,0.92)' }} />
      </div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
    </div>
  </div>
);
