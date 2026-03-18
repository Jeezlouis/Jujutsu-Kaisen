import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();
  const [shattered, setShattered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shatterContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "power3.out"
      });

      const timer = setTimeout(() => {
        setShattered(true);
      }, 1000);
      return () => clearTimeout(timer);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (shattered && shatterContainerRef.current) {
      const shards = shatterContainerRef.current.children;
      gsap.fromTo(shards,
        { scale: 0, opacity: 1, rotation: 0 },
        {
          scale: () => Math.random() * 3 + 1,
          opacity: 0,
          rotation: () => (Math.random() - 0.5) * 360,
          x: () => (Math.random() - 0.5) * 500,
          y: () => (Math.random() - 0.5) * 500,
          duration: 2,
          ease: "power2.out",
          stagger: 0.02
        }
      );
    }
  }, [shattered]);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-[var(--color-bg-abyss)] flex flex-col items-center justify-center overflow-hidden z-[200]">
      <div
        ref={contentRef}
        className="relative z-10 text-center"
      >
        <h1 className={`text-6xl md:text-9xl font-black text-[var(--color-text-primary)] uppercase tracking-[-0.02em] font-display mb-4 transition-all duration-500 ${shattered ? 'blur-sm scale-110 opacity-50 text-[var(--color-accent-crimson)]' : ''}`}>
          404
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-[var(--color-text-primary)]/80 uppercase tracking-[-0.02em] font-display mb-8">
          Veil Breach
        </h2>
        <p className="text-[var(--color-text-primary)]/50 max-w-md mx-auto mb-12 uppercase tracking-widest text-sm font-mono font-semibold">
          The barrier has been compromised. You have wandered into uncharted cursed territory.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-[var(--color-text-primary)] text-[var(--color-bg-abyss)] font-bold uppercase tracking-widest hover:bg-[var(--color-accent-blue)] hover:text-[var(--color-text-primary)] transition-colors duration-300 font-mono"
        >
          Return to Safety
        </button>
      </div>

      {/* Shatter Effect */}
      {shattered && (
        <div ref={shatterContainerRef} className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-[var(--color-accent-purple)]/20"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                clipPath: `polygon(${Math.random() * 100}% ${Math.random() * 100}%, ${Math.random() * 100}% ${Math.random() * 100}%, ${Math.random() * 100}% ${Math.random() * 100}%)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
