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

const activities: ActivityData[] = [
  {
    label: 'LINKEDIN',
    value: 42,
    color: '#DE0C26',
    size: 200,
    current: 42,
    target: 100,
    unit: 'FOLLOWERS',
  },
  {
    label: 'PROJECTS',
    value: 80,
    color: '#64DD00',
    size: 160,
    current: 12,
    target: 15,
    unit: 'REPOS',
  },
  {
    label: 'STARS',
    value: 27,
    color: '#00D3D0',
    size: 120,
    current: 8,
    target: 30,
    unit: 'STARS',
  },
];

const DetailedActivityInfo = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {activities.map((activity) => (
        <div key={activity.label} className="flex items-center justify-between">
          <span
            className="text-[11px] font-bold tracking-wider"
            style={{ color: activity.color }}
          >
            {activity.label}
          </span>
          <span className="text-[13px] font-semibold text-foreground/90">
            {activity.current}
            <span className="text-[10px] text-muted-foreground ml-1">
              {activity.unit}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

export const StatsWidget = ({
  title = 'Dev Stats',
  className,
}: {
  title?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl shadow-macos-glass backdrop-blur-macos overflow-hidden',
        className
      )}
      style={{
        width: 352,
        background: 'hsl(var(--macos-window-bg))',
        border: '1px solid hsl(var(--macos-glass-border))',
      }}
    >
      <div className="p-4">

        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
            {activities.map((activity, index) => {
              const scale = 120 / 200;
              const scaledSize = activity.size * scale;
              const strokeWidth = 10;
              const radius = (scaledSize - strokeWidth) / 2;
              const circumference = radius * 2 * Math.PI;
              const progress = ((100 - activity.value) / 100) * circumference;
              const gradientId = `gradient-sm-${activity.label.toLowerCase()}`;

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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  <svg width={scaledSize} height={scaledSize} className="-rotate-90">
                    <defs>
                      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={activity.color} stopOpacity={0.7} />
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
                      opacity={0.15}
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
                      transition={{ duration: 1.5, delay: index * 0.2, ease: 'easeOut' }}
                    />
                  </svg>
                </motion.div>
              );
            })}
          </div>

          <DetailedActivityInfo />
        </div>
      </div>
    </div>
  );
};
