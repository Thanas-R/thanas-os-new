import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#34c759] data-[state=unchecked]:bg-[#787880]/30 dark:data-[state=unchecked]:bg-[#39393d]',
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        default: 'h-[26px] w-[44px]',
        lg: 'h-7 w-12',
      },
    },
    defaultVariants: { size: 'default' },
  }
);

const thumbVariants = cva('pointer-events-none block rounded-full bg-white shadow-md ring-0', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      default: 'h-[22px] w-[22px]',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: { size: 'default' },
});

const offsetForSize: Record<string, number> = { sm: 16, default: 18, lg: 20 };

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, size, ...props }, ref) => {
    const checked = props.checked ?? props.defaultChecked ?? false;
    const off = offsetForSize[size || 'default'];
    return (
      <SwitchPrimitives.Root ref={ref} className={cn(switchVariants({ size }), className)} {...props}>
        <SwitchPrimitives.Thumb asChild>
          <motion.span
            className={thumbVariants({ size })}
            animate={{ x: checked ? off : 0 }}
            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
          />
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
    );
  }
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
