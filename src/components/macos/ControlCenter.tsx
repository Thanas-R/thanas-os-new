import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Airplay, Sun, Pause } from 'lucide-react';
import { HiSun } from 'react-icons/hi';
import { IoVolumeMedium, IoPlayBack, IoPlayForward, IoBluetooth } from 'react-icons/io5';
import { IoIosWifi } from 'react-icons/io';
import { IoPlay, IoPlayForward, IoBluetooth } from 'react-icons/io5';
import { useMacOS } from '@/contexts/MacOSContext';
import { useNowPlaying, setNowPlaying } from '@/lib/nowPlaying';
import airdropIcon from '@/assets/airdrop-icon-new.png';

if (typeof window !== 'undefined') { const i = new Image(); i.src = airdropIcon; }

interface Props { open: boolean; onClose: () => void; }

export const ControlCenter = ({ open, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { settings, updateSettings } = useMacOS();
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

  const isDark = settings.theme === 'dark';

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
            {/* LEFT: connectivity stack */}
            <div className="rounded-2xl bg-white/10 p-2.5 flex flex-col gap-1.5">
              <ConnRow active={settings.wifi} onClick={() => updateSettings({ wifi: !settings.wifi })}
                icon={<IoIosWifi className="w-[24px] h-[24px]" />} label="Wi-Fi" sub={settings.wifi ? 'ThanasOS-Net' : 'Off'} />
              <ConnRow active={settings.bluetooth} onClick={() => updateSettings({ bluetooth: !settings.bluetooth })}
                icon={<IoBluetooth className="w-[22px] h-[22px]" />} label="Bluetooth" sub={settings.bluetooth ? 'On' : 'Off'} />
              <ConnRow active={settings.airdrop} onClick={() => updateSettings({ airdrop: !settings.airdrop })}
                icon={<img src={airdropIcon} alt="" className="w-[24px] h-[24px] object-contain" style={{ filter: settings.airdrop ? 'none' : 'grayscale(1) brightness(1.4)' }} />}
                label="AirDrop" sub="Contacts" />
            </div>

            {/* RIGHT: focus on top, two squares on bottom */}
            <div className="grid grid-rows-[auto_auto] gap-2">
              <button
  onClick={() => updateSettings({ focus: !settings.focus })}
  className="rounded-2xl bg-white/10 hover:bg-black/20 transition-colors px-3 py-2 flex items-center gap-3 text-left min-h-[78px]"
>
  <div
    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
      settings.focus ? 'bg-violet-500' : 'bg-white/15'
    }`}
  >
    <Moon className="w-4 h-4" />
  </div>

  <div className="leading-tight">
    <div className="text-[12.5px] font-semibold">Focus</div>
    <div className="text-[10.5px] text-white/55">
      {settings.focus ? 'On' : 'Off'}
    </div>
  </div>
</button>
              <div className="grid grid-cols-2 gap-2">
                <SquareTile
                  active={airplayOn}
                  onClick={() => setAirplayOn(v => !v)}
                  icon={<Airplay className="w-4 h-4" />}
                  label="AirPlay"
                  accent="bg-blue-500"
                />
                <SquareTile
                  active={!isDark}
                  onClick={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}
                  icon={isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  label={isDark ? 'Light' : 'Dark'}
                  accent="bg-amber-500"
                />
              </div>
            </div>
          </div>

          <SliderModule
  label="Display"
  value={settings.brightness ?? 80}
  onChange={(v) => updateSettings({ brightness: v })}
  icon={<HiSun className="w-[15px] h-[15px] text-neutral-700 opacity-40" />}
/>

<SliderModule
  label="Sound"
  value={settings.volume ?? 65}
  onChange={(v) => updateSettings({ volume: v })}
  icon={<IoVolumeMedium className="w-[16px] h-[16px] text-neutral-700 opacity-40" />}
  trailing={
    <button
      onClick={() => setAirplayOn(v => !v)}
      className="ml-2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0"
    >
      <Airplay className="w-4 h-4" />
    </button>
  }
/>
          {/* Now Playing */}
          <div className="rounded-2xl bg-white/10 p-3 mt-2 flex items-center gap-3">
            <img src={np.cover} alt="" className="w-11 h-11 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold truncate">{np.title}</div>
              <div className="text-[11px] text-white/65 truncate">{np.artist}</div>
            </div>
            <button className="p-1.5 rounded-full hover:bg-white/15">
  <IoPlayBack className="w-4 h-4" />
</button>

<button
  onClick={() => setNowPlaying({ playing: !np.playing })}
  className="p-1.5 rounded-full hover:bg-white/15"
>
  {np.playing ? <Pause className="w-4 h-4" fill="white" /> : <IoPlay className="w-4 h-4" />}
</button>

<button className="p-1.5 rounded-full hover:bg-white/15">
  <IoPlayForward className="w-4 h-4" />
</button>
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

const SquareTile = ({
  active,
  onClick,
  icon,
  label,
  accent
}: {
  active?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  accent: string;
}) => (
  <button
    onClick={onClick}
    className="rounded-2xl bg-white/10 hover:bg-black/25 transition-colors p-2.5 flex flex-col items-center justify-center aspect-square min-h-[68px]"
  >
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        active ? accent : 'bg-white/15'
      }`}
    >
  {icon}
</div>

<div className="text-[11px] font-semibold mt-1 text-center">
  {label}
</div>
  </button>
);

// macOS-style pill slider with embedded icon and white "filled" indicator.
const SliderModule = ({
  label,
  value,
  onChange,
  icon,
  trailing
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon: React.ReactNode;
  trailing?: React.ReactNode;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const updateFromX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = clamp((clientX - r.left) / r.width, 0, 1);
    onChange(Math.round(p * 100));
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => updateFromX(e.clientX);
    const onUp = () => setDragging(false);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging]);

  const pct = clamp(value, 0, 100);

  return (
    <div className="rounded-2xl bg-white/10 px-3 pt-3 pb-3 mt-2">
      <div className="text-[12.5px] font-semibold mb-2">{label}</div>

      <div className="flex items-center gap-2">
        <div
          ref={trackRef}
          onPointerDown={(e) => {
            setDragging(true);
            updateFromX(e.clientX);
          }}
          className="relative flex-1 h-7 rounded-full overflow-hidden cursor-pointer select-none"
          style={{ background: 'rgba(255,255,255,0.18)' }}
        >
          {/* filled part */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `calc(${pct}% + 12px)`,
              background: '#ffffff',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
            }}
          />

          {/* icon moved a bit more left */}
          <div className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            {icon}
          </div>
        </div>

        {trailing}
      </div>
    </div>
  );
};
