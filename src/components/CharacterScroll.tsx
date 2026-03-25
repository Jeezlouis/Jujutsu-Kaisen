import React, { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';
import { Character } from '../types';

gsap.registerPlugin(ScrollTrigger);

const CHARACTERS: Character[] = [
  {
    id: 'yuji',
    name: 'Yuji Itadori',
    grade: 'Grade 1',
    image: '/assets/images/characters/yuji-itadori.webp',
    story: 'Swallowed a cursed object to save his friends, becoming the vessel for Ryomen Sukuna, the King of Curses.',
    color: 'text-[var(--color-accent-crimson)] text-glow-crimson',
    glowColor: 'bg-[var(--color-accent-crimson)]',
    particleColor: '#CE5268',
    fontWeight: 800,
  },
  {
    id: 'nobara',
    name: 'Nobara Kugisaki',
    grade: 'Grade 3',
    image: '/assets/images/characters/nobara-kugisaki.webp',
    story: 'A brash and confident sorcerer who uses a hammer and nails infused with cursed energy. Unapologetically herself.',
    color: 'text-[var(--color-accent-purple)] text-glow-purple',
    glowColor: 'bg-[var(--color-accent-purple)]',
    particleColor: '#6A0DAD',
    fontWeight: 600,
  },
  {
    id: 'gojo',
    name: 'Satoru Gojo',
    grade: 'Special Grade',
    image: '/assets/images/characters/gojo.webp',
    story: 'The strongest jujutsu sorcerer in the world. Inheritor of the Limitless and the Six Eyes. Arrogant, playful, and untouchable.',
    color: 'text-[var(--color-accent-blue)] text-glow-blue',
    glowColor: 'bg-[var(--color-accent-blue)]',
    particleColor: '#00BFFF',
    fontWeight: 300,
  },
  {
    id: 'megumi',
    name: 'Megumi Fushiguro',
    grade: 'Grade 2',
    image: '/assets/images/characters/megumi-fushiguro.webp',
    story: 'A first-year student at Jujutsu High, possessing the Ten Shadows Technique. Calm, calculating, and deeply protective.',
    color: 'text-[var(--color-accent-green)] text-glow-green',
    glowColor: 'bg-[var(--color-accent-green)]',
    particleColor: '#39FF14',
    fontWeight: 400,
  },
];

export function CharacterScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const charContentRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const headerTextRef = useRef<HTMLHeadingElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const particlesWrapRef = useRef<HTMLDivElement>(null);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !charContentRef.current || !introRef.current) return;

      const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];
      if (panels.length === 0) return;

      const mm = gsap.matchMedia();

      // --- DESKTOP / TABLET ---
      mm.add('(min-width: 768px)', () => {
        gsap.set(panels, { zIndex: (i: number) => panels.length - i, opacity: 0, pointerEvents: 'none' });
        gsap.set(charContentRef.current, { opacity: 1, scale: 1 });
        gsap.set([introRef.current, headerTextRef.current], { y: 0, x: 0, opacity: 1, scale: 1, clearProps: 'transform' });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=350%',
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              // Fade particles in after intro
              if (particlesWrapRef.current) {
                const prog = Math.min(1, Math.max(0, (self.progress - 0.25) * 4));
                gsap.set(particlesWrapRef.current, { opacity: prog * 0.6 });
              }
            },
          },
        });

        // Intro zoom-out
        tl.to(introRef.current, { scale: 6, opacity: 0, ease: 'expo.inOut', force3D: true, duration: 80 }, 0);
        if (headerTextRef.current) {
          tl.fromTo(
            headerTextRef.current,
            { fontWeight: 100, letterSpacing: '0em', textShadow: '0px 0px 0px rgba(106,13,173,0), 0px 0px 0px rgba(206,82,104,0)' },
            { fontWeight: 900, letterSpacing: '0.5em', textShadow: '-10px 0px 40px rgba(106,13,173,0.8), 10px 0px 40px rgba(206,82,104,0.8)', duration: 80, ease: 'expo.inOut' },
            0
          );
        }
        tl.set(introRef.current, { pointerEvents: 'none', display: 'none' }, 80);

        // Group cards into pairs
        const pairs: HTMLDivElement[][] = [];
        for (let i = 0; i < panels.length; i += 2) pairs.push(panels.slice(i, i + 2));

        pairs.forEach((pair, pairIndex) => {
          const startTime = 50 + pairIndex * 100;
          tl.set(pair, { opacity: 1, pointerEvents: 'auto' }, startTime);
          pair.forEach((panel, pIdx) => {
            const card = panel.querySelector('.char-card-container');
            const direction = pIdx === 0 ? 1 : -1;
            tl.fromTo(card,
              { xPercent: 50 * direction, scale: 0.4, rotationY: 45 * direction, opacity: 0 },
              { xPercent: 0, scale: 1, rotationY: 0, opacity: 1, duration: 50, ease: 'power2.out' },
              startTime
            );
          });

          if (pairIndex < pairs.length - 1) {
            const outTime = startTime + 100;
            tl.set(pair, { pointerEvents: 'none' }, outTime);
            pair.forEach((panel, pIdx) => {
              const card = panel.querySelector('.char-card-container');
              const direction = pIdx === 0 ? 1 : -1;
              tl.to(card, { xPercent: 100 * direction, scale: 0.4, rotationY: 30 * direction, opacity: 0, duration: 90, ease: 'power2.inOut' }, outTime);
            });
          }
        });

        tl.to({}, { duration: 20 }, 50 + pairs.length * 100);
      });

      // --- MOBILE ---
      mm.add('(max-width: 767px)', () => {
        gsap.set(panels, { zIndex: (i: number) => panels.length - i, opacity: 0, pointerEvents: 'none' });
        gsap.set(charContentRef.current, { opacity: 1, scale: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=500%',
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              if (particlesWrapRef.current) {
                const prog = Math.min(1, Math.max(0, (self.progress - 0.2) * 5));
                gsap.set(particlesWrapRef.current, { opacity: prog * 0.5 });
              }
            },
          },
        });

        tl.to(introRef.current, { scale: 6, opacity: 0, ease: 'expo.inOut', force3D: true, duration: 80 }, 0);
        if (headerTextRef.current) {
          tl.fromTo(
            headerTextRef.current,
            { fontWeight: 100, letterSpacing: '0em', textShadow: '0px 0px 0px rgba(106,13,173,0), 0px 0px 0px rgba(206,82,104,0)' },
            { fontWeight: 900, letterSpacing: '0.2em', textShadow: '-5px 0px 20px rgba(106,13,173,0.8), 5px 0px 20px rgba(206,82,104,0.8)', duration: 80, ease: 'expo.inOut' },
            0
          );
        }
        tl.set(introRef.current, { pointerEvents: 'none', display: 'none' }, 80);

        panels.forEach((panel, panelIndex) => {
          const startTime = 50 + panelIndex * 130;
          tl.set(panel, { opacity: 1, pointerEvents: 'auto' }, startTime);
          const card = panel.querySelector('.char-card-container');
          tl.fromTo(card,
            { xPercent: 0, scale: 0.4, rotationY: 45, opacity: 0 },
            { xPercent: 0, scale: 1, rotationY: 0, opacity: 1, duration: 50, ease: 'power2.out' },
            startTime
          );
          if (panelIndex < panels.length - 1) {
            const outTime = startTime + 100;
            tl.set(panel, { pointerEvents: 'none' }, outTime);
            tl.to(card, { xPercent: 100, scale: 0.4, rotationY: 45, opacity: 0, duration: 80, ease: 'power2.inOut' }, outTime);
          }
        });

        tl.to({}, { duration: 20 }, 50 + panels.length * 130);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="characters" className="relative w-full h-screen bg-[var(--color-bg-purple)] overflow-hidden z-10">

      {/* Intro Header */}
      <div ref={introRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 pointer-events-none overflow-hidden gap-12">
        <h2
          ref={headerTextRef}
          className="text-6xl md:text-8xl uppercase font-display cursed-text-mask rounded-3xl"
        >
          Characters
        </h2>
        <p className="text-xl md:text-2xl text-[var(--color-text-primary)]/70 max-w-2xl font-body font-medium">
          Meet the sorcerers who stand between humanity and the abyss.
        </p>
      </div>

      {/* Character Content */}
      <div ref={charContentRef} className="absolute inset-0 z-10">
        {/* Particles – initially hidden, faded in by ScrollTrigger onUpdate */}
        <div ref={particlesWrapRef} className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0 }}>
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              fullScreen: { enable: false },
              background: { color: 'transparent' },
              fpsLimit: 60,
              particles: {
                color: { value: ['#CE5268', '#6A0DAD', '#00BFFF', '#39FF14'] },
                links: { enable: false },
                move: {
                  enable: true,
                  speed: 0.8,
                  direction: 'none',
                  random: true,
                  straight: false,
                  outModes: 'out',
                },
                number: { value: 50, density: { enable: true, area: 800 } },
                opacity: { value: 0.4, animation: { enable: true, speed: 0.8, minimumValue: 0.1 } },
                shape: { type: 'circle' },
                size: { value: { min: 1, max: 3 } },
              },
              detectRetina: true,
            }}
            className="absolute inset-0"
          />
        </div>

        {CHARACTERS.map((char, index) => (
          <div
            key={char.id}
            ref={(el: HTMLDivElement | null) => { panelsRef.current[index] = el; }}
            className={`absolute top-0 h-full flex items-center justify-center p-4 md:p-8 w-full left-0
              ${index % 2 === 0 ? 'md:left-0 md:w-1/2' : 'md:left-1/2 md:w-1/2'}
            `}
          >
            <CombinedCard char={char} index={index} />
          </div>
        ))}
      </div>

    </section>
  );
}

