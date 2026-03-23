import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);
  const circle3Ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Simulate load progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 12) + 4);
      });
    }, 140);
    return () => clearInterval(interval);
  }, []);

  // Animate expanding rings with progress
  useEffect(() => {
    const p = progress / 100;
    if (circle1Ref.current) {
      gsap.to(circle1Ref.current, { scale: 0.3 + p * 0.7, opacity: 1 - p * 0.6, duration: 0.25, ease: 'none' });
    }
    if (circle2Ref.current) {
      gsap.to(circle2Ref.current, { scale: 0.2 + p * 1.1, opacity: (1 - p) * 0.5, duration: 0.35, ease: 'none' });
    }
    if (circle3Ref.current) {
      gsap.to(circle3Ref.current, {
        scale: p * 1.5,
        opacity: p < 0.8 ? p * 0.25 : (1 - p) * 1.5,
        duration: 0.4,
        ease: 'none',
      });
    }
  }, [progress]);

  const handleEnter = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.15,
        filter: 'blur(40px)',
        duration: 1.5,
        ease: 'expo.inOut',
        onComplete,
      });
    } else {
      onComplete();
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] bg-[var(--color-bg-abyss)] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Blurred hero video behind everything */}
      <video
        src="/assets/videos/hero/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.12] blur-sm scale-105"
        aria-hidden="true"
      />

      {/* Radial vignette over the video */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_var(--color-bg-abyss)_80%)]" />

      {/* Expanding domain rings */}
      <div className="relative w-80 h-80 flex items-center justify-center z-10">
        <div
          ref={circle3Ref}
          className="absolute inset-0 rounded-full border border-[var(--color-accent-crimson)]/30"
          style={{ transform: 'scale(0)', opacity: 0 }}
        />
        <div
          ref={circle2Ref}
          className="absolute inset-0 rounded-full border border-[var(--color-accent-blue)]/50"
          style={{ transform: 'scale(0.2)', opacity: 0 }}
        />
        <div
          ref={circle1Ref}
          className="absolute inset-0 rounded-full border-2 border-[var(--color-accent-purple)]"
          style={{ transform: 'scale(0.3)', opacity: 1, boxShadow: '0 0 40px rgba(106,13,173,0.3), inset 0 0 40px rgba(106,13,173,0.1)' }}
        />

        {/* Center content */}
        <div ref={textRef} className="z-10 text-center flex flex-col items-center gap-1">
          {/* Japanese subtitle */}
          <p className="text-[10px] tracking-[0.35em] uppercase font-mono text-[var(--color-text-primary)]/30 mb-3">
            領域展開
          </p>
          <h2 className="text-[var(--color-text-primary)] text-lg font-bold uppercase tracking-[0.2em] font-display">
            Entering
          </h2>
          <h1 className="text-[var(--color-accent-purple)] text-3xl font-black uppercase tracking-[-0.02em] font-display">
            Ryoiki Tenkai
          </h1>

          <div className="mt-8 h-20 flex flex-col items-center justify-center gap-3">
            {isLoaded ? (
              <button
                onClick={handleEnter}
                id="loading-enter-btn"
                className="group relative px-10 py-4 bg-[var(--color-text-primary)] text-[var(--color-bg-abyss)] font-black uppercase tracking-widest text-sm rounded-none overflow-hidden transition-all hover:bg-[var(--color-accent-blue)] hover:text-white font-display border border-[var(--color-text-primary)]"
              >
                <span className="relative z-10">Sync Audio & Enter</span>
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {/* Progress bar */}
                <div className="w-48 h-[2px] bg-[var(--color-text-primary)]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-accent-purple)] transition-all duration-150"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <span className="text-[var(--color-text-primary)]/40 font-mono text-xs tracking-widest">
                  CALIBRATING CURSED ENERGY... {Math.min(100, progress)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
