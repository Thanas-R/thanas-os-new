import { useState, useRef, useCallback, useEffect } from 'react';
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
  const [isDockVisible, setIsDockVisible] = useState(!settings.dockAutoHide);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [currentScales, setCurrentScales] = useState<number[]>([]);
  const [currentPositions, setCurrentPositions] = useState<number[]>([]);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMouseMoveTime = useRef<number>(0);

  const baseSize = 64;
  const minScale = 1.0;
  const magnification = settings.dockMagnification / 100;
  const maxScale = settings.reducedMotion ? 1 : 1 + magnification * 0.8;
  const effectWidth = 240;
  const baseSpacing = 8;

  // Authentic macOS cosine-based magnification algorithm
  const calculateTargetMagnification = useCallback((mousePosition: number | null) => {
    if (mousePosition === null || settings.reducedMotion) {
      return dockItems.map(() => minScale);
    }

    return dockItems.map((_, index) => {
      const normalIconCenter = (index * (baseSize + baseSpacing)) + (baseSize / 2);
      const minX = mousePosition - (effectWidth / 2);
      const maxX = mousePosition + (effectWidth / 2);
      
      if (normalIconCenter < minX || normalIconCenter > maxX) {
        return minScale;
      }
      
      const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
      const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
      const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;
      
      return minScale + (scaleFactor * (maxScale - minScale));
    });
  }, [dockItems, baseSize, baseSpacing, effectWidth, maxScale, minScale, settings.reducedMotion]);

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
  }, [dockItems, calculatePositions, minScale]);

  // Animation loop
  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const targetPositions = calculatePositions(targetScales);
    const lerpFactor = mouseX !== null ? 0.2 : 0.12;

    setCurrentScales(prevScales => {
      return prevScales.map((currentScale, index) => {
        const diff = targetScales[index] - currentScale;
        return currentScale + (diff * lerpFactor);
      });
    });

    setCurrentPositions(prevPositions => {
      return prevPositions.map((currentPos, index) => {
        const diff = targetPositions[index] - currentPos;
        return currentPos + (diff * lerpFactor);
      });
    });

    const scalesNeedUpdate = currentScales.some((scale, index) => 
      Math.abs(scale - targetScales[index]) > 0.002
    );
    const positionsNeedUpdate = currentPositions.some((pos, index) => 
      Math.abs(pos - targetPositions[index]) > 0.1
    );
    
    if (scalesNeedUpdate || positionsNeedUpdate || mouseX !== null) {
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [mouseX, calculateTargetMagnification, calculatePositions, currentScales, currentPositions]);

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
    const now = performance.now();
    
    if (now - lastMouseMoveTime.current < 16) {
      return;
    }
    
    lastMouseMoveTime.current = now;
    
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      const padding = 16;
      setMouseX(e.clientX - rect.left - padding);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const createBounceAnimation = (element: HTMLElement) => {
    element.style.transition = 'transform 0.2s ease-out';
    element.style.transform = 'translateY(-12px)';
    
    setTimeout(() => {
      element.style.transform = 'translateY(0px)';
    }, 200);
  };

  const handleAppClick = (appId: string, index: number) => {
    if (iconRefs.current[index] && !settings.reducedMotion) {
      createBounceAnimation(iconRefs.current[index]!);
    }
    openApp(appId);
  };

  // Calculate content width
  const contentWidth = currentPositions.length > 0 
    ? Math.max(...currentPositions.map((pos, index) => 
        pos + (baseSize * currentScales[index]) / 2
      ))
    : (dockItems.length * (baseSize + baseSpacing)) - baseSpacing;

  const padding = 16;

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
        className={`fixed bottom-2 left-1/2 -translate-x-1/2 backdrop-blur-macos-heavy rounded-3xl shadow-macos-glass z-50 ${
          settings.reducedMotion ? '' : 'transition-all duration-500 ease-out'
        } ${
          settings.dockAutoHide && !isDockVisible ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
        style={{
          width: `${contentWidth + padding * 2}px`,
          background: 'hsl(var(--macos-dock-bg))',
          border: '1px solid hsl(var(--macos-glass-border))',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.1) inset',
          padding: `${padding}px`
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
            width: '100%'
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
                  className="rounded-2xl shadow-lg flex items-center justify-center overflow-hidden"
                  style={{
                    width: scaledSize,
                    height: scaledSize,
                    filter: `drop-shadow(0 ${scale > 1.2 ? 2 : 1}px ${scale > 1.2 ? 4 : 2}px rgba(0,0,0,${0.2 + (scale - 1) * 0.15}))`
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
        </div>
      </div>
    </>
  );
};
