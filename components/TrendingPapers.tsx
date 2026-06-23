'use client';

import React from 'react';
import { 
  Bookmark, Eye, Save, Sparkles, Network, ArrowLeftRight, Star, 
  TrendingUp, Activity, Database, Cpu, Milestone 
} from 'lucide-react';
import { Paper } from '@/types';

interface TrendingPapersProps {
  papers: Paper[];
  onViewPaper: (paper: Paper) => void;
  onBookmarkToggle: (paper: Paper) => void;
  onCompareSelect: (paper: Paper) => void;
  onGenerateSummary: (paper: Paper) => void;
  onOpenGraph: (paper: Paper) => void;
  onSavePaper: (paper: Paper) => void;
}

export default function TrendingPapers({ 
  papers, 
  onViewPaper, 
  onBookmarkToggle, 
  onCompareSelect, 
  onGenerateSummary, 
  onOpenGraph, 
  onSavePaper 
}: TrendingPapersProps) {
  
  return (
    <div className="space-y-5 text-left w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-border-warm">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h2 className="font-extrabold text-base text-text-primary tracking-tight">Trending Research Papers</h2>
        </div>
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-4">
        {papers.map((paper) => {
          return (
            <div
              key={paper.id}
              className="p-5 rounded-2xl bg-card border border-border-warm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col md:flex-row gap-5"
            >
              {/* Left Side: Thumbnail Visual */}
              <div className={`w-full md:w-28 h-28 rounded-2xl shrink-0 bg-gradient-to-tr ${paper.thumbnailBg || 'from-orange-400 to-amber-600'} flex flex-col items-center justify-center p-3 text-white shadow-inner relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                <Activity size={24} className="relative z-10 animate-pulse text-white/90" />
                <span className="text-[10px] font-extrabold tracking-wider uppercase mt-2 relative z-10 text-white/95">
                  {paper.category}
                </span>
              </div>

              {/* Right Side: Paper Content */}
              <div className="flex-1 flex flex-col justify-between space-y-3.5">
                
                {/* Meta details */}
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <h3 
                      onClick={() => onViewPaper(paper)}
                      className="font-extrabold text-sm sm:text-base text-text-primary leading-snug hover:text-primary transition-colors cursor-pointer"
                    >
                      {paper.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-text-secondary mt-1 font-semibold">
                    <span className="text-primary font-bold">{paper.organization}</span>
                    <span className="w-1 h-1 rounded-full bg-border-warm" />
                    <span>{paper.authors.join(', ')}</span>
                    <span className="w-1 h-1 rounded-full bg-border-warm" />
                    <span>{paper.pubDate}</span>
                  </div>

                  {/* Summary Block */}
                  <p className="text-xs text-text-secondary leading-relaxed bg-accent/5 p-3 rounded-xl border border-border-warm/60 mt-3 font-medium">
                    {paper.summary}
                  </p>
                </div>

                {/* Grounded Links (Models, Datasets, Benchmarks) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[10px] font-bold">
                  <div className="flex items-center gap-1.5 text-text-primary">
                    <Cpu size={12} className="text-primary" />
                    <span className="text-text-secondary mr-1">Models:</span>
                    <span className="truncate">{paper.models?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-primary">
                    <Database size={12} className="text-emerald-500" />
                    <span className="text-text-secondary mr-1">Data:</span>
                    <span className="truncate">{paper.datasets?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-primary">
                    <Milestone size={12} className="text-amber-500" />
                    <span className="text-text-secondary mr-1">Benchmark:</span>
                    <span className="truncate">{paper.benchmarks || 'N/A'}</span>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="flex flex-wrap gap-4 items-center pt-3 border-t border-border-warm/60 text-[10px] font-extrabold">
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-secondary uppercase">Citations:</span>
                    <span className="text-text-primary bg-accent/20 px-2 py-0.5 rounded border border-border-warm">
                      {paper.citations.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star size={12} className="text-primary fill-primary/10" />
                    <span className="text-text-secondary uppercase">Stars:</span>
                    <span className="text-text-primary bg-accent/20 px-2 py-0.5 rounded border border-border-warm">
                      {(paper.stars || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity size={12} className="text-emerald-500" />
                    <span className="text-text-secondary uppercase">Impact:</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {paper.impact || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-primary" />
                    <span className="text-text-secondary uppercase">Velocity:</span>
                    <span className="text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                      {paper.velocity || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons (All functional) */}
                <div className="flex flex-wrap gap-2 pt-1 justify-end">
                  <button 
                    onClick={() => onViewPaper(paper)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-warm bg-card hover:bg-accent/40 text-[10px] font-bold text-text-secondary hover:text-primary transition-all cursor-pointer"
                  >
                    <Eye size={12} />
                    View Paper
                  </button>
                  <button 
                    onClick={() => onSavePaper(paper)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-warm bg-card hover:bg-accent/40 text-[10px] font-bold text-text-secondary hover:text-primary transition-all cursor-pointer"
                  >
                    <Save size={12} />
                    Save
                  </button>
                  <button 
                    onClick={() => onBookmarkToggle(paper)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                      paper.isBookmarked 
                        ? 'bg-primary/5 border-primary/20 text-primary' 
                        : 'border-border-warm bg-card hover:bg-accent/40 text-text-secondary hover:text-primary'
                    }`}
                  >
                    <Bookmark size={12} className={paper.isBookmarked ? 'fill-primary' : ''} />
                    Bookmark
                  </button>
                  <button 
                    onClick={() => onCompareSelect(paper)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-warm bg-card hover:bg-accent/40 text-[10px] font-bold text-text-secondary hover:text-primary transition-all cursor-pointer"
                  >
                    <ArrowLeftRight size={12} />
                    Compare
                  </button>
                  <button 
                    onClick={() => onOpenGraph(paper)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-warm bg-card hover:bg-accent/40 text-[10px] font-bold text-text-secondary hover:text-primary transition-all cursor-pointer"
                  >
                    <Network size={12} />
                    Open Graph
                  </button>
                  <button 
                    onClick={() => onGenerateSummary(paper)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary text-white text-[10px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles size={11} className="fill-current text-white/95" />
                    Summary
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
