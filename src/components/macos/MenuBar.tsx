import { useState, useEffect, useRef, useMemo } from 'react';
import { Volume2, Search, BatteryCharging, Zap, Plug, Clock as ClockIcon, ChevronRight } from 'lucide-react';
import { IoIosWifi } from 'react-icons/io';
import { useMacOS } from '@/contexts/MacOSContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import turtleLogo from '@/assets/turtle-logo.png';
import controlCenterIcon from '@/assets/control-center-icon.png';
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

// iOS-style battery glyph (rounded body + nub, fills horizontally)
const IOSBattery = ({ level, charging }: { level: number | null; charging: boolean }) => {
  const pct = Math.max(0, Math.min(100, level ?? 100));
  const fillColor = charging ? '#34C952' : pct <= 20 ? '#FE0E09' : '#ffffff';
  return (
    <div className="flex items-center gap-1">
      <div className="relative" style={{ width: 24, height: 12 }}>
        <div
          className="absolute inset-0 rounded-[3.5px] border border-white/70 box-border p-[1px]"
        >
          <div
            className="h-full rounded-[2px] transition-all"
            style={{ width: `${pct}%`, background: fillColor }}
          />
        </div>
        {/* nub */}
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            right: -2.5, width: 1.5, height: 5,
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 1,
          }}
        />
        {charging && (
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 text-white/70" />
        )}
      </div>
    </div>
  );
};

