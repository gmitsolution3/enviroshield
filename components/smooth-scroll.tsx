"use client";

import "lenis/dist/lenis.css";

import { ReactLenis } from "lenis/react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
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
