import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bluetooth, Moon, Airplay, Settings as SettingsIcon, SkipBack, Pause } from 'lucide-react';
import { IoIosWifi } from 'react-icons/io';
import { IoPlay, IoPlayForward } from 'react-icons/io5';
import { useMacOS } from '@/contexts/MacOSContext';
import { AppleSlider } from '@/components/ui/AppleSlider';
import { useNowPlaying, setNowPlaying } from '@/lib/nowPlaying';
import airdropIcon from '@/assets/airdrop-icon-new.png';

if (typeof window !== 'undefined') { const i = new Image(); i.src = airdropIcon; }

interface Props { open: boolean; onClose: () => void; }

export const ControlCenter = ({ open, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { settings, updateSettings, openApp } = useMacOS();
  const [airplayOn, setAirplayOn] = useState(false);
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
          className="fixed top-9 right-3 z-[300] rounded-3xl p-3 text-white"
          style={{
            width: 360,
            background: 'rgba(28,28,32,0.55)',
            backdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px -10px rgba(0,0,0,0.5)',
          }}
        >
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="rounded-2xl bg-white/10 p-2.5 flex flex-col gap-1.5">
              <ConnRow active={settings.wifi} onClick={() => updateSettings({ wifi: !settings.wifi })}
                icon={<IoIosWifi className="w-[24px] h-[24px]" />} label="Wi-Fi" sub={settings.wifi ? 'ThanasOS-Net' : 'Off'} />
              <ConnRow active={settings.bluetooth} onClick={() => updateSettings({ bluetooth: !settings.bluetooth })}
                icon={<Bluetooth className="w-[22px] h-[22px]" />} label="Bluetooth" sub={settings.bluetooth ? 'On' : 'Off'} />
              <ConnRow active={settings.airdrop} onClick={() => updateSettings({ airdrop: !settings.airdrop })}
                icon={<img src={airdropIcon} alt="" className="w-[24px] h-[24px] object-contain" style={{ filter: settings.airdrop ? 'none' : 'grayscale(1) brightness(1.4)' }} />}
                label="AirDrop" sub="Contacts" />
            </div>

            <div className="grid grid-rows-3 gap-2">
              <Tile onClick={() => setAirplayOn(v => !v)} icon={<Airplay className="w-3.5 h-3.5" />} label={airplayOn ? 'AirPlay On' : 'AirPlay'} active={airplayOn} accent="bg-blue-500" />
              <Tile active={settings.focus} onClick={() => updateSettings({ focus: !settings.focus })} icon={<Moon className="w-3.5 h-3.5" />} label="Focus" accent="bg-violet-500" />
              <Tile onClick={() => { openApp('settings'); onClose(); }} icon={<SettingsIcon className="w-3.5 h-3.5" />} label="Settings" accent="bg-neutral-500" />
            </div>
          </div>

          <SliderModule label="Display" value={settings.brightness ?? 80} onChange={(v) => updateSettings({ brightness: v })} />
          <SliderModule label="Sound" value={settings.volume ?? 65} onChange={(v) => updateSettings({ volume: v })} />

          {/* Now Playing — tied to Apple Music */}
          <div className="rounded-2xl bg-white/10 p-3 mt-2 flex items-center gap-3">
            <img src={np.cover} alt="" className="w-11 h-11 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold truncate">{np.title}</div>
              <div className="text-[11px] text-white/65 truncate">{np.artist}</div>
            </div>
            <button className="p-1.5 rounded-full hover:bg-white/15"><SkipBack className="w-4 h-4" fill="white" /></button>
            <button onClick={() => setNowPlaying({ playing: !np.playing })} className="p-1.5 rounded-full hover:bg-white/15">
              {np.playing ? <Pause className="w-4 h-4" fill="white" /> : <IoPlay className="w-4 h-4" />}
            </button>
            <button className="p-1.5 rounded-full hover:bg-white/15"><IoPlayForward className="w-4 h-4" /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ConnRow = ({ active, onClick, icon, label, sub }: { active?: boolean; onClick: () => void; icon: React.ReactNode; label: string; sub: string }) => (
  <button onClick={onClick} className="flex items-center gap-2.5 px-1.5 py-1 rounded-xl transition-colors text-left hover:bg-black/25">
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${active ? 'bg-blue-500' : 'bg-white/15'}`}>{icon}</div>
    <div className="leading-tight min-w-0">
      <div className="text-[12.5px] font-semibold truncate">{label}</div>
      <div className="text-[10.5px] text-white/55 truncate">{sub}</div>
    </div>
  </button>
);

const Tile = ({ active, onClick, icon, label, accent }: { active?: boolean; onClick: () => void; icon: React.ReactNode; label: string; accent: string }) => (
  <button onClick={onClick} className="flex items-center gap-2 px-2.5 rounded-2xl bg-white/10 hover:bg-black/25 transition-colors">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? accent : 'bg-white/15'}`}>{icon}</div>
    <div className="text-[11.5px] font-medium">{label}</div>
  </button>
);

const SliderModule = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div className="rounded-2xl bg-white/10 px-4 pt-3 pb-4 mt-2">
    <div className="text-[12.5px] font-semibold mb-2.5">{label}</div>
    <AppleSlider value={value} onChange={onChange} />
  </div>
);
