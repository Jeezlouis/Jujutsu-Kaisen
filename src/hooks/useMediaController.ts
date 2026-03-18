import { useState, useEffect } from 'react';

const VIDEOS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', // Placeholder for JJK OP 1
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', // Placeholder for JJK OP 2
  'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Placeholder for JJK OP 3
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
