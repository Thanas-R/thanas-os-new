export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType;
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
}

export interface WindowState {
  id: string;
  appId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  preMaximizePosition?: { x: number; y: number };
  preMaximizeSize?: { width: number; height: number };
}

export interface MacOSSettings {
  wallpaper: string;
  theme: 'light' | 'dark';
  dockAutoHide: boolean;
  dockMagnification: number;
  reducedMotion: boolean;
}

export interface DockItem {
  appId: string;
  badge?: number;
}
