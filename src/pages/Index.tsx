import { useState, useEffect } from 'react';
import { MacOSProvider } from '@/contexts/MacOSContext';
import { Desktop } from '@/components/macos/Desktop';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { AboutApp } from '@/components/apps/AboutApp';
import { TechnologiesApp } from '@/components/apps/TechnologiesApp';
import { ProjectsApp } from '@/components/apps/ProjectsApp';
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

import { AppConfig } from '@/types/macos';

const apps: AppConfig[] = [
  { id: 'finder', name: 'Finder', icon: '📁', component: FinderApp, defaultSize: { width: 900, height: 650 }, minSize: { width: 700, height: 500 } },
  { id: 'launchpad', name: 'Launchpad', icon: '🚀', component: LaunchpadApp, defaultSize: { width: 1000, height: 700 }, minSize: { width: 700, height: 500 } },
  { id: 'safari', name: 'Safari', icon: '🧭', component: SafariApp, defaultSize: { width: 1100, height: 720 }, minSize: { width: 700, height: 500 } },
  { id: 'notes', name: 'Notes', icon: '📒', component: NotesApp, defaultSize: { width: 900, height: 620 }, minSize: { width: 600, height: 450 } },
  { id: 'terminal', name: 'Terminal', icon: '💻', component: TerminalApp, defaultSize: { width: 780, height: 500 }, minSize: { width: 500, height: 350 } },
  { id: 'appstore', name: 'App Store', icon: '🛍️', component: AppStoreApp, defaultSize: { width: 950, height: 680 }, minSize: { width: 700, height: 500 } },
  { id: 'about', name: 'About Me', icon: '👨‍💻', component: AboutApp, defaultSize: { width: 700, height: 600 }, minSize: { width: 500, height: 400 } },
  { id: 'technologies', name: 'Technologies', icon: '⚙️', component: TechnologiesApp, defaultSize: { width: 800, height: 650 }, minSize: { width: 600, height: 500 } },
  { id: 'projects', name: 'Projects', icon: '💼', component: ProjectsApp, defaultSize: { width: 850, height: 650 }, minSize: { width: 650, height: 500 } },
  { id: 'journey', name: 'Journey', icon: '🚀', component: JourneyApp, defaultSize: { width: 750, height: 600 }, minSize: { width: 550, height: 450 } },
  { id: 'github', name: 'GitHub', icon: '🐙', component: GitHubApp, defaultSize: { width: 800, height: 650 }, minSize: { width: 600, height: 500 } },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', component: LinkedInApp, defaultSize: { width: 750, height: 600 }, minSize: { width: 550, height: 450 } },
  { id: 'contact', name: 'Contact', icon: '✉️', component: ContactApp, defaultSize: { width: 650, height: 600 }, minSize: { width: 450, height: 450 } },
  { id: 'settings', name: 'Settings', icon: '⚙️', component: SettingsApp, defaultSize: { width: 750, height: 650 }, minSize: { width: 600, height: 550 } },
];

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('hasSeenWelcome')) setShowWelcome(false);
  }, []);

  const handleEnterSite = () => {
    sessionStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  return (
    <MacOSProvider apps={apps}>
      <Desktop />
      {showWelcome && <WelcomeScreen onEnter={handleEnterSite} />}
    </MacOSProvider>
  );
};

export default Index;
