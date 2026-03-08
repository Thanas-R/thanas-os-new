import { Code2, Database, Wrench, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const technologies = {
  languages: [
    { name: 'C', proficiency: 60, color: 'hsl(200, 50%, 50%)' },
    { name: 'C++', proficiency: 75, color: 'hsl(220, 70%, 50%)' },
    { name: 'Python', proficiency: 55, color: 'hsl(205, 100%, 50%)' },
    { name: 'Java', proficiency: 40, color: 'hsl(0, 70%, 50%)' },
    { name: 'TypeScript', proficiency: 45, color: 'hsl(211, 100%, 50%)' },
    { name: 'JavaScript', proficiency: 35, color: 'hsl(47, 100%, 50%)' },
  ],
  webTech: [
    { name: 'HTML/CSS', proficiency: 65, color: 'hsl(14, 100%, 53%)' },
    { name: 'React', proficiency: 50, color: 'hsl(193, 95%, 68%)' },
    { name: 'Tailwind CSS', proficiency: 60, color: 'hsl(198, 93%, 60%)' },
  ],
  tools: [
    { name: 'VS Code', proficiency: 90, color: 'hsl(211, 100%, 50%)' },
    { name: 'Git', proficiency: 65, color: 'hsl(14, 100%, 53%)' },
    { name: 'Vercel', proficiency: 70, color: 'hsl(0, 0%, 20%)' },
    { name: 'PyCharm', proficiency: 50, color: 'hsl(130, 70%, 45%)' },
  ],
  ai: [
    { name: 'Prompt Engineering', proficiency: 95, color: 'hsl(280, 70%, 60%)' },
    { name: 'Machine Learning', proficiency: 50, color: 'hsl(260, 70%, 60%)' },
    { name: 'UI/UX Design', proficiency: 75, color: 'hsl(340, 80%, 55%)' },
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
          C, C++, Python, Java, TypeScript, JavaScript, HTML, React, VS Code, PyCharm, Git, Vercel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TechCategory title="Programming Languages" icon={Code2} techs={technologies.languages} />
        <TechCategory title="Web Technologies" icon={Database} techs={technologies.webTech} />
        <TechCategory title="Tools & Platforms" icon={Wrench} techs={technologies.tools} />
        <TechCategory title="AI & Specializations" icon={Sparkles} techs={technologies.ai} />
      </div>

      <div className="mt-8 p-6 bg-primary/10 border-2 border-primary/20 rounded-xl">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Strengths
        </h3>
        <p className="text-sm text-muted-foreground">
          Frontend Development, AI/ML Concepts, Full-stack Deployment, UI/UX Creativity, 
          Interactive Web Design. Team-oriented, Problem Solver, Community Builder.
        </p>
      </div>
    </div>
  );
};
