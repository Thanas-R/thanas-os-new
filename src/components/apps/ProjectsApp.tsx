import { ExternalLink, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

const projects = [
  {
    name: 'Nautilus',
    description: 'AI knowledge tool with mindmaps, flowcharts & concept cards for enhanced learning.',
    tags: ['React', 'Canvas', 'AI', 'TypeScript'],
    link: 'https://nautilus-app.vercel.app/',
  },
  {
    name: 'Virdis',
    description: 'AI-powered farm boundary mapping & crop health analysis using satellite imagery.',
    tags: ['React', 'Mapbox', 'Python', 'Satellite', 'AI'],
    link: 'https://virdis-app.vercel.app/',
  },
  {
    name: 'Spheal',
    description: 'Smart AI travel planner with interactive map visualization for trip planning.',
    tags: ['React', 'Mapbox', 'AI', 'TypeScript'],
    link: 'https://spheal-app.vercel.app/',
  },
  {
    name: 'PESU Minecraft S2',
    description: 'Official website for PESU Minecraft Server – Season 2. Community gaming hub.',
    tags: ['React', 'Tailwind', 'Vercel', 'REST API'],
    link: 'https://pesu-mc.vercel.app/',
  },
  {
    name: 'AskBookie_',
    description: 'Production-ready RAG API frontend for document Q&A with AI-powered retrieval.',
    tags: ['React', 'TypeScript', 'RAG', 'Framer Motion'],
    link: 'https://askbookie.vercel.app/',
  },
  {
    name: 'Contour Flow Demo',
    description: 'Interactive animated topographic contour flow visualization using WebGL shaders.',
    tags: ['WebGL', 'Canvas', 'Shaders', 'Creative Coding'],
    link: null,
  },
  {
    name: 'Smart Chef',
    description: 'In-memory Vector Space Model using TF-IDF for intelligent recipe matching.',
    tags: ['Python', 'TF-IDF', 'NLP', 'VSM'],
    link: 'https://smart-chef-pesu.vercel.app/',
  },
  {
    name: 'ThanasOS',
    description: 'macOS-themed interactive portfolio website with window management and dock.',
    tags: ['React', 'CSS', 'Framer Motion'],
    link: null,
  },
  {
    name: 'PESU Forge',
    description: 'Collaborative academic resource platform for PES University students.',
    tags: ['React', 'Supabase', 'Tailwind', 'TypeScript'],
    link: 'https://pesu-forge.vercel.app/',
  },
];

export const ProjectsApp = () => {
  return (
    <div className="p-8 space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-muted-foreground">11 projects built - here are the highlights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.name} className="bg-secondary rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold">{project.name}</h3>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-background rounded transition-colors">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">{tag}</span>
              ))}
            </div>
          </div>
          ))}
      </div>

      <a
        href="https://thanas.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
      >
        <ExternalLink className="w-5 h-5 text-primary" />
        <div>
          <span className="text-sm font-semibold text-primary">See all projects on my portfolio</span>
          <p className="text-xs text-muted-foreground">thanas.vercel.app — with full details and live demos</p>
        </div>
      </a>
    </div>
  );
};
