import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Technique } from '../types';
import techniquesDataRaw from '../data/techniques.json';
import { useCursedAudio } from '../context/AudioContext';

const techniquesData = techniquesDataRaw as Technique[];

gsap.registerPlugin(ScrollTrigger);

const techniqueAssets: Record<string, { video: string; color: string }> = {
  'limitless':       { video: '/assets/videos/techniques/hollow-purple.webm', color: '#00d2ff' },
  'ten-shadows':     { video: '/assets/videos/techniques/ten-shadow-technique.webm', color: '#10b981' },
  'cleave-dismantle':{ video: '/assets/videos/techniques/cleave-dismantle.webm', color: '#ef4444' },
  'straw-doll':      { video: '/assets/videos/techniques/straw-doll.webm', color: '#f59e0b' },
  'cursed-speech':   { video: '/assets/videos/techniques/cursed-speech.webm', color: '#8b5cf6' },
};

export function TechniquesLibrary() {
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTechnique(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <section className="relative w-full py-32 px-6 md:px-12 bg-[#050505] z-10 overflow-hidden" id="techniques">
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50 mix-blend-screen opacity-30"
        style={{
          background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))',
          backgroundSize: '100% 4px, 3px 100%',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <h2
          className="text-4xl md:text-6xl font-black uppercase tracking-[-0.02em] mb-24 text-white font-display"
          style={{ textShadow: '3px 0px 0px rgba(255,0,0,0.4), -3px 0px 0px rgba(0,255,255,0.4)' }}
        >
          Cursed <span className="text-[var(--color-accent-purple)]">Techniques</span>
        </h2>

        {/* CSS Grid replaces wonky flex-wrap  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {techniquesData.map((tech, index) => (
            <TechniqueCard
              key={tech.id}
              technique={tech}
              onClick={() => setSelectedTechnique(tech)}
              index={index}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedTechnique && (
          <TechniqueModal
            technique={selectedTechnique}
            onClose={() => setSelectedTechnique(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function TechniqueCard({ technique, onClick, index }: { technique: Technique; onClick: () => void; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isEven = index % 2 === 0;
  const assets = techniqueAssets[technique.id] || { video: '/assets/videos/hero/hero.mp4', color: '#ffffff' };

  useEffect(() => {
    if (!cardRef.current) return;
    const st = ScrollTrigger.create({
      trigger: cardRef.current,
      start: 'top 95%',
      end: 'top 40%',
      scrub: 1.5,
      animation: gsap.fromTo(cardRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1 }),
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isHovered) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isHovered]);

  return (
    /* Odd index cards are offset downward on desktop for stagger look */
    <div className={`w-full ${!isEven ? 'md:mt-32' : ''}`}>
      <div
        ref={cardRef}
        className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-pointer bg-[#0a0a0a] border border-white/5 shadow-2xl transition-shadow duration-500 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] will-change-transform"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Video Background */}
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
          }}
        >
          <video
            ref={videoRef}
            src={assets.video}
            loop muted playsInline preload="none"
            className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-70 scale-105' : 'opacity-30 scale-100'} will-change-[opacity,transform]`}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (cardRef.current) cardRef.current.style.background = `radial-gradient(circle at center, ${assets.color}40, #0a0a0a)`;
            }}
          />
        </div>

        {/* Color accent line on hover */}
        <div
          className="absolute bottom-0 left-0 h-[3px] transition-all duration-700"
          style={{
            width: isHovered ? '100%' : '0%',
            backgroundColor: assets.color,
            boxShadow: `0 0 12px ${assets.color}`,
          }}
        />

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

        <div className="absolute inset-0 z-20 p-8 md:p-10 flex flex-col justify-end pointer-events-none">
          <h3
            className="text-3xl md:text-5xl font-black uppercase tracking-[-0.02em] mb-2 font-display text-white transition-colors"
            style={{ textShadow: '2px 0px 0px rgba(255,0,0,0.5), -2px 0px 0px rgba(0,255,255,0.5)' }}
          >
            {technique.name}
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-4 h-px" style={{ backgroundColor: assets.color }} />
            <p className="text-sm uppercase tracking-widest font-mono" style={{ color: assets.color }}>
              {technique.user}
            </p>
          </div>
        </div>

        {/* Click hint */}
        <div className={`absolute top-6 right-6 z-30 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-white/50">Click to expand →</span>
        </div>
      </div>
    </div>
  );
}

function TechniqueModal({ technique, onClose }: { technique: Technique; onClose: () => void }) {
  const { playSting } = useCursedAudio();

  useEffect(() => {
    playSting('generic');
  }, [playSting]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050505]/95 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Domain border crack effect */}
      <motion.div
        className="absolute inset-4 border-4 border-[var(--color-accent-crimson)] pointer-events-none z-0 mix-blend-screen"
        initial={{ scale: 1.1, opacity: 0, clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)' }}
        animate={{ scale: 1, opacity: 0.5, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        exit={{ scale: 0.9, opacity: 0, clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' }}
        transition={{ duration: 0.7, ease: 'circOut' }}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, filter: 'blur(20px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        exit={{ scale: 0.5, opacity: 0, filter: 'blur(50px)' }}
        transition={{ type: 'spring', damping: 25, stiffness: 120, delay: 0.2 }}
        className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(206,82,104,0.1)] z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h2 id="modal-title" className="text-5xl md:text-7xl font-black uppercase tracking-[-0.02em] mb-2 text-white text-glow-crimson font-display">
              {technique.name}
            </h2>
            <p className="text-xl text-white/50 uppercase tracking-widest mb-12 font-mono">
              User: {technique.user}
            </p>

            <div className="space-y-8">
              <div>
                <h4 className="text-xs text-[var(--color-accent-blue)] uppercase tracking-widest mb-3 font-mono font-bold">Description</h4>
                <p className="text-lg text-white/80 leading-relaxed font-body font-medium">{technique.description}</p>
              </div>

              <div>
                <h4 className="text-xs text-[var(--color-accent-blue)] uppercase tracking-widest mb-3 font-mono font-bold">Domain Expansion</h4>
                <p className="text-3xl font-black text-white uppercase tracking-[-0.02em] font-display">{technique.domain}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 relative min-h-[300px] md:min-h-[400px] overflow-hidden border border-white/5 rounded-xl">
            <img
              src={technique.image}
              alt={technique.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-60 hover:opacity-100 hover:mix-blend-normal transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors p-1 hover:rotate-90 transition-transform duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Hint */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase font-mono text-white/20">Press Esc or click outside to close</p>
      </motion.div>
    </motion.div>
  );
}
