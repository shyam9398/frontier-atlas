'use client';

import React from 'react';
import Link from 'next/link';
import { Paper } from '@/types';
import PaperThumbnail from './PaperThumbnail';

// Helper to format citation numbers nicely
const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getTagStyle = (tag: string) => {
  const t = tag.toLowerCase();
  if (t.includes('coding agent')) {
    return 'bg-[#FAF0F5] border-[#F5D5E5] text-[#9D174D]';
  }
  if (t.includes('agent')) {
    return 'bg-[#F0F2FF] border-[#E0E7FF] text-[#3730A3]';
  }
  if (t.includes('language') || t.includes('nlp')) {
    return 'bg-[#ECFDF5] border-[#D1FAE5] text-[#065F46]';
  }
  if (t.includes('reasoning') || t.includes('math') || t.includes('logic')) {
    return 'bg-[#FFFBEB] border-[#FEF3C7] text-[#92400E]';
  }
  if (t.includes('robot')) {
    return 'bg-[#EFF6FF] border-[#DBEAFE] text-[#1E40AF]';
  }
  if (t.includes('world') || t.includes('predictive')) {
    return 'bg-[#FDF2F8] border-[#FCE7F3] text-[#9D174D]';
  }
  if (t.includes('computer') || t.includes('gui')) {
    return 'bg-[#F0FDFA] border-[#CCFBF1] text-[#0F766E]';
  }
  // Default benchmark or dataset tags
  return 'bg-[#F9FAFB] border-[#F3F4F6] text-[#4B5563]';
};

interface PaperCardProps {
  paper: Paper;
  isBookmarked: boolean;
  isSaved: boolean;
  isInCompareList: boolean;
  onBookmarkToggle: () => void;
  onSaveToggle: () => void;
  onCompareSelect: () => void;
  onOpenGraph: () => void;
}

