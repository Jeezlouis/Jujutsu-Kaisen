import { useState, useEffect } from 'react';

const VIDEOS = [
  '/assets/videos/hero/hero.mp4'
];

export function useMediaController() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % VIDEOS.length);
    }, 10000); // 10s switch

    return () => clearInterval(interval);
  }, []);

  return {
    currentVideo: VIDEOS[currentVideoIndex],
    nextVideo: VIDEOS[(currentVideoIndex + 1) % VIDEOS.length],
  };
}
