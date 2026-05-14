import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppleHelloEffect } from '@/components/effects/AppleHelloEffect';
import { useImagePreloader } from '@/hooks/useImagePreloader';

interface Props { onDone: () => void; }

/** First-visit Apple "hello" intro. Plays the stroke animation, holds briefly,
 *  then fades out into the lock screen. Preloads all assets in the background. */
export const HelloIntro = ({ onDone }: Props) => {
  useImagePreloader();
  const [exiting, setExiting] = useState(false);

  const finish = () => {
    setExiting(true);
    setTimeout(onDone, 650);
  };

  // Safety: if the SVG never finishes (reduced motion etc.) bail out after 4s
  useEffect(() => {
    const t = setTimeout(finish, 4500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="hello"
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AppleHelloEffect
            className="h-28 md:h-36 text-white"
            speed={0.85}
            onAnimationComplete={() => setTimeout(finish, 600)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
