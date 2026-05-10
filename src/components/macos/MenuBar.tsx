import { useState, useEffect, useRef, useMemo, useSyncExternalStore } from 'react';
import { Wifi, Battery, Volume2, Search, SlidersHorizontal } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import turtleLogo from '@/assets/turtle-logo.png';
import { ShortcutsModal } from './ShortcutsModal';
import { HelpModal } from './HelpModal';
import { ControlCenter } from './ControlCenter';
import { getAppMenus, subscribeMenuRegistry, MenuItem, AppMenus } from '@/types/macos';

interface MenuBarProps {
  onSpotlightClick?: () => void;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export const MenuBar = ({ onSpotlightClick }: MenuBarProps) => {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [appleOpen, setAppleOpen] = useState(false);
  const [ccOpen, setCcOpen] = useState(false);
  const [loader, setLoader] = useState<null | { label: string }>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { focusedWindowId, apps, windows, minimizeAllWindows, openApp, closeWindow, focusWindow, settings } = useMacOS();
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Force re-renders when app menus get registered/unregistered
  useSyncExternalStore(subscribeMenuRegistry, () => Object.keys(getAppMenus('') ?? {}).length + Math.random(), () => 0);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const focusedWindow = windows.find(w => w.id === focusedWindowId && !w.isMinimized);
  const focusedApp = focusedWindow ? apps.find(a => a.id === focusedWindow.appId) : null;
  const appName = focusedApp?.name || 'Finder';
  const customMenus: AppMenus | undefined = focusedApp ? getAppMenus(focusedApp.id) : undefined;

  const triggerLoader = (label: string) => {
    setLoader({ label });
    setAppleOpen(false);
    setActiveMenu(null);
    setTimeout(() => {
      if (label === 'Restart…' || label === 'Shut Down…') {
        windows.forEach(w => closeWindow(w.id));
      }
      setLoader(null);
    }, 3500);
  };

  const appleMenu: MenuItem[] = [
    { label: 'About This Mac', action: () => { openApp('about'); setAppleOpen(false); } },
    { separator: true },
    { label: 'System Settings…', action: () => { openApp('settings'); setAppleOpen(false); } },
    { label: 'Control Panel…', action: () => { openApp('controlpanel'); setAppleOpen(false); } },
    { label: 'App Store…', action: () => { openApp('appstore'); setAppleOpen(false); } },
    { separator: true },
    { label: 'Force Quit All', shortcut: '⌥⌘⎋', action: () => { windows.forEach(w => closeWindow(w.id)); setAppleOpen(false); } },
    { separator: true },
    { label: 'Sleep', action: () => triggerLoader('Sleep') },
    { label: 'Restart…', action: () => triggerLoader('Restart…') },
    { label: 'Shut Down…', action: () => triggerLoader('Shut Down…') },
    { separator: true },
    { label: 'Lock Screen', shortcut: '⌃⌘Q', action: () => triggerLoader('Lock Screen') },
  ];

  const focusActive = focusedWindow;

  const menus: MenuGroup[] = useMemo(() => {
    const defaultFile: MenuItem[] = [
      { label: 'New Launchpad', shortcut: '⌘N', action: () => openApp('launchpad') },
      { separator: true },
      { label: 'Close Window', shortcut: '⌘W', action: () => focusActive && closeWindow(focusActive.id) },
      { label: 'Minimize', shortcut: '⌘M', action: () => focusActive && minimizeAllWindows() },
      { separator: true },
      { label: 'Print…', shortcut: '⌘P', action: () => window.print() },
    ];
    const defaultEdit: MenuItem[] = [
      { label: 'Undo', shortcut: '⌘Z', action: () => document.execCommand('undo') },
      { label: 'Redo', shortcut: '⇧⌘Z', action: () => document.execCommand('redo') },
      { separator: true },
      { label: 'Cut', shortcut: '⌘X', action: () => document.execCommand('cut') },
      { label: 'Copy', shortcut: '⌘C', action: () => document.execCommand('copy') },
      { label: 'Paste', shortcut: '⌘V', action: () => document.execCommand('paste') },
      { label: 'Select All', shortcut: '⌘A', action: () => document.execCommand('selectAll') },
    ];
    const defaultView: MenuItem[] = [
      { label: 'Show Desktop', action: () => minimizeAllWindows() },
      { label: 'Open Spotlight', shortcut: '⌘K', action: () => onSpotlightClick?.() },
    ];
    const defaultWindow: MenuItem[] = windows.length === 0
      ? [{ label: 'No Windows Open' }]
      : [
          { label: 'Minimize All', shortcut: '⌘M', action: () => minimizeAllWindows() },
          { separator: true },
          ...windows.map(w => {
            const a = apps.find(app => app.id === w.appId);
            return { label: a?.name || w.appId, action: () => focusWindow(w.id) };
          }),
        ];
    const helpMenu: MenuItem[] = [
      { label: 'ThanasOS Help', action: () => setHelpOpen(true) },
      { label: 'Keyboard Shortcuts', action: () => setShortcutsOpen(true) },
      { separator: true },
      { label: 'Contact Me…', action: () => openApp('contact') },
    ];

    return [
      { label: appName, items: [
        { label: `About ${appName}`, action: () => openApp('about') },
        { separator: true },
        { label: `Hide ${appName}`, shortcut: '⌘H', action: () => focusActive && closeWindow(focusActive.id) },
        { separator: true },
        { label: `Quit ${appName}`, shortcut: '⌘Q', action: () => focusActive && closeWindow(focusActive.id) },
      ]},
      { label: 'File', items: customMenus?.File ?? defaultFile },
      { label: 'Edit', items: customMenus?.Edit ?? defaultEdit },
      { label: 'View', items: customMenus?.View ?? defaultView },
      { label: 'Window', items: customMenus?.Window ?? defaultWindow },
      { label: 'Help', items: helpMenu },
    ];
  }, [appName, focusActive, windows, apps, openApp, closeWindow, minimizeAllWindows, focusWindow, onSpotlightClick, customMenus]);

  useEffect(() => {
    if (!activeMenu && !appleOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!menuBarRef.current?.contains(e.target as Node)) {
        setActiveMenu(null);
        setAppleOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [activeMenu, appleOpen]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });

  const renderDropdown = (items: MenuItem[]) => (
    <div
      className="absolute top-7 left-0 mt-1 min-w-[240px] rounded-2xl py-1.5 z-[100] liquid-glass-card text-white text-[13px] shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((it, i) =>
        it.separator ? (
          <div key={i} className="h-px bg-white/10 my-1 mx-2" />
        ) : (
          <button
            key={i}
            disabled={!it.action}
            onClick={() => { it.action?.(); setActiveMenu(null); setAppleOpen(false); }}
            className={`flex items-center justify-between px-3 py-1.5 text-left rounded-md mx-1 ${it.action ? 'hover:bg-blue-500/80 hover:text-white' : 'opacity-50 cursor-default'}`}
            style={{ width: 'calc(100% - 8px)' }}
          >
            <span>{it.label}</span>
            {it.shortcut && <span className="text-white/55 ml-6 text-xs">{it.shortcut}</span>}
          </button>
        )
      )}
    </div>
  );

