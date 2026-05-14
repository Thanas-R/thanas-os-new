import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, Bluetooth, Battery, HardDrive, Lock as LockIcon, ChevronRight, Bell,
  Volume2, Moon, Clock, Globe, RefreshCw, Settings as SettingsIcon, Eye, Layout, Palette, Compass,
  Sun, Star, ArrowDownToLine, Languages, Database, Share2, Keyboard, Gauge, User,
} from 'lucide-react';
import { IoIosWifi } from 'react-icons/io';
import airdropImg from '@/assets/airdrop-icon-new.png';
import { useMacOS } from '@/contexts/MacOSContext';
import { useGoogleInstalled } from '@/lib/installedApps';
import { Switch } from '@/components/ui/switch';
import { AppleSlider } from '@/components/ui/AppleSlider';
import wallpaper1 from '@/assets/wallpaper-1.jpg';
import wallpaper2 from '@/assets/wallpaper-2.jpg';
import wallpaper3 from '@/assets/wallpaper-3.jpg';
import wallpaperTahoe from '@/assets/wallpaper-tahoe.jpg';
import wallpaperVineyard from '@/assets/wallpaper-vineyard.jpg';
import wallpaperCatalina from '@/assets/wallpaper-catalina.jpg';
import wallpaperValley from '@/assets/wallpaper-valley.jpg';
import wallpaperMountain from '@/assets/wallpaper-mountain.jpg';
import wallpaperBigsur from '@/assets/wallpaper-bigsur.jpg';
import wallpaperSnow from '@/assets/wallpaper-snow.jpg';
import wallpaperAurora from '@/assets/wallpaper-aurora.jpg';
import wallpaperCanyon from '@/assets/wallpaper-canyon.jpg';
import wallpaperViaduct from '@/assets/wallpaper-viaduct.jpg';
import wallpaperDolomites from '@/assets/wallpaper-dolomites.jpg';
import wallpaperVestrahorn from '@/assets/wallpaper-vestrahorn.jpg';
import wallpaperAnnapurna from '@/assets/wallpaper-annapurna.jpg';
import wallpaperAlps from '@/assets/wallpaper-alps.jpg';
import safariIcon from '@/assets/safari-icon.png';
import googleIcon from '@/assets/google-icon-new.png';
import profilePhoto from '@/assets/profile-photo-new.jpg';

const wallpapers = [
  { id: 'wallpaper-mountain', src: wallpaperMountain, name: 'Highlands' },
  { id: 'wallpaper-tahoe', src: wallpaperTahoe, name: 'Lake Tahoe' },
  { id: 'wallpaper-viaduct', src: wallpaperViaduct, name: 'Glenfinnan Viaduct' },
  { id: 'wallpaper-dolomites', src: wallpaperDolomites, name: 'Dolomites' },
  { id: 'wallpaper-vestrahorn', src: wallpaperVestrahorn, name: 'Vestrahorn' },
  { id: 'wallpaper-annapurna', src: wallpaperAnnapurna, name: 'Annapurna Night' },
  { id: 'wallpaper-alps', src: wallpaperAlps, name: 'Swiss Alps' },
  { id: 'wallpaper-bigsur', src: wallpaperBigsur, name: 'Big Sur' },
  { id: 'wallpaper-aurora', src: wallpaperAurora, name: 'Aurora' },
  { id: 'wallpaper-snow', src: wallpaperSnow, name: 'Winter Trail' },
  { id: 'wallpaper-canyon', src: wallpaperCanyon, name: 'Canyon Stars' },
  { id: 'wallpaper-vineyard', src: wallpaperVineyard, name: 'Vineyard Hills' },
  { id: 'wallpaper-catalina', src: wallpaperCatalina, name: 'Catalina' },
  { id: 'wallpaper-valley', src: wallpaperValley, name: 'Painted Valley' },
  { id: 'wallpaper-1', src: wallpaper1, name: 'Mountain Lake' },
  { id: 'wallpaper-2', src: wallpaper2, name: 'Misty Valley' },
  { id: 'wallpaper-3', src: wallpaper3, name: 'Winter Forest' },
];

