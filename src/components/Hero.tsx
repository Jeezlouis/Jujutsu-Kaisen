import React, { useEffect, useRef } from 'react';
import { useScrambleText } from '../hooks/useScrambleText';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic import to keep the bundle split
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);

      if (!h1Ref.current || !containerRef.current || !pRef.current) return;

      // 1. Extreme starting position
      gsap.set(h1Ref.current, {
        opacity: 0,
        rotationY: 80,
        z: -1200,
        transformPerspective: 1200,
        transformOrigin: 'center center',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        display: 'inline-block',
      });

      // 2. Load Animation
      const tlLoad = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tlLoad.to(h1Ref.current, {
        rotationY: 0,
        z: 0,
        opacity: 1,
        duration: 2.0,
      }, 0);

      const fontProxy = { wght: 100 };
      tlLoad.to(fontProxy, {
        wght: 900,
        duration: 1.8,
        ease: 'expo.inOut',
        onUpdate: () => {
          if (h1Ref.current) {
            h1Ref.current.style.fontVariationSettings = `'wght' ${Math.round(fontProxy.wght)}`;
          }
        },
      }, 0.2);

      tlLoad.fromTo('.strike-line', {
        scaleX: 0,
        opacity: 0,
      }, {
        scaleX: 1,
        opacity: 0.8,
        duration: 1.5,
        ease: 'power4.out',
        transformOrigin: 'center center',
      }, 1.0);

      // Scroll hint fade-in
      if (scrollHintRef.current) {
        tlLoad.fromTo(scrollHintRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
          1.5
        );
      }

      // 3. Scroll Animation – "Domain Expansion" effect
      gsap.to(h1Ref.current, {
        scale: 3,
        opacity: 0,
        z: 800,
        filter: 'blur(30px)',
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom center',
          scrub: true,
        },
      });

      gsap.to(pRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '30% top',
          scrub: true,
        },
      });

      if (scrollHintRef.current) {
        gsap.to(scrollHintRef.current, {
          y: -40,
          opacity: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '15% top',
            scrub: true,
          },
        });
      }
    });
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-screen overflow-hidden z-0 hero-section"
    >
      {/* Single hero video – no AnimatePresence needed with one source */}
      <div className="absolute inset-0">
        <video
          src="/assets/videos/hero/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="hero-video w-full h-full object-cover opacity-40"
        />
      </div>

      <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg-abyss)]/50 to-[var(--color-bg-abyss)] pointer-events-none" />

      {/* Center descriptor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center w-full pointer-events-none">
        <p
          ref={pRef}
          className="text-sm tracking-widest text-[var(--color-text-primary)]/50 uppercase font-mono"
        >
          The cursed world awaits
        </p>
      </div>

      {/* Bottom Title */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 text-center w-full pointer-events-none">
        <h1
          ref={h1Ref}
          className="hero-title tracking-[-0.04em] text-5xl md:text-[5rem] lg:text-[6.65rem] font-display relative z-10 inline-block"
          style={{
            color: 'white',
            WebkitTextStroke: '2px var(--color-accent-purple)',
          }}
        >
          RYOIKI TENKAI
          <div className="strike-line absolute top-1/2 left-[-5%] w-[110%] h-[4px] md:h-[6px] bg-white -translate-y-1/2 z-20 pointer-events-none" />
        </h1>
      </div>

      {/* Scroll hint arrow */}
      <div ref={scrollHintRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none" style={{ opacity: 0 }}>
        <span className="text-[10px] tracking-[0.3em] text-[var(--color-text-primary)]/40 uppercase font-mono">Scroll to enter domain</span>
        <svg className="w-5 h-5 text-[var(--color-text-primary)]/30 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
