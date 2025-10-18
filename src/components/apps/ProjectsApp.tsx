import { ExternalLink, Code, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProjectsApp = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-muted-foreground">Featured work and ongoing developments</p>
      </div>

      <div className="bg-secondary rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-start gap-4">
          <div className="text-6xl">📚</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">PESU-Forge</h3>
            <p className="text-muted-foreground mb-4">
              A comprehensive platform for PES University students, featuring course resources, collaboration tools, and academic management systems.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">React</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">TypeScript</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Node.js</span>
            </div>
            <Button asChild>
              <a href="https://pesu-forge.vercel.app/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />Visit Project
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
        <h3 className="text-xl font-semibold mb-2">More Projects Coming Soon</h3>
        <p className="text-muted-foreground">Currently working on multiple exciting projects. Stay tuned!</p>
      </div>
    </div>
  );
};
