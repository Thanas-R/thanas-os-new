import { useState, useEffect } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import { Window } from './Window';
import { Dock } from './Dock';
import { MenuBar } from './MenuBar';
import { Spotlight } from './Spotlight';
import { StatsWidget } from '@/components/widgets/StatsWidget';
import { UtilityClockWidget } from '@/components/widgets/UtilityClockWidget';
import { CalendarWidget } from '@/components/widgets/CalendarWidget';
import { BengaluruWeatherWidget } from '@/components/widgets/BengaluruWeatherWidget';
import { useIsMobile } from '@/hooks/use-mobile';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import wallpaper1 from '@/assets/wallpaper-1.jpg';
import wallpaper2 from '@/assets/wallpaper-2.jpg';
import wallpaper3 from '@/assets/wallpaper-3.jpg';
import wallpaperTahoe from '@/assets/wallpaper-tahoe.jpg';
import wallpaperVineyard from '@/assets/wallpaper-vineyard.jpg';
import wallpaperCatalina from '@/assets/wallpaper-catalina.jpg';
import wallpaperValley from '@/assets/wallpaper-valley.jpg';
import wallpaperMountain from '@/assets/wallpaper-mountain.jpg';
import wallpaperBigsur from '@/assets/wallpaper-bigsur.jpg';
import wallpaperSnow from '@/assets/wallpaper-snow.jpg';
import wallpaperAurora from '@/assets/wallpaper-aurora.jpg';
import wallpaperCanyon from '@/assets/wallpaper-canyon.jpg';
import wallpaperViaduct from '@/assets/wallpaper-viaduct.jpg';
import wallpaperDolomites from '@/assets/wallpaper-dolomites.jpg';
import wallpaperVestrahorn from '@/assets/wallpaper-vestrahorn.jpg';
import wallpaperAnnapurna from '@/assets/wallpaper-annapurna.jpg';
import wallpaperAlps from '@/assets/wallpaper-alps.jpg';

const wallpapers = {
  'wallpaper-1': wallpaper1,
  'wallpaper-2': wallpaper2,
  'wallpaper-3': wallpaper3,
  'wallpaper-tahoe': wallpaperTahoe,
  'wallpaper-vineyard': wallpaperVineyard,
  'wallpaper-catalina': wallpaperCatalina,
  'wallpaper-valley': wallpaperValley,
  'wallpaper-mountain': wallpaperMountain,
  'wallpaper-bigsur': wallpaperBigsur,
  'wallpaper-snow': wallpaperSnow,
  'wallpaper-aurora': wallpaperAurora,
  'wallpaper-canyon': wallpaperCanyon,
  'wallpaper-viaduct': wallpaperViaduct,
  'wallpaper-dolomites': wallpaperDolomites,
  'wallpaper-vestrahorn': wallpaperVestrahorn,
  'wallpaper-annapurna': wallpaperAnnapurna,
  'wallpaper-alps': wallpaperAlps,
};

export const Desktop = () => {
  const { windows, settings, closeWindow } = useMacOS();
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [launchpadClosing, setLaunchpadClosing] = useState(false);
  const isMobile = useIsMobile();
  const launchpadActuallyOpen = windows.some(w => w.appId === 'launchpad' && !w.isMinimized);
  const launchpadOpen = launchpadActuallyOpen && !launchpadClosing;

  useEffect(() => {
    const onClosing = () => setLaunchpadClosing(true);
    window.addEventListener('launchpad-closing', onClosing);
    return () => window.removeEventListener('launchpad-closing', onClosing);
  }, []);

  useEffect(() => {
    if (!launchpadActuallyOpen) setLaunchpadClosing(false);
  }, [launchpadActuallyOpen]);

  useImagePreloader();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen(true);
      }
      if (e.key === 'Escape' && windows.length > 0 && !spotlightOpen) {
        const focused = windows.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), windows[0]);
        closeWindow(focused.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [windows, closeWindow, spotlightOpen]);

  useEffect(() => {
    Object.values(wallpapers).forEach((src) => {
      const img = new Image();
      img.src = src as string;
      img.decoding = 'async';
    });
  }, []);

  // Force every external anchor to open in a new tab
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      // Allow internal app routes (data-internal) to behave normally
      if (a.dataset.internal === 'true') return;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  const getBackgroundImage = () => {
    if (settings.wallpaper === 'custom' && settings.customWallpaper) return settings.customWallpaper;
    if (settings.wallpaper.startsWith('data:')) return settings.wallpaper;
    return wallpapers[settings.wallpaper as keyof typeof wallpapers] || wallpapers['wallpaper-2'];
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden ${isMobile ? 'min-w-[1024px]' : ''}`}
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'auto',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        filter: settings.brightness != null ? `brightness(${0.5 + (settings.brightness / 100) * 0.6})` : undefined,
      }}
    >
      <div className={`menubar-slide ${launchpadOpen ? 'menubar-slide-up' : ''}`}>
        <MenuBar onSpotlightClick={() => setSpotlightOpen(true)} />
      </div>

      <div className="pt-7 h-full p-8">
        <div className="absolute top-12 left-6 space-y-3">
          <BengaluruWeatherWidget />
          <div className="flex gap-3 items-start">
            <UtilityClockWidget size={172} />
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
