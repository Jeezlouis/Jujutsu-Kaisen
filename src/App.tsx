/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CharacterScroll } from './components/CharacterScroll';
import { DomainGallery } from './components/DomainGallery';
import { TechniquesLibrary } from './components/TechniquesLibrary';
import { Timeline } from './components/Timeline';
import { Footer } from './components/Footer';
import { NotFound } from './components/NotFound';
import { LoadingScreen } from './components/LoadingScreen';
import { CursedEnergyBackground } from './components/CursedEnergyBackground';
import { DomainMeter } from './components/DomainMeter';
import { useCursedAudio } from './context/AudioContext';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [bindingVow, setBindingVow] = useState(false);
  const location = useLocation();
  const { isPlaying, toggleAudio } = useCursedAudio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'b') {
        setBindingVow(true);
        setTimeout(() => setBindingVow(false), 5000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <div className={`bg-[var(--color-bg-abyss)] text-[var(--color-text-primary)] min-h-screen font-sans selection:bg-[var(--color-text-primary)]/20 transition-all duration-500 ${bindingVow ? 'invert' : ''}`}>
      <CursedEnergyBackground />
      <DomainMeter />
      
      {/* Binding Vow Tooltip */}
      <AnimatePresence>
        {bindingVow && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[150] bg-[var(--color-bg-abyss)] text-[var(--color-text-primary)] p-6 border border-[var(--color-accent-crimson)] rounded-xl shadow-2xl pointer-events-none">
            <h3 className="text-xl font-black uppercase tracking-[-0.02em] text-[var(--color-accent-crimson)] mb-2 font-display">Binding Vow Enacted</h3>
            <p className="text-sm tracking-widest uppercase opacity-80 font-mono font-semibold">"A vow made with oneself. In exchange for sight, power is amplified."</p>
          </div>
        )}
      </AnimatePresence>

      <Navbar />
      
      <AnimatePresence mode="wait">
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      
      <Footer />

      {/* Audio Toggle */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[var(--color-text-primary)]/10 backdrop-blur-md border border-[var(--color-text-primary)]/20 rounded-full flex items-center justify-center hover:bg-[var(--color-text-primary)]/20 transition-colors"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        )}
      </button>
    </div>
  );
}

