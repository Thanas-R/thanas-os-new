import { Code2, Database, Brain, Wrench, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const technologies = {
  languages: [
    { name: 'C++', proficiency: 75, color: 'hsl(220, 70%, 50%)' },
    { name: 'Python', proficiency: 55, color: 'hsl(205, 100%, 50%)' },
    { name: 'Java', proficiency: 40, color: 'hsl(0, 70%, 50%)' },
  ],
  webTech: [
    { name: 'JavaScript', proficiency: 10, color: 'hsl(47, 100%, 50%)' },
    { name: 'TypeScript', proficiency: 45, color: 'hsl(211, 100%, 50%)' },
    { name: 'HTML/CSS', proficiency: 65, color: 'hsl(14, 100%, 53%)' },
  ],
  frameworks: [
    { name: 'React.js', proficiency: 30, color: 'hsl(193, 95%, 68%)' },
    { name: 'Node.js', proficiency: 30, color: 'hsl(142, 51%, 49%)' },
    { name: 'TensorFlow', proficiency: 30, color: 'hsl(35, 100%, 50%)' },
  ],
  ai: [
    { name: 'Prompt Engineering', proficiency: 95, color: 'hsl(280, 70%, 60%)' },
    { name: 'Machine Learning', proficiency: 50, color: 'hsl(260, 70%, 60%)' },
  ],
};

const TechCategory = ({ 
  title, 
  icon: Icon, 
  techs 
}: { 
  title: string; 
  icon: any; 
  techs: { name: string; proficiency: number; color: string }[] 
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-primary" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <div className="space-y-3">
      {techs.map(tech => (
        <div key={tech.name} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{tech.name}</span>
            <span className="text-muted-foreground">{tech.proficiency}%</span>
          </div>
          <Progress value={tech.proficiency} className="h-2" />
        </div>
      ))}
    </div>
  </div>
);

export const TechnologiesApp = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Tech Stack</h1>
        <p className="text-muted-foreground">
          Technologies and tools I work with to bring ideas to life
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TechCategory title="Programming Languages" icon={Code2} techs={technologies.languages} />
        <TechCategory title="Web Technologies" icon={Database} techs={technologies.webTech} />
        <TechCategory title="Frameworks & Libraries" icon={Wrench} techs={technologies.frameworks} />
        <TechCategory title="AI & Specializations" icon={Sparkles} techs={technologies.ai} />
      </div>

      <div className="mt-8 p-6 bg-primary/10 border-2 border-primary/20 rounded-xl">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Expert in UI/UX & Prompt Engineering
        </h3>
        <p className="text-sm text-muted-foreground">
          Beyond coding, I specialize in creating beautiful user interfaces and am renowned for my prompt engineering 
          skills — crafting precise, effective prompts that unlock the full potential of AI systems.
        </p>
      </div>

      <div className="mt-6 p-6 bg-secondary rounded-xl">
        <h3 className="font-semibold mb-3">Currently Learning</h3>
        <div className="flex flex-wrap gap-2">
          {['C', 'TypeScript', 'Python', 'JavaScript', 'Swift', 'React'].map(tech => (
            <span key={tech} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
