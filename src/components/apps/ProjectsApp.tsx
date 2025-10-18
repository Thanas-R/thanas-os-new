import { ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const projects = [
  {
    id: 1,
    title: 'AI Image Generator',
    description: 'A web application that uses Stable Diffusion to generate images from text prompts with advanced customization options.',
    tags: ['Python', 'React', 'TensorFlow', 'FastAPI'],
    date: '2024',
    github: 'https://github.com/Thanas-R',
    live: '#',
    image: '🎨',
  },
  {
    id: 2,
    title: 'Smart Campus System',
    description: 'IoT-based campus management system with real-time monitoring, attendance tracking, and resource optimization.',
    tags: ['IoT', 'Node.js', 'MongoDB', 'React'],
    date: '2024',
    github: 'https://github.com/Thanas-R',
    live: '#',
    image: '🏫',
  },
  {
    id: 3,
    title: 'NLP Chatbot',
    description: 'Intelligent conversational AI chatbot using transformer models for natural language understanding and generation.',
    tags: ['Python', 'NLP', 'Transformers', 'FastAPI'],
    date: '2023',
    github: 'https://github.com/Thanas-R',
    live: '#',
    image: '🤖',
  },
  {
    id: 4,
    title: 'Portfolio Website',
    description: 'This macOS-inspired portfolio website built with React, TypeScript, and modern web technologies.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    date: '2025',
    github: 'https://github.com/Thanas-R',
    live: '#',
    image: '💼',
  },
  {
    id: 5,
    title: 'Code Optimizer',
    description: 'AI-powered tool that analyzes and suggests optimizations for code performance and readability.',
    tags: ['Python', 'Machine Learning', 'Flask', 'Docker'],
    date: '2023',
    github: 'https://github.com/Thanas-R',
    live: '#',
    image: '⚡',
  },
  {
    id: 6,
    title: 'Task Management App',
    description: 'Collaborative task management platform with real-time updates, kanban boards, and team analytics.',
    tags: ['React', 'Firebase', 'Material-UI', 'TypeScript'],
    date: '2023',
    github: 'https://github.com/Thanas-R',
    live: '#',
    image: '📋',
  },
];

export const ProjectsApp = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">My Projects</h1>
        <p className="text-muted-foreground">
          A collection of projects I've built to solve problems and learn new technologies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{project.image}</div>
              <div className="flex gap-2">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{project.description}</p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Calendar className="w-3 h-3" />
              <span>{project.date}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