type SectionId =
  | 'apple-account'
  | 'wifi' | 'bluetooth' | 'battery' | 'notifications' | 'sound' | 'focus'
  | 'general' | 'appearance' | 'desktop' | 'displays' | 'wallpaper' | 'browser' | 'privacy';

type GeneralSubsection = 'about' | 'software' | 'storage' | 'airdrop' | 'login' | 'language' | 'datetime' | 'sharing' | 'time-machine' | 'transfer' | 'startup';

const SIDEBAR_TOP = [
  { id: 'wifi', label: 'Wi-Fi', icon: IoIosWifi, tint: '#0a84ff' },
  { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth, tint: '#0a84ff' },
  { id: 'battery', label: 'Battery', icon: Battery, tint: '#34c759' },
] as const;
const SIDEBAR_MID = [
  { id: 'notifications', label: 'Notifications', icon: Bell, tint: '#ff453a' },
  { id: 'sound', label: 'Sound', icon: Volume2, tint: '#ff375f' },
  { id: 'focus', label: 'Focus', icon: Moon, tint: '#a855f7' },
] as const;
const SIDEBAR_BOTTOM = [
  { id: 'general', label: 'General', icon: SettingsIcon, tint: '#8e8e93' },
  { id: 'appearance', label: 'Appearance', icon: Palette, tint: '#1c1c1e' },
  { id: 'privacy', label: 'Privacy & Security', icon: LockIcon, tint: '#0a84ff' },
  { id: 'desktop', label: 'Desktop & Dock', icon: Layout, tint: '#8e8e93' },
  { id: 'displays', label: 'Displays', icon: Sun, tint: '#0a84ff' },
  { id: 'wallpaper', label: 'Wallpaper', icon: ArrowDownToLine, tint: '#06b6d4' },
  { id: 'browser', label: 'Default Browser', icon: Compass, tint: '#0a84ff' },
] as const;

const GENERAL_ITEMS: { id: GeneralSubsection; label: string; icon: any; tint: string }[] = [
  { id: 'about', label: 'About', icon: SettingsIcon, tint: '#0a84ff' },
  { id: 'software', label: 'Software Update', icon: RefreshCw, tint: '#8e8e93' },
  { id: 'storage', label: 'Storage', icon: HardDrive, tint: '#8e8e93' },
  { id: 'airdrop', label: 'AirDrop & Handoff', icon: Share2, tint: '#0a84ff' },
  { id: 'login', label: 'Login Items', icon: User, tint: '#34c759' },
  { id: 'language', label: 'Language & Region', icon: Languages, tint: '#0a84ff' },
  { id: 'datetime', label: 'Date & Time', icon: Clock, tint: '#0a84ff' },
  { id: 'sharing', label: 'Sharing', icon: Share2, tint: '#34c759' },
  { id: 'time-machine', label: 'Time Machine', icon: Database, tint: '#34c759' },
  { id: 'transfer', label: 'Transfer or Reset', icon: ArrowDownToLine, tint: '#8e8e93' },
  { id: 'startup', label: 'Startup Disk', icon: HardDrive, tint: '#8e8e93' },
];

