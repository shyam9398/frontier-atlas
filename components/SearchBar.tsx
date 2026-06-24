'use client';

import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  variant?: 'navbar' | 'hero';
  value?: string;
  onChange?: (val: string) => void;
}

export default function SearchBar({ 
  placeholder = "Search papers, authors, models, datasets, benchmarks...", 
  variant = 'navbar',
  value = '',
  onChange
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isHero = variant === 'hero';

  return (
    <div className={`relative flex items-center w-full transition-all duration-200 ${isHero ? 'max-w-xl mx-auto' : 'max-w-md'}`}>
      <div className="absolute left-3.5 text-text-secondary">
        <Search size={18} className="text-text-secondary/70 group-focus-within:text-primary transition-colors" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full pl-11 pr-16 rounded-xl border border-border-warm bg-card text-text-primary text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm hover:border-border-warm/80 ${
          isHero ? 'py-3.5 text-base shadow-md' : 'py-2'
        }`}
      />
      <div className={`absolute right-3 flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-border-warm bg-accent/20 text-[10px] font-semibold text-text-secondary pointer-events-none select-none ${isHero ? 'py-1 px-2' : ''}`}>
        <span>Ctrl</span>
        <span>K</span>
      </div>
    </div>
  );
}
