import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bluetooth, Moon, Sun, Volume2, VolumeX,
  Airplay, Music, Play, SkipForward, Settings as SettingsIcon,
} from 'lucide-react';
import { IoIosWifi } from 'react-icons/io';
import { useMacOS } from '@/contexts/MacOSContext';
import { AppleSlider } from '@/components/ui/AppleSlider';
import airdropIcon from '@/assets/airdrop-icon-new.png';

// Eagerly preload AirDrop icon at module load so it's cached before Control Center opens.
if (typeof window !== 'undefined') {
  const i = new Image();
  i.src = airdropIcon;
  i.decoding = 'async';
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ControlCenter = ({ open, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { settings, updateSettings, openApp } = useMacOS();
  const [airplayOn, setAirplayOn] = useState(false);
  const [playing, setPlaying] = useState(false);

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
          {/* Top row: Connections (large) + stacked AirPlay/Focus/Settings */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Connections module */}
            <div className="rounded-2xl bg-white/10 p-2.5 flex flex-col gap-1.5">
              <ConnRow
                active={settings.wifi}
                onClick={() => updateSettings({ wifi: !settings.wifi })}
                icon={<IoIosWifi className="w-[18px] h-[18px]" />}
                label="Wi-Fi"
                sub={settings.wifi ? 'ThanasOS-Net' : 'Off'}
                accent="bg-blue-500"
              />
              <ConnRow
                active={settings.bluetooth}
                onClick={() => updateSettings({ bluetooth: !settings.bluetooth })}
                icon={<Bluetooth className="w-4 h-4" />}
                label="Bluetooth"
                sub={settings.bluetooth ? 'On' : 'Off'}
                accent="bg-blue-500"
              />
              <ConnRow
                active={settings.airdrop}
                onClick={() => updateSettings({ airdrop: !settings.airdrop })}
                icon={<img src={airdropIcon} alt="" className="w-5 h-5 object-contain" style={{ filter: settings.airdrop ? 'none' : 'grayscale(1) brightness(1.4)' }} />}
                label="AirDrop"
                sub="Contacts"
                accent="bg-blue-500"
              />
            </div>

            {/* Stacked tiles: AirPlay (top), Focus (middle), Settings (bottom) */}
            <div className="grid grid-rows-3 gap-2">
              <Tile
                onClick={() => setAirplayOn(v => !v)}
                icon={<Airplay className="w-3.5 h-3.5" />}
                label={airplayOn ? 'AirPlay On' : 'AirPlay'}
                accent="bg-blue-500"
                active={airplayOn}
              />
              <Tile
                active={settings.focus}
                onClick={() => updateSettings({ focus: !settings.focus })}
                icon={<Moon className="w-3.5 h-3.5" />}
                label="Focus"
                accent="bg-violet-500"
              />
              <Tile
                onClick={() => { openApp('settings'); onClose(); }}
                icon={<SettingsIcon className="w-3.5 h-3.5" />}
                label="Settings"
                accent="bg-neutral-500"
              />
            </div>
          </div>

          {/* Display */}
          <SliderModule
            label="Display"
            icon={<Sun className="w-4 h-4" />}
            value={settings.brightness ?? 80}
            onChange={(v) => updateSettings({ brightness: v })}
          />

          {/* Sound */}
          <SliderModule
            label="Sound"
            icon={(settings.volume ?? 65) === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            value={settings.volume ?? 65}
            onChange={(v) => updateSettings({ volume: v })}
          />

          {/* Now Playing */}
          <div className="rounded-2xl bg-white/10 p-3 mt-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold truncate">Liquid Glass</div>
              <div className="text-[10.5px] text-white/60 truncate">ThanasOS Radio</div>
            </div>
            <button onClick={() => setPlaying(p => !p)} className="p-1.5 rounded-full hover:bg-white/10"><Play className={`w-4 h-4 ${playing ? 'opacity-100' : 'opacity-60'}`} /></button>
            <button className="p-1.5 rounded-full hover:bg-white/10"><SkipForward className="w-4 h-4" /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ConnRow = ({
  active, onClick, icon, label, sub, accent,
}: { active?: boolean; onClick: () => void; icon: React.ReactNode; label: string; sub: string; accent: string }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2.5 px-1.5 py-1 rounded-xl hover:bg-white/5 transition-colors text-left"
  >
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${active ? accent : 'bg-white/15'}`}>
      {icon}
    </div>
    <div className="leading-tight min-w-0">
      <div className="text-[12px] font-semibold truncate">{label}</div>
      <div className="text-[10px] text-white/55 truncate">{sub}</div>
    </div>
  </button>
);

const Tile = ({
  active, onClick, icon, label, accent,
}: { active?: boolean; onClick: () => void; icon: React.ReactNode; label: string; accent: string }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-2.5 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors"
  >
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? accent : 'bg-white/15'}`}>
      {icon}
    </div>
    <div className="text-[11.5px] font-medium">{label}</div>
  </button>
);

const SliderModule = ({
  label, icon, value, onChange,
}: { label: string; icon: React.ReactNode; value: number; onChange: (v: number) => void }) => (
  <div className="rounded-2xl bg-white/10 px-3 pt-3 pb-4 mt-2">
    <div className="flex items-center gap-2 mb-3.5">
      <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">{icon}</div>
      <div className="text-[12px] font-semibold">{label}</div>
    </div>
    {/* Slider track centered with extra horizontal breathing room (was 80% off-center → now 88% centered) */}
    <div className="mx-auto" style={{ width: '88%' }}>
      <AppleSlider value={value} onChange={onChange} />
    </div>
  </div>
);
