import { useMacOS } from '@/contexts/MacOSContext';
import { Monitor, Palette, Layout, Upload, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRef, useEffect, useState } from 'react';
import wallpaper1 from '@/assets/wallpaper-1.jpg';
import wallpaper2 from '@/assets/wallpaper-2.jpg';
import wallpaper3 from '@/assets/wallpaper-3.jpg';
import wallpaper4 from '@/assets/minecraft-valley.jpg';
import forgeIcon from '@/assets/forge-icon.png';
const wallpapers = [{
  id: 'wallpaper-1',
  src: wallpaper1,
  name: 'Mountain Lake'
}, {
  id: 'wallpaper-2',
  src: wallpaper2,
  name: 'Misty Valley'
}, {
  id: 'wallpaper-3',
  src: wallpaper3,
  name: 'Winter Forest'
}, {
  id: 'wallpaper-4',
  src: wallpaper4,
  name: 'Minecraft Mountains'
}];
export const SettingsApp = () => {
  const {
    settings,
    updateSettings
  } = useMacOS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Preload wallpapers and forge icon when Settings opens
  useEffect(() => {
    const preloadImages = async () => {
      const images = [wallpaper1, wallpaper2, wallpaper3, wallpaper4, forgeIcon];
      const promises = images.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src as string;
          img.loading = 'eager';
          img.decoding = 'async';
        });
      });
      await Promise.all(promises);
      setIsPreloaded(true);
    };
    preloadImages();
  }, []);
  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'macos-settings.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const imported = JSON.parse(e.target?.result as string);
            updateSettings(imported);
          } catch (error) {
            console.error('Error importing settings:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  const handleReset = () => {
    updateSettings({
      wallpaper: 'wallpaper-2',
      theme: 'light',
      dockAutoHide: false,
      dockMagnification: 75,
      reducedMotion: false
    });
  };

  const handleCustomWallpaper = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Create a temporary wallpaper URL
        updateSettings({ wallpaper: result });
      };
      reader.readAsDataURL(file);
    }
  };
  return <div className="p-8 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">System Settings</h1>
        <p className="text-muted-foreground">
          Customize your macOS experience
        </p>
      </div>

      {/* Wallpaper */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Wallpaper</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {wallpapers.map(wallpaper => <button key={wallpaper.id} onClick={() => updateSettings({
          wallpaper: wallpaper.id
        })} className={`relative rounded-xl overflow-hidden aspect-video transition-all ${settings.wallpaper === wallpaper.id ? 'ring-4 ring-primary scale-105' : 'hover:scale-105 opacity-80'}`}>
              <img src={wallpaper.src} alt={wallpaper.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 text-white text-sm">
                {wallpaper.name}
              </div>
            </button>)}
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Appearance</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm text-muted-foreground">Choose light or dark mode</div>
            </div>
            <div className="flex gap-2">
              <Button variant={settings.theme === 'light' ? 'default' : 'outline'} size="sm" onClick={() => updateSettings({
              theme: 'light'
            })}>
                Light
              </Button>
              <Button variant={settings.theme === 'dark' ? 'default' : 'outline'} size="sm" onClick={() => updateSettings({
              theme: 'dark'
            })}>
                Dark
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Reduced Motion</div>
              <div className="text-sm text-muted-foreground">Minimize animations</div>
            </div>
            <Switch checked={settings.reducedMotion} onCheckedChange={checked => updateSettings({
            reducedMotion: checked
          })} />
          </div>
        </div>
      </Card>

      {/* Dock */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Layout className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Dock</h2>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Auto-hide Dock</div>
              <div className="text-sm text-muted-foreground">Show dock on hover</div>
            </div>
            <Switch checked={settings.dockAutoHide} onCheckedChange={checked => updateSettings({
            dockAutoHide: checked
          })} />
          </div>
          
          <Separator />
          
        </div>
      </Card>

      {/* Custom Wallpaper Upload */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <ImagePlus className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Custom Wallpaper</h2>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload your own background image (JPEG, JPG, PNG). Note: Custom wallpapers are temporary and won't be saved.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button onClick={handleCustomWallpaper} variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload Custom Wallpaper
          </Button>
        </div>
      </Card>
    </div>;
};