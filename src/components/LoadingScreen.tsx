import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Exit animation
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              opacity: 0,
              scale: 1.1,
              duration: 0.8,
              ease: "power2.inOut",
              onComplete: onComplete
            });
          } else {
            onComplete();
          }
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (circle1Ref.current && circle2Ref.current) {
      gsap.to(circle1Ref.current, {
        scale: progress / 100,
        opacity: 1 - progress / 100,
        duration: 0.2,
        ease: "none"
      });
      
      gsap.to(circle2Ref.current, {
        scale: (progress / 100) * 1.5,
        opacity: (1 - progress / 100) * 0.5,
        duration: 0.3,
        ease: "none"
      });
    }
  }, [progress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] bg-[var(--color-bg-abyss)] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Expanding Domain Circle */}
        <div
          ref={circle1Ref}
          className="absolute inset-0 rounded-full border border-[var(--color-accent-blue)]"
          style={{ transform: 'scale(0)', opacity: 1 }}
        />
        <div
          ref={circle2Ref}
          className="absolute inset-0 rounded-full border-2 border-[var(--color-accent-crimson)]"
          style={{ transform: 'scale(0)', opacity: 0 }}
        />
        
        <div className="z-10 text-center">
          <h2 className="text-[var(--color-text-primary)] text-xl font-bold uppercase tracking-[-0.02em] mb-2 font-display">
            Entering
          </h2>
          <h1 className="text-[var(--color-accent-purple)] text-3xl font-black uppercase tracking-[-0.02em] font-display">
            Ryoiki Tenkai
          </h1>
          <div className="mt-4 text-[var(--color-text-primary)]/50 font-mono text-sm font-bold">
            {Math.min(100, progress)}%
          </div>
        </div>
      </div>
    </div>
  );
}
