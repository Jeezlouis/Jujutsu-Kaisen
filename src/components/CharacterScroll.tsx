import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Hero } from './Hero';

gsap.registerPlugin(ScrollTrigger);

const CHARACTERS = [
  {
    id: 'yuji',
    name: 'Yuji Itadori',
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=1000',
    story: 'Swallowed a cursed object to save his friends, becoming the vessel for Ryomen Sukuna, the King of Curses.',
    color: 'text-[var(--color-accent-crimson)] text-glow-crimson',
    glowColor: 'bg-[var(--color-accent-crimson)]',
    particleColor: '#CE5268',
    fontWeight: 800,
  },
  {
    id: 'nobara',
    name: 'Nobara Kugisaki',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
    story: 'A brash and confident sorcerer who uses a hammer and nails infused with cursed energy. Unapologetically herself.',
    color: 'text-[var(--color-accent-purple)] text-glow-purple',
    glowColor: 'bg-[var(--color-accent-purple)]',
    particleColor: '#6A0DAD',
    fontWeight: 600,
  },
  {
    id: 'gojo',
    name: 'Satoru Gojo',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80&w=1000',
    story: 'The strongest jujutsu sorcerer in the world. Inheritor of the Limitless and the Six Eyes. Arrogant, playful, and untouchable.',
    color: 'text-[var(--color-accent-blue)] text-glow-blue',
    glowColor: 'bg-[var(--color-accent-blue)]',
    particleColor: '#00BFFF',
    fontWeight: 300,
  },
  {
    id: 'megumi',
    name: 'Megumi Fushiguro',
    image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=1000',
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
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !charContentRef.current || !introRef.current) return;

      const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];
      if (panels.length === 0) return;

      let mm = gsap.matchMedia();

      // --- DESKTOP / TABLET (2 cards at once) ---
      mm.add("(min-width: 768px)", () => {
        gsap.set(panels, { zIndex: (i) => panels.length - i, opacity: 0, pointerEvents: 'none' });
        gsap.set(charContentRef.current, { opacity: 1, scale: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=320%', // Reduced from 400% to make the final hold shorter
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Intro
        tl.to(introRef.current, { scale: 4, opacity: 0, ease: 'power2.in', force3D: true, duration: 50 }, 0);
        if (headerTextRef.current) {
          tl.fromTo(headerTextRef.current,
            { fontWeight: 100, letterSpacing: '0em', textShadow: '0px 0px 0px rgba(106,13,173,0), 0px 0px 0px rgba(206,82,104,0)' },
            { fontWeight: 900, letterSpacing: '0.5em', textShadow: '-10px 0px 40px rgba(106,13,173,0.8), 10px 0px 40px rgba(206,82,104,0.8)', duration: 50, ease: 'power2.in' },
            0
          );
        }
        tl.set(introRef.current, { pointerEvents: 'none', display: 'none' }, 50);

        // Pair 1 In (Yuji & Nobara)
        tl.set([panels[0], panels[1]], { opacity: 1, pointerEvents: 'auto' }, 50);
        tl.to('.particles-container', { opacity: 0.6, duration: 50, ease: 'none' }, 50);
        
        tl.fromTo(panels[0].querySelector('.char-card-container'),
          { xPercent: 50, scale: 0.4, rotationY: 45, opacity: 0 },
          { xPercent: 0, scale: 1, rotationY: 0, opacity: 1, duration: 50, ease: 'power2.out' }, 50
        );
        tl.fromTo(panels[1].querySelector('.char-card-container'),
          { xPercent: -50, scale: 0.4, rotationY: -45, opacity: 0 },
          { xPercent: 0, scale: 1, rotationY: 0, opacity: 1, duration: 50, ease: 'power2.out' }, 50
        );

        // Pair 1 Out, Pair 2 In (The "Switching Places" transition)
        tl.set([panels[0], panels[1]], { pointerEvents: 'none' }, 150);
        tl.set([panels[2], panels[3]], { opacity: 1, pointerEvents: 'auto' }, 150);
        tl.to('.particles-container', { opacity: 0.8, duration: 90, yoyo: true, repeat: 1 }, 150);

        // Left card goes Right & Back
        tl.to(panels[0].querySelector('.char-card-container'),
          { xPercent: 100, scale: 0.4, rotationY: 30, opacity: 0, duration: 90, ease: 'power2.inOut' }, 150);
        // Right card goes Left & Back
        tl.to(panels[1].querySelector('.char-card-container'),
          { xPercent: -100, scale: 0.4, rotationY: -30, opacity: 0, duration: 90, ease: 'power2.inOut' }, 150);

        // New Left card comes from Right & Back
        tl.fromTo(panels[2].querySelector('.char-card-container'),
          { xPercent: 100, scale: 0.4, rotationY: 30, opacity: 0 },
          { xPercent: 0, scale: 1, rotationY: 0, opacity: 1, duration: 90, ease: 'power2.inOut' }, 150);
        // New Right card comes from Left & Back
        tl.fromTo(panels[3].querySelector('.char-card-container'),
          { xPercent: -100, scale: 0.4, rotationY: -30, opacity: 0 },
          { xPercent: 0, scale: 1, rotationY: 0, opacity: 1, duration: 90, ease: 'power2.inOut' }, 150);

        tl.to({}, { duration: 20 }, 240); // Reduced hold at the end
      });

      // --- MOBILE (1 card at a time) ---
      mm.add("(max-width: 767px)", () => {
        gsap.set(panels, { zIndex: (i) => panels.length - i, opacity: 0, pointerEvents: 'none' });
        gsap.set(charContentRef.current, { opacity: 1, scale: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=480%', // Reduced from 600% to make the final hold shorter
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Intro
        tl.to(introRef.current, { scale: 4, opacity: 0, ease: 'power2.in', force3D: true, duration: 50 }, 0);
        if (headerTextRef.current) {
          tl.fromTo(headerTextRef.current,
            { fontWeight: 100, letterSpacing: '0em', textShadow: '0px 0px 0px rgba(106,13,173,0), 0px 0px 0px rgba(206,82,104,0)' },
            { fontWeight: 900, letterSpacing: '0.2em', textShadow: '-5px 0px 20px rgba(106,13,173,0.8), 5px 0px 20px rgba(206,82,104,0.8)', duration: 50, ease: 'power2.in' },
            0
          );
        }
        tl.set(introRef.current, { pointerEvents: 'none', display: 'none' }, 50);

        // Yuji In
        tl.set(panels[0], { opacity: 1, pointerEvents: 'auto' }, 50);
        tl.to('.particles-container', { opacity: 0.6, duration: 50, ease: 'none' }, 50);
        tl.fromTo(panels[0].querySelector('.char-card-container'),
          { xPercent: 0, scale: 0.4, rotationY: 45, opacity: 0 },
          { xPercent: 0, scale: 1, rotationY: 0, opacity: 1, duration: 50, ease: 'power2.out' }, 50
        );

        // Yuji out, Nobara in
        tl.set(panels[0], { pointerEvents: 'none' }, 150);
        tl.set(panels[1], { opacity: 1, pointerEvents: 'auto' }, 150);
        tl.to(panels[0].querySelector('.char-card-container'), 
          { xPercent: 100, scale: 0.4, rotationY: 45, opacity: 0, duration: 80, ease: 'power2.inOut' }, 150);
        tl.fromTo(panels[1].querySelector('.char-card-container'),
          { xPercent: -100, scale: 0.4, rotationY: -45, opacity: 0 },
          { xPercent: 0, scale: 1, rotationY: 0, opacity: 1, duration: 80, ease: 'power2.inOut' }, 150);

        // Nobara out, Gojo in
        tl.set(panels[1], { pointerEvents: 'none' }, 280);
        tl.set(panels[2], { opacity: 1, pointerEvents: 'auto' }, 280);
        tl.to(panels[1].querySelector('.char-card-container'), 
          { xPercent: 100, scale: 0.4, rotationY: 45, opacity: 0, duration: 80, ease: 'power2.inOut' }, 280);
        tl.fromTo(panels[2].querySelector('.char-card-container'),
          { xPercent: -100, scale: 0.4, rotationY: -45, opacity: 0 },
          { xPercent: 0, scale: 1, rotationY: 0, opacity: 1, duration: 80, ease: 'power2.inOut' }, 280);

        // Gojo out, Megumi in
        tl.set(panels[2], { pointerEvents: 'none' }, 410);
        tl.set(panels[3], { opacity: 1, pointerEvents: 'auto' }, 410);
        tl.to(panels[2].querySelector('.char-card-container'), 
          { xPercent: 100, scale: 0.4, rotationY: 45, opacity: 0, duration: 80, ease: 'power2.inOut' }, 410);
        tl.fromTo(panels[3].querySelector('.char-card-container'),
          { xPercent: -100, scale: 0.4, rotationY: -45, opacity: 0 },
          { xPercent: 0, scale: 1, rotationY: 0, opacity: 1, duration: 80, ease: 'power2.inOut' }, 410);

        tl.to({}, { duration: 20 }, 490); // Reduced hold at the end
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="characters" className="relative w-full h-screen bg-[var(--color-bg-purple)] overflow-hidden z-10">
      
      {/* Intro Header */}
      <div ref={introRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 will-change-transform rounded-full">
        <h2 
          ref={headerTextRef}
          className="text-6xl md:text-8xl uppercase font-display mb-6 cursed-text-mask rounded-3xl"
        >
          Characters
        </h2>
        <p className="text-xl md:text-2xl text-[var(--color-text-primary)]/70 max-w-2xl font-body font-medium">
          Meet the sorcerers who stand between humanity and the abyss.
        </p>
      </div>

      {/* Character Content */}
      <div ref={charContentRef} className="absolute inset-0 z-10 will-change-transform">
        {/* Particles layer */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            background: { color: "transparent" },
            fpsLimit: 60,
            particles: {
              color: { value: ["#CE5268", "#6A0DAD", "#00BFFF", "#39FF14"] },
              links: { enable: false },
              move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                outModes: "out",
              },
              number: { value: 40, density: { enable: true, area: 800 } },
              opacity: { value: 0.3, animation: { enable: true, speed: 1, minimumValue: 0.1 } },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
          }}
          className="particles-container absolute inset-0 z-0 pointer-events-none opacity-0"
        />

        {CHARACTERS.map((char, index) => (
          <div
            key={char.id}
            ref={(el) => { panelsRef.current[index] = el; }}
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

function CombinedCard({ char, index }: { char: any, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Default tilt values: slightly back, and angled towards the center
  const defaultRotateX = 4; 
  const defaultRotateY = index % 2 === 0 ? 6 : -6; 

  useEffect(() => {
    if (cardRef.current) {
      gsap.set(cardRef.current, {
        rotateX: defaultRotateX,
        rotateY: defaultRotateY,
        transformPerspective: 1000,
        transformOrigin: 'center center'
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
      rotateX,
      rotateY,
      skewX,
      skewY,
      duration: 0.5,
      ease: 'power3.out',
      transformPerspective: 1000,
      transformOrigin: 'center center'
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: defaultRotateX,
      rotateY: defaultRotateY,
      skewX: 0,
      skewY: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  };

  return (
    <div className="char-card-container h-[60vh] md:h-[65vh] max-w-[90%] aspect-[2/3] md:aspect-[9/16] relative perspective-[1000px]">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/20 bg-[#050505] transform-gpu cursor-crosshair shadow-2xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={char.image}
            alt={char.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 md:p-8 z-30 pointer-events-none" style={{ transform: 'translateZ(40px)' }}>
          {/* Top Left: Name */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8">
            <h2 className={`char-name text-2xl md:text-3xl uppercase tracking-[-0.02em] mb-2 font-display ${char.color} drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]`} style={{ fontVariationSettings: `"wght" ${char.fontWeight}` }}>
              {char.name}
            </h2>
            <div className="flex items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <div className="w-6 h-px bg-white" />
              <span className="text-[10px] tracking-widest uppercase text-white font-mono font-medium">File {index + 1}</span>
            </div>
          </div>
          
          {/* Bottom Right: Description */}
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
