import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
  playSting: (type: 'sukuna' | 'gojo' | 'generic') => void;
}

const AudioCtx = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Initialise the Web Audio graph once (so we can control gain smoothly)
  const initAudio = () => {
    if (audioCtxRef.current) return; // already initialised

    const audio = new Audio('/assets/audio/Kaikai Kitan.mp3');
    audio.loop = true;
    audioRef.current = audio;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNodeRef.current = gain;

    const source = ctx.createMediaElementSource(audio);
    sourceRef.current = source;
    source.connect(gain);
    gain.connect(ctx.destination);
  };

  // Scroll → subtle volume swell (max +0.15 at bottom)
  useEffect(() => {
    const handleScroll = () => {
      if (!gainNodeRef.current || !audioCtxRef.current || !isPlaying) return;
      const progress = Math.min(1, window.scrollY /
        Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
      const targetGain = 0.3 + progress * 0.15;
      gainNodeRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPlaying]);

  const toggleAudio = () => {
    initAudio();
    const nextPlaying = !isPlaying;
    const audio = audioRef.current;
    const ctx = audioCtxRef.current;
    if (!audio || !ctx) return;

    if (nextPlaying) {
      ctx.resume();
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
    setIsPlaying(nextPlaying);
  };

  // Sting: brief gain spike on the main track – no separate file needed
  const playSting = (_type: 'sukuna' | 'gojo' | 'generic') => {
    if (!gainNodeRef.current || !audioCtxRef.current || !isPlaying) return;
    const gain = gainNodeRef.current;
    const t = audioCtxRef.current.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(0.65, t + 0.1);   // quick spike
    gain.gain.linearRampToValueAtTime(0.3, t + 1.0);    // fade back
  };

  return (
    <AudioCtx.Provider value={{ isPlaying, toggleAudio, playSting }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useCursedAudio() {
  const context = useContext(AudioCtx);
  if (!context) throw new Error('useCursedAudio must be used within an AudioProvider');
  return context;
}
