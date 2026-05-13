import { useState, useEffect } from 'react';
import { MacOSProvider } from '@/contexts/MacOSContext';
import { Desktop } from '@/components/macos/Desktop';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { LockScreen } from '@/components/macos/LockScreen';
import { SleepScreen } from '@/components/macos/SleepScreen';
import { RestartScreen } from '@/components/macos/RestartScreen';
import { TechnologiesApp } from '@/components/apps/TechnologiesApp';
import { JourneyApp } from '@/components/apps/JourneyApp';
import { ContactApp } from '@/components/apps/ContactApp';
import { GitHubApp } from '@/components/apps/GitHubApp';
import { LinkedInApp } from '@/components/apps/LinkedInApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { FinderApp } from '@/components/apps/FinderApp';
import { LaunchpadApp } from '@/components/apps/LaunchpadApp';
import { TerminalApp } from '@/components/apps/TerminalApp';
import { NotesApp } from '@/components/apps/NotesApp';
import { SafariApp } from '@/components/apps/SafariApp';
import { AppStoreApp } from '@/components/apps/AppStoreApp';
import { CalculatorApp } from '@/components/apps/CalculatorApp';
import { GoogleApp } from '@/components/apps/GoogleApp';
import { CalendarApp } from '@/components/apps/CalendarApp';
import { AppleMusicApp } from '@/components/apps/AppleMusicApp';
import { MapsApp } from '@/components/apps/MapsApp';
import { AppConfig } from '@/types/macos';

const apps: AppConfig[] = [
  { id: 'finder', name: 'Finder', icon: '📁', component: FinderApp, defaultSize: { width: 850, height: 550 }, chromeMode: 'integrated' },
  { id: 'launchpad', name: 'Launchpad', icon: '🚀', component: LaunchpadApp, defaultSize: { width: 1000, height: 700 } },
  { id: 'terminal', name: 'Terminal', icon: '💻', component: TerminalApp, defaultSize: { width: 750, height: 675 }, chromeMode: 'transparent', chromeColor: '#1d1f21' },
  { id: 'journey', name: 'Journey', icon: '🚀', component: JourneyApp, defaultSize: { width: 750, height: 600 } },
  { id: 'notes', name: 'Notes', icon: '📒', component: NotesApp, defaultSize: { width: 950, height: 640 }, chromeMode: 'integrated' },
  { id: 'maps', name: 'Maps', icon: '🗺️', component: MapsApp, defaultSize: { width: 1200, height: 720 }, chromeMode: 'integrated' },
  { id: 'calendar', name: 'Calendar', icon: '📅', component: CalendarApp, defaultSize: { width: 1170, height: 750 }, chromeMode: 'integrated' },
  { id: 'technologies', name: 'VS Code', icon: '⚙️', component: TechnologiesApp, defaultSize: { width: 1100, height: 750 }, chromeMode: 'transparent', chromeColor: '#3B3B3B' },
  { id: 'safari', name: 'Safari', icon: '🧭', component: SafariApp, defaultSize: { width: 1100, height: 870 }, chromeMode: 'integrated' },
  { id: 'google', name: 'Google', icon: 'G', component: GoogleApp, defaultSize: { width: 1100, height: 870 }, chromeMode: 'integrated' },
  { id: 'applemusic', name: 'Music', icon: '🎵', component: AppleMusicApp, defaultSize: { width: 1120, height: 750 }, chromeMode: 'integrated' },
  { id: 'github', name: 'GitHub', icon: '🐙', component: GitHubApp, defaultSize: { width: 1070, height: 750 }, chromeMode: 'integrated' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', component: LinkedInApp, defaultSize: { width: 920, height: 700 }, chromeMode: 'integrated' },
  { id: 'contact', name: 'Contact', icon: '✉️', component: ContactApp, defaultSize: { width: 800, height: 650 }, chromeMode: 'integrated' },
  { id: 'calculator', name: 'Calculator', icon: '🧮', component: CalculatorApp, defaultSize: { width: 300, height: 520 }, nonResizable: true, noMaximize: true, chromeMode: 'integrated' },
  { id: 'appstore', name: 'App Store', icon: '🛍️', component: AppStoreApp, defaultSize: { width: 1100, height: 680 }, chromeMode: 'integrated' },
  { id: 'settings', name: 'Settings', icon: '⚙️', component: SettingsApp, defaultSize: { width: 900, height: 650 }, chromeMode: 'integrated' },
];

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [locked, setLocked] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [restarting, setRestarting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('hasSeenWelcome')) setShowWelcome(false);
  }, []);

  useEffect(() => {
    const onLock = () => setLocked(true);
    const onSleep = () => setSleeping(true);
    const onRestart = () => {
      setRestarting(true);
      setTimeout(() => {
        setRestarting(false);
        setLocked(true);
      }, 10000);
    };
    window.addEventListener('os:lock', onLock);
    window.addEventListener('os:sleep', onSleep);
    window.addEventListener('os:restart', onRestart);
    return () => {
      window.removeEventListener('os:lock', onLock);
      window.removeEventListener('os:sleep', onSleep);
      window.removeEventListener('os:restart', onRestart);
    };
  }, []);

  const handleEnterSite = () => {
    sessionStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  return (
    <MacOSProvider apps={apps}>
      <Desktop />
      {showWelcome && <WelcomeScreen onEnter={handleEnterSite} />}
      {locked && !showWelcome && <LockScreen onUnlock={() => setLocked(false)} />}
      {sleeping && <SleepScreen onWake={() => setSleeping(false)} />}
      {restarting && <RestartScreen onDone={() => { /* handled by timeout */ }} durationMs={10000} />}
    </MacOSProvider>
  );
};

export default Index;
