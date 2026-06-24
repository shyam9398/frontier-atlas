'use client';

import React from 'react';
import { 
  Bookmark, Eye, Save, Sparkles, Network, ArrowLeftRight, 
  FileText, ArrowUp, Trophy
} from 'lucide-react';
import { Paper } from '@/types';

// Custom inline Github SVG component to resolve missing export in lucide-react version
const Github = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    height={size}
    width={size}
    className={className}
    viewBox="0 0 16 16"
    fill="currentColor"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

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
  
  // Helper for dynamic tag colors based on category/type
  const getTagColor = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('agent') || t.includes('robot') || t.includes('task') || t.includes('success') || t.includes('control') || t.includes('learning')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50';
    }
    if (t.includes('llm') || t.includes('nlp') || t.includes('code') || t.includes('model') || t.includes('transformer')) {
      return 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100/50';
    }
    return 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100/50';
  };

  return (
    <div className="space-y-4 text-left w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
        <div className="flex items-center gap-2">
          <span className="text-[#FF4D3A] font-bold">🔥</span>
          <h2 className="font-extrabold text-base font-display text-[#111827] tracking-tight">
            Trending Research Papers
          </h2>
        </div>
        <span className="text-[11px] font-bold text-[#6B7280] bg-[#FAFAFA] border border-[#EEEEEE] px-2 py-0.5 rounded-lg">
          {papers.length} publications
        </span>
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-4">
        {papers.map((paper) => {
          return (
            <div
              key={paper.id}
              className="p-5 rounded-2xl bg-white border border-[#EEEEEE] hover:border-[#FF4D3A]/20 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-6 items-start justify-between"
            >
              {/* Left Column: Cover & Details (Thumbnail + Info) */}
              <div className="flex flex-col sm:flex-row gap-5 items-start flex-1 min-w-0 w-full">
                
                {/* Realistic Paper Document Sheet Thumbnail */}
                <div 
                  onClick={() => onViewPaper(paper)}
                  className="w-[100px] h-[130px] rounded-lg shrink-0 bg-white border border-[#EEEEEE] shadow-sm relative group cursor-pointer hover:shadow-md transition-all p-3 flex flex-col justify-between overflow-hidden self-center sm:self-start"
                >
                  {/* Simulated lines and visual doc headers */}
                  <div className="space-y-1.5 w-full">
                    {/* Header bar / Title block */}
                    <div className="h-2 w-3/4 bg-gray-200 rounded group-hover:bg-[#FF4D3A]/10 transition-colors" />
                    <div className="h-1.5 w-1/2 bg-gray-100 rounded" />
                    
                    {/* Body text lines */}
                    <div className="space-y-1 pt-2">
                      <div className="h-1 w-full bg-gray-100 rounded" />
                      <div className="h-1 w-5/6 bg-gray-100 rounded" />
                      <div className="h-1 w-4/5 bg-gray-100 rounded" />
                      <div className="h-1 w-full bg-gray-100 rounded" />
                    </div>
                  </div>
                  
                  {/* Mini Bar Chart graphic at the bottom of the thumbnail */}
                  <div className="flex items-end gap-1 h-8 pt-2 border-t border-gray-100 w-full justify-between">
                    <div className="w-1.5 bg-[#FF4D3A]/30 rounded-t h-1/3 group-hover:h-1/2 transition-all duration-300" />
                    <div className="w-1.5 bg-[#FF4D3A]/60 rounded-t h-2/3 group-hover:h-5/6 transition-all duration-300" />
                    <div className="w-1.5 bg-[#FF4D3A] rounded-t h-full group-hover:h-3/4 transition-all duration-300" />
                    <div className="w-1.5 bg-[#FF4D3A]/40 rounded-t h-1/2 group-hover:h-2/3 transition-all duration-300" />
                  </div>
                </div>

                {/* Center Content Column */}
                <div className="flex-1 min-w-0 space-y-2.5">
                  {/* Date & SOTA badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-[#6B7280]">{paper.pubDate}</span>
                    {paper.benchmarks && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                        <Trophy size={11} className="fill-amber-500 text-amber-500" />
                        <span>SOTA: {paper.benchmarks}</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onViewPaper(paper)}
                    className="font-extrabold text-base text-[#111827] leading-snug hover:text-[#FF4D3A] transition-colors cursor-pointer"
                  >
                    {paper.title}
                  </h3>

                  {/* Authors & Organization */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6B7280] font-semibold">
                    <span className="text-[#FF4D3A] font-bold">{paper.organization}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{paper.authors.join(', ')}</span>
                  </div>

                  {/* Summary Block */}
                  <p className="text-[11px] sm:text-xs text-[#6B7280] leading-relaxed bg-[#FAFAFA] p-3 border border-[#EEEEEE] rounded-xl font-medium">
                    {paper.summary}
                  </p>

                  {/* Colored research tags */}
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold pt-1">
                    {paper.category && (
                      <span className={`px-2.5 py-0.5 rounded-full border transition-colors ${getTagColor(paper.category)}`}>
                        {paper.category}
                      </span>
                    )}
                    {paper.models && paper.models.map((m) => (
                      <span key={m} className={`px-2.5 py-0.5 rounded-full border transition-colors ${getTagColor(m)}`}>
                        {m}
                      </span>
                    ))}
                    {paper.datasets && paper.datasets.map((d) => (
                      <span key={d} className={`px-2.5 py-0.5 rounded-full border transition-colors ${getTagColor(d)}`}>
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button 
                      onClick={() => onViewPaper(paper)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EEEEEE] bg-white hover:bg-[#FFEAE5] hover:border-[#FFEAE5] text-[10px] font-bold text-[#6B7280] hover:text-[#FF4D3A] transition-all cursor-pointer"
                    >
                      <Eye size={12} />
                      View Paper
                    </button>
                    <button 
                      onClick={() => onSavePaper(paper)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EEEEEE] bg-white hover:bg-[#FFEAE5] hover:border-[#FFEAE5] text-[10px] font-bold text-[#6B7280] hover:text-[#FF4D3A] transition-all cursor-pointer"
                    >
                      <Save size={12} />
                      Save
                    </button>
                    <button 
                      onClick={() => onBookmarkToggle(paper)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                        paper.isBookmarked 
                          ? 'bg-[#FFEAE5] border-[#FFEAE5] text-[#FF4D3A]' 
                          : 'border-[#EEEEEE] bg-white hover:bg-[#FFEAE5] hover:border-[#FFEAE5] text-[#6B7280] hover:text-[#FF4D3A]'
                      }`}
                    >
                      <Bookmark size={12} className={paper.isBookmarked ? 'fill-[#FF4D3A]' : ''} />
                      Bookmark
                    </button>
                    <button 
                      onClick={() => onCompareSelect(paper)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EEEEEE] bg-white hover:bg-[#FFEAE5] hover:border-[#FFEAE5] text-[10px] font-bold text-[#6B7280] hover:text-[#FF4D3A] transition-all cursor-pointer"
                    >
                      <ArrowLeftRight size={12} />
                      Compare
                    </button>
                    <button 
                      onClick={() => window.open('https://github.com', '_blank')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EEEEEE] bg-white hover:bg-[#FFEAE5] hover:border-[#FFEAE5] text-[10px] font-bold text-[#6B7280] hover:text-[#FF4D3A] transition-all cursor-pointer"
                    >
                      <Github size={12} />
                      Repository
                    </button>
                    <button 
                      onClick={() => onOpenGraph(paper)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EEEEEE] bg-white hover:bg-[#FFEAE5] hover:border-[#FFEAE5] text-[10px] font-bold text-[#6B7280] hover:text-[#FF4D3A] transition-all cursor-pointer"
                    >
                      <Network size={12} />
                      Open Graph
                    </button>
                    <button 
                      onClick={() => onGenerateSummary(paper)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF4D3A] hover:bg-[#FF4D3A]/90 text-white text-[10px] font-extrabold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Sparkles size={12} className="fill-current text-white/90" />
                      Summary
                    </button>
                  </div>

                </div>
              </div>

              {/* Right Column: Stacked Vertical Metrics (Upvotes, Repo, Citations) */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-6 border-t md:border-t-0 md:border-l border-[#EEEEEE] pt-4 md:pt-0 pl-0 md:pl-6 shrink-0 w-full md:w-44 justify-between md:justify-start">
                
                {/* Upvotes */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFEAE5] text-[#FF4D3A] shrink-0">
                    <ArrowUp size={16} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-extrabold text-[#111827] leading-none">
                      {(paper.upvotes ?? 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#6B7280] font-semibold mt-1">Upvotes</div>
                  </div>
                </div>

                {/* Repo / Stars */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FAFAFA] text-[#6B7280] border border-[#EEEEEE] shrink-0">
                    <Github size={16} />
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-extrabold text-[#111827] leading-none">
                      {(paper.stars ?? 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#6B7280] font-semibold mt-1">Repo</div>
                  </div>
                </div>

                {/* Citations */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FAFAFA] text-[#6B7280] border border-[#EEEEEE] shrink-0">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-extrabold text-[#111827] leading-none">
                      {paper.citations.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#6B7280] font-semibold mt-1">Citations</div>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
