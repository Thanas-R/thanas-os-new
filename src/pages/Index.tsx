import { MacOSProvider } from '@/contexts/MacOSContext';
import { Desktop } from '@/components/macos/Desktop';
import { AboutApp } from '@/components/apps/AboutApp';
import { TechnologiesApp } from '@/components/apps/TechnologiesApp';
import { ProjectsApp } from '@/components/apps/ProjectsApp';
import { JourneyApp } from '@/components/apps/JourneyApp';
import { ContactApp } from '@/components/apps/ContactApp';
import { GitHubApp } from '@/components/apps/GitHubApp';
import { LinkedInApp } from '@/components/apps/LinkedInApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { FinderApp } from '@/components/apps/FinderApp';

import { AppConfig } from '@/types/macos';

const apps: AppConfig[] = [
  {
    id: 'finder',
    name: 'Finder',
    icon: '📁',
    component: FinderApp,
    defaultSize: { width: 900, height: 650 },
    minSize: { width: 700, height: 500 },
  },
  {
    id: 'about',
    name: 'About Me',
    icon: '👨‍💻',
    component: AboutApp,
    defaultSize: { width: 700, height: 600 },
    minSize: { width: 500, height: 400 },
  },
  {
    id: 'technologies',
    name: 'Technologies',
    icon: '⚙️',
    component: TechnologiesApp,
    defaultSize: { width: 800, height: 650 },
    minSize: { width: 600, height: 500 },
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '💼',
    component: ProjectsApp,
    defaultSize: { width: 850, height: 650 },
    minSize: { width: 650, height: 500 },
  },
  {
    id: 'journey',
    name: 'Journey',
    icon: '🚀',
    component: JourneyApp,
    defaultSize: { width: 750, height: 600 },
    minSize: { width: 550, height: 450 },
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '🐙',
    component: GitHubApp,
    defaultSize: { width: 800, height: 650 },
    minSize: { width: 600, height: 500 },
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    component: LinkedInApp,
    defaultSize: { width: 750, height: 600 },
    minSize: { width: 550, height: 450 },
  },
  {
    id: 'contact',
    name: 'Contact',
    icon: '✉️',
    component: ContactApp,
    defaultSize: { width: 650, height: 600 },
    minSize: { width: 450, height: 450 },
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    component: SettingsApp,
    defaultSize: { width: 750, height: 650 },
    minSize: { width: 600, height: 550 },
  },
];

const Index = () => {
  return (
    <MacOSProvider apps={apps}>
      <Desktop />
    </MacOSProvider>
  );
};

export default Index;
