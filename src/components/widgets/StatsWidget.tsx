import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ActivityData {
  label: string;
  value: number;
  color: string;
  size: number;
  current: number;
  target: number;
  unit: string;
}

const baseActivities = (
  stars: number,
  repoCount: number
): ActivityData[] => [
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
    current: repoCount,
    target: 25,
    unit: 'REPOS',
    value: Math.min(100, (repoCount / 25) * 100),
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
  className,
}: {
  className?: string;
}) => {
  const [stars, setStars] = useState<number>(8);
  const [repoCount, setRepoCount] = useState<number>(0);

  useEffect(() => {
    const KEY = 'thanasos.github-activity';
    const TTL = 2 * 60 * 60 * 1000; // 2 hours
    let cancelled = false;

    // Hydrate from cache immediately
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached?.data) {
          setRepoCount(cached.data.repoCount ?? 0);
          setStars(cached.data.stars ?? 0);
        }
        if (cached?.fetchedAt && Date.now() - cached.fetchedAt < TTL) {
          return; // fresh enough, skip API
        }
      }
    } catch { /* ignore */ }

    (async () => {
      try {
        const res = await fetch('https://api.github.com/users/Thanas-R/repos?per_page=100&type=owner&sort=created');
        if (!res.ok) return;
        const repos = await res.json();
        if (!Array.isArray(repos) || cancelled) return;
        const totalStars = repos.reduce((s: number, r: { stargazers_count?: number }) => s + (r.stargazers_count || 0), 0);
        setRepoCount(repos.length);
        setStars(totalStars);
        try {
          localStorage.setItem(KEY, JSON.stringify({ data: { repoCount: repos.length, stars: totalStars }, fetchedAt: Date.now() }));
        } catch { /* ignore */ }
      } catch { /* keep cache */ }
    })();

    return () => { cancelled = true; };
  }, []);

  const activities = baseActivities(stars, repoCount);

  return (
    <div
  className={cn('rounded-3xl overflow-hidden shadow-xl', className)}
  style={{
    width: 356,

    background: 'rgba(28, 28, 32, 0.55)',
    border: '1px solid rgba(255,255,255,0.08)',

    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',

    boxShadow:
      '0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',

    transform: 'translateZ(0)',
    willChange: 'transform',
    isolation: 'isolate',
  }}
>
      <div className="px-4 py-3">
        <div className="flex items-center gap-5">
          <div
            className="relative flex-shrink-0"
            style={{ width: 130, height: 130 }}
          >
            {activities.map((activity, index) => {
              const scale = 130 / 200;
              const scaledSize = activity.size * scale;
              const strokeWidth = 11;
              const radius = (scaledSize - strokeWidth) / 2;
              const circumference = radius * 2 * Math.PI;
              const progress =
                ((100 - activity.value) / 100) * circumference;

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
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                  }}
                >
                  <svg
                    width={scaledSize}
                    height={scaledSize}
                    className="-rotate-90"
                  >
                    <defs>
                      <linearGradient
                        id={gradientId}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor={activity.color}
                          stopOpacity={0.6}
                        />
                        <stop
                          offset="100%"
                          stopColor={activity.color}
                        />
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
                      initial={{
                        strokeDashoffset: circumference,
                      }}
                      animate={{
                        strokeDashoffset: progress,
                      }}
                      transition={{
                        duration: 1.4,
                        delay: index * 0.15,
                        ease: 'easeOut',
                      }}
                    />
                  </svg>
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 flex-1 pl-5">
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
                  <span className="text-white/40 text-[12px]">
                    /{a.target}
                  </span>
                  <span className="text-white/40 text-[10px] ml-1">
                    {a.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
