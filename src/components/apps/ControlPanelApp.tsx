import { useMacOS } from '@/contexts/MacOSContext';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Sun, Moon, Sparkles, Magnet, EyeOff, Image as ImageIcon, Upload } from 'lucide-react';
import wallpaper1 from '@/assets/wallpaper-1.jpg';
import wallpaper2 from '@/assets/wallpaper-2.jpg';
import wallpaper3 from '@/assets/wallpaper-3.jpg';
import wallpaper4 from '@/assets/minecraft-valley.jpg';

const PRESETS = [
  { id: 'wallpaper-1', src: wallpaper1, label: '#1' },
  { id: 'wallpaper-2', src: wallpaper2, label: '#2' },
  { id: 'wallpaper-3', src: wallpaper3, label: '#3' },
  { id: 'wallpaper-4', src: wallpaper4, label: '#4' },
];

export const ControlPanelApp = () => {
  const { settings, updateSettings } = useMacOS();
  const Tile = ({ children, span = 1 }: { children: React.ReactNode; span?: number }) => (
    <div className="rounded-3xl p-5 liquid-glass-card text-white" style={{ gridColumn: `span ${span}` }}>{children}</div>
  );

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateSettings({ wallpaper: 'custom', customWallpaper: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full w-full overflow-auto p-6" style={{ background: 'rgba(20,20,24,0.6)' }}>
      <h1 className="text-white text-xl font-semibold mb-4">Control Panel</h1>
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <Tile span={2}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Sparkles className="w-5 h-5" /><div>
              <div className="font-semibold">Animations</div>
              <div className="text-xs text-white/60">Smooth window & dock animations</div>
            </div></div>
            <Switch checked={!settings.reducedMotion} onCheckedChange={(v) => updateSettings({ reducedMotion: !v })} />
          </div>
        </Tile>

        <Tile>
          <div className="flex items-center gap-3 mb-3">{settings.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}<div className="font-semibold">Theme</div></div>
          <div className="flex gap-2">
            <button onClick={() => updateSettings({ theme: 'light' })} className={`flex-1 py-2 rounded-xl text-sm ${settings.theme === 'light' ? 'bg-white/20' : 'bg-white/5'}`}>Light</button>
            <button onClick={() => updateSettings({ theme: 'dark' })} className={`flex-1 py-2 rounded-xl text-sm ${settings.theme === 'dark' ? 'bg-white/20' : 'bg-white/5'}`}>Dark</button>
          </div>
        </Tile>

        <Tile>
          <div className="flex items-center gap-3 mb-3"><EyeOff className="w-5 h-5" /><div className="font-semibold">Auto-hide Dock</div></div>
          <Switch checked={settings.dockAutoHide} onCheckedChange={(v) => updateSettings({ dockAutoHide: v })} />
        </Tile>

        <Tile span={2}>
          <div className="flex items-center gap-3 mb-3"><Magnet className="w-5 h-5" /><div className="font-semibold">Dock Magnification</div></div>
          <Slider value={[settings.dockMagnification]} min={0} max={150} step={5} onValueChange={(v) => updateSettings({ dockMagnification: v[0] })} />
          <div className="text-xs text-white/60 mt-2">{settings.dockMagnification}%</div>
        </Tile>

        <Tile span={2}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3"><ImageIcon className="w-5 h-5" /><div className="font-semibold">Wallpaper</div></div>
            <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs">
              <Upload className="w-3.5 h-3.5" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
            </label>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {PRESETS.map(w => (
              <button
                key={w.id}
                onClick={() => updateSettings({ wallpaper: w.id })}
                className={`h-16 rounded-xl border-2 overflow-hidden ${settings.wallpaper === w.id ? 'border-blue-400' : 'border-white/10'}`}
                style={{ backgroundImage: `url(${w.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                title={w.label}
              />
            ))}
            {settings.customWallpaper && (
              <button
                onClick={() => updateSettings({ wallpaper: 'custom' })}
                className={`h-16 rounded-xl border-2 overflow-hidden ${settings.wallpaper === 'custom' ? 'border-blue-400' : 'border-white/10'}`}
                style={{ backgroundImage: `url(${settings.customWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                title="Custom"
              />
            )}
          </div>
          {settings.wallpaper === 'custom' && (
            <p className="mt-2 text-xs text-white/60">Custom wallpaper saved to localStorage. Persists across reloads.</p>
          )}
        </Tile>
      </div>
    </div>
  );
};
