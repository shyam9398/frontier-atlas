'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-10 pt-6 pb-4 border-t border-border-warm flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-semibold text-text-secondary">
      {/* Left side copyright */}
      <div className="flex items-center gap-1">
        <span>© {currentYear} AI Hub.</span>
        <span className="hidden sm:inline">All rights reserved.</span>
      </div>

      {/* Center tagline */}
      <div className="text-center md:text-left flex items-center gap-1.5">
        <span className="text-primary text-xs">✨</span>
        <span>Building the connected graph of all AI research.</span>
      </div>

      {/* Right side navigation links and theme toggle */}
      <div className="flex items-center gap-5 flex-wrap justify-center">
        <div className="flex items-center gap-4">
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#blog" className="hover:text-primary transition-colors">Blog</a>
          <a href="#api" className="hover:text-primary transition-colors">API</a>
          <a href="#careers" className="hover:text-primary transition-colors">Careers</a>
          <a href="#privacy" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#terms" className="hover:text-primary transition-colors">Terms</a>
        </div>

        {/* Theme Switcher Toggle */}
        <div className="flex items-center p-0.5 rounded-lg border border-border-warm bg-card shadow-sm">
          <button className="p-1 rounded bg-accent/40 text-primary transition-all">
            <Sun size={11} className="fill-current" />
          </button>
          <button className="p-1 rounded text-text-secondary/70 hover:text-primary transition-all">
            <Moon size={11} />
          </button>
        </div>
      </div>
    </footer>
  );
}
