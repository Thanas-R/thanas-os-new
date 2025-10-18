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

import { AppConfig } from '@/types/macos';

const apps: AppConfig[] = [
  {
    id: 'about',
    name: 'About Me',
    icon: '👨‍💻',
    component: AboutApp,
    defaultSize: { width: 900, height: 700 },
    minSize: { width: 600, height: 500 },
  },
  {
    id: 'technologies',
    name: 'Technologies',
    icon: '⚙️',
    component: TechnologiesApp,
    defaultSize: { width: 1000, height: 800 },
    minSize: { width: 700, height: 600 },
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: '💼',
    component: ProjectsApp,
    defaultSize: { width: 1100, height: 800 },
    minSize: { width: 800, height: 600 },
  },
  {
    id: 'journey',
    name: 'Journey',
    icon: '🚀',
    component: JourneyApp,
    defaultSize: { width: 900, height: 750 },
    minSize: { width: 600, height: 500 },
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '🐙',
    component: GitHubApp,
    defaultSize: { width: 1000, height: 800 },
    minSize: { width: 700, height: 600 },
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    component: LinkedInApp,
    defaultSize: { width: 850, height: 750 },
    minSize: { width: 600, height: 500 },
  },
  {
    id: 'contact',
    name: 'Contact',
    icon: '✉️',
    component: ContactApp,
    defaultSize: { width: 700, height: 700 },
    minSize: { width: 500, height: 500 },
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    component: SettingsApp,
    defaultSize: { width: 850, height: 800 },
    minSize: { width: 650, height: 600 },
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
