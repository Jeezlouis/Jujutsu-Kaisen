import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScrambleText } from '../hooks/useScrambleText';

const NAV_LINKS = [
  { name: 'Characters', id: 'characters' },
  { name: 'Techniques', id: 'techniques' },
  { name: 'Timeline', id: 'timeline' },
  { name: 'Domains', id: 'domains' }
];

export function Navbar() {
  const [activeLink, setActiveLink] = useState(NAV_LINKS[0].name);

  const handleScroll = (id: string, name: string) => {
    setActiveLink(name);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center pointer-events-none">
      <div className="text-xl font-black tracking-[-0.02em] uppercase pointer-events-auto font-display">
        <span className="text-[var(--color-text-primary)]" style={{ WebkitTextStroke: '1.5px var(--color-accent-blue)' }}>Jujutsu</span> <span className="text-[var(--color-text-primary)]" style={{ WebkitTextStroke: '1.5px var(--color-accent-crimson)' }}>Kaisen</span>
      </div>
      <ul className="flex gap-8 pointer-events-auto">
        {NAV_LINKS.map((link) => (
          <NavItem
            key={link.name}
            text={link.name}
            isActive={activeLink === link.name}
            onClick={() => handleScroll(link.id, link.name)}
          />
        ))}
      </ul>
    </nav>
  );
}

function NavItem({ text, isActive, onClick }: { key?: string; text: string; isActive: boolean; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const scrambledText = useScrambleText(text, 500, isHovered);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && indicatorRef.current) {
      gsap.fromTo(indicatorRef.current, 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    } else if (!isActive && indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      });
    }
  }, [isActive]);

  return (
    <li
      className="relative cursor-pointer group flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        ref={indicatorRef}
        className="w-2 h-2 rounded-full bg-[var(--color-text-primary)] text-glow-blue"
        style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'scale(1)' : 'scale(0)' }}
      />
      <span className={`uppercase tracking-widest text-sm transition-colors duration-300 font-mono font-semibold ${isActive ? 'text-[var(--color-text-primary)] drop-shadow-[0_0_8px_var(--color-accent-blue)]' : 'text-[var(--color-text-primary)]/60 group-hover:text-[var(--color-text-primary)] group-hover:drop-shadow-[0_0_8px_var(--color-accent-blue)]'}`}>
        {isHovered ? scrambledText : text}
      </span>
    </li>
  );
}
