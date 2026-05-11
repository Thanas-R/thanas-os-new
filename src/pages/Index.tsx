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
import { CalculatorApp } from '@/components/apps/CalculatorApp';
import { GoogleApp } from '@/components/apps/GoogleApp';

import { AppConfig } from '@/types/macos';

// Dock order: finder, launchpad, terminal, about, journey, notes, projects, technologies, safari, google, github, linkedin, contact, calculator, appstore, settings
const apps: AppConfig[] = [
  { id: 'finder', name: 'Finder', icon: '📁', component: FinderApp, defaultSize: { width: 900, height: 650 } },
  { id: 'launchpad', name: 'Launchpad', icon: '🚀', component: LaunchpadApp, defaultSize: { width: 1000, height: 700 } },
  { id: 'terminal', name: 'Terminal', icon: '💻', component: TerminalApp, defaultSize: { width: 780, height: 500 } },
  { id: 'about', name: 'About Me', icon: '👨‍💻', component: AboutApp, defaultSize: { width: 700, height: 600 } },
  { id: 'journey', name: 'Journey', icon: '🚀', component: JourneyApp, defaultSize: { width: 750, height: 600 } },
  { id: 'notes', name: 'Notes', icon: '📒', component: NotesApp, defaultSize: { width: 980, height: 640 } },
  { id: 'projects', name: 'Projects', icon: '💼', component: ProjectsApp, defaultSize: { width: 850, height: 650 } },
  { id: 'technologies', name: 'VS Code', icon: '⚙️', component: TechnologiesApp, defaultSize: { width: 1100, height: 700 } },
  { id: 'safari', name: 'Safari', icon: '🧭', component: SafariApp, defaultSize: { width: 1100, height: 720 } },
  // Google placed right after Safari so the dock places it next to Safari when installed
  { id: 'google', name: 'Google', icon: 'G', component: GoogleApp, defaultSize: { width: 1100, height: 720 } },
  { id: 'github', name: 'GitHub', icon: '🐙', component: GitHubApp, defaultSize: { width: 800, height: 650 } },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', component: LinkedInApp, defaultSize: { width: 750, height: 600 } },
  { id: 'contact', name: 'Contact', icon: '✉️', component: ContactApp, defaultSize: { width: 650, height: 600 } },
  { id: 'calculator', name: 'Calculator', icon: '🧮', component: CalculatorApp, defaultSize: { width: 360, height: 520 } },
  { id: 'appstore', name: 'App Store', icon: '🛍️', component: AppStoreApp, defaultSize: { width: 950, height: 680 } },
  { id: 'settings', name: 'Settings', icon: '⚙️', component: SettingsApp, defaultSize: { width: 750, height: 650 } },
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
