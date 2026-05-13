import { useState, useRef, useCallback, useEffect } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import { APP_ICONS as iconMap } from '@/components/apps/LaunchpadApp';
import { setDockOrder, trashApp, PROTECTED_APPS, useTrashed } from '@/lib/dock';
import trashIcon from '@/assets/trash-icon.png';

export const Dock = () => {
  const { apps, dockItems, openApp, windows, settings } = useMacOS();
  const trashed = useTrashed();
  const [isDockVisible, setIsDockVisible] = useState(!settings.dockAutoHide);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [currentScales, setCurrentScales] = useState<number[]>([]);
  const [currentPositions, setCurrentPositions] = useState<number[]>([]);
  const dockRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMouseMoveTime = useRef<number>(0);

  // drag state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [trashHover, setTrashHover] = useState(false);

  const getResponsiveConfig = useCallback(() => {
    if (typeof window === 'undefined') return { baseSize: 64, maxScale: 1.6, effectWidth: 240 };
    const s = Math.min(window.innerWidth, window.innerHeight);
    if (s < 480) return { baseSize: Math.max(40, s * 0.08) * 0.95, maxScale: 1.4, effectWidth: s * 0.4 };
    if (s < 768) return { baseSize: Math.max(48, s * 0.07) * 0.95, maxScale: 1.5, effectWidth: s * 0.35 };
    if (s < 1024) return { baseSize: Math.max(56, s * 0.06) * 0.95, maxScale: 1.6, effectWidth: s * 0.3 };
    return { baseSize: Math.max(64, Math.min(80, s * 0.05)) * 0.95, maxScale: 1.8, effectWidth: 300 };
  }, []);

  const [config, setConfig] = useState(getResponsiveConfig);
  const { baseSize, maxScale, effectWidth } = config;
  const minScale = 1.0;
  const baseSpacing = Math.max(8, baseSize * 0.18);

  useEffect(() => {
    const h = () => setConfig(getResponsiveConfig());
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [getResponsiveConfig]);

  const calculateTargetMagnification = useCallback((mp: number | null) => {
    if (mp === null || draggingId) return dockItems.map(() => minScale);
    return dockItems.map((_, i) => {
      const c = (i * (baseSize + baseSpacing)) + (baseSize / 2);
      const mn = mp - effectWidth / 2;
      const mx = mp + effectWidth / 2;
      if (c < mn || c > mx) return minScale;
      const theta = ((c - mn) / effectWidth) * 2 * Math.PI;
      const f = (1 - Math.cos(Math.min(Math.max(theta, 0), 2 * Math.PI))) / 2;
      return minScale + f * (maxScale - minScale);
    });
  }, [dockItems, baseSize, baseSpacing, effectWidth, maxScale, draggingId]);

  const calculatePositions = useCallback((scales: number[]) => {
    let x = 0;
    return scales.map(s => {
      const w = baseSize * s;
      const c = x + w / 2;
      x += w + baseSpacing;
      return c;
    });
  }, [baseSize, baseSpacing]);

  useEffect(() => {
    const init = dockItems.map(() => minScale);
    setCurrentScales(init);
    setCurrentPositions(calculatePositions(init));
  }, [dockItems.length, calculatePositions, config]);

  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const targetPositions = calculatePositions(targetScales);
    const lerp = settings.reducedMotion ? 1 : (mouseX !== null ? 0.2 : 0.12);
    setCurrentScales(prev => prev.map((c, i) => Math.max(minScale, Math.min(maxScale, c + (targetScales[i] - c) * lerp))));
    setCurrentPositions(prev => prev.map((c, i) => c + (targetPositions[i] - c) * lerp));
    const need = currentScales.some((s, i) => Math.abs(s - targetScales[i]) > 0.005) ||
                 currentPositions.some((p, i) => Math.abs(p - targetPositions[i]) > 0.2) || mouseX !== null;
    if (need) animationFrameRef.current = requestAnimationFrame(animateToTarget);
  }, [mouseX, calculateTargetMagnification, calculatePositions, currentScales, currentPositions, settings.reducedMotion, maxScale]);

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
      const pad = Math.max(8, baseSize * 0.12);
      setMouseX(e.clientX - rect.left - pad);
    }
  }, [baseSize, settings.reducedMotion]);

  const handleAppClick = (appId: string) => {
    if (draggingId) return;
    openApp(appId);
  };

  // Drag handlers
  const onDragStart = (e: React.DragEvent, appId: string) => {
    setDraggingId(appId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/x-thanasos-app', appId);
  };
  const onDragOverIcon = (e: React.DragEvent, idx: number) => {
    if (!draggingId) return;
    e.preventDefault();
    setDragOverIndex(idx);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingId) return;
    if (trashHover && !PROTECTED_APPS.has(draggingId)) {
      trashApp(draggingId);
    } else if (dragOverIndex !== null) {
      const ids = dockItems.map(d => d.appId);
      const fromIdx = ids.indexOf(draggingId);
      if (fromIdx >= 0) {
        ids.splice(fromIdx, 1);
        const insertAt = dragOverIndex > fromIdx ? dragOverIndex - 1 : dragOverIndex;
        ids.splice(insertAt, 0, draggingId);
        setDockOrder(ids);
      }
    }
    setDraggingId(null);
    setDragOverIndex(null);
    setTrashHover(false);
  };
  const onDragEnd = () => { setDraggingId(null); setDragOverIndex(null); setTrashHover(false); };

  const baseContentWidth = currentPositions.length > 0
    ? Math.max(...currentPositions.map((p, i) => p + (baseSize * currentScales[i]) / 2))
    : (dockItems.length * (baseSize + baseSpacing)) - baseSpacing;

  const separatorGap = baseSpacing * 1.5;
  const separatorWidth = 1;
  const trashSize = baseSize;
  const contentWidth = baseContentWidth + separatorGap + separatorWidth + separatorGap + trashSize;
  const padding = Math.max(8, baseSize * 0.12);
  const trashCount = trashed.length;

  return (
    <>
      {settings.dockAutoHide && (
        <div className="fixed bottom-0 left-0 right-0 w-full h-24 z-40" onMouseEnter={() => setIsDockVisible(true)} />
      )}

      <div
        ref={dockRef}
        className={`fixed bottom-2 left-1/2 -translate-x-1/2 backdrop-blur-macos-heavy rounded-3xl shadow-macos-glass z-[70] ${
          settings.reducedMotion ? '' : 'transition-all duration-500 ease-out'
        } ${(settings.dockAutoHide && !isDockVisible) ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
        style={{
          width: `${contentWidth + padding * 2}px`,
          background: 'rgba(45,45,45,0.2)',
          borderRadius: `${Math.max(12, baseSize * 0.4)}px`,
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: `0 ${Math.max(4, baseSize * 0.1)}px ${Math.max(16, baseSize * 0.4)}px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)`,
          padding: `${padding}px`,
          overflow: 'visible',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { if (settings.dockAutoHide) setIsDockVisible(false); setMouseX(null); }}
        onDragOver={(e) => { if (draggingId) e.preventDefault(); }}
        onDrop={onDrop}
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
            const isDragging = draggingId === app.id;
            const showInsertBefore = draggingId && dragOverIndex === index && draggingId !== app.id;

            return (
              <div
                key={app.id}
                ref={(el) => { iconRefs.current[index] = el; }}
                draggable={!PROTECTED_APPS.has(app.id) || true}
                onDragStart={(e) => onDragStart(e, app.id)}
                onDragOver={(e) => onDragOverIcon(e, index)}
                onDragEnd={onDragEnd}
                className="absolute cursor-pointer flex flex-col items-center justify-end"
                onClick={() => handleAppClick(app.id)}
                style={{
                  left: `${position - scaledSize / 2}px`,
                  bottom: '0px',
                  width: `${scaledSize}px`,
                  height: `${scaledSize}px`,
                  transformOrigin: 'bottom center',
                  zIndex: Math.round(scale * 10),
                  opacity: isDragging ? 0.4 : 1,
                  transition: isDragging ? 'none' : undefined,
                }}
              >
                {showInsertBefore && (
                  <div className="absolute -left-1 top-2 bottom-2 w-0.5 rounded-full bg-white/80" />
                )}
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
                    <img src={iconSrc} alt={app.name} className="w-full h-full object-cover" decoding="async" loading="eager" draggable={false} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-primary/90 to-accent/90">{app.icon}</div>
                  )}
                </div>
                {isOpen && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white" />}
                {isMinimized && !isOpen && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white/50" />}
                {mouseX !== null && !draggingId && Math.abs(position - mouseX - padding) < 50 && (
                  <div className={`absolute -top-12 backdrop-blur-macos-heavy bg-[hsl(var(--macos-glass))] px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border border-[hsl(var(--macos-glass-border))] shadow-macos-glass ${settings.reducedMotion ? '' : 'animate-fade-in'}`}>
                    {app.name}
                  </div>
                )}
              </div>
            );
          })}

          {/* Separator */}
          <div className="absolute" style={{
            left: `${baseContentWidth + separatorGap}px`,
            bottom: `${baseSize * 0.1}px`,
            width: `${separatorWidth}px`,
            height: `${baseSize * 0.8}px`,
            background: 'rgba(255,255,255,0.18)',
            borderRadius: 1,
          }} />

          {/* Trash — drop target + click opens Finder Trash */}
          <div
            ref={trashRef}
            onClick={() => {
              if (draggingId) return;
              window.dispatchEvent(new CustomEvent('finder:open-trash'));
              openApp('finder');
            }}
            onDragOver={(e) => { if (draggingId) { e.preventDefault(); setTrashHover(true); } }}
            onDragLeave={() => setTrashHover(false)}
            className="absolute cursor-pointer flex items-end justify-center"
            title={`Trash${trashCount ? ` (${trashCount})` : ''}`}
            style={{
              left: `${baseContentWidth + separatorGap + separatorWidth + separatorGap}px`,
              bottom: 0,
              width: `${baseSize}px`,
              height: `${baseSize}px`,
              transform: trashHover ? 'scale(1.18)' : 'scale(1)',
              transition: 'transform 180ms cubic-bezier(0.2,0.7,0.2,1)',
            }}
          >
            <div className="flex items-center justify-center overflow-hidden" style={{
              width: baseSize, height: baseSize,
              borderRadius: `${Math.max(12, baseSize * 0.225)}px`,
              filter: `drop-shadow(0 ${Math.max(1, baseSize * 0.03)}px ${Math.max(2, baseSize * 0.06)}px rgba(0,0,0,0.3))`,
            }}>
              <img src={trashIcon} alt="Trash" className="w-full h-full object-contain" draggable={false} />
            </div>
            {trashCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                {trashCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
