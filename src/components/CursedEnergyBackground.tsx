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
  const rafRef = useRef<number>(0);
  // Track last mouse position for per-move velocity
  const lastMouse = useRef({ x: -1000, y: -1000, t: 0 });

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

    const colors = [
      '#6A0DAD', // purple
      '#00BFFF', // blue
      '#CE5268', // crimson
      '#39FF14', // green
    ];

    const createParticle = (x?: number, y?: number, isMouse = false): Particle => ({
      x: x ?? Math.random() * canvas.width,
      y: y ?? canvas.height + 10,
      vx: (Math.random() - 0.5) * 2,
      vy: isMouse ? (Math.random() - 0.5) * 3 : -(Math.random() * 1.5 + 0.5),
      size: isMouse ? Math.random() * 2 + 1 : Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      maxLife: Math.random() * 60 + 40,
    });

    // Initial ambient particles
    for (let i = 0; i < 50; i++) {
      particles.current.push(createParticle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
      ));
    }

    // Mouse – throttled via rAF flag so we don't burst on fast moves
    let pendingMouseParticles = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      const dt = Math.max(1, now - lastMouse.current.t);
      const speed = Math.sqrt(dx * dx + dy * dy) / dt; // px/ms

      mouse.current = { x: e.clientX, y: e.clientY };
      lastMouse.current = { x: e.clientX, y: e.clientY, t: now };

      // Scale burst by cursor speed (1-6 particles)
      pendingMouseParticles = Math.min(6, Math.max(1, Math.floor(speed * 8)));
    };

    const handleScroll = () => {
      const current = window.scrollY;
      scrollVelocity.current = Math.abs(current - lastScrollY.current);
      lastScrollY.current = current;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = () => {
      // Fade trail
      ctx.fillStyle = 'rgba(3, 3, 3, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      scrollVelocity.current *= 0.92;
      const speedMultiplier = 1 + scrollVelocity.current * 0.04;

      // Ambient spawn
      if (Math.random() < 0.08 * speedMultiplier) {
        particles.current.push(createParticle());
      }

      // Emit pending mouse particles
      for (let i = 0; i < pendingMouseParticles; i++) {
        particles.current.push(createParticle(mouse.current.x, mouse.current.y, true));
      }
      pendingMouseParticles = 0;

      // Update & draw
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

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 mix-blend-screen"
        style={{ opacity: 0.6 }}
      />
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