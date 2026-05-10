import { useMacOS } from '@/contexts/MacOSContext';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Sun, Moon, Sparkles, Eye, Magnet, EyeOff, Image as ImageIcon } from 'lucide-react';

export const ControlPanelApp = () => {
  const { settings, updateSettings } = useMacOS();
  const Tile = ({ children, span = 1 }: { children: React.ReactNode; span?: number }) => (
    <div
      className="rounded-3xl p-5 liquid-glass-card text-white"
      style={{ gridColumn: `span ${span}` }}
    >{children}</div>
  );

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
          <div className="flex items-center gap-3 mb-3"><ImageIcon className="w-5 h-5" /><div className="font-semibold">Wallpaper</div></div>
          <div className="grid grid-cols-4 gap-2">
            {['wallpaper-1','wallpaper-2','wallpaper-3','wallpaper-4'].map(w => (
              <button key={w} onClick={() => updateSettings({ wallpaper: w })} className={`h-16 rounded-xl border-2 ${settings.wallpaper === w ? 'border-blue-400' : 'border-white/10'}`} style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="text-xs">{w.replace('wallpaper-','#')}</div>
              </button>
            ))}
          </div>
        </Tile>
      </div>
    </div>
  );
};
