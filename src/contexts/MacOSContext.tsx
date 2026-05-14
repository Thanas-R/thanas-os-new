import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { WindowState, MacOSSettings, DockItem, AppConfig } from '@/types/macos';
import { useGoogleInstalled } from '@/lib/installedApps';

interface MacOSContextType {
  windows: WindowState[];
  settings: MacOSSettings;
  dockItems: DockItem[];
  focusedWindowId: string | null;
  openApp: (appId: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  minimizeAllWindows: () => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => void;
  updateWindowSize: (windowId: string, size: { width: number; height: number }) => void;
  updateSettings: (settings: Partial<MacOSSettings>) => void;
  openUrl: (url: string) => void;
  apps: AppConfig[];
}

const MacOSContext = createContext<MacOSContextType | undefined>(undefined);

const DEFAULT_SETTINGS: MacOSSettings = {
  wallpaper: 'wallpaper-mountain',
  theme: 'dark',
  dockAutoHide: false,
  dockMagnification: 75,
  reducedMotion: false,
  brightness: 80,
  volume: 65,
  wifi: true,
  bluetooth: true,
  airdrop: true,
  focus: false,
};

export const MacOSProvider = ({ children, apps }: { children: ReactNode; apps: AppConfig[] }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const [settings, setSettings] = useState<MacOSSettings>(() => {
    const saved = localStorage.getItem('macos-settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });
  const googleInstalled = useGoogleInstalled();
  const dockItems: DockItem[] = useMemo(() => {
    const out: DockItem[] = [];
    apps.forEach(a => {
      if (a.id === 'google' && !googleInstalled) return;
      out.push({ appId: a.id });
    });
    return out;
  }, [apps, googleInstalled]);

  useEffect(() => {
    localStorage.setItem('macos-settings', JSON.stringify(settings));
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings]);

  const openApp = (appId: string) => {
    if (appId !== 'launchpad') {
      const lp = windows.find(w => w.appId === 'launchpad' && !w.isMinimized);
      if (lp) {
        setWindows(prev => prev.filter(w => w.id !== lp.id));
      }
    }

    const existingWindow = windows.find(w => w.appId === appId && !w.isMinimized);
    if (existingWindow) {
      // Launchpad: clicking dock icon again closes it
      if (appId === 'launchpad') {
        closeWindow(existingWindow.id);
        return;
      }
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

    const menuBarHeight = 28;
    const dockHeight = 100;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const availableHeight = vh - menuBarHeight - dockHeight;
    const availableWidth = vw - 40;

    // Cap the default size so windows don't overflow the usable area
    const requestedW = app.defaultSize?.width || 800;
    const requestedH = app.defaultSize?.height || 600;
    const width = Math.min(requestedW, Math.max(420, availableWidth - 40));
    const height = Math.min(requestedH, Math.max(360, availableHeight - 20));

    // Center near (slightly above) the middle, with mild jitter so stacks fan out
    const jitterX = (Math.random() - 0.5) * 40;
    const jitterY = (Math.random() - 0.5) * 24;
    const x = Math.max(10, Math.min(vw - width - 10, (vw - width) / 2 + jitterX));
    const y = Math.max(menuBarHeight + 10, Math.min(vh - dockHeight - height - 10, menuBarHeight + (availableHeight - height) / 2 + jitterY));

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      position: { x, y },
      size: { width, height },
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
            : window.innerHeight - 28 - 86;
          
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

  const openUrl = (url: string) => {
    // route through default browser
    import('@/lib/installedApps').then(m => m.setPendingSafariUrl(url));
    const browser = settings.defaultBrowser === 'google' && settings.googleInstalled ? 'google' : 'safari';
    openApp(browser);
  };

  return (
    <MacOSContext.Provider
      value={{
        windows,
        settings,
        dockItems,
        focusedWindowId,
        openApp,
        closeWindow,
        minimizeWindow,
        minimizeAllWindows,
        maximizeWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
        updateSettings,
        openUrl,
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
