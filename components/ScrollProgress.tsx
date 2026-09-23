import {
  useReducedMotion,
  useScroll,
  useSpring,
  motion,
} from "motion/react";

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });
  if (reduce) return null;
  return (
    <motion.div className="scroll-progress" style={{ scaleX }} />
  );
}
