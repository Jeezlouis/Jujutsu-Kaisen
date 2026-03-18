import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export function CursedEnergyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      // Add particles on mouse move
      for (let i = 0; i < 3; i++) {
        particles.current.push(createParticle(mouse.current.x, mouse.current.y, true));
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity.current = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);

    const getCssVariable = (name: string) => {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    };

    const colors = [
      getCssVariable('--color-accent-purple') || '#6A0DAD',
      getCssVariable('--color-accent-blue') || '#00BFFF',
      getCssVariable('--color-accent-crimson') || '#CE5268',
      getCssVariable('--color-accent-green') || '#39FF14'
    ];

    const createParticle = (x?: number, y?: number, isMouse = false): Particle => {
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - (isMouse ? 0 : 1), // Drift up slightly
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        maxLife: Math.random() * 50 + 50,
      };
    };

    // Initial particles
    for (let i = 0; i < 50; i++) {
      particles.current.push(createParticle());
    }

    let animationFrameId: number;

    const render = () => {
      // Fade effect for trails
      ctx.fillStyle = 'rgba(3, 3, 3, 0.2)'; // Keep this dark for the trail effect, matches bg-abyss
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Decay scroll velocity
      scrollVelocity.current *= 0.95;

      const speedMultiplier = 1 + scrollVelocity.current * 0.05;

      // Add ambient particles
      if (Math.random() < 0.1 * speedMultiplier) {
        particles.current.push(createParticle(undefined, canvas.height + 10));
      }

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;
        p.life--;

        if (p.life <= -p.maxLife || p.x < 0 || p.x > canvas.width || p.y < -50) {
          particles.current.splice(i, 1);
          continue;
        }

        const opacity = Math.max(0, 1 - Math.abs(p.life) / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        
        // Add glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 mix-blend-screen"
        style={{ opacity: 0.6 }}
      />
      {/* Noise/Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </>
  );
}
