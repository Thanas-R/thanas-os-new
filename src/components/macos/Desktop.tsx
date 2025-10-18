import { useMacOS } from '@/contexts/MacOSContext';
import { Window } from './Window';
import { Dock } from './Dock';
import { MenuBar } from './MenuBar';
import wallpaper1 from '@/assets/wallpaper-1.jpg';
import wallpaper2 from '@/assets/wallpaper-2.jpg';
import wallpaper3 from '@/assets/wallpaper-3.jpg';
import { useEffect } from 'react';

const wallpapers = {
  'wallpaper-1': wallpaper1,
  'wallpaper-2': wallpaper2,
  'wallpaper-3': wallpaper3,
};

export const Desktop = () => {
  const { windows, settings, closeWindow } = useMacOS();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc to close focused window
      if (e.key === 'Escape' && windows.length > 0) {
        const focused = windows.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), windows[0]);
        closeWindow(focused.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [windows, closeWindow]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundImage: `url(${wallpapers[settings.wallpaper as keyof typeof wallpapers]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <MenuBar />
      
      <div className="pt-7 h-full">
        {windows.map(window => (
          <Window key={window.id} window={window} />
        ))}
      </div>

      <Dock />
    </div>
  );
};
