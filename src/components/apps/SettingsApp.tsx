import { useMacOS } from '@/contexts/MacOSContext';
import { useGoogleInstalled } from '@/lib/installedApps';
import {
  Search, Monitor, Palette, Layout, Wifi, Bluetooth, Battery, Lock, Volume2,
  Sun, Globe, Sparkles, User, Eye, Keyboard, Compass,
} from 'lucide-react';
import { useState, useRef } from 'react';
import wallpaper1 from '@/assets/wallpaper-1.jpg';
import wallpaper2 from '@/assets/wallpaper-2.jpg';
import wallpaper3 from '@/assets/wallpaper-3.jpg';
import wallpaper4 from '@/assets/minecraft-valley.jpg';
import safariIcon from '@/assets/safari-icon.png';
import googleIcon from '@/assets/google-icon-new.png';
import profilePhoto from '@/assets/profile-photo-new.jpg';

const wallpapers = [
  { id: 'wallpaper-1', src: wallpaper1, name: 'Mountain Lake' },
  { id: 'wallpaper-2', src: wallpaper2, name: 'Misty Valley' },
  { id: 'wallpaper-3', src: wallpaper3, name: 'Winter Forest' },
  { id: 'wallpaper-4', src: wallpaper4, name: 'Minecraft Mountains' },
];

type SectionId =
  | 'appearance' | 'wallpaper' | 'general' | 'accessibility'
  | 'wifi' | 'bluetooth' | 'battery' | 'sound' | 'displays'
  | 'privacy' | 'desktop' | 'browser';

const SUGGESTIONS: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }>; tint: string }[] = [
  { id: 'displays', label: 'Displays', icon: Sun, tint: 'bg-blue-500' },
  { id: 'battery', label: 'Battery', icon: Battery, tint: 'bg-green-500' },
  { id: 'privacy', label: 'Privacy & Security', icon: Lock, tint: 'bg-violet-500' },
  { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth, tint: 'bg-blue-600' },
  { id: 'desktop', label: 'Desktop & Dock', icon: Layout, tint: 'bg-neutral-700' },
];

const NAV: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }>; tint: string }[] = [
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, tint: 'bg-blue-500' },
  { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth, tint: 'bg-blue-600' },
  { id: 'battery', label: 'Battery', icon: Battery, tint: 'bg-green-500' },
  { id: 'general', label: 'General', icon: Sparkles, tint: 'bg-neutral-500' },
  { id: 'accessibility', label: 'Accessibility', icon: Eye, tint: 'bg-blue-400' },
  { id: 'appearance', label: 'Appearance', icon: Palette, tint: 'bg-neutral-800' },
  { id: 'browser', label: 'Default Browser', icon: Compass, tint: 'bg-blue-500' },
  { id: 'desktop', label: 'Desktop & Dock', icon: Layout, tint: 'bg-neutral-700' },
  { id: 'displays', label: 'Displays', icon: Sun, tint: 'bg-blue-500' },
  { id: 'sound', label: 'Sound', icon: Volume2, tint: 'bg-pink-500' },
  { id: 'wallpaper', label: 'Wallpaper', icon: Monitor, tint: 'bg-cyan-500' },
  { id: 'privacy', label: 'Privacy & Security', icon: Lock, tint: 'bg-violet-500' },
  { id: 'general' as SectionId, label: 'Keyboard', icon: Keyboard, tint: 'bg-neutral-500' },
];

