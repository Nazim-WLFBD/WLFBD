'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -90 } });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Respect scroll locks (e.g. when a drawer sets overflow hidden)
    const observer = new MutationObserver(() => {
      if (document.documentElement.style.overflow === 'hidden') lenis.stop();
      else lenis.start();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
