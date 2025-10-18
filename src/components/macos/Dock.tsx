import { useState } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';

export const Dock = () => {
  const { apps, dockItems, openApp, windows, settings } = useMacOS();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const magnification = settings.dockMagnification / 100;
  const baseSize = 56;
  const maxScale = 1 + magnification * 0.5;

  const getScale = (index: number) => {
    if (hoveredIndex === null || settings.reducedMotion) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return maxScale;
    if (distance === 1) return 1 + magnification * 0.3;
    if (distance === 2) return 1 + magnification * 0.15;
    return 1;
  };

  const getTranslateY = (index: number) => {
    if (hoveredIndex === null || settings.reducedMotion) return 0;
    const scale = getScale(index);
    return -(scale - 1) * baseSize * 0.5;
  };

  return (
    <div
      className={`fixed bottom-2 left-1/2 -translate-x-1/2 backdrop-blur-macos rounded-2xl px-3 py-2 shadow-2xl transition-all duration-300 ${
        settings.dockAutoHide && hoveredIndex === null ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      style={{
        background: 'hsl(var(--macos-dock-bg))',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="flex items-end gap-2">
        {dockItems.map((item, index) => {
          const app = apps.find(a => a.id === item.appId);
          if (!app) return null;

          const isOpen = windows.some(w => w.appId === app.id && !w.isMinimized);
          const scale = getScale(index);
          const translateY = getTranslateY(index);

          return (
            <div
              key={app.id}
              className="relative flex flex-col items-center justify-center cursor-pointer"
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                transition: settings.reducedMotion ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => openApp(app.id)}
            >
              <div
                className="rounded-2xl shadow-lg flex items-center justify-center text-3xl"
                style={{
                  width: baseSize,
                  height: baseSize,
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
                }}
              >
                {app.icon}
              </div>

              {/* Active Indicator */}
              {isOpen && (
                <div
                  className="absolute -bottom-1 w-1 h-1 rounded-full"
                  style={{ background: 'hsl(var(--foreground))' }}
                />
              )}

              {/* Badge */}
              {item.badge && item.badge > 0 && (
                <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </div>
              )}

              {/* Tooltip */}
              {hoveredIndex === index && (
                <div className="absolute -top-10 backdrop-blur-macos bg-[hsl(var(--macos-glass))] px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap border border-[hsl(var(--macos-glass-border))] animate-fade-in">
                  {app.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