function CombinedCard({ char, index }: { char: Character; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const defaultRotateX = 4;
  const defaultRotateY = index % 2 === 0 ? 6 : -6;

  useEffect(() => {
    if (cardRef.current) {
      gsap.set(cardRef.current, {
        rotateX: defaultRotateX,
        rotateY: defaultRotateY,
        transformPerspective: 1000,
        transformOrigin: 'center center',
      });
    }
  }, [index, defaultRotateX, defaultRotateY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5 + defaultRotateX;
    const rotateY = ((x - centerX) / centerX) * 5 + defaultRotateY;
    const skewX = ((x - centerX) / centerX) * 0.5;
    const skewY = ((y - centerY) / centerY) * 0.5;

    gsap.to(cardRef.current, {
      rotateX, rotateY, skewX, skewY,
      duration: 0.5,
      ease: 'power3.out',
      transformPerspective: 1000,
      transformOrigin: 'center center',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    setIsHovered(false);
    gsap.to(cardRef.current, {
      rotateX: defaultRotateX,
      rotateY: defaultRotateY,
      skewX: 0,
      skewY: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  };

  return (
    <div className="char-card-container h-[60vh] md:h-[65vh] max-w-[90%] aspect-[2/3] md:aspect-[9/16] relative perspective-[1000px]">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/20 bg-[#050505] transform-gpu cursor-crosshair shadow-2xl will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={char.image}
            alt={char.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
            referrerPolicy="no-referrer"
          />
          {/* Dynamic color tint on hover */}
          <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isHovered ? 'opacity-20' : 'opacity-40'} bg-black`} />
          {isHovered && (
            <div
              className="absolute inset-0 z-10 opacity-10 mix-blend-color"
              style={{ backgroundColor: char.particleColor }}
            />
          )}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 md:p-8 z-30 pointer-events-none" style={{ transform: 'translateZ(40px)' }}>
          {/* Top Left: Name + Grade */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8">
            <h2
              className={`char-name text-2xl md:text-3xl uppercase tracking-[-0.02em] mb-1 font-display ${char.color} drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]`}
              style={{ fontVariationSettings: `"wght" ${char.fontWeight}` }}
            >
              {char.name}
            </h2>
            <div className="flex items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <div className="w-6 h-px bg-white" />
              <span
                className="text-[10px] tracking-widest uppercase font-mono font-medium"
                style={{ color: char.particleColor }}
              >
                {char.grade}
              </span>
            </div>
          </div>

          {/* File tag top-right */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8">
            <span className="text-[9px] tracking-widest uppercase text-white/30 font-mono">File {String(index + 1).padStart(2, '0')}</span>
          </div>

          {/* Bottom: Description */}
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 max-w-[80%] md:max-w-[70%] text-right">
            <p className="text-xs md:text-sm text-white leading-relaxed font-body drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-medium">
              {char.story}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
