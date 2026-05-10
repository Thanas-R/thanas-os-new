import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Bluetooth, Radio, Moon, Monitor, Sun, Volume2, VolumeX, Calculator, Camera, Timer, Sparkles } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';
import { Slider } from '@/components/ui/slider';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ControlCenter = ({ open, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { settings, updateSettings, openApp } = useMacOS();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    setTimeout(() => document.addEventListener('mousedown', onDown), 0);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  const Pill = ({ active, onClick, icon, label, sub }: { active?: boolean; onClick: () => void; icon: React.ReactNode; label: string; sub?: string }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-full transition-colors ${active ? 'bg-blue-500 text-white' : 'bg-white/15 text-white hover:bg-white/20'}`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${active ? 'bg-white/25' : 'bg-white/15'}`}>{icon}</div>
      <div className="text-left leading-tight">
        <div className="text-[12px] font-semibold">{label}</div>
        {sub && <div className="text-[10px] opacity-70">{sub}</div>}
      </div>
    </button>
  );

  const Square = ({ active, onClick, icon, label }: { active?: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-3xl aspect-square transition-colors ${active ? 'bg-blue-500 text-white' : 'bg-white/15 text-white hover:bg-white/20'}`}
    >
      <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">{icon}</div>
      <div className="text-[11px] font-medium">{label}</div>
    </button>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-9 right-3 z-[300] w-80 rounded-3xl p-3 liquid-glass-card text-white"
          style={{
            background: 'rgba(28,28,32,0.55)',
            backdropFilter: 'blur(40px) saturate(180%)',
          }}
        >
          {/* Connectivity row */}
          <div className="rounded-3xl bg-white/5 p-3 mb-3 grid grid-cols-2 gap-2">
            <Pill
              active={settings.wifi}
              onClick={() => updateSettings({ wifi: !settings.wifi })}
              icon={<Wifi className="w-3.5 h-3.5" />}
              label="Wi-Fi"
              sub={settings.wifi ? 'ThanasOS-Net' : 'Off'}
            />
            <Pill
              active={settings.bluetooth}
              onClick={() => updateSettings({ bluetooth: !settings.bluetooth })}
              icon={<Bluetooth className="w-3.5 h-3.5" />}
              label="Bluetooth"
              sub={settings.bluetooth ? 'On' : 'Off'}
            />
            <Pill
              active={settings.airdrop}
              onClick={() => updateSettings({ airdrop: !settings.airdrop })}
              icon={<Radio className="w-3.5 h-3.5" />}
              label="AirDrop"
              sub="Contacts"
            />
            <Pill
              active={settings.focus}
              onClick={() => updateSettings({ focus: !settings.focus })}
              icon={<Moon className="w-3.5 h-3.5" />}
              label="Focus"
            />
          </div>

          {/* Display brightness */}
          <div className="rounded-3xl bg-white/5 p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4" />
              <div className="text-[12px] font-semibold">Display</div>
            </div>
            <Slider
              value={[settings.brightness ?? 80]}
              min={20}
              max={100}
              step={5}
              onValueChange={(v) => updateSettings({ brightness: v[0] })}
            />
          </div>

          {/* Sound */}
          <div className="rounded-3xl bg-white/5 p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              {(settings.volume ?? 65) === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <div className="text-[12px] font-semibold">Sound</div>
            </div>
            <Slider
              value={[settings.volume ?? 65]}
              min={0}
              max={100}
              step={5}
              onValueChange={(v) => updateSettings({ volume: v[0] })}
            />
          </div>

          {/* Quick action squares */}
          <div className="grid grid-cols-4 gap-2">
            <Square
              active={settings.theme === 'dark'}
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              icon={settings.theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              label={settings.theme === 'dark' ? 'Dark' : 'Light'}
            />
            <Square
              onClick={() => { openApp('settings'); onClose(); }}
              icon={<Sparkles className="w-4 h-4" />}
              label="Settings"
            />
            <Square
              onClick={() => { /* timer placeholder */ }}
              icon={<Timer className="w-4 h-4" />}
              label="Timer"
            />
            <Square
              onClick={() => { /* screenshot placeholder */ }}
              icon={<Camera className="w-4 h-4" />}
              label="Shot"
            />
            <Square
              onClick={() => { openApp('finder'); onClose(); }}
              icon={<Monitor className="w-4 h-4" />}
              label="Finder"
            />
            <Square
              onClick={() => { /* calculator hook future */ }}
              icon={<Calculator className="w-4 h-4" />}
              label="Calc"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
