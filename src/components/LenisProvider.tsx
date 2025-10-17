// LenisProvider.tsx
"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // smoothness
      easing: (t) => 1 - Math.pow(1 - t, 3), // easing function
      lerp: 0.5, // smooth scrolling factor
      orientation: "vertical", // vertical scroll

      touchMultiplier: 2, // touch scroll speed
      wheelMultiplier: 1,
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
