import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WindowState, MacOSSettings, DockItem, AppConfig } from '@/types/macos';

interface MacOSContextType {
  windows: WindowState[];
  settings: MacOSSettings;
  dockItems: DockItem[];
  focusedWindowId: string | null;
  launchpadOpen: boolean;
  setLaunchpadOpen: (open: boolean) => void;
  openApp: (appId: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  minimizeAllWindows: () => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => void;
  updateWindowSize: (windowId: string, size: { width: number; height: number }) => void;
  updateSettings: (settings: Partial<MacOSSettings>) => void;
  reorderDock: (fromIndex: number, toIndex: number) => void;
  removeFromDock: (appId: string) => void;
  addToDock: (appId: string) => void;
  apps: AppConfig[];
}

const MacOSContext = createContext<MacOSContextType | undefined>(undefined);

const DEFAULT_SETTINGS: MacOSSettings = {
  wallpaper: 'wallpaper-2',
  theme: 'dark',
  dockAutoHide: false,
  dockMagnification: 75,
  reducedMotion: false,
};

export const MacOSProvider = ({ children, apps }: { children: ReactNode; apps: AppConfig[] }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [settings, setSettings] = useState<MacOSSettings>(() => {
    const saved = localStorage.getItem('macos-settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });
  const DEFAULT_DOCK = apps.map(app => app.id);
  const [dockOrder, setDockOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('thanasos-dock-order');
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        // keep only known apps; append any new apps that aren't yet in saved order
        const filtered = parsed.filter(id => apps.some(a => a.id === id));
        const missing = DEFAULT_DOCK.filter(id => !filtered.includes(id));
        return [...filtered, ...missing];
      }
    } catch {}
    return DEFAULT_DOCK;
  });
  const dockItems: DockItem[] = dockOrder.map(id => ({ appId: id }));
  const [launchpadOpen, setLaunchpadOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('thanasos-dock-order', JSON.stringify(dockOrder));
  }, [dockOrder]);

  const reorderDock = (fromIndex: number, toIndex: number) => {
    setDockOrder(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const removeFromDock = (appId: string) => {
    setDockOrder(prev => prev.filter(id => id !== appId));
  };

  const addToDock = (appId: string) => {
    setDockOrder(prev => prev.includes(appId) ? prev : [...prev, appId]);
  };

  useEffect(() => {
    localStorage.setItem('macos-settings', JSON.stringify(settings));
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings]);

  const openApp = (appId: string) => {
    if (appId === 'launchpad') {
      setLaunchpadOpen(true);
      return;
    }
    const existingWindow = windows.find(w => w.appId === appId && !w.isMinimized);
    if (existingWindow) {
      // If window is already open and focused, minimize it
      minimizeWindow(existingWindow.id);
      return;
    }

    const minimizedWindow = windows.find(w => w.appId === appId && w.isMinimized);
    if (minimizedWindow) {
      setWindows(prev =>
        prev.map(w => (w.id === minimizedWindow.id ? { ...w, isMinimized: false } : w))
      );
      focusWindow(minimizedWindow.id);
      return;
    }

    const app = apps.find(a => a.id === appId);
    if (!app) return;

    // Calculate available space (menu bar height = 28px, dock height ≈ 100px)
    const menuBarHeight = 28;
    const dockHeight = 100;
    const availableHeight = window.innerHeight - menuBarHeight - dockHeight;
    const defaultHeight = app.defaultSize?.height || 600;
    const defaultWidth = app.defaultSize?.width || 800;
    
    // Ensure window fits in available space above dock
    const maxHeight = Math.min(defaultHeight, availableHeight - 20);
    
    // Center window in available space above dock
    const centerY = menuBarHeight + (availableHeight - maxHeight) / 2 + Math.random() * 30;
    
    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      position: {
        x: window.innerWidth / 2 - defaultWidth / 2 + Math.random() * 50,
        y: Math.max(menuBarHeight + 10, centerY),
      },
      size: { width: defaultWidth, height: maxHeight },
      isMinimized: false,
      isMaximized: false,
      zIndex: Math.max(...windows.map(w => w.zIndex), 0) + 1,
    };

    setWindows(prev => [...prev, newWindow]);
    setFocusedWindowId(newWindow.id);
  };

  const closeWindow = (windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
    if (focusedWindowId === windowId) {
      const remaining = windows.filter(w => w.id !== windowId);
      setFocusedWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const minimizeWindow = (windowId: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === windowId ? { ...w, isMinimized: true } : w))
    );
  };

  const minimizeAllWindows = () => {
    setWindows(prev =>
      prev.map(w => ({ ...w, isMinimized: true }))
    );
    setFocusedWindowId(null);
  };

  const maximizeWindow = (windowId: string) => {
    setWindows(prev =>
      prev.map(w => {
        if (w.id !== windowId) return w;
        
        if (w.isMaximized) {
          // Un-maximize: restore previous position and size
          return {
            ...w,
            isMaximized: false,
            position: w.preMaximizePosition || w.position,
            size: w.preMaximizeSize || w.size,
            preMaximizePosition: undefined,
            preMaximizeSize: undefined,
          };
        } else {
          // Maximize: store current position/size and go fullscreen
          // If dock is auto-hide, use full height; otherwise leave space for dock
          const maxHeight = settings.dockAutoHide 
            ? window.innerHeight - 28 
            : window.innerHeight - 28 - 100;
          
          return {
            ...w,
            isMaximized: true,
            preMaximizePosition: w.position,
            preMaximizeSize: w.size,
            position: { x: 0, y: 28 },
            size: { width: window.innerWidth, height: maxHeight },
          };
        }
      })
    );
  };

  const focusWindow = (windowId: string) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex), 0);
    setWindows(prev =>
      prev.map(w => (w.id === windowId ? { ...w, zIndex: maxZ + 1 } : w))
    );
    setFocusedWindowId(windowId);
  };

  const updateWindowPosition = (windowId: string, position: { x: number; y: number }) => {
    setWindows(prev =>
      prev.map(w => (w.id === windowId ? { ...w, position } : w))
    );
  };

  const updateWindowSize = (windowId: string, size: { width: number; height: number }) => {
    setWindows(prev =>
      prev.map(w => (w.id === windowId ? { ...w, size } : w))
    );
  };

  const updateSettings = (newSettings: Partial<MacOSSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <MacOSContext.Provider
      value={{
        windows,
        settings,
        dockItems,
        focusedWindowId,
        launchpadOpen,
        setLaunchpadOpen,
        openApp,
        closeWindow,
        minimizeWindow,
        minimizeAllWindows,
        maximizeWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
        updateSettings,
        reorderDock,
        removeFromDock,
        addToDock,
        apps,
      }}
    >
      {children}
    </MacOSContext.Provider>
  );
};

export const useMacOS = () => {
  const context = useContext(MacOSContext);
  if (!context) throw new Error('useMacOS must be used within MacOSProvider');
  return context;
};
