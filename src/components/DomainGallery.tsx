import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrambleText } from '../hooks/useScrambleText';

gsap.registerPlugin(ScrollTrigger);

const DOMAIN_VIDEOS = [
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', name: 'MALEVOLENT SHRINE' },
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', name: 'INFINITE VOID' },
  { src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', name: 'CHIMERA SHADOW GARDEN' }
];

export function DomainGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const edgeFilterRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  const scrambledTitle = useScrambleText(DOMAIN_VIDEOS[activeIndex].name, 800, isGlitching);
  const scrambledRyoiki = useScrambleText("RYOIKI TENKAI", 600, isGlitching);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Portal Frame Floating & Tilt
      gsap.set(portalRef.current, {
        y: -15,
        rotationX: 10,
        rotationY: -15,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
        force3D: true,
        willChange: 'transform'
      });

      gsap.to(portalRef.current, {
        y: 15,
        rotationX: 12,
        rotationY: -13,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        force3D: true
      });

      // 2. ScrollTrigger for Video Transitions (No Pinning)
      const totalDomains = DOMAIN_VIDEOS.length;
      
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const newIndex = Math.min(Math.floor(progress * totalDomains), totalDomains - 1);

          if (newIndex !== activeIndex) {
            // Trigger transition
            setActiveIndex(newIndex);
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 1000);

            // Shatter transition for the new video
            const newVideo = videosRef.current[newIndex];
            const oldVideo = videosRef.current[activeIndex];

            if (newVideo) {
              gsap.set(newVideo, { zIndex: 10, opacity: 1 });
              if (oldVideo) gsap.set(oldVideo, { zIndex: 1 });

              // Play new video
              newVideo.play().catch(() => {});

              // Shatter clip-path animation
              gsap.fromTo(newVideo, 
                { 
                  clipPath: 'polygon(50% 50%, 55% 40%, 60% 50%, 70% 45%, 65% 60%, 75% 65%, 60% 70%, 55% 80%, 45% 70%, 30% 75%, 40% 60%, 25% 55%, 40% 45%, 35% 30%, 45% 40%)',
                  filter: 'contrast(2.5) brightness(1.5) hue-rotate(90deg)' // Chromatic aberration intense
                },
                { 
                  clipPath: 'polygon(0% 0%, 20% 0%, 50% 0%, 80% 0%, 100% 0%, 100% 20%, 100% 50%, 100% 80%, 100% 100%, 80% 100%, 50% 100%, 20% 100%, 0% 100%, 0% 50%, 0% 20%)',
                  filter: 'contrast(1) brightness(1) hue-rotate(0deg)',
                  duration: 1.5,
                  ease: 'expo.out',
                  onComplete: () => {
                    if (oldVideo) {
                      oldVideo.pause();
                      gsap.set(oldVideo, { opacity: 0 });
                    }
                  }
                }
              );
            }
          } else {
            // Chromatic aberration intensity based on scroll velocity
            const velocity = Math.abs(self.getVelocity());
            const aberrationAmount = Math.min(velocity / 1000, 10);
            if (edgeFilterRef.current) {
              gsap.to(edgeFilterRef.current, {
                boxShadow: `inset 0 0 ${50 + aberrationAmount * 10}px rgba(255,0,0,${0.3 + aberrationAmount * 0.05}), inset 0 0 ${50 + aberrationAmount * 10}px rgba(0,255,255,${0.3 + aberrationAmount * 0.05})`,
                duration: 0.2
              });
            }
          }
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [activeIndex]);

  // Initial load effect
  useEffect(() => {
    setIsGlitching(true);
    const timer = setTimeout(() => setIsGlitching(false), 1000);
    
    // Play first video
    if (videosRef.current[0]) {
      videosRef.current[0].play().catch(() => {});
      gsap.set(videosRef.current[0], { opacity: 1, clipPath: 'polygon(0% 0%, 20% 0%, 50% 0%, 80% 0%, 100% 0%, 100% 20%, 100% 50%, 100% 80%, 100% 100%, 80% 100%, 50% 100%, 20% 100%, 0% 100%, 0% 50%, 0% 20%)' });
    }
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={containerRef} id="domains" className="h-screen w-full bg-[var(--color-bg-abyss)] flex items-center justify-center relative overflow-hidden">
      {/* Background Grid / Atmosphere */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--color-accent-blue)_0%,_transparent_70%)]" />
      
      {/* UI Interaction */}
      <div className={`absolute top-12 left-6 md:left-12 z-50 pointer-events-none ${isGlitching ? 'animate-pulse' : ''}`}>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[-0.02em] text-[var(--color-accent-blue)] font-display drop-shadow-[0_0_10px_rgba(0,191,255,0.8)]" style={{ transform: isGlitching ? 'skewX(-10deg)' : 'none', transition: 'transform 0.1s' }}>
          {scrambledRyoiki}
        </h2>
        <div className="text-2xl font-mono text-white mt-2 font-bold tracking-widest">
          {scrambledTitle}
        </div>
      </div>

      {/* Portal Frame */}
      <div 
        ref={portalRef}
        className="relative w-[90vw] h-[50vh] md:w-[60vw] md:h-[70vh] border border-[var(--color-accent-blue)]/50 shadow-[0_0_40px_rgba(0,191,255,0.3)] bg-black"
        style={{ willChange: 'transform' }}
      >
        {DOMAIN_VIDEOS.map((domain, index) => (
          <video
            key={domain.src}
            ref={(el) => { videosRef.current[index] = el; }}
            src={domain.src}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0 }}
            muted
            loop
            playsInline
          />
        ))}

        {/* Glowing Blue Wireframe Overlay */}
        <div className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-40">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 191, 255, 0.4)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Topological lines */}
            <path d="M 0 50 Q 150 150 300 50 T 600 50" fill="none" stroke="rgba(0, 191, 255, 0.6)" strokeWidth="2" className="animate-pulse" />
            <path d="M 0 250 Q 200 100 400 250 T 800 250" fill="none" stroke="rgba(0, 191, 255, 0.4)" strokeWidth="1.5" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          </svg>
        </div>

        {/* Chromatic Aberration Edge Filter */}
        <div ref={edgeFilterRef} className="absolute inset-0 pointer-events-none z-30 shadow-[inset_0_0_50px_rgba(255,0,0,0.3),inset_0_0_50px_rgba(0,255,255,0.3)] mix-blend-overlay" />
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--color-accent-blue)] z-40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--color-accent-blue)] z-40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--color-accent-blue)] z-40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--color-accent-blue)] z-40" />
      </div>
    </section>
  );
}
