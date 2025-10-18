import { Calendar, Award, Code, GraduationCap, Briefcase } from 'lucide-react';

const milestones = [
  {
    year: '2025',
    title: 'Starting B.Tech Journey',
    description: 'Began B.Tech in Computer Science Engineering (AI/ML) at PES University, Bangalore',
    icon: GraduationCap,
    color: 'hsl(211, 100%, 50%)',
  },
  {
    year: '2023-2025',
    title: 'Allen Career Institute',
    description: 'Completed preparation for JEE while building coding skills and personal projects',
    icon: Award,
    color: 'hsl(260, 70%, 60%)',
  },
  {
    year: '2023',
    title: 'First Major Project',
    description: 'Built my first full-stack web application and discovered passion for software development',
    icon: Code,
    color: 'hsl(142, 51%, 49%)',
  },
  {
    year: '2022',
    title: 'Started Coding Journey',
    description: 'Discovered programming through Python and immediately fell in love with problem-solving',
    icon: Code,
    color: 'hsl(47, 100%, 50%)',
  },
  {
    year: '2021',
    title: 'First Lines of Code',
    description: 'Wrote my first "Hello World" program and decided to pursue Computer Science',
    icon: Briefcase,
    color: 'hsl(0, 70%, 50%)',
  },
];

export const JourneyApp = () => {
  return (
    <div className="p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">My Journey</h1>
        <p className="text-muted-foreground">
          The story of how I fell in love with technology and software development
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary" />

        {/* Milestones */}
        <div className="space-y-12">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            return (
              <div key={index} className="relative pl-20 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Icon */}
                <div
                  className="absolute left-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: milestone.color }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="bg-secondary rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border-2 border-primary/20">
        <h3 className="text-xl font-bold mb-3">What's Next?</h3>
        <p className="text-muted-foreground">
          Currently focused on mastering AI/ML technologies, contributing to open source, and building projects 
          that make a positive impact. Always excited to learn, collaborate, and push the boundaries of what's possible!
        </p>
      </div>
    </div>
  );
};
