import { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Brain, Cpu, GraduationCap, Code2, Terminal as TerminalIcon } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';

type EntryData = {
  icon: React.ComponentType<{ className?: string }>;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  accent: string;
};

const entries: EntryData[] = [
  {
    icon: TerminalIcon, year: '2020', title: 'First Lines of Python', subtitle: 'Where it all started',
    description: 'Wrote my first programs in Python and fell in love with making the computer do exactly what I asked.',
    items: ['Hello world, then everything after', 'Tiny scripts and automations', 'Discovered programming as a craft'],
    accent: '#0ea5e9',
  },
  {
    icon: Code2, year: '2021', title: 'Java and OOP', subtitle: 'First serious language',
    description: 'Picked up Java and used it to learn object oriented design properly, not just syntax.',
    items: ['Built first multi file projects', 'Started thinking in classes and interfaces', 'Wrote first tiny games and tools'],
    accent: '#dc2626',
  },
  {
    icon: Cpu, year: '2023', title: 'C++ and DSA Foundation', subtitle: 'Core CS deep dive',
    description: 'Focused on C++ and data structures and algorithms to solidify the fundamentals.',
    items: ['Solved hundreds of DSA problems', 'Built small CLI tools in modern C++', 'Got comfortable with complexity analysis'],
    accent: '#0891b2',
  },
  {
    icon: GraduationCap, year: '2025', title: 'B.Tech and Production Projects', subtitle: 'PES University, Bangalore',
    description: 'Started B.Tech in CSE (AI and ML) at PES University and turned side projects into production grade apps.',
    items: ['Joined PES University CSE AIML', 'Shipped Nautilus, Virdis, Spheal and more', 'Started writing about what I build'],
    accent: '#2563eb',
  },
  {
    icon: Brain, year: '2026', title: 'Agentic AI and Design Maturity', subtitle: 'Now',
    description: 'Adopted agentic AI tooling end to end, sharpened UI and UX, and pushed prompt engineering further into product work.',
    items: ['Daily driver workflow built on agentic IDE tools', 'Refined a personal liquid glass design system', 'Shipped ThanasOS, a macOS themed portfolio'],
    accent: '#7c3aed',
  },
];

const GlassNode = ({ data }: NodeProps<EntryData>) => {
  const Icon = data.icon;
  return (
    <div
      className="relative rounded-2xl p-5 w-[280px] backdrop-blur-xl border shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${data.accent}22, rgba(255,255,255,0.06))`,
        borderColor: 'rgba(255,255,255,0.18)',
        boxShadow: `0 10px 30px -10px ${data.accent}55, 0 0 0 1px rgba(255,255,255,0.08) inset`,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: data.accent, width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} style={{ background: data.accent, width: 8, height: 8 }} />

      <div className="flex items-start gap-3 mb-2">
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
          style={{ background: data.accent }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-mono opacity-70">{data.year}</div>
          <div className="text-[15px] font-semibold leading-tight text-white">{data.title}</div>
          <div className="text-[11px] opacity-70 text-white">{data.subtitle}</div>
        </div>
      </div>
      <p className="text-[12px] text-white/85 leading-snug mb-2">{data.description}</p>
      <ul className="space-y-1">
        {data.items.map((it, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-white/75">
            <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: data.accent }} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const nodeTypes = { glass: GlassNode };

export const JourneyApp = () => {
  const { settings } = useMacOS();
  const dark = settings.theme === 'dark';

  const { nodes, edges } = useMemo(() => {
    const ns: Node<EntryData>[] = entries.map((e, i) => ({
      id: String(i),
      type: 'glass',
      position: { x: i * 360, y: (i % 2 === 0 ? 0 : 180) },
      data: e,
    }));
    const es: Edge[] = entries.slice(0, -1).map((e, i) => ({
      id: `e${i}`,
      source: String(i),
      target: String(i + 1),
      animated: true,
      style: { stroke: e.accent, strokeWidth: 2 },
    }));
    return { nodes: ns, edges: es };
  }, []);

  return (
    <div
      className="h-full w-full relative"
      style={{
        background: dark
          ? 'radial-gradient(ellipse at 30% 20%, #1f2937 0%, #0b0f17 60%)'
          : 'radial-gradient(ellipse at 30% 20%, #dbeafe 0%, #f8fafc 60%)',
      }}
    >
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/15 text-white text-[12px] font-semibold tracking-wide pointer-events-none">
        My Journey
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        className={dark ? 'dark' : ''}
      >
        <Background gap={20} size={1} color={dark ? '#ffffff15' : '#00000015'} />
        <Controls className="!bg-white/10 !backdrop-blur-md !border !border-white/15 !rounded-lg" showInteractive={false} />
      </ReactFlow>
    </div>
  );
};
