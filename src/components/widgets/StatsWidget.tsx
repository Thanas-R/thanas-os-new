import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ActivityData {
  label: string;
  icon: string;
  value: string;
  color: string;
  ringValue: number;
  size: number;
}

const activities: ActivityData[] = [
  {
    label: 'Projects',
    icon: '📂',
    value: '11',
    color: '#DE0C26',
    ringValue: 42,
    size: 200,
  },
  {
    label: 'Stars',
    icon: '⭐',
    value: '2',
    color: '#64DD00',
    ringValue: 80,
    size: 160,
  },
  {
    label: 'LinkedIn',
    icon: '👥',
    value: '40+',
    color: '#00D3D0',
    ringValue: 27,
    size: 120,
  },
];

export const StatsWidget = ({
  className,
}: {
  title?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl shadow-sm overflow-hidden',
        className
      )}
      style={{
        width: 352,
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="p-4">
        <div className="text-[10px] font-bold tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          ACTIVITY
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0" style={{ width: 100, height: 100 }}>
            {activities.map((activity, index) => {
              const scale = 100 / 200;
              const scaledSize = activity.size * scale;
              const strokeWidth = 9;
              const radius = (scaledSize - strokeWidth) / 2;
              const circumference = radius * 2 * Math.PI;
              const progress = ((100 - activity.ringValue) / 100) * circumference;
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

          <div className="flex flex-col gap-2.5 flex-1">
            {activities.map((activity) => (
              <div key={activity.label} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px]">{activity.icon}</span>
                  <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {activity.label}
                  </span>
                </div>
                <span className="text-[14px] font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  {activity.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
