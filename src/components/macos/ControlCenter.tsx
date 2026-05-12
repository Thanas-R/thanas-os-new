import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Settings as SettingsIcon, Pause } from 'lucide-react';
import { IoIosWifi } from 'react-icons/io';
import { IoPlay, IoPlayForward, IoPlayBack, IoBluetooth } from 'react-icons/io5';
import { useMacOS } from '@/contexts/MacOSContext';
import { AppleSlider } from '@/components/ui/AppleSlider';
import { useNowPlaying, togglePlay, nextTrack, prevTrack } from '@/lib/nowPlaying';
import airdropIcon from '@/assets/airdrop-icon-new.png';

if (typeof window !== 'undefined') { const i = new Image(); i.src = airdropIcon; }

interface Props { open: boolean; onClose: () => void; }

export const ControlCenter = ({ open, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { settings, updateSettings, openApp } = useMacOS();
  const np = useNowPlaying();

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
          className="fixed top-9 right-3 z-[300] rounded-[26px] p-3"
          style={{
            width: 320,
            background: 'rgba(255,255,255,0.05)',
            color: '#1c1c1e',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 24px 70px -10px rgba(0,0,0,0.35)',
            fontFamily: '-apple-system, "SF Pro Text", Roboto, sans-serif',
          }}
        >
          {/* Connectivity */}
          <Panel>
            <ConnRow
              active={settings.wifi}
              onClick={() => updateSettings({ wifi: !settings.wifi })}
              icon={<IoIosWifi className="w-5 h-5" />}
              label="Wi-Fi"
              sub={settings.wifi ? 'Home' : 'Off'}
            />
            <ConnRow
              active={settings.bluetooth}
              onClick={() => updateSettings({ bluetooth: !settings.bluetooth })}
              icon={<IoBluetooth className="w-5 h-5" />}
              label="Bluetooth"
              sub={settings.bluetooth ? 'On' : 'Off'}
            />
            <ConnRow
              active={settings.airdrop}
              onClick={() => updateSettings({ airdrop: !settings.airdrop })}
              icon={<img src={airdropIcon} alt="" className="w-5 h-5 object-contain" />}
              label="AirDrop"
              sub="Contacts"
            />
          </Panel>

          {/* Focus + Settings */}
          <Panel className="mt-2.5">
            <Tile
              active={settings.focus}
              onClick={() => updateSettings({ focus: !settings.focus })}
              icon={<Moon className="w-4 h-4" />}
              label="Focus"
            />
            <Tile
              onClick={() => { openApp('settings'); onClose(); }}
              icon={<SettingsIcon className="w-4 h-4" />}
              label="Settings"
            />
          </Panel>

          {/* Display + Sound */}
          <SliderModule label="Display" value={settings.brightness ?? 80} onChange={(v) => updateSettings({ brightness: v })} />
          <SliderModule label="Sound" value={settings.volume ?? 65} onChange={(v) => updateSettings({ volume: v })} />

          {/* Now Playing — tied to Apple Music */}
          <div className="mt-2.5 rounded-2xl px-3 py-2.5 flex items-center gap-2.5"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <img src={np.cover} alt="" className="w-10 h-10 rounded-md object-cover" />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold truncate">{np.title}</div>
              <div className="text-[11px] truncate" style={{ color: 'rgba(0,0,0,0.55)' }}>{np.artist}</div>
            </div>
            <button onClick={prevTrack} className="p-1.5 rounded-full hover:bg-black/10" style={{ color: '#0a84ff' }}>
              <IoPlayBack className="w-4 h-4" />
            </button>
            <button onClick={togglePlay} className="p-1.5 rounded-full hover:bg-black/10" style={{ color: '#0a84ff' }}>
              {np.playing ? <Pause className="w-4 h-4" fill="currentColor" /> : <IoPlay className="w-4 h-4" />}
            </button>
            <button onClick={nextTrack} className="p-1.5 rounded-full hover:bg-black/10" style={{ color: '#0a84ff' }}>
              <IoPlayForward className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Panel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl p-2 space-y-1 ${className}`}
    style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
    {children}
  </div>
);

const ConnRow = ({ active, onClick, icon, label, sub }: { active?: boolean; onClick: () => void; icon: React.ReactNode; label: string; sub: string }) => (
  <button onClick={onClick} className="w-full flex items-center gap-2.5 px-1.5 py-1.5 rounded-xl hover:bg-black/5 text-left">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'text-white' : 'text-neutral-500'}`}
      style={{ background: active ? '#0a84ff' : 'rgba(0,0,0,0.08)' }}>
      {icon}
    </div>
    <div className="flex-1 min-w-0 leading-tight">
      <div className="text-[13px] font-semibold">{label}</div>
      <div className="text-[11px]" style={{ color: 'rgba(0,0,0,0.55)' }}>{sub}</div>
    </div>
  </button>
);

const Tile = ({ active, onClick, icon, label }: { active?: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button onClick={onClick} className="w-full flex items-center gap-2.5 px-1.5 py-1.5 rounded-xl hover:bg-black/5 text-left">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'text-white' : 'text-neutral-600'}`}
      style={{ background: active ? '#0a84ff' : 'rgba(0,0,0,0.08)' }}>
      {icon}
    </div>
    <div className="text-[13px] font-semibold">{label}</div>
  </button>
);

const SliderModule = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div className="mt-2.5 rounded-2xl px-3 pt-2 pb-3"
    style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
    <div className="text-[12.5px] font-semibold mb-1.5">{label}</div>
    <AppleSlider value={value} onChange={onChange} />
  </div>
);
