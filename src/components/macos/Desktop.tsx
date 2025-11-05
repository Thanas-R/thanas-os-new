import { useState, useEffect } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import { Window } from './Window';
import { Dock } from './Dock';
import { MenuBar } from './MenuBar';
import { Spotlight } from './Spotlight';
import { StatsWidget } from '@/components/widgets/StatsWidget';
import { ClockWidget } from '@/components/widgets/ClockWidget';
import { WelcomeWidget } from '@/components/widgets/WelcomeWidget';
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
  
  // Preload all critical images
  useImagePreloader();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for Spotlight
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen(true);
      }
      // Esc to close focused window
      if (e.key === 'Escape' && windows.length > 0) {
        const focused = windows.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), windows[0]);
        closeWindow(focused.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [windows, closeWindow]);

  // Preload wallpapers for smooth transitions
  useEffect(() => {
    Object.values(wallpapers).forEach((src) => {
      const img = new Image();
      img.src = src as string;
      img.decoding = 'async';
      img.loading = 'eager';
    });
  }, []);

  // Get the background image URL - support both preset wallpapers and custom URLs
  const getBackgroundImage = () => {
    if (settings.wallpaper.startsWith('data:')) {
      return settings.wallpaper;
    }
    return wallpapers[settings.wallpaper as keyof typeof wallpapers];
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <MenuBar onSpotlightClick={() => setSpotlightOpen(true)} />
      
      <div className="pt-7 h-full p-8">
        {/* All Widgets Stacked on Left */}
        <div className="absolute top-20 left-8 space-y-4">
          <WelcomeWidget />
          <ClockWidget />
          <StatsWidget />
        </div>

        {/* Windows */}
        {windows.map(window => (
          <Window key={window.id} window={window} />
        ))}
      </div>

      <Spotlight isOpen={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
      <Dock />
    </div>
  );
};
