import { useState, useEffect, useCallback } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?~`-=[]\',./';

export function useScrambleText(text: string, duration: number = 1000, active: boolean = false) {
  const [displayText, setDisplayText] = useState(text);

  const scramble = useCallback(() => {
    let iteration = 0;
    const maxIterations = text.length;
    const intervalTime = duration / maxIterations;

    const interval = setInterval(() => {
      setDisplayText((prev) =>
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

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }

      iteration += 1 / 3; // Adjust speed of revealing actual characters
    }, intervalTime);

    return () => clearInterval(interval);
  }, [text, duration]);

  useEffect(() => {
    if (active) {
      return scramble();
    } else {
      setDisplayText(text);
    }
  }, [active, scramble, text]);

  return displayText;
}
