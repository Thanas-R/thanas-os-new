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
    settings,
  } = useMacOS();

  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

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
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.posX;
        let newY = resizeStart.posY;

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(app.minSize?.width || 400, resizeStart.width + deltaX);
        }
        if (resizeDirection.includes('w')) {
          newWidth = Math.max(app.minSize?.width || 400, resizeStart.width - deltaX);
          if (newWidth > (app.minSize?.width || 400)) {
            newX = resizeStart.posX + deltaX;
          }
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(app.minSize?.height || 300, resizeStart.height + deltaY);
        }
        if (resizeDirection.includes('n')) {
          newHeight = Math.max(app.minSize?.height || 300, resizeStart.height - deltaY);
          if (newHeight > (app.minSize?.height || 300)) {
            newY = Math.max(28, resizeStart.posY + deltaY); // Prevent going above menu bar
          }
        }

        updateWindowSize(window.id, { width: newWidth, height: newHeight });
        if (newX !== resizeStart.posX || newY !== resizeStart.posY) {
          updateWindowPosition(window.id, { x: newX, y: newY });
        }
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
      className={`absolute backdrop-blur-macos-heavy rounded-2xl shadow-macos-window overflow-hidden ${settings.reducedMotion ? '' : 'animate-fade-in'}`}
      style={{
        left: window.isMaximized ? 0 : window.position.x,
        top: window.isMaximized ? 28 : window.position.y,
        width: window.isMaximized ? '100vw' : window.size.width,
        height: window.isMaximized ? 'calc(100vh - 28px - 80px)' : window.size.height,
        zIndex: window.zIndex,
        background: 'hsl(var(--macos-glass))',
        border: '1px solid hsl(var(--macos-glass-border))',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 1px rgba(255, 255, 255, 0.15) inset',
      }}
      onMouseDown={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-4 h-10 cursor-move select-none backdrop-blur-md"
        style={{ 
          background: 'hsl(var(--macos-window-bg))',
          borderBottom: '1px solid hsl(var(--macos-glass-border))'
        }}
        onMouseDown={(e) => {
          if (!window.isMaximized) {
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
          }
        }}
      >
        {/* Traffic Lights */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(window.id);
            }}
            className={`w-3 h-3 rounded-full flex items-center justify-center group ${settings.reducedMotion ? '' : 'transition-all hover:scale-110'}`}
            style={{ background: isFocused ? '#FF5F57' : '#555' }}
            aria-label="Close"
          >
            {isFocused && <X className={`w-2 h-2 text-[#9f0000] opacity-0 group-hover:opacity-100 ${settings.reducedMotion ? '' : 'transition-opacity'}`} strokeWidth={2.5} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(window.id);
            }}
            className={`w-3 h-3 rounded-full flex items-center justify-center group ${settings.reducedMotion ? '' : 'transition-all hover:scale-110'}`}
            style={{ background: isFocused ? '#FFBD2E' : '#555' }}
            aria-label="Minimize"
          >
            {isFocused && <Minus className={`w-2 h-2 text-[#995700] opacity-0 group-hover:opacity-100 ${settings.reducedMotion ? '' : 'transition-opacity'}`} strokeWidth={2.5} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(window.id);
            }}
            className={`w-3 h-3 rounded-full flex items-center justify-center group ${settings.reducedMotion ? '' : 'transition-all hover:scale-110'}`}
            style={{ background: isFocused ? '#28C840' : '#555' }}
            aria-label="Maximize"
          >
            {isFocused && <Square className={`w-2 h-2 text-[#006400] opacity-0 group-hover:opacity-100 ${settings.reducedMotion ? '' : 'transition-opacity'}`} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-foreground">
          {app.name}
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-2.5rem)] overflow-auto backdrop-blur-sm" style={{ background: 'hsl(var(--macos-window-bg))' }}>
        <AppComponent />
      </div>

      {/* Resize Handles - All Edges */}
      {!window.isMaximized && (
        <>
          {/* Top */}
          <div
            className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setResizeDirection('n');
              setResizeStart({
                x: e.clientX,
                y: e.clientY,
                width: window.size.width,
                height: window.size.height,
                posX: window.position.x,
                posY: window.position.y,
              });
            }}
          />
          {/* Bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setResizeDirection('s');
              setResizeStart({
                x: e.clientX,
                y: e.clientY,
                width: window.size.width,
                height: window.size.height,
                posX: window.position.x,
                posY: window.position.y,
              });
            }}
          />
          {/* Left */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1 cursor-ew-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setResizeDirection('w');
              setResizeStart({
                x: e.clientX,
                y: e.clientY,
                width: window.size.width,
                height: window.size.height,
                posX: window.position.x,
                posY: window.position.y,
              });
            }}
          />
          {/* Right */}
          <div
            className="absolute top-0 bottom-0 right-0 w-1 cursor-ew-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setResizeDirection('e');
              setResizeStart({
                x: e.clientX,
                y: e.clientY,
                width: window.size.width,
                height: window.size.height,
                posX: window.position.x,
                posY: window.position.y,
              });
            }}
          />
          {/* Top-left corner */}
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setResizeDirection('nw');
              setResizeStart({
                x: e.clientX,
                y: e.clientY,
                width: window.size.width,
                height: window.size.height,
                posX: window.position.x,
                posY: window.position.y,
              });
            }}
          />
          {/* Top-right corner */}
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setResizeDirection('ne');
              setResizeStart({
                x: e.clientX,
                y: e.clientY,
                width: window.size.width,
                height: window.size.height,
                posX: window.position.x,
                posY: window.position.y,
              });
            }}
          />
          {/* Bottom-left corner */}
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setResizeDirection('sw');
              setResizeStart({
                x: e.clientX,
                y: e.clientY,
                width: window.size.width,
                height: window.size.height,
                posX: window.position.x,
                posY: window.position.y,
              });
            }}
          />
          {/* Bottom-right corner */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setResizeDirection('se');
              setResizeStart({
                x: e.clientX,
                y: e.clientY,
                width: window.size.width,
                height: window.size.height,
                posX: window.position.x,
                posY: window.position.y,
              });
            }}
          />
        </>
      )}
    </div>
  );
};
