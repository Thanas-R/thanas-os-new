import { useState, useEffect } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import { Window } from './Window';
import { Dock } from './Dock';
import { MenuBar } from './MenuBar';
import { Spotlight } from './Spotlight';
import { StatsWidget } from '@/components/widgets/StatsWidget';
import { TimeWidget } from '@/components/widgets/TimeWidget';
import { CalendarWidget } from '@/components/widgets/CalendarWidget';
import { WelcomeWidget } from '@/components/widgets/WelcomeWidget';
import { WeatherWidget } from '@/components/widgets/WeatherWidget';
import { useIsMobile } from '@/hooks/use-mobile';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import wallpaper1 from '@/assets/wallpaper-1.jpg';
import wallpaper2 from '@/assets/wallpaper-2.jpg';
import wallpaper3 from '@/assets/wallpaper-3.jpg';
import wallpaper4 from '@/assets/minecraft-valley.jpg';

const wallpapers = {
  'wallpaper-1': wallpaper1,
  'wallpaper-2': wallpaper2,
  'wallpaper-3': wallpaper3,
  'wallpaper-4': wallpaper4,
};

export const Desktop = () => {
  const { windows, settings, closeWindow } = useMacOS();
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const isMobile = useIsMobile();

  useImagePreloader();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen(true);
      }
      if (e.key === 'Escape' && windows.length > 0) {
        const focused = windows.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), windows[0]);
        closeWindow(focused.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [windows, closeWindow]);

  useEffect(() => {
    Object.values(wallpapers).forEach((src) => {
      const img = new Image();
      img.src = src as string;
      img.decoding = 'async';
      img.loading = 'eager';
    });
  }, []);

  const getBackgroundImage = () => {
    if (settings.wallpaper.startsWith('data:')) return settings.wallpaper;
    return wallpapers[settings.wallpaper as keyof typeof wallpapers];
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden ${isMobile ? 'min-w-[1024px]' : ''}`}
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <MenuBar onSpotlightClick={() => setSpotlightOpen(true)} />

      <div className="pt-7 h-full p-8">
        {/* Widgets - Left column */}
        <div className="absolute top-12 left-6 space-y-3">
          <WelcomeWidget />
          <div className="flex gap-2 items-start">
            <TimeWidget />
            <CalendarWidget />
          </div>
          <StatsWidget />
        </div>

        {windows.map(window => (
          <Window key={window.id} window={window} />
        ))}
      </div>

      <Spotlight isOpen={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
      <Dock />
    </div>
  );
};
