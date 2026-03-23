import React, { useEffect, useState, useRef, CSSProperties } from 'react';
import gsap from 'gsap';

export function DomainMeter() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [domainState, setDomainState] = useState(0);
  const flashKeyRef = useRef(0);
  const flashRef = useRef<HTMLDivElement>(null);
  const prevDomainState = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      setScrollProgress(progress);

      const newState =
        progress >= 100 ? 100 :
        progress >= 75 ? 75 :
        progress >= 50 ? 50 :
        progress >= 25 ? 25 : 0;

      setDomainState(newState);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fire flash every time we reach 100%, even if re-entering from below
  useEffect(() => {
    if (domainState === 100 && prevDomainState.current !== 100) {
      flashKeyRef.current += 1;
    }
    prevDomainState.current = domainState;
  }, [domainState]);

  useEffect(() => {
    if (domainState === 100 && flashRef.current) {
      gsap.fromTo(flashRef.current, { opacity: 1 }, { opacity: 0, duration: 1.5, ease: 'power2.out' });
    }
  }, [domainState, flashKeyRef.current]);

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;
  const y = scrollProgress / 100;

  const indicatorStyle: CSSProperties = {
    transform: `translateY(calc(${y} * (100vh - 120px) - ${y * 100}%))`,
  };

  const meterColor =
    domainState >= 100 ? 'var(--color-text-primary)' :
    domainState >= 75  ? 'var(--color-accent-purple)' :
    domainState >= 50  ? 'var(--color-accent-crimson)' :
    domainState >= 25  ? 'var(--color-accent-blue)' :
    'rgba(224,224,224,0.3)';

  const stateLabel =
    domainState >= 100 ? 'Domain Fully Expanded' :
    domainState >= 75  ? 'Maximum Output' :
    domainState >= 50  ? 'Cursed Technique Reversal' :
    domainState >= 25  ? 'Cursed Energy Flow' :
    'Dormant';

  return (
    <div
      className="fixed top-24 left-6 z-50 flex items-center gap-4 pointer-events-none will-change-transform opacity-30 hover:opacity-70 transition-opacity duration-500"
      style={indicatorStyle}
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="transform -rotate-90 w-full h-full">
          <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[var(--color-text-primary)]/20" />
          <circle
            cx="32" cy="32" r={radius}
            stroke={meterColor}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
            style={{ filter: domainState >= 25 ? `drop-shadow(0 0 8px ${meterColor})` : 'none' }}
          />
        </svg>
        <div className="absolute text-xs font-mono font-bold" style={{ color: meterColor }}>
          {Math.round(scrollProgress)}%
        </div>
      </div>

      <div className="flex flex-col font-mono">
        <span className="text-xs uppercase tracking-widest text-[var(--color-text-primary)]/60 font-bold">Ryoiki Tenkai</span>
        <span className="text-[10px] uppercase tracking-widest font-medium transition-colors duration-300" style={{ color: meterColor }}>
          {stateLabel}
        </span>
      </div>

      {/* Full Screen Flash — key changes so React remounts and re-fires the GSAP on every reach */}
      {domainState === 100 && (
        <div
          key={flashKeyRef.current}
          ref={flashRef}
          className="fixed inset-0 bg-[var(--color-text-primary)] z-[100] pointer-events-none flex items-center justify-center mix-blend-difference"
        >
          <h1 className="text-[var(--color-bg-abyss)] text-4xl md:text-7xl font-black uppercase tracking-[-0.02em] font-display text-center px-8">
            Domain Fully Expanded
          </h1>
        </div>
      )}
    </div>
  );
}
