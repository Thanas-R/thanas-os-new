import { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, Volume2, Search } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import turtleLogo from '@/assets/turtle-logo.png';

interface MenuBarProps {
  onSpotlightClick?: () => void;
}

interface MenuItem {
  label?: string;
  shortcut?: string;
  action?: () => void;
  separator?: boolean;
}

export const MenuBar = ({ onSpotlightClick }: MenuBarProps) => {
  const [time, setTime] = useState(new Date());
  const [volume, setVolume] = useState(65);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loader, setLoader] = useState<null | { label: string }>(null);
  const { focusedWindowId, apps, windows, minimizeAllWindows, openApp, closeWindow } = useMacOS();
  const menuBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const focusedWindow = windows.find(w => w.id === focusedWindowId);
  const focusedApp = focusedWindow ? apps.find(a => a.id === focusedWindow.appId) : null;
  const appName = focusedApp?.name || 'Finder';

  const triggerLoader = (label: string) => {
    setLoader({ label });
    setActiveMenu(null);
    setTimeout(() => {
      if (label === 'Restart…' || label === 'Shut Down…') {
        windows.forEach(w => closeWindow(w.id));
      }
      setLoader(null);
    }, 3500);
  };

  const appleMenu: MenuItem[] = [
    { label: 'About This Mac', action: () => { openApp('about'); setActiveMenu(null); } },
    { separator: true },
    { label: 'System Settings…', action: () => { openApp('settings'); setActiveMenu(null); } },
    { label: 'App Store…', action: () => { openApp('appstore'); setActiveMenu(null); } },
    { separator: true },
    { label: 'Force Quit…', shortcut: '⌥⌘⎋', action: () => { windows.forEach(w => closeWindow(w.id)); setActiveMenu(null); } },
    { separator: true },
    { label: 'Sleep', action: () => triggerLoader('Sleep') },
    { label: 'Restart…', action: () => triggerLoader('Restart…') },
    { label: 'Shut Down…', action: () => triggerLoader('Shut Down…') },
    { separator: true },
    { label: 'Lock Screen', shortcut: '⌃⌘Q', action: () => triggerLoader('Lock Screen') },
    { label: 'Log Out…', shortcut: '⇧⌘Q', action: () => triggerLoader('Log Out…') },
  ];

  const fileMenu: MenuItem[] = [
    { label: 'New Window', shortcut: '⌘N' },
    { label: 'New Tab', shortcut: '⌘T' },
    { separator: true },
    { label: 'Close Window', shortcut: '⇧⌘W', action: () => focusedWindow && closeWindow(focusedWindow.id) },
    { separator: true },
    { label: 'Print…', shortcut: '⌘P', action: () => window.print() },
  ];
  const editMenu: MenuItem[] = [
    { label: 'Undo', shortcut: '⌘Z', action: () => document.execCommand('undo') },
    { label: 'Redo', shortcut: '⇧⌘Z', action: () => document.execCommand('redo') },
    { separator: true },
    { label: 'Cut', shortcut: '⌘X', action: () => document.execCommand('cut') },
    { label: 'Copy', shortcut: '⌘C', action: () => document.execCommand('copy') },
    { label: 'Paste', shortcut: '⌘V', action: () => document.execCommand('paste') },
    { label: 'Select All', shortcut: '⌘A', action: () => document.execCommand('selectAll') },
  ];
  const viewMenu: MenuItem[] = [
    { label: 'Show Desktop', action: () => minimizeAllWindows() },
    { label: 'Enter Full Screen', shortcut: '⌃⌘F' },
  ];
  const windowMenu: MenuItem[] = [
    { label: 'Minimize', shortcut: '⌘M', action: () => focusedWindow && minimizeAllWindows() },
    { label: 'Bring All to Front' },
  ];
  const helpMenu: MenuItem[] = [
    { label: 'ThanasOS Help', action: () => openApp('about') },
    { label: 'Keyboard Shortcuts' },
  ];

  const menus: { label: string; items: MenuItem[] }[] = [
    { label: appName, items: appleMenu.slice(0, 4) },
    { label: 'File', items: fileMenu },
    { label: 'Edit', items: editMenu },
    { label: 'View', items: viewMenu },
    { label: 'Window', items: windowMenu },
    { label: 'Help', items: helpMenu },
  ];

  // close on outside
  useEffect(() => {
    if (!activeMenu) return;
    const onDown = (e: MouseEvent) => {
      if (!menuBarRef.current?.contains(e.target as Node)) setActiveMenu(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [activeMenu]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });

  const renderDropdown = (items: MenuItem[]) => (
    <div
      className="absolute top-7 mt-1 min-w-[240px] rounded-xl py-1.5 z-[100] liquid-glass-dark text-white text-[13px]"
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((it, i) =>
        it.separator ? (
          <div key={i} className="h-px bg-white/10 my-1 mx-2" />
        ) : (
          <button
            key={i}
            onClick={() => it.action?.()}
            className="w-full flex items-center justify-between px-3 py-1 hover:bg-blue-500 hover:text-white text-left"
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
        {/* Left */}
        <div className="flex items-center gap-1 relative">
          <button
            onClick={() => setActiveMenu(activeMenu === '__apple' ? null : '__apple')}
            className="px-2 py-0.5 rounded hover:bg-white/15"
          >
            <img src={turtleLogo} alt="Logo" className="h-4 w-auto object-contain" />
          </button>
          {activeMenu === '__apple' && <div className="left-0">{renderDropdown(appleMenu)}</div>}

          {menus.map((m, idx) => (
            <div key={m.label} className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === m.label ? null : m.label)}
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

        {/* Right */}
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 hover:bg-white/15 rounded">
                <Battery className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3 z-[200]">
              <div className="text-sm font-medium">Battery 87%</div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Power Source: Battery</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 hover:bg-white/15 rounded"><Wifi className="w-4 h-4" /></button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-3 z-[200]">
              <div className="text-sm font-medium">Wi-Fi · ThanasOS-Net</div>
              <p className="text-xs text-muted-foreground mt-1">Excellent signal</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 hover:bg-white/15 rounded"><Volume2 className="w-4 h-4" /></button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-3 z-[200]">
              <div className="flex justify-between text-xs"><span>Volume</span><span>{volume}%</span></div>
              <input
                type="range" min={0} max={100} value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full mt-2"
              />
            </PopoverContent>
          </Popover>

          <button onClick={onSpotlightClick} className="p-1 hover:bg-white/15 rounded" title="Spotlight (⌘K)">
            <Search className="w-4 h-4" />
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

      {/* Boot/restart loader overlay */}
      {loader && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
          <img src={turtleLogo} alt="ThanasOS" className="w-32 h-32 object-contain opacity-90" />
          <div className="mt-10 w-[400px] max-w-[85vw] h-1 rounded bg-white/20 overflow-hidden turtle-progress" />
          <div className="mt-6 text-white/60 text-xs uppercase tracking-widest">{loader.label}</div>
        </div>
      )}
    </>
  );
};
