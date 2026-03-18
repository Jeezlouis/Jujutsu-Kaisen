import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import timelineData from '../data/timeline.json';
import { useScrambleText } from '../hooks/useScrambleText';

gsap.registerPlugin(ScrollTrigger);

const bgColors = ['#1a0202', '#021a0a', '#1a021a', '#1a0a02', '#020a1a'];
const accentColors = ['#CE5268', '#39FF14', '#6A0DAD', '#FF4500', '#00BFFF'];

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const powerThreadRef = useRef<SVGLineElement>(null);
  const timelineTextRef = useRef<HTMLSpanElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const parallaxRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!container || !scrollContainer) return;

    const ctx = gsap.context(() => {
      const totalWidth = scrollContainer.scrollWidth - window.innerWidth;
      if (totalWidth <= 0) return;

      // Main horizontal scroll
      const mainTween = gsap.to(scrollContainer, {
        x: -totalWidth,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;

            // Power Thread Pulse
            if (powerThreadRef.current) {
              powerThreadRef.current.style.strokeDashoffset = String(100 - (progress * 100));
            }

            // Calculate current index
            const colorIndex = Math.min(Math.floor(progress * bgColors.length), bgColors.length - 1);
            
            const prevIndex = container.dataset.colorIndex;
            if (prevIndex !== String(colorIndex)) {
              container.dataset.colorIndex = String(colorIndex);

              // Atmospheric Tweening
              gsap.to(container, { backgroundColor: bgColors[colorIndex], duration: 0.5, ease: 'power2.out' });

              // Power Thread Color
              if (powerThreadRef.current) {
                gsap.to(powerThreadRef.current, { color: accentColors[colorIndex], duration: 0.5 });
              }

              // Typography Polish (Glitch & Color)
              if (timelineTextRef.current) {
                gsap.to(timelineTextRef.current, { color: accentColors[colorIndex], duration: 0.5 });
                // Glitch effect
                gsap.fromTo(timelineTextRef.current,
                  { x: -5, opacity: 0.8, skewX: 10 },
                  { x: 0, opacity: 1, skewX: 0, duration: 0.1, ease: 'power1.inOut', yoyo: true, repeat: 3, clearProps: 'all' }
                );
              }
            }
          }
        }
      });

      // Lens Transition for Cards
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Enter animation (tilting in from right)
        gsap.fromTo(card,
          { rotationY: -45, scale: 0.7, opacity: 0.2, z: -200 },
          {
            rotationY: 0, scale: 1, opacity: 1, z: 0,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: card,
              containerAnimation: mainTween,
              start: 'left right',
              end: 'center center',
              scrub: true,
            }
          }
        );

        // Exit animation (tilting away to left)
        gsap.to(card, {
          rotationY: 45, scale: 0.7, opacity: 0.2, z: -200,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: card,
            containerAnimation: mainTween,
            start: 'center center',
            end: 'right left',
            scrub: true,
          }
        });
      });

      // Environmental Parallax
      parallaxRef.current.forEach((text) => {
        if (!text) return;
        gsap.to(text, {
          x: 400, // Moves slower than the container (parallax)
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            scrub: true,
          }
        });
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-[100dvw] h-screen bg-[var(--color-bg-crimson)] overflow-hidden flex items-center z-10 transition-colors duration-500" id="timeline" data-color-index="0">
      {/* Pinned Header */}
      <div className="absolute top-12 left-6 md:left-12 z-50 pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[-0.02em] text-[var(--color-text-primary)] font-display drop-shadow-lg">
          Jujutsu <span ref={timelineTextRef} className="text-[var(--color-accent-blue)] inline-block transition-colors duration-300">Timeline</span>
        </h2>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-24 items-center h-full pt-24 w-max px-[50vw] relative"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {/* Environmental Parallax Text */}
        <div className="absolute top-1/2 left-0 flex items-center h-full -translate-y-1/2 pointer-events-none -z-20 opacity-10">
          {timelineData.map((item, i) => (
            <div
              key={`bg-${item.id}`}
              ref={el => { parallaxRef.current[i] = el; }}
              className="text-[20vw] font-black whitespace-nowrap px-[15vw] font-display text-transparent"
              style={{ WebkitTextStroke: '2px var(--color-text-primary)' }}
            >
              {item.year.split(' ')[0]}
            </div>
          ))}
        </div>

        {/* Power Thread SVG */}
        <svg className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 -z-10 overflow-visible pointer-events-none" preserveAspectRatio="none" style={{ transform: 'translateZ(-100px)' }}>
          <line x1="0" y1="50%" x2="20000" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="10 10" />
          <line
            ref={powerThreadRef}
            x1="0" y1="50%" x2="20000" y2="50%"
            stroke="currentColor"
            strokeWidth="4"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset="100"
            className="transition-colors duration-300"
            style={{ filter: 'drop-shadow(0 0 12px currentColor)', color: accentColors[0] }}
          />
        </svg>

        {/* Timeline Cards */}
        {timelineData.map((item, index) => (
          <div key={item.id} ref={el => { cardsRef.current[index] = el; }} style={{ transformStyle: 'preserve-3d' }}>
            <TimelineCard item={item} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelineCard({ item, index }: { item: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const scrambledYear = useScrambleText(item.year, 500, isHovered);

  return (
    <div
      className="relative flex-shrink-0 w-[300px] md:w-[450px] group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10 bg-[var(--color-bg-abyss)] border border-[var(--color-text-primary)]/20 p-8 rounded-2xl shadow-2xl transition-transform duration-500 group-hover:-translate-y-4 backdrop-blur-sm">
        <div className="text-sm font-mono text-[var(--color-accent-crimson)] mb-4 tracking-widest uppercase font-bold">
          {isHovered ? scrambledYear : item.year}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-[-0.02em] text-[var(--color-text-primary)] mb-4 font-display">
          {item.arc}
        </h3>
        <p className="text-[var(--color-text-primary)]/70 leading-relaxed font-body font-medium">
          {item.description}
        </p>

        {/* Ripple Effect */}
        <div className={`absolute inset-0 border-2 border-[var(--color-accent-purple)] rounded-2xl opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100 animate-ping' : ''}`} style={{ animationDuration: '2s' }} />
      </div>
    </div>
  );
}
