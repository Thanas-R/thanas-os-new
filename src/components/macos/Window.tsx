import { useRef, useEffect, useState } from 'react';
import { useMacOS } from '@/contexts/MacOSContext';
import { WindowState } from '@/types/macos';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  window: WindowState;
}

export const Window = ({ window }: WindowProps) => {
  const {
    apps,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    focusedWindowId,
  } = useMacOS();

  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const app = apps.find(a => a.id === window.appId);
  if (!app) return null;

  const AppComponent = app.component;
  const isFocused = focusedWindowId === window.id;

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        updateWindowPosition(window.id, {
          x: window.position.x + deltaX,
          y: Math.max(28, window.position.y + deltaY),
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(app.minSize?.width || 400, resizeStart.width + deltaX);
        const newHeight = Math.max(app.minSize?.height || 300, resizeStart.height + deltaY);
        updateWindowSize(window.id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, window, app, updateWindowPosition, updateWindowSize]);

  if (window.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className="absolute backdrop-blur-macos rounded-xl shadow-2xl overflow-hidden animate-fade-in"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
        background: 'hsl(var(--macos-glass))',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
      onMouseDown={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-4 h-10 cursor-move select-none"
        style={{ background: 'hsl(var(--macos-window-bg))' }}
        onMouseDown={(e) => {
          setIsDragging(true);
          setDragStart({ x: e.clientX, y: e.clientY });
        }}
      >
        {/* Traffic Lights */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(window.id);
            }}
            className="w-3 h-3 rounded-full transition-transform hover:scale-110"
            style={{ background: isFocused ? 'hsl(var(--macos-traffic-red))' : 'hsl(var(--muted))' }}
            aria-label="Close"
          >
            {isFocused && <X className="w-2 h-2 text-[hsl(var(--macos-traffic-red))]" strokeWidth={3} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(window.id);
            }}
            className="w-3 h-3 rounded-full transition-transform hover:scale-110"
            style={{ background: isFocused ? 'hsl(var(--macos-traffic-yellow))' : 'hsl(var(--muted))' }}
            aria-label="Minimize"
          >
            {isFocused && <Minus className="w-2 h-2 text-[hsl(var(--macos-traffic-yellow))]" strokeWidth={3} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(window.id);
            }}
            className="w-3 h-3 rounded-full transition-transform hover:scale-110"
            style={{ background: isFocused ? 'hsl(var(--macos-traffic-green))' : 'hsl(var(--muted))' }}
            aria-label="Maximize"
          >
            {isFocused && <Square className="w-2 h-2 text-[hsl(var(--macos-traffic-green))]" strokeWidth={3} />}
          </button>
        </div>

        {/* Title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-foreground">
          {app.name}
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-2.5rem)] overflow-auto bg-[hsl(var(--macos-window-bg))]">
        <AppComponent />
      </div>

      {/* Resize Handle */}
      {!window.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsResizing(true);
            setResizeStart({
              x: e.clientX,
              y: e.clientY,
              width: window.size.width,
              height: window.size.height,
            });
          }}
        />
      )}
    </div>
  );
};
