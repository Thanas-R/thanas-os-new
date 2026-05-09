import {
  Brain,
  Cpu,
  GraduationCap,
  Code2,
  Coffee,
  Terminal as TerminalIcon,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';

type Entry = {
  icon: React.ComponentType<{ className?: string }>;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  accent: string;
};

const entries: Entry[] = [
  {
    icon: Brain,
    year: '2026',
    title: 'Agentic AI and Design Maturity',
    subtitle: 'Now',
    description:
      'Adopted agentic AI tooling end to end, sharpened UI and UX, and pushed prompt engineering further into product work.',
    items: [
      'Daily driver workflow built on agentic IDE tools',
      'Refined a personal liquid glass design system',
      'Shipped ThanasOS, a macOS themed portfolio',
    ],
    accent: '#7c3aed',
  },
  {
    icon: GraduationCap,
    year: '2025',
    title: 'B.Tech and Production Projects',
    subtitle: 'PES University, Bangalore',
    description:
      'Started B.Tech in CSE (AI and ML) at PES University and began turning side projects into production grade apps.',
    items: [
      'Joined PES University CSE AIML',
      'Shipped Nautilus, Virdis, Spheal and more',
      'Started writing about what I build',
    ],
    accent: '#2563eb',
  },
  {
    icon: Cpu,
    year: '2023',
    title: 'C++ and DSA Foundation',
    subtitle: 'Core CS deep dive',
    description:
      'Focused on C++ and data structures and algorithms to solidify the fundamentals behind every higher level abstraction.',
    items: [
      'Solved hundreds of DSA problems',
      'Built small CLI tools in modern C++',
      'Got comfortable with complexity analysis',
    ],
    accent: '#0891b2',
  },
  {
    icon: Code2,
    year: '2021',
    title: 'Java and OOP',
    subtitle: 'First serious language',
    description:
      'Picked up Java and used it as a vehicle to learn object oriented design properly, not just as syntax.',
    items: [
      'Built first multi file projects',
      'Started thinking in classes and interfaces',
      'Wrote first tiny games and tools',
    ],
    accent: '#dc2626',
  },
  {
    icon: TerminalIcon,
    year: '2020',
    title: 'First Lines of Python',
    subtitle: 'Where it all started',
    description:
      'Wrote my first programs in Python, fell in love with making the computer do exactly what I asked.',
    items: [
      'Hello world, then everything after',
      'Tiny scripts and automations',
      'Discovered programming is a craft',
    ],
    accent: '#0ea5e9',
  },
];

const education = [
  { school: 'PES University', degree: 'B.Tech CSE (AIML)', range: '2025 to 2029', icon: GraduationCap },
  { school: 'Allen Career Institute', degree: 'Class 11 to 12', range: '2023 to 2025', icon: Coffee },
  { school: 'Sri Vani Education Centre', degree: 'Class 1 to 10', range: '2013 to 2023', icon: GraduationCap },
];

export const JourneyApp = () => {
  return (
    <div className="h-full overflow-auto bg-gradient-to-b from-background to-secondary/40">
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Calendar className="w-3 h-3" />
            Timeline
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Journey</h1>
          <p className="text-muted-foreground">
            How I fell into software, and how it slowly turned into a craft.
          </p>
        </div>

        <div className="space-y-6">
          {entries.map((e, i) => {
            const Icon = e.icon;
            return (
              <div
                key={i}
                className="group relative rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                    style={{ background: e.accent }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <h3 className="text-lg font-semibold">{e.title}</h3>
                      <span className="text-xs font-mono text-muted-foreground">{e.year}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">{e.subtitle}</div>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">{e.description}</p>
                    <ul className="space-y-1.5">
                      {e.items.map((it, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: e.accent }}
                          />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Education</h3>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {education.map((ed, i) => {
              const I = ed.icon;
              return (
                <div key={i} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <I className="w-4 h-4 text-foreground/70" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{ed.school}</div>
                      <div className="text-xs text-muted-foreground truncate">{ed.degree}</div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono shrink-0">{ed.range}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};