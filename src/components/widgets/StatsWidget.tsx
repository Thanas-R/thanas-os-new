import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { PROJECTS } from '@/lib/projects';

interface ActivityData {
  label: string;
  value: number;
  color: string;
  size: number;
  current: number;
  target: number;
  unit: string;
}

const baseActivities = (stars: number): ActivityData[] => [
  {
    label: 'LINKEDIN',
    color: '#FF2D55',
    size: 200,
    current: 100,
    target: 250,
    unit: 'FOLLOWERS',
    value: Math.min(100, (100 / 250) * 100),
  },
  {
    label: 'PROJECTS',
    color: '#A3F900',
    size: 160,
    current: PROJECTS.length,
    target: 25,
    unit: 'REPOS',
    value: Math.min(100, (PROJECTS.length / 25) * 100),
  },
  {
    label: 'STARS',
    color: '#04C7DD',
    size: 120,
    current: stars,
    target: 30,
    unit: 'STARS',
    value: Math.min(100, (stars / 30) * 100),
  },
];

export const StatsWidget = ({
  title = 'Activity',
  className,
}: {
  title?: string;
  className?: string;
}) => {
  const [stars, setStars] = useState<number>(8);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('https://api.github.com/users/Thanas-R/repos?per_page=100');
        if (!res.ok) return;
        const repos = await res.json();
        if (!Array.isArray(repos) || cancelled) return;
        const total = repos.reduce(
          (sum: number, r: { stargazers_count?: number }) => sum + (r.stargazers_count || 0),
          0,
        );
        setStars(total);
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activities = baseActivities(stars);

  return (
    <div
      className={cn('rounded-3xl overflow-hidden liquid-glass-card', className)}
      style={{ width: 352 }}
    >
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <span className="text-white/95 text-sm font-semibold tracking-tight">{title}</span>
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
          Live
        </span>
      </div>
      <div className="px-5 pb-5">
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0" style={{ width: 130, height: 130 }}>
            {activities.map((activity, index) => {
              const scale = 130 / 200;
              const scaledSize = activity.size * scale;
              const strokeWidth = 11;
              const radius = (scaledSize - strokeWidth) / 2;
              const circumference = radius * 2 * Math.PI;
              const progress = ((100 - activity.value) / 100) * circumference;
              const gradientId = `g-stats-${activity.label.toLowerCase()}`;

              return (
                <motion.div
                  key={activity.label}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: scaledSize,
                    height: scaledSize,
                    marginLeft: -scaledSize / 2,
                    marginTop: -scaledSize / 2,
                  }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <svg width={scaledSize} height={scaledSize} className="-rotate-90">
                    <defs>
                      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={activity.color} stopOpacity={0.6} />
                        <stop offset="100%" stopColor={activity.color} />
                      </linearGradient>
                    </defs>
                    <circle
                      cx={scaledSize / 2}
                      cy={scaledSize / 2}
                      r={radius}
                      fill="none"
                      stroke={activity.color}
                      strokeWidth={strokeWidth}
                      opacity={0.18}
                    />
                    <motion.circle
                      cx={scaledSize / 2}
                      cy={scaledSize / 2}
                      r={radius}
                      fill="none"
                      stroke={`url(#${gradientId})`}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: progress }}
                      transition={{ duration: 1.4, delay: index * 0.15, ease: 'easeOut' }}
                    />
                  </svg>
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {activities.map((a) => (
              <div key={a.label}>
                <div
                  className="text-[11px] font-bold tracking-wider"
                  style={{ color: a.color }}
                >
                  {a.label}
                </div>
                <div className="text-white/95 text-[15px] font-semibold leading-tight">
                  {a.current}
                  <span className="text-white/40 text-[12px]">/{a.target}</span>
                  <span className="text-white/40 text-[10px] ml-1">{a.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
