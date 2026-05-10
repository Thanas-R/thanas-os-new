export interface MenuItem {
  label?: string;
  shortcut?: string;
  action?: () => void;
  separator?: boolean;
}

export interface AppMenus {
  File?: MenuItem[];
  Edit?: MenuItem[];
  View?: MenuItem[];
  Window?: MenuItem[];
}

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
  customWallpaper?: string; // data URL
  theme: 'light' | 'dark';
  dockAutoHide: boolean;
  dockMagnification: number;
  reducedMotion: boolean;
  brightness?: number;
  volume?: number;
  wifi?: boolean;
  bluetooth?: boolean;
  airdrop?: boolean;
  focus?: boolean;
  doNotDisturb?: boolean;
  defaultBrowser?: 'safari' | 'google';
  googleInstalled?: boolean;
}

export interface DockItem {
  appId: string;
  badge?: number;
}

// Cross-app menu registry — apps publish their menus here, MenuBar reads them.
type MenuRegistry = Record<string, AppMenus>;
const registry: MenuRegistry = {};
const subs = new Set<() => void>();

export const registerAppMenus = (appId: string, menus: AppMenus | null) => {
  if (menus) registry[appId] = menus;
  else delete registry[appId];
  subs.forEach(fn => fn());
};
export const getAppMenus = (appId: string): AppMenus | undefined => registry[appId];
export const subscribeMenuRegistry = (fn: () => void) => {
  subs.add(fn);
  return () => { subs.delete(fn); };
};
