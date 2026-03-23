import { useState, useEffect, useCallback } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?~`-=[]\',./';

export function useScrambleText(text: string, duration: number = 1000, active: boolean = false) {
  const [displayText, setDisplayText] = useState(text);

  const scramble = useCallback(() => {
    let frameId: number;
    let iteration = 0;
    const maxIterations = text.length;

    const loop = () => {
      setDisplayText(
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join('')
      );

      if (iteration < maxIterations) {
        iteration += 0.33; // Reveal speed
        frameId = requestAnimationFrame(loop);
      } else {
        setDisplayText(text);
      }
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [text]);

  useEffect(() => {
    if (active) {
      return scramble();
    } else {
      setDisplayText(text);
    }
  }, [active, scramble, text]);

  return displayText;
}
