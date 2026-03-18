import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaController } from '../hooks/useMediaController';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const { currentVideo } = useMediaController();
  const containerRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!h1Ref.current || !containerRef.current || !scrollWrapperRef.current) return;

      // 1. Extreme starting position — almost edge-on (very slanted / "looking away")
      gsap.set(h1Ref.current, {
        opacity: 0,
        rotationY: 80,             // 80–88° = very sharp side view (85° is good balance)
        z: -1200,                  // Deeper start = stronger "coming toward you" pull
        transformPerspective: 1200, // Larger perspective = more dramatic depth
        transformOrigin: "center center", // Pivot from true center
        transformStyle: "preserve-3d",    // Important for clean 3D children if any
        backfaceVisibility: "hidden",     // Prevents weird flickering on edge
        display: "inline-block",
      });

      // 2. Load Animation (Plays immediately on mount for ~2s)
      const tlLoad = gsap.timeline({ defaults: { ease: "power4.out" } });

      tlLoad.to(h1Ref.current, {
        rotationY: 0,
        z: 0,
        opacity: 1,
        duration: 2.0,
      }, 0);

      // Font weight bloom synced to the turn
      const fontProxy = { wght: 100 };
      tlLoad.to(fontProxy, {
        wght: 900,
        duration: 1.8,
        ease: "expo.inOut",
        onUpdate: () => {
          if (h1Ref.current) {
            h1Ref.current.style.fontVariationSettings = `'wght' ${Math.round(fontProxy.wght)}`;
          }
        }
      }, 0.2);

      // Line animation
      tlLoad.fromTo('.strike-line', {
        scaleX: 0,
        opacity: 0,
      }, {
        scaleX: 1,
        opacity: 0.8,
        duration: 1.5,
        ease: "power4.out",
        transformOrigin: "center center"
      }, 1.0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden z-0 hero-section"
    >
      <AnimatePresence mode="wait">
        <motion.video
          key={currentVideo}
          src={currentVideo}
          autoPlay
          muted
          loop
          playsInline
          className="hero-video absolute inset-0 w-full h-full object-cover opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg-abyss)]/50 to-[var(--color-bg-abyss)] pointer-events-none" />

      {/* Center Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center w-full pointer-events-none">
        <p
          ref={pRef}
          className="text-sm tracking-widest text-[var(--color-text-primary)]/50 uppercase font-mono animate-pulse"
        >
          Scroll to enter domain
        </p>
      </div>

      {/* Bottom Title */}
      <div ref={scrollWrapperRef} className="absolute bottom-0 md:bottom-0 left-1/2 -translate-x-1/2 z-10 text-center w-full pointer-events-none">
        <h1
          ref={h1Ref}
          className="hero-title tracking-[-0.04em] text-5xl md:text-[5rem] lg:text-[6.65rem] font-display relative z-10 inline-block"
          style={{
            color: 'white',
            WebkitTextStroke: '2px var(--color-accent-purple)'
          }}
        >
          RYOIKI TENKAI
          <div className="strike-line absolute top-1/2 left-[-5%] w-[110%] h-[4px] md:h-[6px] bg-white -translate-y-1/2 z-20 pointer-events-none" />
        </h1>
      </div>
    </section>
  );
}
