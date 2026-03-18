import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
  playSting: (type: 'sukuna' | 'gojo' | 'generic') => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const humRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    humRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3');
    humRef.current.loop = true;
    humRef.current.volume = 0;

    const handleScroll = () => {
      if (!humRef.current) return;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollY / docHeight));
      
      humRef.current.volume = progress * 0.5;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (humRef.current) {
        humRef.current.pause();
        humRef.current = null;
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      humRef.current?.pause();
    } else {
      audioRef.current?.play().catch(console.error);
      humRef.current?.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const playSting = (type: 'sukuna' | 'gojo' | 'generic') => {
    const sting = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3');
    sting.volume = 0.6;
    sting.play().catch(console.error);
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio, playSting }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useCursedAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useCursedAudio must be used within an AudioProvider');
  }
  return context;
}
