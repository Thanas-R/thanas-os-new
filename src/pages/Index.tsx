import { useState, useEffect } from 'react';
import { MacOSProvider } from '@/contexts/MacOSContext';
import { Desktop } from '@/components/macos/Desktop';
import { LockScreen } from '@/components/macos/LockScreen';
import { SleepScreen } from '@/components/macos/SleepScreen';
import { RestartScreen } from '@/components/macos/RestartScreen';
import { HelloIntro } from '@/components/macos/HelloIntro';
import { MobileFallback } from '@/components/MobileFallback';
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
  { id: 'finder', name: 'Finder', icon: '📁', component: FinderApp, defaultSize: { width: 930, height: 600 }, chromeMode: 'integrated' },
  { id: 'launchpad', name: 'Launchpad', icon: '🚀', component: LaunchpadApp, defaultSize: { width: 1000, height: 700 } },
  { id: 'terminal', name: 'Terminal', icon: '💻', component: TerminalApp, defaultSize: { width: 870, height: 775 }, chromeMode: 'transparent', chromeColor: '#1d1f21' },
  { id: 'journey', name: 'Journey', icon: '🚀', component: JourneyApp, defaultSize: { width: 1200, height: 825 }, chromeMode: 'integrated' },
  { id: 'notes', name: 'Notes', icon: '📒', component: NotesApp, defaultSize: { width: 1100, height: 780 }, chromeMode: 'integrated' },
  { id: 'maps', name: 'Maps', icon: '🗺️', component: MapsApp, defaultSize: { width: 900, height: 650 }, chromeMode: 'integrated' },
  { id: 'calendar', name: 'Calendar', icon: '📅', component: CalendarApp, defaultSize: { width: 1300, height: 900 }, chromeMode: 'integrated' },
  { id: 'technologies', name: 'VS Code', icon: '⚙️', component: TechnologiesApp, defaultSize: { width: 1370, height: 950 }, chromeMode: 'transparent', chromeColor: '#3B3B3B' },
  { id: 'safari', name: 'Safari', icon: '🧭', component: SafariApp, defaultSize: { width: 1380, height: 1070 }, chromeMode: 'integrated' },
  { id: 'google', name: 'Google', icon: 'G', component: GoogleApp, defaultSize: { width: 1380, height: 1070 }, chromeMode: 'integrated' },
  { id: 'applemusic', name: 'Music', icon: '🎵', component: AppleMusicApp, defaultSize: { width: 1320, height: 950 }, chromeMode: 'integrated' },
  { id: 'github', name: 'GitHub', icon: '🐙', component: GitHubApp, defaultSize: { width: 1070, height: 930 }, chromeMode: 'integrated' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', component: LinkedInApp, defaultSize: { width: 1080, height: 880 }, chromeMode: 'integrated' },
  { id: 'contact', name: 'Contact', icon: '✉️', component: ContactApp, defaultSize: { width: 850, height: 750 }, chromeMode: 'integrated' },
  { id: 'calculator', name: 'Calculator', icon: '🧮', component: CalculatorApp, defaultSize: { width: 300, height: 520 }, nonResizable: true, noMaximize: true, chromeMode: 'integrated' },
  { id: 'appstore', name: 'App Store', icon: '🛍️', component: AppStoreApp, defaultSize: { width: 1100, height: 680 }, chromeMode: 'integrated' },
  { id: 'settings', name: 'Settings', icon: '⚙️', component: SettingsApp, defaultSize: { width: 1000, height: 790 }, chromeMode: 'integrated' },
];

const VISITED_KEY = 'thanasos-visited-v1';

const detectIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
};

const Index = () => {
  const [isMobile, setIsMobile] = useState(detectIsMobile);
  const [showHello, setShowHello] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem(VISITED_KEY);
  });
  const [locked, setLocked] = useState(true);
  const [relocking, setRelocking] = useState(false); // animate lock screen back IN
  const [sleeping, setSleeping] = useState(false);
  const [restarting, setRestarting] = useState(false);

  // System theme detection — respects user's OS preference unless they've set one
  useEffect(() => {
    try {
      const saved = localStorage.getItem('macos-settings');
      if (saved && JSON.parse(saved).theme) return; // user already chose
    } catch { /* ignore */ }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const cur = JSON.parse(localStorage.getItem('macos-settings') || '{}');
    localStorage.setItem('macos-settings', JSON.stringify({ ...cur, theme: prefersDark ? 'dark' : 'light' }));
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-mobile', isMobile);
  }, [isMobile]);

  useEffect(() => {
    const onResize = () => setIsMobile(detectIsMobile());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onLock = () => {
      // Reverse-swipe: render lock screen sliding down from top
      setRelocking(true);
      setLocked(true);
      // Clear flag so subsequent unlocks behave normally
      setTimeout(() => setRelocking(false), 750);
    };
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

  const finishHello = () => {
    sessionStorage.setItem(VISITED_KEY, '1');
    setShowHello(false);
  };

  if (isMobile) return <MobileFallback />;

  return (
    <MacOSProvider apps={apps}>
      <Desktop />
      {locked && <LockScreen onUnlock={() => setLocked(false)} enterFromTop={relocking} />}
      {sleeping && <SleepScreen onWake={() => setSleeping(false)} />}
      {restarting && <RestartScreen onDone={() => { /* handled by timeout */ }} durationMs={10000} />}
      {showHello && <HelloIntro onDone={finishHello} />}
    </MacOSProvider>
  );
};

export default Index;
