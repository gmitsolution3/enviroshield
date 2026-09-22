'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { fadeUp, fadeIn, fadeLeft, fadeRight, scaleIn, imageReveal, staggerContainer, staggerItem, viewportOnce } from './variants';
import type { ReactNode, CSSProperties } from 'react';

type Dir = 'up' | 'down' | 'left' | 'right' | 'scale' | 'image';

const map: Record<Dir, Variants> = {
  up: fadeUp,
  down: fadeUp,
  left: fadeLeft,
  right: fadeRight,
  scale: scaleIn,
  image: imageReveal,
};

type CommonProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  dir?: Dir;
};

export function Reveal({ children, dir = 'up', delay = 0, className = '', style }: CommonProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div className={className} style={style} variants={map[dir]} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay }}>
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, className = '', style }: CommonProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div className={className} style={style} variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewportOnce} transition={{ delay }}>
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, delay = 0, className = '', style }: CommonProps) {
  return <Reveal dir="up" delay={delay} className={className} style={style}>{children}</Reveal>;
}

export function SlideIn({ children, dir = 'left', delay = 0, className = '', style }: CommonProps) {
  return <Reveal dir={dir} delay={delay} className={className} style={style}>{children}</Reveal>;
}

export function StaggerContainer({ children, className = '', style, ...rest }: CommonProps & Record<string, unknown>) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style} {...rest}>{children}</div>;
  return (
    <motion.div className={className} style={style} variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} {...rest}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', style, ...rest }: CommonProps & Record<string, unknown>) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style} {...rest}>{children}</div>;
  return <motion.div className={className} style={style} variants={staggerItem} {...rest}>{children}</motion.div>;
}

export function ImageReveal({ children, delay = 0, className = '', style }: CommonProps) {
  return <Reveal dir="image" delay={delay} className={className} style={style}>{children}</Reveal>;
}
