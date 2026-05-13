import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, BatteryCharging, Zap, Check } from 'lucide-react';
import { IoIosWifi } from 'react-icons/io';
import { IoBluetooth } from 'react-icons/io5';
import { useMacOS } from '@/contexts/MacOSContext';
import turtleLogo from '@/assets/turtle-logo.png';
import controlCenterIcon from '@/assets/control-centre.svg';
import { ShortcutsModal } from './ShortcutsModal';
import { HelpModal } from './HelpModal';
import { ControlCenter } from './ControlCenter';
import { NotificationCenter } from './NotificationCenter';

import { getAppMenus, subscribeMenuRegistry, MenuItem, AppMenus } from '@/types/macos';

interface MenuBarProps { onSpotlightClick?: () => void; }
interface MenuGroup { label: string; items: MenuItem[]; }

// Battery glyph — body now 22px wide (was 26 → 15% smaller, rounded)
const IOSBattery = ({ level, charging, lowPower }: { level: number | null; charging: boolean; lowPower?: boolean }) => {
  const pct = Math.max(0, Math.min(100, level ?? 100));
  const fillColor = lowPower
    ? '#FFD60A'
    : charging
      ? '#32C04E'
      : pct <= 20
        ? '#FE0E09'
        : '#ffffff';
  return (
    <div className="flex items-center gap-1">
      <div className="relative" style={{ width: 22, height: 13 }}>
        <div className="absolute inset-0 rounded-[4px] border border-white/70 box-border px-[1px] py-[2px]">
          <div className="h-full rounded-[1.5px]" style={{ width: `${pct}%`, background: fillColor }} />
        </div>
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ right: -2.5, width: 1.5, height: 5, background: 'rgba(255,255,255,0.7)', borderRadius: 1 }}
        />
        {charging && (
          <Zap
            fill="white"
            stroke="white"
            strokeWidth={1.8}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3"
          />
        )}
      </div>
    </div>
  );
};

type FrostedPanelProps = {
  children: React.ReactNode;
  width?: number;
  className?: string;
  align?: 'left' | 'right';
  offset?: number;
};

const FrostedPanel: React.FC<FrostedPanelProps> = ({
  children,
  width = 280,
  className = '',
  align = 'left',
  offset = 8,
}) => (
  <div
    className={`fixed top-8 mt-1 rounded-xl py-2.5 px-3 z-[200] text-white ${className}`}
    style={{
      width: `min(${width}px, calc(100vw - 16px))`,
      ...(align === 'right' ? { right: offset } : { left: offset }),
      background: 'rgba(28,28,32,0.85)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
      fontFamily: "'Inter', -apple-system, sans-serif",
      fontSize: '13px',
    }}
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </div>
);

