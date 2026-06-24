'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const ResearchGraph3D = dynamic(() => import('./ResearchGraph3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[120px] flex flex-col items-center justify-center space-y-1 p-4">
      <div className="w-4 h-4 rounded-full border-2 border-[#FF6B35]/20 border-t-[#FF6B35] animate-spin" />
    </div>
  )
});

export default function Hero() {
  const [activeFilter, setActiveFilter] = useState('All Time');
  
  const periods = ['Today', 'This Week', 'This Month', 'All Time'];

  return (
    <section className="bg-white py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#ECECEC] pb-6 mb-4">
      
      {/* Left side text and filters */}
      <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-4">
        <div className="space-y-1 text-left max-w-2xl">
          <h1 className="text-3xl font-bold font-serif text-[#111111] leading-tight">
            Discover Frontier AI Research
          </h1>
          <p className="text-sm font-serif text-[#666666] leading-relaxed">
            Explore the latest papers, methods and breakthroughs from the world&apos;s AI research community.
          </p>
        </div>

        {/* Timeframe Filters aligned to the right of the title block */}
        <div className="flex items-center gap-0.5 border border-[#ECECEC] rounded-md p-0.5 bg-gray-50 shrink-0 self-start md:self-auto">
          {periods.map((period) => {
            const isActive = activeFilter === period;
            return (
              <button
                key={period}
                type="button"
                onClick={() => setActiveFilter(period)}
                className={`px-3 py-1.5 text-xs font-serif transition-all duration-150 cursor-pointer rounded ${
                  isActive 
                    ? 'bg-[#FF6B35] text-white font-semibold' 
                    : 'text-[#666666] hover:text-[#FF6B35]'
                }`}
              >
                {period}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side: 3D network visual */}
      <div className="w-[140px] h-[90px] shrink-0 overflow-hidden relative rounded-md border border-[#ECECEC] bg-gray-50 flex items-center justify-center">
        <ResearchGraph3D />
      </div>

    </section>
  );
}
