/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';

// Critical Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LoadingScreen } from './components/LoadingScreen';

// Lazy load non-critical sections
const CharacterScroll  = React.lazy(() => import('./components/CharacterScroll').then(m => ({ default: m.CharacterScroll })));
const DomainGallery    = React.lazy(() => import('./components/DomainGallery').then(m => ({ default: m.DomainGallery })));
const TechniquesLibrary = React.lazy(() => import('./components/TechniquesLibrary').then(m => ({ default: m.TechniquesLibrary })));
const Timeline         = React.lazy(() => import('./components/Timeline').then(m => ({ default: m.Timeline })));
const Footer           = React.lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const NotFound         = React.lazy(() => import('./components/NotFound').then(m => ({ default: m.NotFound })));

import { CursedEnergyBackground } from './components/CursedEnergyBackground';
import { DomainMeter } from './components/DomainMeter';
import { useCursedAudio } from './context/AudioContext';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [bindingVow, setBindingVow] = useState(false);
  const location = useLocation();
  const { isPlaying, toggleAudio } = useCursedAudio();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Pre-load critical video
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = '/assets/videos/hero/hero.mp4';
    document.head.appendChild(link);

    // Keybind: B = Binding Vow
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'b' && !bindingVow) {
        setBindingVow(true);
        setTimeout(() => setBindingVow(false), 5000);
      }
    };

    // Custom cursor – smooth follow
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.12, ease: 'power2.out' });
      }
    };

    // Cursor pulse on click
    const handleMouseDown = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 1.8, borderColor: 'var(--color-accent-crimson)', duration: 0.1, ease: 'power2.out' });
      }
    };
    const handleMouseUp = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 1, borderColor: 'var(--color-accent-blue)', duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      }
    };

    // Cursor grow over interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], [tabindex], input, textarea')) {
        if (cursorRef.current) gsap.to(cursorRef.current, { scale: 1.6, opacity: 0.6, duration: 0.2 });
      }
    };
    const handleMouseOut = () => {
      if (cursorRef.current) gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.2 });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [bindingVow]);

  if (loading) {
    return (
      <LoadingScreen
        onComplete={() => {
          setLoading(false);
          if (!isPlaying) toggleAudio();
        }}
      />
    );
  }

  return (
    <div className={`bg-[var(--color-bg-abyss)] text-[var(--color-text-primary)] min-h-screen font-sans selection:bg-[var(--color-text-primary)]/20 transition-all duration-500 ${bindingVow ? 'invert' : ''}`}>
      <div className="digital-grain" />
      <div className="fixed inset-0 lens-vignette pointer-events-none z-[200]" />

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-6 h-6 border-2 border-[var(--color-accent-blue)] rounded-full z-[1000] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block aspect-square shadow-[0_0_10px_rgba(0,191,255,1)]"
        aria-hidden="true"
      />

      <CursedEnergyBackground />
      <DomainMeter />

      {/* Binding Vow Overlay – now a proper motion.div with enter/exit */}
      <AnimatePresence>
        {bindingVow && (
          <motion.div
            key="binding-vow"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, ease: 'backOut' }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[250] bg-[var(--color-bg-abyss)] text-[var(--color-text-primary)] p-6 border border-[var(--color-accent-crimson)] rounded-xl shadow-2xl pointer-events-none"
          >
            <h3 className="text-xl font-black uppercase tracking-[-0.02em] text-[var(--color-accent-crimson)] mb-2 font-display">Binding Vow Enacted</h3>
            <p className="text-sm tracking-widest uppercase opacity-80 font-mono font-semibold">
              "A vow made with oneself. In exchange for sight, power is amplified."
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      <AnimatePresence mode="wait">
        <React.Suspense fallback={null}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <main>
                <Hero />
                <CharacterScroll />
                <TechniquesLibrary />
                <Timeline />
                <DomainGallery />
              </main>
            } />
            <Route path="*" element={<NotFoundError />} />
          </Routes>
        </React.Suspense>
      </AnimatePresence>

      <Footer />

      {/* Audio Toggle */}
      <button
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Mute Background Music' : 'Unmute Background Music'}
        className="fixed bottom-6 right-6 z-[300] w-12 h-12 bg-[var(--color-text-primary)]/10 backdrop-blur-md border border-[var(--color-text-primary)]/20 rounded-full flex items-center justify-center hover:bg-[var(--color-text-primary)]/20 transition-colors group"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>
    </div>
  );
}

function NotFoundError() {
  return (
    <React.Suspense fallback={null}>
      <NotFound />
    </React.Suspense>
  );
}