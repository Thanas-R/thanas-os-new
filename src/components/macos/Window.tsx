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
  const AppComponent = app?.component;
  const isFocused = focusedWindowId === window.id;

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const newX = Math.max(0, Math.min(globalThis.window.innerWidth - window.size.width, window.position.x + deltaX));
        // Always allow dragging to bottom
        const newY = Math.max(28, Math.min(globalThis.window.innerHeight - window.size.height - 2, window.position.y + deltaY));
        updateWindowPosition(window.id, { x: newX, y: newY });
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
          newWidth = Math.min(newWidth, globalThis.window.innerWidth - resizeStart.posX );
        }
        if (resizeDirection.includes('w')) {
          const maxWidth = Math.min(app.minSize?.width || 400, resizeStart.width - deltaX);
          newWidth = Math.max(maxWidth, resizeStart.width - deltaX);
          if (newWidth > (app.minSize?.width || 400)) {
            newX = Math.max(0, resizeStart.posX + deltaX);
          }
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(app.minSize?.height || 300, resizeStart.height + deltaY);
          // Always allow resizing to bottom
          newHeight = Math.min(newHeight, globalThis.window.innerHeight - resizeStart.posY );
        }
        if (resizeDirection.includes('n')) {
          newHeight = Math.max(app.minSize?.height || 300, resizeStart.height - deltaY);
          if (newHeight > (app.minSize?.height || 300)) {
            newY = Math.max(28, resizeStart.posY + deltaY);
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
  }, [isDragging, isResizing, dragStart, resizeStart, resizeDirection, window, app, updateWindowPosition, updateWindowSize]);

  if (!app || !AppComponent) return null;
  if (window.isMinimized) return null;

  // Launchpad: fullscreen blurred overlay covering even the menu bar; only dock stays visible above it.
  if (window.appId === 'launchpad') {
    return (
      <div
        className="fixed inset-0"
        style={{
          zIndex: 60,
          animation: settings.reducedMotion ? undefined : 'launchpadIn 0.34s cubic-bezier(0.2,0.7,0.2,1) both',
        }}
        onMouseDown={() => focusWindow(window.id)}
        onKeyDown={(e) => { if (e.key === 'Escape') closeWindow(window.id); }}
      >
        <AppComponent />
      </div>
    );
  }

  const chromeMode = app.chromeMode ?? 'default';
  const integrated = chromeMode === 'integrated';
  const transparent = chromeMode === 'transparent';

  const TrafficLights = (
    <div
      className="flex gap-2"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
        className={`w-3 h-3 rounded-full flex items-center justify-center group ${settings.reducedMotion ? '' : 'transition-all hover:scale-110'}`}
        style={{ background: isFocused ? '#FF5F57' : '#555' }}
        aria-label="Close"
      >
        {isFocused && <X className={`w-2 h-2 text-[#9f0000] opacity-0 group-hover:opacity-100 ${settings.reducedMotion ? '' : 'transition-opacity'}`} strokeWidth={2.5} />}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.isMaximized) maximizeWindow(window.id);
          else minimizeWindow(window.id);
        }}
        className={`w-3 h-3 rounded-full flex items-center justify-center group ${settings.reducedMotion ? '' : 'transition-all hover:scale-110'}`}
        style={{ background: isFocused ? '#FFBD2E' : '#555' }}
        aria-label="Minimize"
      >
        {isFocused && <Minus className={`w-2 h-2 text-[#995700] opacity-0 group-hover:opacity-100 ${settings.reducedMotion ? '' : 'transition-opacity'}`} strokeWidth={2.5} />}
      </button>
      {app.noMaximize ? (
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: '#464B4E' }}
          aria-label="Maximize disabled"
        />
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); maximizeWindow(window.id); }}
          className={`w-3 h-3 rounded-full flex items-center justify-center group ${settings.reducedMotion ? '' : 'transition-all hover:scale-110'}`}
          style={{ background: isFocused ? '#28C840' : '#555' }}
          aria-label="Maximize"
        >
          {isFocused && <Square className={`w-2 h-2 text-[#006400] opacity-0 group-hover:opacity-100 ${settings.reducedMotion ? '' : 'transition-opacity'}`} strokeWidth={2.5} />}
        </button>
      )}
    </div>
  );

  const startDrag = (e: React.MouseEvent) => {
    if (!window.isMaximized) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Allow dragging from the top 28px row of the window when the click lands
  // on a non-interactive surface (so empty header areas in integrated apps act as drag handles).
  const handleTopRowMouseDown = (e: React.MouseEvent) => {
    if (window.isMaximized) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    if (y > 30) return;
    const x = e.clientX - rect.left;
    if (x < 80) return; // traffic-light area
    const target = e.target as HTMLElement;
    if (target.closest('button,a,input,select,textarea,label,[role="button"],[role="link"],[role="tab"],[contenteditable="true"]')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      ref={windowRef}
      className={`absolute backdrop-blur-macos-heavy rounded-2xl shadow-macos-window overflow-hidden ${settings.reducedMotion ? '' : 'animate-fade-in'}`}
      style={{
        left: window.isMaximized ? 0 : window.position.x,
        top: window.isMaximized ? 28 : window.position.y,
        right: window.isMaximized ? 0 : undefined,
        bottom: window.isMaximized ? 86 : undefined,
        width: window.isMaximized ? undefined : window.size.width,
        height: window.isMaximized ? undefined : window.size.height,
        zIndex: window.zIndex,
        background: 'hsl(var(--macos-glass))',
        border: '1px solid hsl(var(--macos-glass-border))',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 1px rgba(255, 255, 255, 0.15) inset',
      }}
      onMouseDown={(e) => { focusWindow(window.id); handleTopRowMouseDown(e); }}
    >
      {!integrated && (
        <div
          className="flex items-center justify-between px-4 h-10 cursor-move select-none backdrop-blur-md"
          style={{
            background: transparent ? (app.chromeColor || 'transparent') : 'hsl(var(--macos-window-bg))',
            borderBottom: transparent ? 'none' : '1px solid hsl(var(--macos-glass-border))',
          }}
          onMouseDown={startDrag}
        >
          {TrafficLights}
          {!transparent && (
            <div className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-foreground">
              {app.name}
            </div>
          )}
        </div>
      )}

      {integrated && (
        <div
          className="absolute top-0 left-0 z-40 cursor-move"
          style={{ width: 80, height: 28 }}
          onMouseDown={startDrag}
        >
          <div
  className="absolute"
  style={{
    top: '16px',
    left: window.appId === 'maps' ? '30px' : '14px',
  }}
>
  {TrafficLights}
</div>
        </div>
      )}

      {/* Content */}
      <div
        className={integrated ? 'h-full overflow-auto' : 'h-[calc(100%-2.5rem)] overflow-auto backdrop-blur-sm'}
        style={{ background: 'hsl(var(--macos-window-bg))' }}
      >
        <AppComponent />
      </div>

      {/* Resize Handles - All Edges */}
      {!window.isMaximized && !app.nonResizable && (
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
