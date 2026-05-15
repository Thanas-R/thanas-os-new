import { useState, useRef, useCallback, useEffect } from 'react';

declare global {
  interface Window {
    gsap?: {
      to: (target: Element | null, vars: Record<string, unknown>) => void;
    };
  }
}

import { useMacOS } from '@/contexts/MacOSContext';
import { APP_ICONS as iconMap } from '@/components/apps/LaunchpadApp';
import trashIcon from '@/assets/trash-icon.png';

export const Dock = () => {
  const { apps, dockItems, openApp, windows, settings } = useMacOS();
  const [isDockVisible, setIsDockVisible] = useState(!settings.dockAutoHide);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [currentScales, setCurrentScales] = useState<number[]>([]);
  const [currentPositions, setCurrentPositions] = useState<number[]>([]);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMouseMoveTime = useRef<number>(0);

  // Responsive size calculations
  const getResponsiveConfig = useCallback(() => {
    if (typeof window === 'undefined') {
      return { baseSize: 64, maxScale: 1.6, effectWidth: 240 };
    }

    const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    
    if (smallerDimension < 480) {
      return {
        baseSize: Math.max(40, smallerDimension * 0.08) * 0.95,
        maxScale: 1.4,
        effectWidth: smallerDimension * 0.4
      };
    } else if (smallerDimension < 768) {
      return {
        baseSize: Math.max(48, smallerDimension * 0.07) * 0.95,
        maxScale: 1.5,
        effectWidth: smallerDimension * 0.35
      };
    } else if (smallerDimension < 1024) {
      return {
        baseSize: Math.max(56, smallerDimension * 0.06) * 0.95,
        maxScale: 1.6,
        effectWidth: smallerDimension * 0.3
      };
    } else {
      return {
        baseSize: Math.max(64, Math.min(80, smallerDimension * 0.05)) * 0.95,
        maxScale: 1.8,
        effectWidth: 300
      };
    }
  }, []);

  const [config, setConfig] = useState(getResponsiveConfig);
  const { baseSize, maxScale, effectWidth } = config;
  const minScale = 1.0;
  // More breathing room between dock icons, closer to native macOS
  const baseSpacing = Math.max(8, baseSize * 0.18);

  // Update config on window resize
  useEffect(() => {
    const handleResize = () => {
      setConfig(getResponsiveConfig());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getResponsiveConfig]);

  // Authentic macOS cosine-based magnification algorithm
const calculateTargetMagnification = useCallback(
  (mousePosition: number | null) => {
    if (mousePosition === null) {
      return dockItems.map(() => minScale);
    }

    return dockItems.map((_, index) => {
      const actualCenter = currentPositions[index] ?? (index * (baseSize + baseSpacing) + baseSize / 2);
      const minX = mousePosition - effectWidth / 2;
      const maxX = mousePosition + effectWidth / 2;

      if (actualCenter < minX || actualCenter > maxX) {
        return minScale;
      }

      const theta = ((actualCenter - minX) / effectWidth) * 2 * Math.PI;
      const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
      const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;

      return minScale + scaleFactor * (maxScale - minScale);
    });
  },
  [dockItems, currentPositions, baseSize, baseSpacing, effectWidth, maxScale, minScale]
);

  // Calculate positions based on current scales
  const calculatePositions = useCallback((scales: number[]) => {
    let currentX = 0;
    
    return scales.map((scale) => {
      const scaledWidth = baseSize * scale;
      const centerX = currentX + (scaledWidth / 2);
      currentX += scaledWidth + baseSpacing;
      return centerX;
    });
  }, [baseSize, baseSpacing]);

  // Initialize scales and positions
  useEffect(() => {
    const initialScales = dockItems.map(() => minScale);
    const initialPositions = calculatePositions(initialScales);
    setCurrentScales(initialScales);
    setCurrentPositions(initialPositions);
  }, [dockItems, calculatePositions, minScale, config]);

  // Animation loop
  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const targetPositions = calculatePositions(targetScales);
    const lerpFactor = settings.reducedMotion ? 1 : (mouseX !== null ? 0.2 : 0.12);

    setCurrentScales(prevScales => {
      return prevScales.map((currentScale, index) => {
        const diff = targetScales[index] - currentScale;
        const next = currentScale + (diff * lerpFactor);
        // Clamp to avoid overshoot and jitter
        return Math.max(minScale, Math.min(maxScale, next));
      });
    });

    setCurrentPositions(prevPositions => {
      return prevPositions.map((currentPos, index) => {
        const diff = targetPositions[index] - currentPos;
        return currentPos + (diff * lerpFactor);
      });
    });

    const scalesNeedUpdate = currentScales.some((scale, index) => 
      Math.abs(scale - targetScales[index]) > 0.005
    );
    const positionsNeedUpdate = currentPositions.some((pos, index) => 
      Math.abs(pos - targetPositions[index]) > 0.2
    );
    
    if (scalesNeedUpdate || positionsNeedUpdate || mouseX !== null) {
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [mouseX, calculateTargetMagnification, calculatePositions, currentScales, currentPositions, maxScale, settings.reducedMotion]);

  // Start/stop animation loop
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (currentScales.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateToTarget, currentScales.length]);

  // Throttled mouse movement handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (settings.reducedMotion) return;
    
    const now = performance.now();
    
    if (now - lastMouseMoveTime.current < 16) {
      return;
    }
    
    lastMouseMoveTime.current = now;
    
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      const dynamicPadding = Math.max(8, baseSize * 0.12);
      setMouseX(e.clientX - rect.left - dynamicPadding);
    }
  }, [baseSize, settings.reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const createBounceAnimation = (element: HTMLElement) => {
    if (settings.reducedMotion) return;
    const bounceHeight = Math.max(-8, -baseSize * 0.15);
    element.style.transition = 'transform 0.15s ease-out';
    element.style.transform = `translateY(${bounceHeight}px)`;
    
    setTimeout(() => {
      element.style.transform = 'translateY(0px)';
    }, 150);
  };

  const handleAppClick = (appId: string, index: number) => {
    if (iconRefs.current[index] && !settings.reducedMotion) {
      if (typeof window !== 'undefined' && window.gsap) {
        const gsap = window.gsap;
        const bounceHeight = currentScales[index] > 1.3 ? -baseSize * 0.2 : -baseSize * 0.15;
        
        gsap.to(iconRefs.current[index], {
          y: bounceHeight,
          duration: 0.2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          transformOrigin: 'bottom center'
        });
      } else {
        createBounceAnimation(iconRefs.current[index]!);
      }
    }
    
    openApp(appId);
  };

  // Calculate content width
  const baseContentWidth = currentPositions.length > 0
    ? Math.max(...currentPositions.map((pos, index) =>
        pos + (baseSize * currentScales[index]) / 2
      ))
    : (dockItems.length * (baseSize + baseSpacing)) - baseSpacing;

  // Reserve space for separator + trash icon at the right
  const separatorGap = baseSpacing * 1.5;
  const separatorWidth = 1;
  const trashSize = baseSize;
  const contentWidth = baseContentWidth + separatorGap + separatorWidth + separatorGap + trashSize;

  const padding = Math.max(8, baseSize * 0.12);

  return (
    <>
      {/* Hover trigger for auto-hide dock */}
      {settings.dockAutoHide && (
        <div 
          className="fixed bottom-0 left-0 right-0 w-full h-24 z-40"
          onMouseEnter={() => setIsDockVisible(true)}
        />
      )}
      
      <div
        ref={dockRef}
        className={`fixed bottom-2 left-1/2 -translate-x-1/2 backdrop-blur-macos-heavy rounded-3xl shadow-macos-glass z-[70] ${
          settings.reducedMotion ? '' : 'transition-all duration-500 ease-out'
        } ${
          (settings.dockAutoHide && !isDockVisible) ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
        style={{
          width: `${contentWidth + padding * 2}px`,
          background: 'rgba(45, 45, 45, 0.2)',
          borderRadius: `${Math.max(12, baseSize * 0.4)}px`,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: `
            0 ${Math.max(4, baseSize * 0.1)}px ${Math.max(16, baseSize * 0.4)}px rgba(0, 0, 0, 0.4),
            0 ${Math.max(2, baseSize * 0.05)}px ${Math.max(8, baseSize * 0.2)}px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2)
          `,
          padding: `${padding}px`,
          transition: settings.reducedMotion ? undefined : 'opacity 0.5s ease, transform 0.5s ease',
          overflow: 'visible'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          if (settings.dockAutoHide) {
            setIsDockVisible(false);
          }
          handleMouseLeave();
        }}
      >
        <div 
          className="relative"
          style={{
            height: `${baseSize}px`,
            width: '100%',
            overflow: 'visible'
          }}
        >
          {dockItems.map((item, index) => {
            const app = apps.find(a => a.id === item.appId);
            if (!app) return null;

            const isOpen = windows.some(w => w.appId === app.id && !w.isMinimized);
            const isMinimized = windows.some(w => w.appId === app.id && w.isMinimized);
            const scale = currentScales[index] || 1;
            const position = currentPositions[index] || 0;
            const scaledSize = baseSize * scale;
            const iconSrc = iconMap[app.id];

            return (
              <div
                key={app.id}
                ref={(el) => { iconRefs.current[index] = el; }}
                className="absolute cursor-pointer flex flex-col items-center justify-end"
                onClick={() => handleAppClick(app.id, index)}
                style={{
                  left: `${position - scaledSize / 2}px`,
                  bottom: '0px',
                  width: `${scaledSize}px`,
                  height: `${scaledSize}px`,
                  transformOrigin: 'bottom center',
                  zIndex: Math.round(scale * 10)
                }}
              >
              <div
                  className="flex items-center justify-center overflow-hidden"
                  style={{
                    width: scaledSize,
                    height: scaledSize,
                    borderRadius: `${Math.max(12, scaledSize * 0.225)}px`,
                    filter: `drop-shadow(0 ${scale > 1.2 ? Math.max(2, baseSize * 0.05) : Math.max(1, baseSize * 0.03)}px ${scale > 1.2 ? Math.max(4, baseSize * 0.1) : Math.max(2, baseSize * 0.06)}px rgba(0,0,0,${0.3 + (scale - 1) * 0.2}))`
                  }}
                >
                  {iconSrc ? (
                    <img src={iconSrc} alt={app.name} className="w-full h-full object-cover" decoding="async" loading="eager" />
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
                
                {/* Minimized Indicator */}
                {isMinimized && !isOpen && (
                  <div
                    className="absolute -bottom-1 w-1 h-1 rounded-full"
                    style={{ background: 'hsl(var(--muted-foreground))' }}
                  />
                )}

                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}

                {/* Tooltip */}
                {mouseX !== null && Math.abs(position - mouseX - padding) < 50 && (
                  <div className={`absolute -top-12 backdrop-blur-macos-heavy bg-[hsl(var(--macos-glass))] px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border border-[hsl(var(--macos-glass-border))] shadow-macos-glass ${settings.reducedMotion ? '' : 'animate-fade-in'}`}>
                    {app.name}
                  </div>
                )}
              </div>
            );
          })}

          {/* Separator + Trash */}
          <div
            className="absolute"
            style={{
              left: `${baseContentWidth + separatorGap}px`,
              bottom: `${baseSize * 0.1}px`,
              width: `${separatorWidth}px`,
              height: `${baseSize * 0.8}px`,
              background: 'rgba(255,255,255,0.18)',
              borderRadius: 1,
            }}
          />
          <div
            className="absolute cursor-pointer flex items-end justify-center group"
            style={{
              left: `${baseContentWidth + separatorGap + separatorWidth + separatorGap}px`,
              bottom: 0,
              width: `${baseSize}px`,
              height: `${baseSize}px`,
            }}
          >
            <div
              className="flex items-center justify-center overflow-hidden"
              style={{
                width: baseSize,
                height: baseSize,
                borderRadius: `${Math.max(12, baseSize * 0.225)}px`,
                filter: `drop-shadow(0 ${Math.max(1, baseSize * 0.03)}px ${Math.max(2, baseSize * 0.06)}px rgba(0,0,0,0.3))`,
              }}
            >
              <img src={trashIcon} alt="Trash" className="w-full h-full object-contain" />
            </div>
            {/* Tooltip */}
            <div className="absolute -top-12 backdrop-blur-macos-heavy bg-[hsl(var(--macos-glass))] px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border border-[hsl(var(--macos-glass-border))] shadow-macos-glass opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Trash
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
