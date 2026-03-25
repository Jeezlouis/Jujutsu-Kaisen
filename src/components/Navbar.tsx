import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrambleText } from '../hooks/useScrambleText';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { name: 'Characters', id: 'characters' },
  { name: 'Techniques', id: 'techniques' },
  { name: 'Timeline', id: 'timeline' },
  { name: 'Domains', id: 'domains' },
];

export function Navbar() {
  const [activeLink, setActiveLink] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleSetScrolled = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleSetScrolled, { passive: true });

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -60% 0px',
      threshold: 0
    };

    const observerCallBack = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'hero') {
            setActiveLink('');
          } else {
            const link = NAV_LINKS.find(l => l.id === entry.target.id);
            if (link) setActiveLink(link.name);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallBack, observerOptions);

    const checkElements = ['hero', ...NAV_LINKS.map(l => l.id)];
    checkElements.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Close mobile menu on outside scroll
    const closeMobile = () => setMobileOpen(false);
    window.addEventListener('scroll', closeMobile, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleSetScrolled);
      window.removeEventListener('scroll', closeMobile);
      observer.disconnect();
    };
  }, []);

  const handleScroll = (id: string, name: string) => {
    setActiveLink(name);
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        aria-label="Main Navigation"
        className={`fixed top-0 left-0 w-full px-6 py-4 md:px-12 md:py-6 z-50 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'bg-black/60 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}
      >
        {/* Logo */}
        <div
          className="text-xl md:text-2xl font-black tracking-[-0.04em] uppercase pointer-events-auto font-display cursor-pointer hover:scale-105 transition-transform group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="text-white relative">
            JUJUTSU <span className="text-[var(--color-accent-blue)]">KAISEN</span>
            <span className="absolute inset-0 text-red-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-1 translate-x-[2px] pointer-events-none">JUJUTSU KAISEN</span>
            <span className="absolute inset-0 text-cyan-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-2 -translate-x-[2px] pointer-events-none">JUJUTSU KAISEN</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="flex items-center gap-6 md:gap-12 pointer-events-auto">
          <ul className="hidden md:flex gap-8 items-center" role="menubar">
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.id}
                text={link.name}
                isActive={activeLink === link.name}
                onClick={() => handleScroll(link.id, link.name)}
              />
            ))}
          </ul>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-[6px] pointer-events-auto"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className={`block h-[2px] bg-[var(--color-text-primary)] transition-all duration-300 origin-center ${mobileOpen ? 'w-6 rotate-45 translate-y-[8px]' : 'w-6'}`} />
            <span className={`block h-[2px] bg-[var(--color-text-primary)] transition-all duration-300 ${mobileOpen ? 'w-0 opacity-0' : 'w-5'}`} />
            <span className={`block h-[2px] bg-[var(--color-text-primary)] transition-all duration-300 origin-center ${mobileOpen ? 'w-6 -rotate-45 -translate-y-[8px]' : 'w-4'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 z-[60] bg-[var(--color-bg-abyss)] border-l border-white/10 flex flex-col justify-center px-10 gap-8 md:hidden"
            >
              {/* Decorative title */}
              <div className="mb-4">
                <p className="text-[10px] tracking-[0.3em] uppercase font-mono text-[var(--color-text-primary)]/30">Navigation</p>
                <h3 className="text-3xl font-black uppercase font-display text-[var(--color-accent-purple)] tracking-[-0.02em]">Menu</h3>
              </div>

              <ul className="flex flex-col gap-6" role="menu">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * i, type: 'spring', damping: 20 }}
                  >
                    <button
                      onClick={() => handleScroll(link.id, link.name)}
                      role="menuitem"
                      className={`text-2xl font-black uppercase font-display tracking-[-0.02em] transition-colors duration-200 ${
                        activeLink === link.name
                          ? 'text-[var(--color-accent-blue)] drop-shadow-[0_0_8px_var(--color-accent-blue)]'
                          : 'text-[var(--color-text-primary)]/60 hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      {link.name}
                    </button>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-[10px] tracking-[0.3em] uppercase font-mono text-[var(--color-text-primary)]/20">Press B for Binding Vow</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ text, isActive, onClick }: { key?: string; text: string; isActive: boolean; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const scrambledText = useScrambleText(text, 500, isHovered);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isActive && indicatorRef.current) {
        gsap.fromTo(indicatorRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
      } else if (!isActive && indicatorRef.current) {
        gsap.to(indicatorRef.current, { scale: 0, opacity: 0, duration: 0.2, ease: 'power2.in' });
      }
    });
    return () => ctx.revert();
  }, [isActive]);

  return (
    <li
      className="relative cursor-pointer group flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role="menuitem"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
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
