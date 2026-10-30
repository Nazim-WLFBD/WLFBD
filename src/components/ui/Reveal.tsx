'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

type Props = HTMLMotionProps<'div'> & { delay?: number; y?: number };

/** Fades and lifts its children into view once, as they scroll in. */
export function Reveal({ delay = 0, y = 28, children, ...rest }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
