import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props { onWake: () => void; }

export const SleepScreen = ({ onWake }: Props) => {
  useEffect(() => {
    const wake = () => onWake();
    window.addEventListener('mousedown', wake);
    window.addEventListener('keydown', wake);
    window.addEventListener('touchstart', wake);
    return () => {
      window.removeEventListener('mousedown', wake);
      window.removeEventListener('keydown', wake);
      window.removeEventListener('touchstart', wake);
    };
  }, [onWake]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    />
  );
};