export const SettingsApp = () => {
  const { settings, updateSettings } = useMacOS();
  const googleInstalled = useGoogleInstalled();
  const [section, setSection] = useState<SectionId>('apple-account');
  const [generalSub, setGeneralSub] = useState<GeneralSubsection>('about');
  const [query, setQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState(false);

  // Battery API
  useEffect(() => {
    const nav: any = navigator;
    if (!nav.getBattery) return;
    let battery: any;
    const update = () => { if (battery) { setBatteryLevel(Math.round(battery.level * 100)); setBatteryCharging(!!battery.charging); } };
    nav.getBattery().then((b: any) => { battery = b; update(); b.addEventListener('levelchange', update); b.addEventListener('chargingchange', update); });
  }, []);

  // Spotlight handoff
  useEffect(() => {
    const fn = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d?.appId === 'settings' && d?.payload?.section) {
        setSection(d.payload.section as SectionId);
      }
    };
    window.addEventListener('spotlight:open', fn);
    return () => window.removeEventListener('spotlight:open', fn);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && /image\/(jpeg|jpg|png)/.test(file.type)) {
      const r = new FileReader();
      r.onload = ev => updateSettings({ wallpaper: 'custom', customWallpaper: ev.target?.result as string });
      r.readAsDataURL(file);
    }
  };

  const allNav = [...SIDEBAR_TOP, ...SIDEBAR_MID, ...SIDEBAR_BOTTOM];
  const filteredSidebar = useMemo(
    () => allNav.filter(n => !query || n.label.toLowerCase().includes(query.toLowerCase())),
    [query, allNav]
  );

  const sectionLabel = allNav.find(n => n.id === section)?.label || 'Settings';

  return (
    <div className="h-full w-full flex bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 text-[14px]">
      {/* Sidebar — extends to top, traffic lights overlay above the search */}
      <aside className="w-[240px] shrink-0 bg-neutral-200/70 dark:bg-neutral-900/70 backdrop-blur-xl border-r border-black/5 dark:border-white/5 flex flex-col">
        {/* Search row leaves ~78px on the left for traffic lights */}
        <div className="pt-2.5 pb-2">
      <div className="px-3 h-[20px]" />
  <div className="mt-2 px-3">
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/10">
      <Search className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search"
        className="flex-1 bg-transparent outline-none text-[13px] min-w-0"
      />
    </div>
  </div>
</div>
        {/* Profile / Apple Account row */}
        <button
          onClick={() => setSection('apple-account')}
          className={`mx-3 mb-2 flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors ${
            section === 'apple-account'
              ? 'bg-neutral-300/70 dark:bg-neutral-700/60'
              : 'hover:bg-neutral-300/60 dark:hover:bg-neutral-800/60'
          }`}
        >
          <img src={profilePhoto} alt="Thanas R" className="w-10 h-10 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/10" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold truncate">Thanas R</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">Apple Account</div>
          </div>
        </button>

        <nav className="flex-1 overflow-auto thin-scrollbar px-2 pb-3 pt-[2px] space-y-0.5">
          {filteredSidebar.map((n, i) => {
            const prev = filteredSidebar[i - 1];
            const groupOf = (id: string) => {
              if (SIDEBAR_TOP.some(x => x.id === id)) return 'top';
              if (SIDEBAR_MID.some(x => x.id === id)) return 'mid';
              return 'bot';
            };
            const showSep = prev && groupOf(prev.id) !== groupOf(n.id);
            return (
              <div key={`nv-${n.id}`}>
                {showSep && <div className="h-2" />}
                <NavRow {...n} active={section === n.id} onClick={() => setSection(n.id as SectionId)} />
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Right pane */}
      {section === 'apple-account' ? (
        <div className="flex-1 overflow-auto bg-white dark:bg-neutral-900 thin-scrollbar">
          <AppleAccountPane />
        </div>
      ) : section === 'general' ? (
        <div className="flex-1 min-h-0 bg-white dark:bg-neutral-900">
          <GeneralPane sub={generalSub} setSub={setGeneralSub} batteryLevel={batteryLevel} batteryCharging={batteryCharging} />
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-white dark:bg-neutral-900 thin-scrollbar">
          <div className="px-7 pt-5 pb-10 max-w-3xl">
            <h1 className="text-[20px] font-semibold mb-5">{sectionLabel}</h1>

            {section === 'appearance' && (
              <Card>
                <Row label="Appearance" desc="Choose your accent style.">
                  <div className="flex gap-3">
                    {(['light', 'dark'] as const).map(opt => {
                      const active = settings.theme === opt;
                      return (
                        <button key={opt} onClick={() => updateSettings({ theme: opt })} className="flex flex-col items-center gap-1">
                          <div className={`w-16 h-10 rounded-md ring-2 ${active ? 'ring-blue-500' : 'ring-transparent'}`} style={{ background: opt === 'light' ? '#f5f5f7' : '#1c1c1e' }} />
                          <div className="text-[11px] capitalize">{opt}</div>
                        </button>
                      );
                    })}
                  </div>
                </Row>
                <Row label="Reduced Motion" desc="Minimize animations across the system.">
                  <Switch checked={!!settings.reducedMotion} onCheckedChange={v => updateSettings({ reducedMotion: v })} />
                </Row>
              </Card>
            )}

            {section === 'wifi' && (
              <Card>
                <Row label="Wi-Fi" desc={settings.wifi ? 'ThanasOS-Net' : 'Off'}>
                  <Switch checked={!!settings.wifi} onCheckedChange={v => updateSettings({ wifi: v })} />
                </Row>
                {settings.wifi && (
                  <>
                    <Row label="Network Name" desc="ThanasOS-Net" />
                    <Row label="Ask to join networks" desc="Known networks join automatically.">
                      <Switch checked defaultChecked />
                    </Row>
                  </>
                )}
              </Card>
            )}

            {section === 'bluetooth' && (
              <Card>
                <Row label="Bluetooth" desc={settings.bluetooth ? 'On' : 'Off'}>
                  <Switch checked={!!settings.bluetooth} onCheckedChange={v => updateSettings({ bluetooth: v })} />
                </Row>
              </Card>
            )}

            {section === 'sound' && (
              <Card>
                <Row label="Output Volume" desc={`${settings.volume ?? 65}%`}>
                  <div className="w-48"><AppleSlider value={settings.volume ?? 65} onChange={v => updateSettings({ volume: v })} /></div>
                </Row>
                <Row label="Mute" desc="Silence all sound output.">
                  <Switch checked={(settings.volume ?? 65) === 0} onCheckedChange={v => updateSettings({ volume: v ? 0 : 65 })} />
                </Row>
              </Card>
            )}

            {section === 'focus' && (
              <Card>
                <Row label="Do Not Disturb" desc="Silences notifications.">
                  <Switch checked={!!settings.focus} onCheckedChange={v => updateSettings({ focus: v })} />
                </Row>
              </Card>
            )}

            {section === 'displays' && (
              <Card>
                <Row label="Brightness" desc={`${settings.brightness ?? 80}%`}>
                  <div className="w-48"><AppleSlider value={settings.brightness ?? 80} min={20} onChange={v => updateSettings({ brightness: v })} /></div>
                </Row>
              </Card>
            )}

            {section === 'desktop' && (
              <Card>
                <Row label="Auto-hide Dock" desc="Show the dock only on hover.">
                  <Switch checked={!!settings.dockAutoHide} onCheckedChange={v => updateSettings({ dockAutoHide: v })} />
                </Row>
                <Row label="Dock Magnification" desc={`${settings.dockMagnification}%`}>
                  <div className="w-48"><AppleSlider value={settings.dockMagnification} max={150} onChange={v => updateSettings({ dockMagnification: v })} /></div>
                </Row>
                <Row label="Reduce Motion" desc="Disable dock and window animations.">
                  <Switch checked={!!settings.reducedMotion} onCheckedChange={v => updateSettings({ reducedMotion: v })} />
                </Row>
              </Card>
            )}

            {section === 'wallpaper' && (
              <Card>
                <div className="grid grid-cols-2 gap-3 p-3">
                  {wallpapers.map(w => (
                    <button
                      key={w.id}
                      onClick={() => updateSettings({ wallpaper: w.id })}
                      className={`relative rounded-xl overflow-hidden aspect-video transition-transform ${
                        settings.wallpaper === w.id ? 'ring-2 ring-blue-500' : 'hover:scale-[1.02] opacity-90'
                      }`}
                    >
                      <img src={w.src} alt={w.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-1.5 text-white text-[11px]">{w.name}</div>
                    </button>
                  ))}
                </div>
                <div className="border-t border-black/5 dark:border-white/10 mt-2" />
                <div className="px-3 pt-4 pb-5 mt-2 flex justify-start">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[12.5px] px-3.5 py-1.5 rounded-md bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 ring-1 ring-black/5 dark:ring-white/10 transition-colors"
                  >
                    Choose Custom Image…
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
              </Card>
            )}

            {section === 'battery' && (
              <Card>
                <Row label="Battery Level" desc={batteryLevel !== null ? `${batteryLevel}%${batteryCharging ? ' (Charging)' : ''}` : 'Battery API unavailable'} />
                <Row label="Low Power Mode" desc="Reduce energy use to extend battery life. Battery icon turns yellow.">
                  <Switch checked={!!settings.lowPowerMode} onCheckedChange={v => updateSettings({ lowPowerMode: v })} />
                </Row>
              </Card>
            )}

            {section === 'browser' && (
              <Card>
                <Row label="Default web browser" desc={googleInstalled ? 'Pick which browser opens links by default.' : 'Install Google from the App Store to choose it.'}>
                  <div className="flex gap-3">
                    <BrowserChoice img={safariIcon} label="Safari" active={settings.defaultBrowser !== 'google' || !googleInstalled} onClick={() => updateSettings({ defaultBrowser: 'safari' })} />
                    <BrowserChoice img={googleIcon} label="Google" disabled={!googleInstalled} active={!!googleInstalled && settings.defaultBrowser === 'google'} onClick={() => updateSettings({ defaultBrowser: 'google' })} />
                  </div>
                </Row>
              </Card>
            )}

            {section === 'privacy' && (
              <Card>
                <Row label="Location Services" desc="Off"><Switch checked={false} onCheckedChange={() => {}} /></Row>
                <Row label="Analytics & Improvements" desc="Help improve ThanasOS."><Switch checked={false} onCheckedChange={() => {}} /></Row>
              </Card>
            )}

            {section === 'notifications' && (
              <Card>
                <Row label={sectionLabel} desc="Pane reserved. Settings will appear here." />
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AppleAccountPane = () => (
  <div className="px-8 pt-5 pb-10 max-w-2xl mx-auto">
    <div className="flex flex-col items-center pt-4 pb-6 text-center">
      <img src={profilePhoto} alt="Thanas R" className="w-20 h-20 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/10 mb-3" />
      <div className="text-[22px] font-semibold text-center">Thanas R</div>
      <div className="text-[13px] text-neutral-500 text-center">thanas5.rd@gmail.com</div>
      <div className="text-[12px] text-neutral-500 mt-0.5 text-center">Apple Account</div>
    </div>
    <Card>
      <KV k="Personal Information" v="Manage" />
      <KV k="Sign-In & Security" v="Manage" />
      <KV k="Payment & Shipping" v="None" />
    </Card>
    <div className="text-[13px] font-semibold mt-6 mb-2">iCloud</div>
    <Card>
      <KV k="iCloud+" v="200 GB Plan" />
      <KV k="iCloud Drive" v="On" />
      <KV k="Photos" v="On" />
    </Card>
    <div className="text-[13px] font-semibold mt-6 mb-2">Devices</div>
    <Card>
      <KV k="MacBook Air M6 (this device)" v="Online" />
      <KV k="Thanas's iPhone 17" v="This iPhone 17" />
      <KV k="Thanas's iPhone" v="iPhone 6" />
      <KV k="iPad" v="iPad Air" />
      <KV k="iPhone 5" v="iPhone 5" />
      <KV k="iPhone 8 Plus" v="iPhone 8 Plus" />
      <KV k="THANAS-LAPTOP" v="Windows" />
      <KV k="Thanas's iPad" v="iPad" />
      <KV k="Thanas's iPhone 13 Pro Max" v="iPhone 13 Pro Max" />
      <KV k="Thanas's iPhone XR" v="iPhone XR" />
    </Card>
  </div>
);

const GeneralPane = ({ sub, setSub, batteryLevel, batteryCharging }: { sub: GeneralSubsection; setSub: (s: GeneralSubsection) => void; batteryLevel: number | null; batteryCharging: boolean }) => {
  const renderAbout = () => (
    <div className="px-8 pt-5 pb-10 max-w-2xl">
      <div className="flex flex-col items-center pb-6">
        <img src={profilePhoto} alt="ThanasOS" className="w-32 h-32 object-contain rounded-2xl" />
        <div className="text-[28px] font-semibold mt-3">ThanasOS</div>
        <div className="text-[13px] text-neutral-500">2026</div>
      </div>
      <Card>
        <KV k="Model Name" v="MacBook Air" />
        <KV k="Model Identifier" v="MacBookAir2026,1" />
        <KV k="Chip" v="Apple M5" />
        <KV k="Total Number of Cores" v="10 (4 performance and 6 efficiency)" />
        <KV k="Memory" v="24 GB Unified Memory" />
        <KV k="Storage" v="512 GB SSD" />
        <KV k="Display" v="13.6-inch Liquid Retina, 2560×1664" />
        <KV k="Serial Number" v="THANAS-OS-2026" />
        <KV k="Battery" v={batteryLevel !== null ? `${batteryLevel}%${batteryCharging ? ' Charging' : ''}` : 'Unavailable'} />
      </Card>
      <div className="text-[13px] font-semibold mt-6 mb-2">macOS</div>
      <Card>
        <KV k="ThanasOS" v="Version 1.0 (Build 2026.05)" />
      </Card>
    </div>
  );

  return (
    <div className="flex h-full">
      {/* macOS-style General sub-sidebar */}
      <div className="w-[220px] shrink-0 border-r border-black/5 dark:border-white/5 overflow-auto thin-scrollbar p-2 space-y-0.5 bg-neutral-100/40 dark:bg-neutral-900/40">
        <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-neutral-500">General</div>
        {GENERAL_ITEMS.map((g) => {
          const I = g.icon;
          const active = g.id === sub;
          return (
            <button
              key={g.id}
              onClick={() => setSub(g.id)}
              className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13.5px] text-left transition-colors ${
                active ? 'bg-neutral-300/70 dark:bg-neutral-700/60 text-neutral-900 dark:text-neutral-100'
                       : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/60'
              }`}
            >
              <span className="w-6 h-6 rounded-[6px] flex items-center justify-center text-white" style={{ background: g.tint }}>
                <I className="w-4 h-4" />
              </span>
              <span className="truncate">{g.label}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-auto thin-scrollbar">
        {sub === 'about' ? renderAbout() : (
          <div className="px-8 pt-5 pb-10 max-w-2xl">
            <h1 className="text-[20px] font-semibold mb-5">{GENERAL_ITEMS.find(g => g.id === sub)?.label}</h1>
            <Card><Row label="Section" desc="Reserved." /></Card>
          </div>
        )}
      </div>
    </div>
  );
};

const KV = ({ k, v }: { k: string; v: string }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <div className="text-[13px]">{k}</div>
    <div className="text-[13px] text-neutral-500">{v}</div>
  </div>
);

const NavRow = ({ label, icon: I, tint, active, onClick }: { label: string; icon: any; tint: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[14px] transition-colors ${
    active ? 'bg-neutral-300/70 dark:bg-neutral-700/60 text-neutral-900 dark:text-neutral-100'
           : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/60'
  }`}>
    <span className="w-6 h-6 rounded-[6px] flex items-center justify-center text-white" style={{ background: tint }}>
      {label === 'AirDrop & Handoff' ? <img src={airdropImg} alt="" className="w-4 h-4 object-contain" /> : <I className="w-4 h-4" />}
    </span>
    <span className="truncate">{label}</span>
  </button>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/60 ring-1 ring-black/5 dark:ring-white/5 divide-y divide-black/5 dark:divide-white/5 mb-4">
    {children}
  </div>
);

const Row = ({ label, desc, children }: { label: string; desc?: string; children?: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 px-4 py-3">
    <div className="min-w-0">
      <div className="font-medium">{label}</div>
      {desc && <div className="text-[11.5px] text-neutral-500 dark:text-neutral-400">{desc}</div>}
    </div>
    {children}
  </div>
);

const BrowserChoice = ({ img, label, active, disabled, onClick }: { img: string; label: string; active: boolean; disabled?: boolean; onClick: () => void }) => (
  <button onClick={disabled ? undefined : onClick} disabled={disabled} className={`flex flex-col items-center gap-1 p-2 rounded-lg ring-2 transition-colors ${active ? 'ring-blue-500' : 'ring-transparent'} ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
    <img src={img} alt={label} className="w-10 h-10 object-contain" />
    <div className="text-[11px]">{label}</div>
  </button>
);