export const MenuBar = ({ onSpotlightClick }: MenuBarProps) => {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [appleOpen, setAppleOpen] = useState(false);
  const [ccOpen, setCcOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [batteryOpen, setBatteryOpen] = useState(false);
  const [wifiOpen, setWifiOpen] = useState(false);
  const [btOpen, setBtOpen] = useState(false);
  const [volOpen, setVolOpen] = useState(false);
  const [loader, setLoader] = useState<null | { label: string }>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState(false);
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const { focusedWindowId, apps, windows, minimizeAllWindows, openApp, closeWindow, focusWindow, settings, updateSettings } = useMacOS();
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
      battery = b;
      update();
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
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
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
    { label: 'About This Mac', action: () => { openApp('settings'); setAppleOpen(false); } },
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
      {
        label: appName,
        items: [
          { label: `About ${appName}`, action: () => openApp('settings') },
          { separator: true },
          { label: `Hide ${appName}`, shortcut: '⌘H', action: () => focusActive && closeWindow(focusActive.id) },
          { separator: true },
          { label: `Quit ${appName}`, shortcut: '⌘Q', action: () => focusActive && closeWindow(focusActive.id) },
        ],
      },
      { label: 'File', items: customMenus?.File ?? defaultFile },
      { label: 'Edit', items: customMenus?.Edit ?? defaultEdit },
      { label: 'View', items: customMenus?.View ?? defaultView },
      { label: 'Window', items: customMenus?.Window ?? defaultWindow },
      { label: 'Help', items: helpMenu },
    ];
  }, [appName, focusActive, windows, apps, openApp, closeWindow, minimizeAllWindows, focusWindow, onSpotlightClick, customMenus]);

  // Close any open status popover when another opens
  const openOnly = (which: 'battery' | 'wifi' | 'bt' | 'vol' | 'cc' | 'notif' | null) => {
    setBatteryOpen(which === 'battery');
    setWifiOpen(which === 'wifi');
    setBtOpen(which === 'bt');
    setVolOpen(which === 'vol');
    setCcOpen(which === 'cc');
    setNotifOpen(which === 'notif');
  };

  useEffect(() => {
    if (!activeMenu && !appleOpen && !batteryOpen && !wifiOpen && !btOpen && !volOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!menuBarRef.current?.contains(e.target as Node)) {
        setActiveMenu(null);
        setAppleOpen(false);
        setBatteryOpen(false);
        setWifiOpen(false);
        setBtOpen(false);
        setVolOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [activeMenu, appleOpen, batteryOpen, wifiOpen, btOpen, volOpen]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  const renderDropdown = (items: MenuItem[]) => (
    <FrostedPanel className="mt-1" width={260} align="left" offset={8}>
      <div className="-mx-1">
        {items.map((it, i) =>
          it.separator ? (
            <div key={i} className="h-px bg-white/10 my-1 mx-2" />
          ) : (
            <button
              key={i}
              disabled={!it.action}
              onClick={() => {
                it.action?.();
                setActiveMenu(null);
                setAppleOpen(false);
              }}
              className={`flex items-center px-3 py-1.5 text-left rounded-md mx-1 w-[calc(100%-8px)] ${
                it.action ? 'hover:bg-black/40' : 'opacity-50 cursor-default'
              }`}
            >
              <span>{it.label}</span>
            </button>
          )
        )}
      </div>
    </FrostedPanel>
  );

  // Status icon button — darkens on hover (no white overlay)
  const StatusBtn: React.FC<{
    onClick?: () => void;
    active?: boolean;
    title?: string;
    children: React.ReactNode;
    className?: string;
  }> = ({ onClick, active, title, children, className = '' }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-[6px] rounded transition-colors hover:bg-black/30 ${active ? 'bg-black/40' : ''} ${className}`}
    >
      {children}
    </button>
  );

  return (
    <>
      <div
        ref={menuBarRef}
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-3 z-50 text-[12.4px] text-white"
        style={{
          height: 25,
          background: 'rgba(20,20,25,0.45)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-1 relative">
          <div
            className="relative"
            onMouseEnter={() => { setActiveMenu(null); setAppleOpen(true); }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(null);
                setAppleOpen(o => !o);
              }}
              className={`px-2 py-0.5 rounded hover:bg-black/30 flex items-center ${appleOpen ? 'bg-black/40' : ''}`}
            >
              <img src={turtleLogo} alt="Logo" className="h-[18px] w-auto object-contain" />
            </button>
            {appleOpen && renderDropdown(appleMenu)}
          </div>

          {menus.map((m, idx) => (
            <div
              key={m.label}
              className="relative"
              onMouseEnter={() => { setAppleOpen(false); setActiveMenu(m.label); }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAppleOpen(false);
                  setActiveMenu(activeMenu === m.label ? null : m.label);
                }}
                className={`px-2.5 py-0.5 rounded hover:bg-black/30 ${idx === 0 ? 'font-semibold text-[12.35px]' : ''} ${activeMenu === m.label ? 'bg-black/40' : ''}`}
              >
                {m.label}
              </button>
              {activeMenu === m.label && renderDropdown(m.items)}
            </div>
          ))}
        </div>

        {/* Right status group — order: bluetooth, wifi, battery, search, control center, date */}
        <div className="flex items-center gap-[2px] relative">
          <div
            className="relative"
            onMouseEnter={() => openOnly('bt')}
          >
            <StatusBtn onClick={() => openOnly(btOpen ? null : 'bt')} active={btOpen} title="Bluetooth">
              <IoBluetooth style={{ width: 14, height: 14 }} />
            </StatusBtn>

            {btOpen && (
              <FrostedPanel width={260} align="right" offset={8}>
                <div className="font-semibold mb-1 flex items-center justify-between">
                  Bluetooth
                  <span className={`text-[11px] ${settings.bluetooth ? 'text-[#32C14E]' : 'text-white/50'}`}>
                    {settings.bluetooth ? 'On' : 'Off'}
                  </span>
                </div>

                <button
                  onClick={() => updateSettings({ bluetooth: !settings.bluetooth })}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-black/40 text-[12.5px]"
                >
                  {settings.bluetooth ? 'Turn Bluetooth Off' : 'Turn Bluetooth On'}
                </button>

                <div className="h-px bg-white/10 my-1" />

                <div className="text-[11px] text-white/55 px-2 mb-1">Devices</div>
                {['Thanas\u2019 AirPods Pro', 'Magic Mouse', 'Magic Keyboard'].map(d => (
                  <div key={d} className="px-2 py-1 text-[12.5px] flex items-center justify-between">
                    <span>{d}</span>
                    <span className="text-[10.5px] text-white/55">Connected</span>
                  </div>
                ))}

                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={() => {
                    openApp('settings');
                    openOnly(null);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-black/40 text-[12.5px]"
                >
                  Bluetooth Settings…
                </button>
              </FrostedPanel>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => openOnly('wifi')}
          >
            <StatusBtn
              onClick={() => openOnly(wifiOpen ? null : 'wifi')}
              active={wifiOpen}
              title={online ? 'Online' : 'Offline'}
              className={settings.wifi && online ? '' : 'opacity-60'}
            >
              <IoIosWifi style={{ width: 18, height: 18 }} />
            </StatusBtn>

            {wifiOpen && (
              <FrostedPanel width={280} align="right" offset={8}>
                <div className="font-semibold mb-1 flex items-center justify-between">
                  Wi-Fi
                  <span className={`text-[11px] ${settings.wifi ? 'text-[#32C14E]' : 'text-white/50'}`}>
                    {settings.wifi ? 'On' : 'Off'}
                  </span>
                </div>

                <button
                  onClick={() => updateSettings({ wifi: !settings.wifi })}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-black/40 text-[12.5px]"
                >
                  {settings.wifi ? 'Turn Wi-Fi Off' : 'Turn Wi-Fi On'}
                </button>

                <div className="h-px bg-white/10 my-1" />

                <div className="text-[11px] text-white/55 px-2 mb-1">Networks</div>
                {[
                  { name: 'ThanasOS-Net', current: true },
                  { name: 'PESU-Wifi', current: false },
                  { name: 'JioFiber-5G', current: false },
                  { name: 'Cubbon Cafe', current: false },
                ].map(n => (
                  <div
                    key={n.name}
                    className="px-2 py-1 text-[12.5px] flex items-center justify-between hover:bg-black/40 rounded cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      {n.current && <Check className="w-3 h-3 text-[#32C14E]" />}
                      {n.name}
                    </span>
                    <IoIosWifi className="w-3.5 h-3.5 opacity-70" />
                  </div>
                ))}

                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={() => {
                    openApp('settings');
                    openOnly(null);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-black/40 text-[12.5px]"
                >
                  Wi-Fi Settings…
                </button>
              </FrostedPanel>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => openOnly('battery')}
          >
            <StatusBtn onClick={() => openOnly(batteryOpen ? null : 'battery')} active={batteryOpen} title="Battery">
              <IOSBattery level={batteryLevel} charging={batteryCharging} lowPower={settings.lowPowerMode} />
            </StatusBtn>

            {batteryOpen && (
              <FrostedPanel width={260} align="right" offset={8}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold flex items-center gap-1.5">
                    Battery {batteryCharging && <BatteryCharging className="w-5 h-5" style={{ color: '#32C04E' }} />}
                  </div>
                  <div className="text-[12px] text-white/70">{batteryLevel ?? 100}%</div>
                </div>

                <div className="text-[12px] text-white/70 mb-2">
                  Power Source: {batteryCharging ? 'Power Adapter' : 'Battery'}
                </div>

                <div className="h-px bg-white/10 my-1.5" />
                <button
                  onClick={() => updateSettings({ lowPowerMode: !settings.lowPowerMode })}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-black/40 text-[12.5px]"
                >
                  <span>Low Power Mode</span>
                  <span
                    className="relative inline-flex h-[18px] w-[30px] rounded-full transition-colors"
                    style={{ background: settings.lowPowerMode ? '#34c759' : 'rgba(255,255,255,0.22)' }}
                  >
                    <span
                      className="absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow transition-transform"
                      style={{ left: 2, transform: settings.lowPowerMode ? 'translateX(12px)' : 'translateX(0)' }}
                    />
                  </span>
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={() => {
                    openApp('settings');
                    openOnly(null);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-black/40 text-[12.5px]"
                >
                  Battery Settings…
                </button>
              </FrostedPanel>
            )}
          </div>

          <StatusBtn onClick={onSpotlightClick} title="Spotlight (⌘K)">
            <Search style={{ width: 13, height: 13 }} />
          </StatusBtn>

          <StatusBtn onClick={() => openOnly(ccOpen ? null : 'cc')} active={ccOpen} title="Control Center">
            <img
              src={controlCenterIcon}
              alt="Control Center"
              style={{ height: 13, width: 'auto', filter: 'brightness(0) invert(1)' }}
              className="object-contain"
            />
          </StatusBtn>

          <button
            onClick={() => openOnly(notifOpen ? null : 'notif')}
            className={`px-2 py-0.5 rounded hover:bg-black/30 ${notifOpen ? 'bg-black/40' : ''}`}
          >
            <span style={{ fontWeight: 300, fontFamily: "'Inter', -apple-system, sans-serif" }}>{formatTime(time)}</span>
          </button>
        </div>
      </div>

      <ControlCenter open={ccOpen} onClose={() => setCcOpen(false)} />
      <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />

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
