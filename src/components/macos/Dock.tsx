import { useState, useRef, useCallback, useEffect } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import { APP_ICONS as iconMap } from '@/components/apps/LaunchpadApp';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

export const Dock = () => {
  const { apps, dockItems, openApp, windows, settings, reorderDock, removeFromDock } = useMacOS();
  const [isDockVisible, setIsDockVisible] = useState(!settings.dockAutoHide);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [currentScales, setCurrentScales] = useState<number[]>([]);
  const [currentPositions, setCurrentPositions] = useState<number[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [removeHover, setRemoveHover] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMouseMoveTime = useRef<number>(0);

  const getResponsiveConfig = useCallback(() => {
    if (typeof window === 'undefined') {
      return { baseSize: 64, maxScale: 1.6, effectWidth: 240 };
    }
    const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    if (smallerDimension < 480) return { baseSize: Math.max(40, smallerDimension * 0.08), maxScale: 1.4, effectWidth: smallerDimension * 0.4 };
    if (smallerDimension < 768) return { baseSize: Math.max(48, smallerDimension * 0.07), maxScale: 1.5, effectWidth: smallerDimension * 0.35 };
    if (smallerDimension < 1024) return { baseSize: Math.max(56, smallerDimension * 0.06), maxScale: 1.6, effectWidth: smallerDimension * 0.3 };
    return { baseSize: Math.max(64, Math.min(80, smallerDimension * 0.05)), maxScale: 1.8, effectWidth: 300 };
  }, []);

  const [config, setConfig] = useState(getResponsiveConfig);
  const { baseSize, maxScale, effectWidth } = config;
  const minScale = 1.0;
  const baseSpacing = Math.max(10, baseSize * 0.22);

  useEffect(() => {
    const handleResize = () => setConfig(getResponsiveConfig());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getResponsiveConfig]);

  const calculateTargetMagnification = useCallback((mousePosition: number | null) => {
    if (mousePosition === null) return dockItems.map(() => minScale);
    return dockItems.map((_, index) => {
      const normalIconCenter = (index * (baseSize + baseSpacing)) + (baseSize / 2);
      const minX = mousePosition - (effectWidth / 2);
      const maxX = mousePosition + (effectWidth / 2);
      if (normalIconCenter < minX || normalIconCenter > maxX) return minScale;
      const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
      const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
      const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;
      return minScale + (scaleFactor * (maxScale - minScale));
    });
  }, [dockItems, baseSize, baseSpacing, effectWidth, maxScale, minScale]);

  const calculatePositions = useCallback((scales: number[]) => {
    let currentX = 0;
    return scales.map((scale) => {
      const scaledWidth = baseSize * scale;
      const centerX = currentX + (scaledWidth / 2);
      currentX += scaledWidth + baseSpacing;
      return centerX;
    });
  }, [baseSize, baseSpacing]);

  useEffect(() => {
    const initialScales = dockItems.map(() => minScale);
    setCurrentScales(initialScales);
    setCurrentPositions(calculatePositions(initialScales));
  }, [dockItems.length, calculatePositions, minScale, config]);

  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const targetPositions = calculatePositions(targetScales);
    const lerpFactor = settings.reducedMotion ? 1 : (mouseX !== null ? 0.2 : 0.12);

    setCurrentScales(prev => prev.map((s, i) => {
      const next = s + (targetScales[i] - s) * lerpFactor;
      return Math.max(minScale, Math.min(maxScale, next));
    }));
    setCurrentPositions(prev => prev.map((p, i) => p + (targetPositions[i] - p) * lerpFactor));

    const need = currentScales.some((s, i) => Math.abs(s - targetScales[i]) > 0.005)
      || currentPositions.some((p, i) => Math.abs(p - targetPositions[i]) > 0.2);
    if (need || mouseX !== null) animationFrameRef.current = requestAnimationFrame(animateToTarget);
  }, [mouseX, calculateTargetMagnification, calculatePositions, currentScales, currentPositions, settings.reducedMotion, minScale, maxScale]);

  useEffect(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (currentScales.length > 0) animationFrameRef.current = requestAnimationFrame(animateToTarget);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [animateToTarget, currentScales.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (settings.reducedMotion) return;
    const now = performance.now();
    if (now - lastMouseMoveTime.current < 16) return;
    lastMouseMoveTime.current = now;
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      const dynamicPadding = Math.max(8, baseSize * 0.12);
      setMouseX(e.clientX - rect.left - dynamicPadding);
    }
  }, [baseSize, settings.reducedMotion]);

  const handleMouseLeave = useCallback(() => setMouseX(null), []);

  const createBounceAnimation = (element: HTMLElement) => {
    if (settings.reducedMotion) return;
    const bounceHeight = Math.max(-8, -baseSize * 0.15);
    element.style.transition = 'transform 0.15s ease-out';
    element.style.transform = `translateY(${bounceHeight}px)`;
    setTimeout(() => { element.style.transform = 'translateY(0px)'; }, 150);
  };

  const handleAppClick = (appId: string, index: number) => {
    if (draggingIndex !== null) return;
    if (iconRefs.current[index]) createBounceAnimation(iconRefs.current[index]!);
    openApp(appId);
  };

  // ----- DRAG & DROP -----
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggingIndex !== null && draggingIndex !== index) setDragOverIndex(index);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (dockRef.current && draggingIndex !== null) {
      const rect = dockRef.current.getBoundingClientRect();
      const draggedFar = e.clientY > rect.bottom + 60 || e.clientY < rect.top - 60
        || e.clientX < rect.left - 80 || e.clientX > rect.right + 80;
      if (draggedFar) {
        const item = dockItems[draggingIndex];
        if (item) removeFromDock(item.appId);
      } else if (dragOverIndex !== null && dragOverIndex !== draggingIndex) {
        reorderDock(draggingIndex, dragOverIndex);
      }
    }
    setDraggingIndex(null);
    setDragOverIndex(null);
    setRemoveHover(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingIndex !== null && dragOverIndex !== null && draggingIndex !== dragOverIndex) {
      reorderDock(draggingIndex, dragOverIndex);
    }
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const contentWidth = currentPositions.length > 0
    ? Math.max(...currentPositions.map((pos, index) => pos + (baseSize * (currentScales[index] || 1)) / 2))
    : (dockItems.length * (baseSize + baseSpacing)) - baseSpacing;
  const padding = Math.max(10, baseSize * 0.14);

  return (
    <>
      {settings.dockAutoHide && (
        <div className="fixed bottom-0 left-0 right-0 w-full h-24 z-40" onMouseEnter={() => setIsDockVisible(true)} />
      )}

      {draggingIndex !== null && removeHover && (
        <div className="fixed inset-0 z-[51] pointer-events-none flex items-start justify-center pt-32">
          <div className="px-4 py-2 rounded-full text-white text-sm bg-red-500/85 backdrop-blur-md border border-white/20 shadow-lg">
            Remove from Dock
          </div>
        </div>
      )}

      <div
        ref={dockRef}
        className={`fixed bottom-2 left-1/2 -translate-x-1/2 z-50 ${settings.reducedMotion ? '' : 'transition-all duration-500 ease-out'} ${
          settings.dockAutoHide && !isDockVisible ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
        style={{
          width: `${contentWidth + padding * 2}px`,
          background: 'rgba(40, 40, 45, 0.55)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          borderRadius: `${Math.max(18, baseSize * 0.42)}px`,
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: `0 ${Math.max(6, baseSize * 0.12)}px ${Math.max(20, baseSize * 0.45)}px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.25)`,
          padding: `${padding}px`,
          overflow: 'visible',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { if (settings.dockAutoHide) setIsDockVisible(false); handleMouseLeave(); }}
        onDragOver={(e) => {
          e.preventDefault();
          if (dockRef.current && draggingIndex !== null) {
            const rect = dockRef.current.getBoundingClientRect();
            setRemoveHover(e.clientY < rect.top - 30 || e.clientY > rect.bottom + 30);
          }
        }}
        onDrop={handleDrop}
      >
        <div className="relative" style={{ height: `${baseSize}px`, width: '100%', overflow: 'visible' }}>
          {dockItems.map((item, index) => {
            const app = apps.find(a => a.id === item.appId);
            if (!app) return null;
            const isOpen = windows.some(w => w.appId === app.id && !w.isMinimized);
            const isMinimized = windows.some(w => w.appId === app.id && w.isMinimized);
            const scale = currentScales[index] || 1;
            const position = currentPositions[index] || 0;
            const scaledSize = baseSize * scale;
            const iconSrc = iconMap[app.id];
            const isDragging = draggingIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <ContextMenu key={app.id}>
                <ContextMenuTrigger asChild>
                  <div
                    ref={(el) => { iconRefs.current[index] = el; }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className="absolute cursor-pointer flex flex-col items-center justify-end"
                    onClick={() => handleAppClick(app.id, index)}
                    style={{
                      left: `${position - scaledSize / 2}px`,
                      bottom: '0px',
                      width: `${scaledSize}px`,
                      height: `${scaledSize}px`,
                      transformOrigin: 'bottom center',
                      zIndex: Math.round(scale * 10),
                      opacity: isDragging ? 0.35 : 1,
                      transform: isDragOver ? 'translateX(8px)' : undefined,
                      transition: isDragging ? 'none' : 'opacity 120ms ease, transform 160ms ease',
                    }}
                  >
                    <div
                      className="flex items-center justify-center overflow-hidden"
                      style={{
                        width: scaledSize,
                        height: scaledSize,
                        borderRadius: `${Math.max(12, scaledSize * 0.225)}px`,
                        filter: `drop-shadow(0 ${scale > 1.2 ? Math.max(2, baseSize * 0.05) : Math.max(1, baseSize * 0.03)}px ${scale > 1.2 ? Math.max(4, baseSize * 0.1) : Math.max(2, baseSize * 0.06)}px rgba(0,0,0,${0.3 + (scale - 1) * 0.2}))`,
                      }}
                    >
                      {iconSrc ? (
                        <img src={iconSrc} alt={app.name} className="w-full h-full object-cover pointer-events-none" decoding="async" loading="eager" draggable={false} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-primary/90 to-accent/90">
                          {app.icon}
                        </div>
                      )}
                    </div>

                    {isOpen && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-foreground" />}
                    {isMinimized && !isOpen && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-muted-foreground" />}

                    {item.badge && item.badge > 0 && (
                      <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge > 9 ? '9+' : item.badge}
                      </div>
                    )}

                    {mouseX !== null && Math.abs(position - mouseX - padding) < 50 && draggingIndex === null && (
                      <div className={`absolute -top-12 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg ${settings.reducedMotion ? '' : 'animate-fade-in'}`}
                        style={{ background: 'rgba(40,40,45,0.85)', color: 'white', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        {app.name}
                      </div>
                    )}
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onSelect={() => openApp(app.id)}>Open</ContextMenuItem>
                  <ContextMenuItem onSelect={() => removeFromDock(app.id)} className="text-red-500">
                    Remove from Dock
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>
      </div>
    </>
  );
};