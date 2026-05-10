import nautilusIcon from '@/assets/nautilus-icon.png';
import virdisIcon from '@/assets/virdis-icon.png';
import sphealIcon from '@/assets/spheal-icon.png';
import pesuMcIcon from '@/assets/pesu-mc-s2-icon.png';
import askbookieIcon from '@/assets/askbookie-icon.png';
import smartChefIcon from '@/assets/smart-chef-new-icon.png';
import contourFlowIcon from '@/assets/contour-flow-icon.png';
import thanasosIcon from '@/assets/thanasos-turtle-icon.png';
import pesuForgeIcon from '@/assets/odintree-icon.png';
import odintreeIcon from '@/assets/pesuforge-shield-icon.png';
import portfolioIcon from '@/assets/portfolio-icon.png';
import askpesuIcon from '@/assets/askpesu-rowlet-icon.png';

export interface Project {
  id: string;
  name: string;
  description: string;
  liveUrl: string;
  githubUrl: string;
  favicon: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'nautilus',
    name: 'Nautilus',
    description: 'AI knowledge tool with mindmaps, flowcharts and concept cards',
    liveUrl: 'https://nautilus-build.vercel.app',
    githubUrl: 'https://github.com/Thanas-R',
    favicon: nautilusIcon,
  },
  {
    id: 'virdis',
    name: 'Virdis',
    description: 'AI-powered farm boundary mapping and crop health analysis',
    liveUrl: 'https://virdis.vercel.app',
    githubUrl: 'https://github.com/Thanas-R',
    favicon: virdisIcon,
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'My main personal portfolio website.',
    liveUrl: 'https://thanas.vercel.app',
    githubUrl: 'https://github.com/Thanas-R',
    favicon: portfolioIcon,
  },
  {
    id: 'spheal',
    name: 'Spheal',
    description: 'Smart AI travel planner with interactive map visualization',
    liveUrl: 'https://spheal-worldwide.vercel.app',
    githubUrl: 'https://github.com/Thanas-R',
    favicon: sphealIcon,
  },
  {
    id: 'pesu-mc',
    name: 'PESU Minecraft S2',
    description: 'Official website for PESU Minecraft Server Season 2',
    liveUrl: 'https://pesu-mc.vercel.app',
    githubUrl: 'https://github.com/Thanas-R',
    favicon: pesuMcIcon,
  },
  {
    id: 'askbookie',
    name: 'AskBookie',
    description: 'Production-ready RAG API frontend for document Q&A',
    liveUrl: 'https://ask-bookie.vercel.app',
    githubUrl: 'https://github.com/Thanas-R',
    favicon: askbookieIcon,
  },
  {
    id: 'askpesu',
    name: 'AskPESU',
    description: 'A focused Q&A tool for PESU students.',
    liveUrl: 'https://askpesu.vercel.app/',
    githubUrl: 'https://github.com/Thanas-R',
    favicon: askpesuIcon,
  },
  {
    id: 'smart-chef',
    name: 'Smart Chef',
    description: 'In-memory Vector Space Model using TF-IDF for recipe recommendations',
    liveUrl: 'https://smart-chef-pesu.vercel.app',
    githubUrl: 'https://github.com/Thanas-R',
    favicon: smartChefIcon,
  },
  {
    id: 'contour-flow',
    name: 'Contour Flow',
    description: 'Real-time procedural topographic map generator rendered to canvas',
    liveUrl: 'https://contour-flow.vercel.app',
    githubUrl: 'https://github.com/Thanas-R',
    favicon: contourFlowIcon,
  },
  {
    id: 'thanasos',
    name: 'ThanasOS',
    description: 'macOS-themed interactive portfolio',
    liveUrl: 'https://thanas-os.vercel.app',
    githubUrl: 'https://github.com/Thanas-R',
    favicon: thanasosIcon,
  },
  {
    id: 'pesu-forge',
    name: 'PESU Forge',
    description: 'AI-powered study tool with flashcards, quizzes, and mind maps',
    liveUrl: 'https://pesuforge.vercel.app',
    githubUrl: 'https://github.com/Thanas-R',
    favicon: pesuForgeIcon,
  },
  {
    id: 'odintree',
    name: 'OdinTree',
    description: 'A focused repository explorer and project landing page.',
    liveUrl: 'https://odintree.vercel.app/',
    githubUrl: 'https://github.com/Thanas-R',
    favicon: odintreeIcon,
  },
];

export const getProject = (id: string) => PROJECTS.find(p => p.id === id);
