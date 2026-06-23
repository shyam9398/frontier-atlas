'use client';

import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import 3D Canvas with SSR disabled to prevent Server Side Rendering crashes
const ResearchGraph3D = dynamic(() => import('./ResearchGraph3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center space-y-2 p-6">
      <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <span className="text-[8px] font-extrabold text-text-secondary uppercase tracking-wider">
        Loading WebGL Graph Engine...
      </span>
    </div>
  )
});

interface HeroProps {
  onSearchClick?: () => void;
}

export default function Hero({ onSearchClick }: HeroProps) {
  return (
    <section className="glass-panel rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm border border-border-warm mb-5 overflow-hidden relative">
      {/* Glow Backdrops */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-accent/25 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-accent/15 to-transparent rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Left Column Text details (reduced sizing) */}
        <div className="lg:col-span-7 flex flex-col text-left space-y-3.5">
          <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 rounded-full bg-accent/40 text-primary border border-border-warm text-[10px] font-bold tracking-wide">
            <Sparkles size={10} className="fill-current" />
            AI Research Operating System
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
            Discover, understand and track <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              AI research
            </span>{' '}
            that matters.
          </h1>

          <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
            Explore connections between papers, models, datasets, benchmarks, authors, and organizations in an interactive 3D WebGL glass cards network graph.
          </p>

          {/* Localized Search Box */}
          <div className="relative flex items-center w-full max-w-lg mt-1 group">
            <div className="absolute left-3.5 text-text-secondary/70 group-focus-within:text-primary transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search papers, authors, models, datasets..."
              className="w-full py-2.5 pl-10 pr-24 rounded-xl border border-border-warm bg-card text-text-primary text-xs shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-border-warm/80"
            />
            <button 
              onClick={onSearchClick}
              className="absolute right-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary text-white text-[10px] font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        {/* Right Column 3D Network Graph */}
        <div className="lg:col-span-5 flex justify-center items-center h-full min-h-[220px] max-h-[260px]">
          <ResearchGraph3D />
        </div>

      </div>
    </section>
  );
}