export const MenuBar = ({ onSpotlightClick }: MenuBarProps) => {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [appleOpen, setAppleOpen] = useState(false);
  const [ccOpen, setCcOpen] = useState(false);
  const [loader, setLoader] = useState<null | { label: string }>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState(false);
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const { focusedWindowId, apps, windows, minimizeAllWindows, openApp, closeWindow, focusWindow, settings } = useMacOS();
  const menuBarRef = useRef<HTMLDivElement>(null);

  const [, force] = useState(0);
  useEffect(() => subscribeMenuRegistry(() => force(n => n + 1)), []);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const nav: any = navigator;
    if (!nav.getBattery) return;
    let battery: any;
    const update = () => {
      if (!battery) return;
      setBatteryLevel(Math.round(battery.level * 100));
      setBatteryCharging(!!battery.charging);
    };
    nav.getBattery().then((b: any) => {
      battery = b; update();
      b.addEventListener('levelchange', update);
      b.addEventListener('chargingchange', update);
    });
    return () => {
      if (battery) {
        battery.removeEventListener?.('levelchange', update);
        battery.removeEventListener?.('chargingchange', update);
      }
    };
  }, []);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
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
      if (label === 'Restart' || label === 'Shut Down') {
        windows.forEach(w => closeWindow(w.id));
      }
      setLoader(null);
    }, 3500);
  };

  const appleMenu: MenuItem[] = [
    { label: 'About This Mac', action: () => { openApp('about'); setAppleOpen(false); } },
    { separator: true },
    { label: 'System Settings', action: () => { openApp('settings'); setAppleOpen(false); } },
    { label: 'App Store', action: () => { openApp('appstore'); setAppleOpen(false); } },
    { separator: true },
    { label: 'Force Quit All', shortcut: '⌥⌘⎋', action: () => { windows.forEach(w => closeWindow(w.id)); setAppleOpen(false); } },
    { separator: true },
    { label: 'Sleep', action: () => triggerLoader('Sleep') },
    { label: 'Restart', action: () => triggerLoader('Restart') },
    { label: 'Shut Down', action: () => triggerLoader('Shut Down') },
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
      { label: 'Print', shortcut: '⌘P', action: () => window.print() },
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
      { label: 'Contact Me', action: () => openApp('contact') },
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

  // Fully blurred liquid-glass dropdown (Inter, larger text, no shortcut keys)
  const renderDropdown = (items: MenuItem[]) => (
    <div
      className="absolute top-7 left-0 mt-1 min-w-[260px] rounded-xl py-1.5 z-[100] text-white"
      style={{
        background: 'rgba(28,28,32,0.58)',
        backdropFilter: 'blur(80px) saturate(200%)',
        WebkitBackdropFilter: 'blur(80px) saturate(200%)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: '14px',
      }}
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
            className={`flex items-center px-3 py-1.5 text-left rounded-md mx-1 ${it.action ? 'hover:bg-white/15' : 'opacity-50 cursor-default'}`}
            style={{ width: 'calc(100% - 8px)' }}
          >
            <span>{it.label}</span>
          </button>
        )
      )}
    </div>
  );

  return (
    <>
      <div
        ref={menuBarRef}
        className="fixed top-0 left-0 right-0 h-7 flex items-center justify-between px-3 z-50 text-[13px] text-white"
        style={{
          margin: 0,
          borderRadius: 0,
          background: 'rgba(20,20,25,0.45)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-1 relative">
          {/* Turtle (Apple) menu */}
          <div
            className="relative"
            onMouseEnter={() => { if (activeMenu || appleOpen) { setActiveMenu(null); setAppleOpen(true); } }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setActiveMenu(null); setAppleOpen(o => !o); }}
              className={`px-2 py-0.5 rounded hover:bg-white/15 flex items-center ${appleOpen ? 'bg-white/20' : ''}`}
            >
              <img src={turtleLogo} alt="Logo" className="h-5 w-auto object-contain" />
            </button>
            {appleOpen && renderDropdown(appleMenu)}
          </div>

          {menus.map((m, idx) => (
            <div
              key={m.label}
              className="relative"
              onMouseEnter={() => { if (activeMenu || appleOpen) { setAppleOpen(false); setActiveMenu(m.label); } }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setAppleOpen(false); setActiveMenu(activeMenu === m.label ? null : m.label); }}
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
              <button className="px-1 hover:bg-white/15 rounded flex items-center">
                <IOSBattery level={batteryLevel} charging={batteryCharging} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 z-[200]">
              <div className="text-[13px] font-semibold flex items-center gap-1.5">
                Battery
                {batteryCharging && <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {batteryLevel !== null ? `${batteryLevel}% available` : 'Battery API unavailable'}
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${batteryLevel ?? 0}%` }} />
              </div>
              <div className="mt-3 divide-y divide-border rounded-md border border-border">
                <div className="flex items-center justify-between px-2.5 py-1.5 text-[12px]">
                  <span className="flex items-center gap-2 text-muted-foreground"><Plug className="w-3.5 h-3.5" />Power Source</span>
                  <span>{batteryCharging ? 'Power Adapter' : 'Battery'}</span>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 text-[12px]">
                  <span className="flex items-center gap-2 text-muted-foreground"><ClockIcon className="w-3.5 h-3.5" />Time Remaining</span>
                  <span>
                    {batteryLevel === null
                      ? '—'
                      : batteryCharging
                        ? `${Math.max(1, Math.round((100 - batteryLevel) * 1.4))} min to full`
                        : `${Math.max(1, Math.round(batteryLevel * 4.2))} min`}
                  </span>
                </div>
              </div>
              <button
                onClick={() => openApp('settings')}
                className="mt-2 w-full flex items-center justify-between px-2.5 py-1.5 text-[12px] rounded-md hover:bg-accent"
              >
                <span>Battery Preferences…</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </PopoverContent>
          </Popover>
          <button className={`p-1 hover:bg-white/15 rounded ${settings.wifi && online ? '' : 'opacity-50'}`} title={online ? 'Online' : 'Offline'}>
            <IoIosWifi className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-white/15 rounded" title={`Volume ${settings.volume ?? 65}%`}>
            <Volume2 className="w-4 h-4" />
          </button>
          <button onClick={onSpotlightClick} className="p-1 hover:bg-white/15 rounded" title="Spotlight (⌘K)">
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCcOpen(o => !o)}
            className={`p-1 hover:bg-white/15 rounded flex items-center ${ccOpen ? 'bg-white/20' : ''}`}
            title="Control Center"
          >
            <img src={controlCenterIcon} alt="Control Center" className="h-4 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
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