  return (
    <>
      <div
        ref={menuBarRef}
        className="fixed top-0 left-0 right-0 h-7 liquid-glass-dark flex items-center justify-between px-3 z-50 text-[13px] text-white"
      >
        <div className="flex items-center gap-1 relative">
          {/* Apple/turtle menu — own state, isolated */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveMenu(null); setAppleOpen(o => !o); }}
              className={`px-2 py-0.5 rounded hover:bg-white/15 ${appleOpen ? 'bg-white/20' : ''}`}
            >
              <img src={turtleLogo} alt="Logo" className="h-4 w-auto object-contain" />
            </button>
            {appleOpen && renderDropdown(appleMenu)}
          </div>

          {menus.map((m, idx) => (
            <div key={m.label} className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setAppleOpen(false); setActiveMenu(activeMenu === m.label ? null : m.label); }}
                onMouseEnter={() => activeMenu && setActiveMenu(m.label)}
                className={`px-2.5 py-0.5 rounded hover:bg-white/15 ${
                  idx === 0 ? 'font-semibold' : ''
                } ${activeMenu === m.label ? 'bg-white/20' : ''}`}
              >
                {m.label}
              </button>
              {activeMenu === m.label && renderDropdown(m.items)}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 hover:bg-white/15 rounded"><Battery className="w-4 h-4" /></button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3 z-[200]">
              <div className="text-sm font-medium">Battery 87%</div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }} />
              </div>
            </PopoverContent>
          </Popover>
          <button className={`p-1 hover:bg-white/15 rounded ${settings.wifi ? '' : 'opacity-50'}`}><Wifi className="w-4 h-4" /></button>
          <button className="p-1 hover:bg-white/15 rounded"><Volume2 className="w-4 h-4" /></button>
          <button onClick={onSpotlightClick} className="p-1 hover:bg-white/15 rounded" title="Spotlight (⌘K)">
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCcOpen(o => !o)}
            className={`p-1 hover:bg-white/15 rounded ${ccOpen ? 'bg-white/20' : ''}`}
            title="Control Center"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 hover:bg-white/15 rounded">
                <span className="font-medium">{formatTime(time)}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4 z-[200] text-center">
              <div className="text-3xl font-bold">
                {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <ControlCenter open={ccOpen} onClose={() => setCcOpen(false)} />

      {loader && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
          <img src={turtleLogo} alt="ThanasOS" className="w-32 h-32 object-contain opacity-90" />
          <div className="mt-10 w-[400px] max-w-[85vw] h-1 rounded bg-white/20 overflow-hidden turtle-progress" />
          <div className="mt-6 text-white/60 text-xs uppercase tracking-widest">{loader.label}</div>
        </div>
      )}

      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
};
