import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export function DomainMeter() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [domainState, setDomainState] = useState(0); // 0, 25, 50, 75, 100
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      setScrollProgress(progress);

      if (progress >= 100) setDomainState(100);
      else if (progress >= 75) setDomainState(75);
      else if (progress >= 50) setDomainState(50);
      else if (progress >= 25) setDomainState(25);
      else setDomainState(0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (domainState === 100 && flashRef.current) {
      gsap.fromTo(flashRef.current, 
        { opacity: 1 }, 
        { opacity: 0, duration: 1, ease: 'power2.out' }
      );
    }
  }, [domainState]);

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  // Calculate vertical position based on scroll progress (0 to 100)
  const y = scrollProgress / 100;

  const indicatorStyle = {
    transform: `translateY(calc(${y} * (100vh - 120px) - ${y * 100}%))`
  };

  return (
    <div 
      className="fixed top-24 left-6 z-50 flex items-center gap-4 pointer-events-none will-change-transform opacity-30"
      style={indicatorStyle}
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-[var(--color-text-primary)]/20"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-500 ${
              domainState >= 100 ? 'text-[var(--color-text-primary)]' :
              domainState >= 75 ? 'text-[var(--color-accent-purple)]' :
              domainState >= 50 ? 'text-[var(--color-accent-crimson)]' :
              domainState >= 25 ? 'text-[var(--color-accent-blue)]' :
              'text-[var(--color-text-primary)]/50'
            }`}
            style={{
              filter: domainState >= 25 ? 'drop-shadow(0 0 8px currentColor)' : 'none'
            }}
          />
        </svg>
        <div className="absolute text-xs font-mono font-bold">
          {Math.round(scrollProgress)}%
        </div>
      </div>
      <div className="flex flex-col font-mono">
        <span className="text-xs uppercase tracking-widest text-[var(--color-text-primary)]/60 font-bold">Ryoiki Tenkai</span>
        <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-primary)]/40 font-medium">
          {domainState >= 100 ? 'Domain Fully Expanded' :
           domainState >= 75 ? 'Maximum Output' :
           domainState >= 50 ? 'Cursed Technique Reversal' :
           domainState >= 25 ? 'Cursed Energy Flow' :
           'Dormant'}
        </span>
      </div>
      
      {/* 100% Full Screen Flash */}
      {domainState === 100 && (
        <div
          ref={flashRef}
          className="fixed inset-0 bg-[var(--color-text-primary)] z-[100] pointer-events-none flex items-center justify-center mix-blend-difference"
        >
          <h1 className="text-[var(--color-bg-abyss)] text-6xl md:text-9xl font-black uppercase tracking-[-0.02em] font-display">
            Domain Fully Expanded
          </h1>
        </div>
      )}
    </div>
  );
}
