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
    githubUrl: 'https://github.com',
    favicon: 'https://www.google.com/s2/favicons?domain=nautilus-build.vercel.app&sz=128',
  },
  {
    id: 'virdis',
    name: 'Virdis',
    description: 'AI-powered farm boundary mapping and crop health analysis',
    liveUrl: 'https://virdis.vercel.app',
    githubUrl: 'https://github.com',
    favicon: 'https://www.google.com/s2/favicons?domain=virdis.vercel.app&sz=128',
  },
  {
    id: 'spheal',
    name: 'Spheal',
    description: 'Smart AI travel planner with interactive map visualization',
    liveUrl: 'https://spheal-worldwide.vercel.app',
    githubUrl: 'https://github.com',
    favicon: 'https://www.google.com/s2/favicons?domain=spheal-worldwide.vercel.app&sz=128',
  },
  {
    id: 'pesu-mc',
    name: 'PESU Minecraft S2',
    description: 'Official website for PESU Minecraft Server Season 2',
    liveUrl: 'https://pesu-mc.vercel.app',
    githubUrl: 'https://github.com',
    favicon: 'https://www.google.com/s2/favicons?domain=pesu-mc.vercel.app&sz=128',
  },
  {
    id: 'askbookie',
    name: 'AskBookie',
    description: 'Production-ready RAG API frontend for document Q&A',
    liveUrl: 'https://ask-bookie.vercel.app',
    githubUrl: 'https://github.com',
    favicon: 'https://www.google.com/s2/favicons?domain=ask-bookie.vercel.app&sz=128',
  },
  {
    id: 'contour-flow',
    name: 'Contour Flow',
    description: 'Real-time procedural topographic map generator rendered to canvas',
    liveUrl: 'https://contour-flow.vercel.app',
    githubUrl: 'https://github.com',
    favicon: 'https://www.google.com/s2/favicons?domain=contour-flow.vercel.app&sz=128',
  },
  {
    id: 'smart-chef',
    name: 'Smart Chef',
    description: 'In-memory Vector Space Model using TF-IDF for recipe recommendations',
    liveUrl: 'https://smart-chef-pesu.vercel.app',
    githubUrl: 'https://github.com',
    favicon: 'https://www.google.com/s2/favicons?domain=smart-chef-pesu.vercel.app&sz=128',
  },
  {
    id: 'thanasos',
    name: 'ThanasOS',
    description: 'macOS-themed interactive portfolio',
    liveUrl: 'https://thanas-os.vercel.app',
    githubUrl: 'https://github.com',
    favicon: 'https://www.google.com/s2/favicons?domain=thanas-os.vercel.app&sz=128',
  },
  {
    id: 'pesu-forge',
    name: 'PESU Forge',
    description: 'AI-powered study tool with flashcards, quizzes, and mind maps',
    liveUrl: 'https://pesuforge.vercel.app',
    githubUrl: 'https://github.com',
    favicon: 'https://www.google.com/s2/favicons?domain=pesuforge.vercel.app&sz=128',
  },
];

export const getProject = (id: string) => PROJECTS.find(p => p.id === id);
