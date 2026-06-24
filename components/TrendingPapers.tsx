'use client';

import React from 'react';
import { 
  Bookmark, Eye, Save, Sparkles, Network, ArrowLeftRight, 
  FileText, ArrowUp, Trophy
} from 'lucide-react';
import { Paper } from '@/types';

// Custom inline Github SVG component
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

  // Helper to render book-like paper thumbnails with columns, titles and charts
  const renderPaperThumbnail = (paper: Paper) => {
    const isGLM = paper.id === '1';
    const isResNet = paper.id === '2';
    const isTransformer = paper.id === '3';

    return (
      <div className="w-[110px] h-[145px] bg-[#FFFFFF] border border-[#E0E0E0] shadow-[1px_2px_4px_rgba(0,0,0,0.06)] rounded-sm shrink-0 flex flex-col p-2.5 overflow-hidden select-none hover:shadow-md transition-all self-center sm:self-start">
        {/* Micro Title Header */}
        <div className="text-[4px] font-bold font-serif text-[#111111] line-clamp-2 leading-none border-b border-[#ECECEC] pb-1 uppercase tracking-tighter">
          {paper.title}
        </div>
        
        {/* Micro authors list */}
        <div className="text-[3px] font-serif text-[#666666] mt-0.5 scale-90 origin-left">
          {paper.authors.slice(0, 2).join(', ')} et al.
        </div>

        {/* Double column paragraph simulation */}
        <div className="flex-1 flex gap-1.5 mt-2 overflow-hidden">
          {/* Column 1 */}
          <div className="flex-1 space-y-0.5">
            <div className="h-0.5 w-full bg-gray-200 rounded-2xs" />
            <div className="h-0.5 w-11/12 bg-gray-150 rounded-2xs" />
            <div className="h-0.5 w-4/5 bg-gray-100 rounded-2xs" />
            <div className="h-0.5 w-full bg-gray-200 rounded-2xs" />
            <div className="h-0.5 w-5/6 bg-gray-100 rounded-2xs" />
          </div>
          {/* Column 2 */}
          <div className="flex-1 space-y-0.5">
            <div className="h-0.5 w-full bg-gray-200 rounded-2xs" />
            <div className="h-0.5 w-full bg-gray-150 rounded-2xs" />
            <div className="h-0.5 w-5/6 bg-gray-100 rounded-2xs" />
            <div className="h-0.5 w-3/4 bg-gray-250 rounded-2xs" />
            <div className="h-0.5 w-full bg-gray-200 rounded-2xs" />
          </div>
        </div>

        {/* Custom graphic inside the thumbnail */}
        <div className="mt-1 h-12 w-full bg-gray-50 border border-[#ECECEC] rounded-xs flex items-center justify-center overflow-hidden">
          {isGLM && (
            <div className="flex items-end gap-1 h-8 w-full px-2 justify-center">
              <div className="w-1.5 bg-[#4F46E5] h-3 rounded-t-2xs" />
              <div className="w-1.5 bg-[#3B82F6] h-6 rounded-t-2xs" />
              <div className="w-1.5 bg-[#FF6B35] h-9 rounded-t-2xs" />
            </div>
          )}
          {isResNet && (
            <div className="relative w-full h-full p-1 flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 20 10">
                <path d="M0,8 Q5,2 10,6 T20,1" fill="none" stroke="#FF6B35" strokeWidth="0.5" />
                <path d="M0,9 Q6,4 12,8 T20,3" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
              </svg>
            </div>
          )}
          {isTransformer && (
            <div className="flex flex-col gap-0.5 items-center justify-center w-full h-full p-1">
              <div className="w-8 h-2 bg-blue-50 border border-blue-200 text-[2px] font-sans scale-75 rounded-2xs flex items-center justify-center text-blue-700">Encoder</div>
              <div className="w-8 h-2 bg-orange-50 border border-orange-200 text-[2px] font-sans scale-75 rounded-2xs flex items-center justify-center text-orange-700">Decoder</div>
            </div>
          )}
          {!isGLM && !isResNet && !isTransformer && (
            <div className="text-[3px] text-gray-400 font-serif italic scale-90">Figure 1</div>
          )}
        </div>

        {/* Micro footer page number */}
        <div className="text-[3px] text-gray-300 text-right mt-1 font-serif scale-75 origin-right">
          Page 1
        </div>
      </div>
    );
  };

  // Helper for category dot colors
  const getCategoryDotStyle = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('agent')) return { dot: 'bg-emerald-600', pill: 'bg-[#ECFDF5] text-emerald-800 hover:bg-[#D1FAE5]' };
    if (c.includes('reason')) return { dot: 'bg-indigo-600', pill: 'bg-[#EEF2FF] text-indigo-800 hover:bg-[#E0E7FF]' };
    if (c.includes('language') || c.includes('nlp')) return { dot: 'bg-blue-600', pill: 'bg-[#EFF6FF] text-blue-800 hover:bg-[#DBEAFE]' };
    if (c.includes('robot')) return { dot: 'bg-amber-600', pill: 'bg-[#FFFBEB] text-amber-800 hover:bg-[#FEF3C7]' };
    if (c.includes('image') || c.includes('video') || c.includes('audio') || c.includes('generative')) {
      return { dot: 'bg-rose-600', pill: 'bg-[#FFF1F2] text-rose-800 hover:bg-[#FFE4E6]' };
    }
    return { dot: 'bg-gray-600', pill: 'bg-[#F9FAFB] text-gray-800 hover:bg-[#F3F4F6]' };
  };

  // Helper to formatting citation numbers nicely
  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="space-y-4 text-left w-full">
      {/* Cards List */}
      <div className="flex flex-col gap-4">
        {papers.map((paper) => {
          const categoryStyle = getCategoryDotStyle(paper.category);
          
          return (
            <div
              key={paper.id}
              className="p-5 bg-white border border-[#ECECEC] rounded-md transition-all duration-200 flex flex-col md:flex-row gap-6 items-stretch justify-between"
            >
              {/* Left Column: Book-like Page Thumbnail & Details */}
              <div className="flex flex-col sm:flex-row gap-5 items-start flex-1 min-w-0 w-full">
                
                {/* Book-like paper page */}
                <div onClick={() => onViewPaper(paper)} className="cursor-pointer shrink-0">
                  {renderPaperThumbnail(paper)}
                </div>

                {/* Center Content Column */}
                <div className="flex-1 min-w-0 space-y-2">
                  
                  {/* Title */}
                  <h3 
                    onClick={() => onViewPaper(paper)}
                    className="font-serif font-bold text-lg text-[#111111] leading-snug hover:text-[#FF6B35] transition-colors cursor-pointer"
                  >
                    {paper.title}
                  </h3>

                  {/* Authors, Date, Citations line */}
                  <div className="text-xs text-[#666666] font-serif">
                    {paper.authors.join(', ')}
                    {paper.pubDate && ` · ${paper.pubDate}`}
                    {paper.citations > 0 && ` · ${paper.citations.toLocaleString()} citations`}
                  </div>

                  {/* Summary Block */}
                  <p className="text-xs font-serif text-[#666666] leading-relaxed">
                    {paper.summary}
                  </p>

                  {/* SOTA badges line */}
                  {paper.benchmarks && (
                    <div className="flex items-center gap-1.5 text-xs text-[#666666] font-serif">
                      <Trophy size={13} className="text-[#FF6B35] shrink-0" />
                      <span>
                        <span className="font-bold text-[#FF6B35]">SOTA</span> on {paper.benchmarks}
                      </span>
                    </div>
                  )}

                  {/* Categories and Methods pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {/* Category pill with colored dot */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-serif transition-colors cursor-pointer ${categoryStyle.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dot}`} />
                      {paper.category}
                    </span>

                    {/* Method tags / White border pills */}
                    {paper.models && paper.models.map((m) => (
                      <span 
                        key={m} 
                        className="px-2.5 py-0.5 rounded-full border border-[#ECECEC] bg-white text-[#666666] hover:border-[#FF6B35] hover:text-[#FF6B35] text-xs font-serif transition-colors cursor-pointer"
                      >
                        {m}
                      </span>
                    ))}
                    {paper.datasets && paper.datasets.slice(0, 2).map((d) => (
                      <span 
                        key={d} 
                        className="px-2.5 py-0.5 rounded-full border border-[#ECECEC] bg-white text-[#666666] hover:border-[#FF6B35] hover:text-[#FF6B35] text-xs font-serif transition-colors cursor-pointer"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Clean Functional Actions Row */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-serif text-[#888888]">
                    <button 
                      onClick={() => onViewPaper(paper)}
                      className="hover:text-[#FF6B35] transition-colors cursor-pointer"
                    >
                      View Paper
                    </button>
                    <span>·</span>
                    <button 
                      onClick={() => onSavePaper(paper)}
                      className="hover:text-[#FF6B35] transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                    <span>·</span>
                    <button 
                      onClick={() => onBookmarkToggle(paper)}
                      className={`hover:text-[#FF6B35] transition-colors cursor-pointer ${paper.isBookmarked ? 'text-[#FF6B35] font-bold' : ''}`}
                    >
                      {paper.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                    <span>·</span>
                    <button 
                      onClick={() => onCompareSelect(paper)}
                      className="hover:text-[#FF6B35] transition-colors cursor-pointer"
                    >
                      Compare
                    </button>
                    <span>·</span>
                    <button 
                      onClick={() => window.open('https://github.com', '_blank')}
                      className="hover:text-[#FF6B35] transition-colors cursor-pointer"
                    >
                      Open Repository
                    </button>
                    <span>·</span>
                    <button 
                      onClick={() => onOpenGraph(paper)}
                      className="hover:text-[#FF6B35] transition-colors cursor-pointer"
                    >
                      Open Graph
                    </button>
                  </div>

                </div>
              </div>

              {/* Right Column: Stacked Vertical Metrics exactly matching reference image */}
              <div className="flex flex-row md:flex-col items-center justify-center gap-4 border-t md:border-t-0 md:border-l border-[#ECECEC] pt-4 md:pt-0 pl-0 md:pl-6 shrink-0 w-full md:w-28 self-stretch md:self-auto">
                {/* Upvotes */}
                <div className="flex items-center gap-1.5">
                  <ArrowUp size={16} className="text-[#3B82F6] stroke-[2.5]" />
                  <span className="text-sm font-bold text-[#111111] font-serif">
                    {formatNumber(paper.upvotes ?? 0)}
                  </span>
                </div>

                {/* Github Link */}
                <button 
                  onClick={() => window.open('https://github.com', '_blank')}
                  className="text-[#111111] hover:text-[#FF6B35] transition-colors cursor-pointer p-1"
                >
                  <Github size={16} />
                </button>

                {/* HuggingFace Face Smiley Icon */}
                <button 
                  onClick={() => window.open('https://huggingface.co', '_blank')}
                  className="text-lg hover:scale-110 transition-transform cursor-pointer p-0.5"
                  title="Hugging Face Space"
                >
                  🤗
                </button>

                {/* Model Metric Description */}
                <div className="text-center">
                  <div className="text-xs font-bold text-[#111111] font-serif leading-none">
                    {paper.id === '2' ? '0.0' : '1'}
                  </div>
                  <div className="text-[8px] text-[#888888] font-semibold mt-0.5 tracking-wider font-serif">
                    {paper.id === '2' ? 'STARS / HR' : 'MODELS'}
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
