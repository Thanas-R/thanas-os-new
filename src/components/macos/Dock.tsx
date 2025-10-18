import { useState } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import finderIcon from '@/assets/finder-icon.png';
import aboutIcon from '@/assets/about-icon.png';
import techIcon from '@/assets/tech-icon.png';
import projectsIcon from '@/assets/projects-icon.png';
import journeyIcon from '@/assets/journey-icon.png';
import githubIcon from '@/assets/github-icon.png';
import linkedinIcon from '@/assets/linkedin-icon.png';
import contactIcon from '@/assets/contact-icon.png';
import settingsIcon from '@/assets/settings-icon.png';

const iconMap: Record<string, string> = {
  'finder': finderIcon,
  'about': aboutIcon,
  'technologies': techIcon,
  'projects': projectsIcon,
  'journey': journeyIcon,
  'github': githubIcon,
  'linkedin': linkedinIcon,
  'contact': contactIcon,
  'settings': settingsIcon,
};

export const Dock = () => {
  const { apps, dockItems, openApp, windows, settings } = useMacOS();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const magnification = settings.dockMagnification / 100;
  const baseSize = 64;
  const maxScale = settings.reducedMotion ? 1 : 1 + magnification * 0.5;

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
    <>
      {/* Hover trigger for auto-hide dock */}
      {settings.dockAutoHide && (
        <div 
          className="fixed bottom-0 left-0 right-0 h-4 z-40"
          onMouseEnter={() => setHoveredIndex(0)}
        />
      )}
      
      <div
        className={`fixed bottom-2 left-1/2 -translate-x-1/2 backdrop-blur-macos-heavy rounded-3xl px-4 py-3 shadow-macos-glass z-50 ${
          settings.reducedMotion ? '' : 'transition-all duration-300'
        } ${
          settings.dockAutoHide && hoveredIndex === null ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
        style={{
          background: 'hsl(var(--macos-dock-bg))',
          border: '1px solid hsl(var(--macos-glass-border))',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.1) inset',
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
          const iconSrc = iconMap[app.id];

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
                className="rounded-2xl shadow-lg flex items-center justify-center overflow-hidden"
                style={{
                  width: baseSize,
                  height: baseSize,
                }}
              >
                {iconSrc ? (
                  <img src={iconSrc} alt={app.name} className="w-full h-full object-cover" />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-3xl"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.9), hsl(var(--accent) / 0.9))',
                    }}
                  >
                    {app.icon}
                  </div>
                )}
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
                <div className={`absolute -top-12 backdrop-blur-macos-heavy bg-[hsl(var(--macos-glass))] px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border border-[hsl(var(--macos-glass-border))] shadow-macos-glass ${settings.reducedMotion ? '' : 'animate-fade-in'}`}>
                  {app.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </>
  );
};