export const SettingsApp = () => {
  const { settings, updateSettings } = useMacOS();
  const googleInstalled = useGoogleInstalled();
  const [section, setSection] = useState<SectionId>('appearance');
  const [query, setQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredNav = NAV.filter(n => !query || n.label.toLowerCase().includes(query.toLowerCase()));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && /image\/(jpeg|jpg|png)/.test(file.type)) {
      const reader = new FileReader();
      reader.onload = ev => updateSettings({ wallpaper: ev.target?.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full w-full flex bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 text-[13px]">
      {/* Sidebar */}
      <aside className="w-[230px] shrink-0 bg-neutral-200/70 dark:bg-neutral-900/70 backdrop-blur-xl border-r border-black/5 dark:border-white/5 flex flex-col">
        {/* Profile card */}
        <button
          onClick={() => setSection('general')}
          className="mx-3 mt-3 mb-1 flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-neutral-300/60 dark:hover:bg-neutral-800/60 text-left"
        >
          <img src={profilePhoto} alt="Thanas R" className="w-10 h-10 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/10" />
          <div className="min-w-0">
            <div className="text-[12.5px] font-semibold truncate">Thanas R</div>
            <div className="text-[10.5px] text-neutral-500 dark:text-neutral-400 truncate">Apple Account</div>
          </div>
        </button>
        <div className="px-3 pt-1 pb-2">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 shadow-inner">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent outline-none text-[12.5px]"
            />
          </div>
        </div>
        {!query && (
          <div className="px-2 mt-1 mb-1">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Suggestions</div>
            {SUGGESTIONS.map(s => (
              <NavRow key={`sg-${s.id}`} {...s} active={section === s.id} onClick={() => setSection(s.id)} />
            ))}
            <div className="h-3" />
          </div>
        )}
        <nav className="flex-1 overflow-auto px-2 pb-3 space-y-0.5">
          {filteredNav.map((n, i) => (
            <NavRow key={`nv-${n.id}-${i}`} {...n} active={section === n.id} onClick={() => setSection(n.id)} />
          ))}
        </nav>
      </aside>

      {/* Main pane */}
      <div className="flex-1 overflow-auto bg-white dark:bg-neutral-900">
        <div className="px-7 pt-5 pb-10 max-w-3xl">
          <h1 className="text-[20px] font-semibold mb-5">{NAV.find(n => n.id === section)?.label || 'Settings'}</h1>

          {section === 'appearance' && (
            <div className="space-y-5">
              <Card>
                <Row label="Appearance" desc="Choose your accent style.">
                  <div className="flex gap-3">
                    {(['auto', 'light', 'dark'] as const).map(opt => {
                      const active =
                        (opt === 'auto' && settings.theme === 'light') ||
                        opt === settings.theme;
                      return (
                        <button
                          key={opt}
                          onClick={() => updateSettings({ theme: opt === 'dark' ? 'dark' : 'light' })}
                          className={`flex flex-col items-center gap-1 px-1 ${active ? '' : 'opacity-70 hover:opacity-100'}`}
                        >
                          <div
                            className={`w-16 h-10 rounded-md ring-2 ${active ? 'ring-blue-500' : 'ring-transparent'}`}
                            style={{
                              background:
                                opt === 'auto'
                                  ? 'linear-gradient(90deg,#fff 50%,#1c1c1e 50%)'
                                  : opt === 'light'
                                    ? '#f5f5f7'
                                    : '#1c1c1e',
                            }}
                          />
                          <div className="text-[11px] capitalize">{opt}</div>
                        </button>
                      );
                    })}
                  </div>
                </Row>
                <Row label="Reduced Motion" desc="Minimize animations across the system.">
                  <Toggle checked={!!settings.reducedMotion} onChange={v => updateSettings({ reducedMotion: v })} />
                </Row>
              </Card>
              <Card>
                <Row label="Liquid Glass" desc="Choose your preferred look for Liquid Glass.">
                  <div className="flex gap-3 text-[11px]">
                    <Swatch label="Clear" gradient="linear-gradient(135deg,#7fb6ff,#bfe3ff)" active />
                    <Swatch label="Tinted" gradient="linear-gradient(135deg,#dfe7f0,#bfcad8)" />
                  </div>
                </Row>
              </Card>
            </div>
          )}

          {section === 'browser' && (
            <Card>
              <Row label="Default web browser" desc={googleInstalled ? 'Pick which browser opens links by default.' : 'Install Google from the App Store to use it as the default browser.'}>
                <div className="flex gap-3">
                  <BrowserChoice
                    img={safariIcon}
                    label="Safari"
                    active={settings.defaultBrowser !== 'google' || !googleInstalled}
                    onClick={() => updateSettings({ defaultBrowser: 'safari' })}
                  />
                  <BrowserChoice
                    img={googleIcon}
                    label="Google"
                    disabled={!googleInstalled}
                    active={!!googleInstalled && settings.defaultBrowser === 'google'}
                    onClick={() => updateSettings({ defaultBrowser: 'google' })}
                  />
                </div>
              </Row>
            </Card>
          )}

          {section === 'wallpaper' && (
            <Card>
              <div className="grid grid-cols-2 gap-3">
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
              <div className="mt-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[12px] px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200"
                >
                  Choose custom image…
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
            </Card>
          )}

          {section === 'wifi' && (
            <Card>
              <Row label="Wi-Fi" desc={settings.wifi ? 'ThanasOS-Net' : 'Off'}>
                <Toggle checked={!!settings.wifi} onChange={v => updateSettings({ wifi: v })} />
              </Row>
            </Card>
          )}

          {section === 'bluetooth' && (
            <Card>
              <Row label="Bluetooth" desc={settings.bluetooth ? 'On' : 'Off'}>
                <Toggle checked={!!settings.bluetooth} onChange={v => updateSettings({ bluetooth: v })} />
              </Row>
            </Card>
          )}

          {section === 'battery' && (
            <Card>
              <Row label="Battery health" desc="100% — Normal" />
              <Row label="Low Power Mode" desc="Reduce energy use to extend battery life.">
                <Toggle checked={false} onChange={() => {}} />
              </Row>
            </Card>
          )}

          {section === 'sound' && (
            <Card>
              <Row label="Output Volume" desc={`${settings.volume ?? 65}%`}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.volume ?? 65}
                  onChange={e => updateSettings({ volume: +e.target.value })}
                  className="w-48"
                />
              </Row>
            </Card>
          )}

          {section === 'displays' && (
            <Card>
              <Row label="Brightness" desc={`${settings.brightness ?? 100}%`}>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={settings.brightness ?? 100}
                  onChange={e => updateSettings({ brightness: +e.target.value })}
                  className="w-48"
                />
              </Row>
            </Card>
          )}

          {section === 'desktop' && (
            <Card>
              <Row label="Auto-hide Dock" desc="Show the dock only on hover.">
                <Toggle checked={!!settings.dockAutoHide} onChange={v => updateSettings({ dockAutoHide: v })} />
              </Row>
            </Card>
          )}

          {section === 'general' && (
            <>
              <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/60 ring-1 ring-black/5 dark:ring-white/5 p-5 mb-4 flex items-center gap-4">
                <img src={profilePhoto} alt="Thanas R" className="w-16 h-16 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/10" />
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold">Thanas R</div>
                  <div className="text-[12px] text-neutral-500 dark:text-neutral-400">thanas@thanasos.dev</div>
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Apple Account · iCloud · Family</div>
                </div>
              </div>
              <Card>
                <Row label="About" desc="ThanasOS-Max · Version 1.0" />
                <Row label="Software Update" desc="Your system is up to date." />
              </Card>
            </>
          )}

          {section === 'accessibility' && (
            <Card>
              <Row label="Reduce Transparency" desc="Use solid backgrounds in place of frosted ones.">
                <Toggle checked={false} onChange={() => {}} />
              </Row>
              <Row label="Increase Contrast" desc="Enhance text and interface contrast.">
                <Toggle checked={false} onChange={() => {}} />
              </Row>
            </Card>
          )}

          {section === 'privacy' && (
            <Card>
              <Row label="Location Services" desc="Off">
                <Toggle checked={false} onChange={() => {}} />
              </Row>
              <Row label="Analytics & Improvements" desc="Help improve ThanasOS by sharing analytics.">
                <Toggle checked={false} onChange={() => {}} />
              </Row>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const NavRow = ({
  label, icon: I, tint, active, onClick,
}: {
  label: string; icon: React.ComponentType<{ className?: string }>; tint: string; active: boolean; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-2 py-1 rounded-md text-[12.5px] transition-colors ${
      active ? 'bg-neutral-300/80 dark:bg-neutral-700/70 text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/60'
    }`}
  >
    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-white ${tint}`}>
      <I className="w-3 h-3" />
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

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-9 h-5 rounded-full transition-colors ${checked ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`}
    />
  </button>
);

const Swatch = ({ label, gradient, active }: { label: string; gradient: string; active?: boolean }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className={`w-20 h-12 rounded-md ring-2 ${active ? 'ring-blue-500' : 'ring-transparent'}`}
      style={{ background: gradient }}
    />
    <div className="text-[11px]">{label}</div>
  </div>
);

const BrowserChoice = ({
  img, label, active, disabled, onClick,
}: { img: string; label: string; active: boolean; disabled?: boolean; onClick: () => void }) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`flex flex-col items-center gap-1 p-2 rounded-lg ring-2 transition-colors ${
      active ? 'ring-blue-500' : 'ring-transparent'
    } ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
  >
    <img src={img} alt={label} className="w-10 h-10 object-contain" />
    <div className="text-[11px]">{label}</div>
  </button>
);
