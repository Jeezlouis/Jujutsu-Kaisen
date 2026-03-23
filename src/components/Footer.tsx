import React from 'react';
import { Github } from 'lucide-react';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="relative w-full bg-[var(--color-bg-abyss)] pt-[30vh] pb-12 overflow-hidden min-h-screen">
      {/* Slanted backgrounds */}
      <div className="absolute inset-0 bg-[var(--color-bg-abyss)] clip-footer" />
      <div className="absolute inset-0 bg-[var(--color-accent-purple)]/20 pointer-events-none mix-blend-color-dodge clip-footer" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-purple)]/30 to-transparent pointer-events-none clip-footer" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-end text-right h-full justify-end">
        <div className="flex flex-col md:flex-row justify-end gap-16 w-full">

          {/* Navigation */}
          <div className="flex flex-col gap-8 items-end">
            <div className="flex flex-col gap-4 items-end">
              <h3 className="text-xl text-[var(--color-text-primary)]/80 uppercase tracking-[-0.02em] font-display font-bold">Navigation</h3>
              <ul className="flex flex-col gap-2 font-mono items-end">
                {[
                  { name: 'Characters', id: '#characters' },
                  { name: 'Domains', id: '#domains' },
                  { name: 'Techniques', id: '#techniques' },
                  { name: 'Timeline', id: '#timeline' },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.id}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors uppercase tracking-wider text-sm font-semibold"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Only include real links */}
            <div className="flex gap-4 justify-end">
              <a
                href="https://github.com/Jeezlouis/Jujutsu-Kaisen"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on Github"
                className="w-10 h-10 rounded-full border border-[var(--color-text-primary)]/10 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)]/30 transition-all hover:shadow-[0_0_8px_rgba(224,224,224,0.2)]"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Studio Info */}
          <div className="flex flex-col gap-4 max-w-sm items-end">
            <h3 className="text-xl text-[var(--color-text-primary)]/80 uppercase tracking-[-0.02em] font-display font-bold">Studio</h3>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed font-body">
              Tokyo Metropolitan Curse Technical College.
              <br />
              Dedicated to the study and exorcism of curses.
            </p>
            <div className="mt-4 font-mono">
              <p className="text-[var(--color-text-secondary)]/80 text-xs tracking-widest uppercase font-semibold">Contact</p>
              <a
                href="mailto:info@jujutsu.edu"
                className="text-[var(--color-text-primary)] hover:text-glow-blue transition-all font-semibold"
              >
                info@jujutsu.edu
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-24 pt-8 border-t border-[var(--color-text-primary)]/10 flex flex-col items-end gap-4 font-mono w-full">
          <p className="text-[var(--color-text-secondary)]/80 text-xs tracking-widest uppercase font-semibold">
            &copy; {YEAR} Jujutsu Kaisen Experience. All rights reserved.
          </p>
          <p className="text-[var(--color-text-secondary)]/60 text-xs tracking-widest uppercase font-semibold">
            Designed with Cursed Energy
          </p>
        </div>
      </div>
    </footer>
  );
}
