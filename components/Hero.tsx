'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import 3D Canvas with SSR disabled to prevent Server Side Rendering crashes
const ResearchGraph3D = dynamic(() => import('./ResearchGraph3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center space-y-1.5 p-4 bg-[#FAFAFA]">
      <div className="w-6 h-6 rounded-full border-2 border-[#FF4D3A]/20 border-t-[#FF4D3A] animate-spin" />
      <span className="text-[8px] font-bold text-[#6B7280] uppercase tracking-widest">
        WebGL...
      </span>
    </div>
  )
});

interface HeroProps {
  onSearchClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function Hero({ onSearchClick, searchQuery = '', onSearchChange }: HeroProps) {
  const [activeFilter, setActiveFilter] = useState('All Time');
  
  const periods = ['Today', 'This Week', 'This Month', 'All Time'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchClick) onSearchClick();
  };

  const trendingTags = ['GPT-5', 'Claude', 'Gemini', 'Qwen', 'DeepSeek', 'Reasoning', 'Agentic AI', 'World Models'];

  return (
    <section className="bg-white border border-[#EEEEEE] rounded-2xl p-6 md:p-8 shadow-sm mb-6 relative text-left">
      
      {/* 12-Column Grid Layout: 75% Left Text and 25% Right 3D Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Left Side: 75% Area (9 Columns) */}
        <div className="lg:col-span-9 flex flex-col space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-[#111827] tracking-tight leading-tight">
            Discover <span className="text-[#FF4D3A]">AI Research</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-xl font-medium">
            Explore the latest papers, methods, models, datasets and breakthroughs from the world&apos;s AI research community.
          </p>

          {/* Research Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-xl mt-1 group">
            <div className="absolute left-3.5 text-[#6B7280] group-focus-within:text-[#FF4D3A] transition-colors pointer-events-none">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search papers, methods, tasks, authors..."
              className="w-full py-2.5 pl-10 pr-24 rounded-xl border border-[#EEEEEE] bg-white text-[#111827] text-xs sm:text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#FF4D3A]/10 focus:border-[#FF4D3A] hover:border-[#EEEEEE]/80 font-medium"
            />
            <button 
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 bg-[#FF4D3A] hover:bg-[#FF4D3A]/90 text-white text-[11px] font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Clickable Trending Tags Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mr-1">
              Trending:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {trendingTags.map((tag) => {
                const isActive = searchQuery.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        onSearchChange?.('');
                      } else {
                        onSearchChange?.(tag);
                        if (onSearchClick) onSearchClick();
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all duration-150 cursor-pointer ${
                      isActive 
                        ? 'bg-[#FFEAE5] border-[#FF4D3A]/20 text-[#FF4D3A]' 
                        : 'bg-[#FAFAFA] border-[#EEEEEE] text-[#6B7280] hover:bg-[#FFEAE5] hover:border-[#FFEAE5] hover:text-[#FF4D3A]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeframe Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280] mr-1">
              Timeframe:
            </span>
            <div className="flex items-center gap-1">
              {periods.map((period) => {
                const isActive = activeFilter === period;
                return (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setActiveFilter(period)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-150 cursor-pointer ${
                      isActive 
                        ? 'bg-[#FF4D3A] text-white shadow-sm font-extrabold' 
                        : 'bg-[#FAFAFA] hover:bg-[#FFEAE5] border border-[#EEEEEE] text-[#6B7280] hover:text-[#FF4D3A]'
                    }`}
                  >
                    {period}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: 25% Area (3 Columns) hosting the visualization */}
        <div className="lg:col-span-3 flex justify-center items-center w-full h-full min-h-[140px] max-h-[180px] bg-[#FAFAFA] border border-[#EEEEEE] rounded-2xl p-2 relative overflow-hidden shadow-inner">
          <ResearchGraph3D />
        </div>

      </div>
    </section>
  );
}