export default function PaperCard({
  paper,
  isBookmarked,
  isSaved,
  isInCompareList,
  onBookmarkToggle,
  onSaveToggle,
  onCompareSelect,
  onOpenGraph
}: PaperCardProps) {

  // Helper to resolve github repository URL or fallback to search query for title
  const handleOpenRepo = () => {
    if (paper.githubRepo && paper.githubRepo.trim() !== '') {
      window.open(paper.githubRepo, '_blank');
    } else {
      window.open(`https://github.com/search?q=${encodeURIComponent(paper.title)}`, '_blank');
    }
  };

  const getSotaLine = () => {
    if (!paper.benchmarks) return null;
    // Format benchmarks nicely to show SOTA ranking
    return (
      <div className="flex items-center gap-1.5 text-xs text-[#FF3B6B] font-serif">
        <span>🏆</span>
        <span>
          <span className="font-bold">SOTA</span> on <span className="font-semibold">{paper.benchmarks}</span> · #1 ranking today
        </span>
      </div>
    );
  };

  return (
    <div 
      className="p-6 bg-white border border-[#ECECEC] rounded-xl transition-all duration-300 hover:shadow-md hover:border-[#FF3B6B]/20 flex flex-col md:flex-row gap-6 items-stretch justify-between text-left min-h-[300px]"
      data-testid="paper-card"
    >
      {/* Left Column: Real Paper Thumbnail */}
      <div className="shrink-0 flex items-center md:items-start justify-center">
        <Link href={`/papers/${paper.id}`} className="block">
          <PaperThumbnail
            title={paper.title}
            authors={paper.authors}
            hfThumbnail={paper.hfThumbnail}
            className="w-[130px] h-[175px] cursor-pointer"
          />
        </Link>
      </div>

      {/* Center Content Column */}
      <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* SOTA Line if available */}
          {getSotaLine()}

          {/* Title - Times New Roman */}
          <h2 className="font-serif font-bold text-[#111111] hover:text-[#FF3B6B] transition-colors leading-snug break-words text-xl md:text-2xl">
            <Link href={`/papers/${paper.id}`}>
              {paper.title}
            </Link>
          </h2>

          {/* Authors & Organization */}
          <p className="text-xs font-serif text-[#666666]">
            <span className="font-semibold text-[#111111]">{paper.authors.join(', ')}</span> 
            {paper.pubDate && ` · ${paper.pubDate}`}
          </p>

          {/* Abstract / Description - #444444, Times New Roman, line-height 1.7 */}
          <p className="font-serif text-[#444444] text-[14px] md:text-[15px] leading-[1.65] line-clamp-3 max-w-none">
            {paper.summary}
          </p>
        </div>

        {/* Tags Row: Tasks, Methods, Datasets */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5 items-center">
            {/* Primary category pill */}
            <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider bg-[#FFF0F3] border border-[#FF3B6B]/15 text-[#FF3B6B]">
              {paper.category}
            </span>

            {/* Tasks Tags */}
            {paper.tasks && paper.tasks.slice(0, 3).map(task => (
              <span 
                key={task}
                className={`px-2 py-0.5 rounded text-[10px] border font-sans tracking-tight transition-colors ${getTagStyle(task)}`}
              >
                {task}
              </span>
            ))}
            
            {/* Methods Tags (Secondary style: thin border) */}
            {paper.methods && paper.methods.slice(0, 3).map(method => (
              <span 
                key={method}
                className="px-2 py-0.5 rounded text-[10px] bg-[#FAFAFA] border border-[#ECECEC] text-[#555555] font-sans tracking-tight hover:bg-gray-50 transition-colors"
              >
                {method}
              </span>
            ))}
          </div>

          {/* Action Row - Times New Roman fine links separated by dots */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 pt-2 text-[11px] font-serif text-[#666666] border-t border-[#ECECEC]">
            <Link href={`/papers/${paper.id}`} className="hover:text-[#FF3B6B] font-bold transition-colors">
              View Paper
            </Link>
            <span className="text-[#ECECEC]">•</span>
            <button 
              onClick={handleOpenRepo}
              className="hover:text-[#FF3B6B] transition-colors cursor-pointer flex items-center bg-transparent border-0 p-0 font-serif text-[11px] text-[#666666]"
            >
              Repository
            </button>
            <span className="text-[#ECECEC]">•</span>
            <button 
              onClick={onSaveToggle}
              className={`hover:text-[#FF3B6B] transition-colors cursor-pointer bg-transparent border-0 p-0 font-serif text-[11px] ${isSaved ? 'text-[#FF3B6B] font-bold' : 'text-[#666666]'}`}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <span className="text-[#ECECEC]">•</span>
            <button 
              onClick={onBookmarkToggle}
              className={`hover:text-[#FF3B6B] transition-colors cursor-pointer bg-transparent border-0 p-0 font-serif text-[11px] ${isBookmarked ? 'text-[#FF3B6B] font-bold' : 'text-[#666666]'}`}
            >
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <span className="text-[#ECECEC]">•</span>
            <button 
              onClick={onCompareSelect}
              className={`hover:text-[#FF3B6B] transition-colors cursor-pointer bg-transparent border-0 p-0 font-serif text-[11px] ${isInCompareList ? 'text-[#FF3B6B] font-bold' : 'text-[#666666]'}`}
            >
              {isInCompareList ? 'Remove Compare' : 'Compare'}
            </button>
            <span className="text-[#ECECEC]">•</span>
            <button 
              onClick={onOpenGraph}
              className="hover:text-[#FF3B6B] transition-colors cursor-pointer bg-transparent border-0 p-0 font-serif text-[11px] text-[#666666]"
            >
              Open Graph
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Metrics Panel */}
      <div className="flex flex-row md:flex-col items-end justify-between md:justify-start gap-6 border-t md:border-t-0 md:border-l border-[#ECECEC] pt-4 md:pt-2 pl-0 md:pl-6 shrink-0 w-full md:w-32 text-right">
        
        {/* Upvotes */}
        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-1 font-serif text-lg font-bold text-[#FF3B6B]">
            <span>↑</span>
            <span>{formatNumber(paper.upvotes || 0)}</span>
          </div>
          <span className="text-[10px] font-sans font-bold text-[#888888] uppercase tracking-wider">
            Upvotes
          </span>
        </div>

        {/* Repo Stars */}
        <div className="flex flex-col items-end text-right">
          <button 
            onClick={handleOpenRepo}
            className="flex items-center gap-1.5 font-serif text-lg font-bold text-[#111111] hover:text-[#FF3B6B] transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            {/* Simple circular sync loop SVG */}
            <svg className="w-3.5 h-3.5 text-gray-700 hover:text-[#FF3B6B] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>{formatNumber(paper.stars || 0)}</span>
          </button>
          <span className="text-[10px] font-sans font-bold text-[#888888] uppercase tracking-wider">
            Repo
          </span>
        </div>

        {/* Citations */}
        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-1.5 font-serif text-lg font-bold text-[#111111]">
            {/* Simple book page SVG */}
            <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>{paper.citations || 0}</span>
          </div>
          <span className="text-[10px] font-sans font-bold text-[#888888] uppercase tracking-wider">
            Citations
          </span>
        </div>

      </div>
    </div>
  );
}
