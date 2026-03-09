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

interface CircleProgressProps {
  data: ActivityData;
  index: number;
}

const activities: ActivityData[] = [
  {
    label: 'MOVE',
    value: 85,
    color: '#FF2D55',
    size: 200,
    current: 479,
    target: 800,
    unit: 'CAL',
  },
  {
    label: 'EXERCISE',
    value: 60,
    color: '#A3F900',
    size: 160,
    current: 24,
    target: 30,
    unit: 'MIN',
  },
  {
    label: 'STAND',
    value: 30,
    color: '#04C7DD',
    size: 120,
    current: 6,
    target: 12,
    unit: 'HR',
  },
];

const CircleProgress = ({ data, index }: CircleProgressProps) => {
  const strokeWidth = 16;
  const radius = (data.size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = ((100 - data.value) / 100) * circumference;

  const gradientId = `gradient-${data.label.toLowerCase()}`;
  const gradientUrl = `url(#${gradientId})`;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: data.size,
        height: data.size,
        marginLeft: -data.size / 2,
        marginTop: -data.size / 2,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
    >
      <svg width={data.size} height={data.size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={data.color} stopOpacity={0.7} />
            <stop offset="100%" stopColor={data.color} />
          </linearGradient>
        </defs>

        <circle
          cx={data.size / 2}
          cy={data.size / 2}
          r={radius}
          fill="none"
          stroke={data.color}
          strokeWidth={strokeWidth}
          opacity={0.15}
        />

        <motion.circle
          cx={data.size / 2}
          cy={data.size / 2}
          r={radius}
          fill="none"
          stroke={gradientUrl}
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
};

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
          <span className="text-[13px] font-semibold text-white/90">
            {activity.current}/{activity.target}
            <span className="text-[10px] text-white/40 ml-1">
              {activity.unit}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

export const StatsWidget = ({
  title = 'Activity Rings',
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
        <h3 className="text-[10px] font-semibold text-white/50 tracking-wider uppercase mb-3">
          {title}
        </h3>

        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
            {activities.map((activity, index) => {
              // Scale down proportionally to fit in 120px container
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
