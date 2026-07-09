"use client";
// "use client" — tracks scroll position via a browser scroll listener.

import { useEffect, useState } from "react";

/**
 * Fixed progress bar across the top of the viewport showing how far through the
 * article the reader has scrolled. Throttled with `requestAnimationFrame`;
 * hidden from assistive tech (purely decorative) and static under
 * reduced-motion via the global CSS reset.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      setProgress(Math.min(1, Math.max(0, ratio)));
    }

    function onScroll() {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent" aria-hidden="true">
      <div
        className="h-full origin-left bg-brand transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
