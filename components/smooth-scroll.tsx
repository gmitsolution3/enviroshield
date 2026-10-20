"use client";

import "lenis/dist/lenis.css";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.025,
        duration: 1.8,
        smoothWheel: true,
        syncTouch: true,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
