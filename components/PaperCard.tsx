'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Trophy, FileText, ExternalLink, Clock, ThumbsUp
} from 'lucide-react';
import { Paper } from '@/types';
import PaperThumbnail from './PaperThumbnail';

// Custom inline Github SVG component
const GithubIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
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

  // Helper to format citation numbers nicely
  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  // Helper to resolve github repository URL or fallback to search query for title
  const handleOpenRepo = () => {
    if (paper.githubRepo && paper.githubRepo.trim() !== '') {
      window.open(paper.githubRepo, '_blank');
    } else {
      window.open(`https://github.com/search?q=${encodeURIComponent(paper.title)}`, '_blank');
    }
  };

  return (
    <div 
      className="p-6 bg-white border border-[#ECECEC] rounded-md transition-all duration-300 hover:shadow-md hover:border-[#FF6B35]/20 flex flex-col md:flex-row gap-6 items-stretch justify-between text-left min-h-[320px] md:min-h-[340px]"
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
          {/* Organization & Category Tag */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider font-sans font-bold">
            <span className="text-[#FF6B35] bg-[#FFF2EB] px-2 py-0.5 rounded border border-[#FF6B35]/15">
              {paper.category}
            </span>
            <span className="text-[#666666]">
              • {paper.organization || 'Independent Research'}
            </span>
            <span className="text-[#888888] normal-case font-normal font-serif">
              ({paper.pubDate})
            </span>
          </div>

          {/* Title - Times New Roman */}
          <h2 className="font-serif font-bold text-[#111111] hover:text-[#FF6B35] transition-colors leading-snug break-words line-clamp-2 text-20px md:text-24px">
            <Link href={`/papers/${paper.id}`}>
              {paper.title}
            </Link>
          </h2>

          {/* Authors */}
          <p className="text-xs font-serif text-[#666666] line-clamp-1">
            <span className="font-semibold text-[#111111]">Authors:</span> {paper.authors.join(', ')}
          </p>

          {/* Abstract / Description - #444444, line-height 1.7, 16px desktop */}
          <p className="font-serif text-[#444444] text-[14px] md:text-[16px] leading-[1.7] line-clamp-4 max-w-none">
            {paper.summary}
          </p>

          {/* SOTA Benchmarks Line */}
          {paper.benchmarks && (
            <div className="flex items-center gap-1.5 text-xs text-[#666666] font-serif">
              <Trophy size={13} className="text-[#FF6B35] shrink-0" />
              <span>
                <span className="font-bold text-[#FF6B35]">SOTA Leaderboard</span> on <span className="font-semibold text-[#111111]">{paper.benchmarks}</span>
              </span>
            </div>
          )}
        </div>

        {/* Tags Row: Tasks, Methods, Datasets */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5 items-center">
            {/* Tasks Tags */}
            {paper.tasks && paper.tasks.slice(0, 3).map(task => (
              <span 
                key={task}
                className="px-2 py-0.5 rounded text-[10px] bg-gray-50 border border-gray-200 text-[#444444] hover:bg-gray-100 hover:border-gray-300 font-sans tracking-tight transition-colors"
              >
                {task}
              </span>
            ))}
            
            {/* Methods Tags */}
            {paper.methods && paper.methods.slice(0, 3).map(method => (
              <span 
                key={method}
                className="px-2 py-0.5 rounded text-[10px] bg-gray-50 border border-gray-200 text-[#555555] hover:bg-gray-100 hover:border-gray-300 font-sans tracking-tight transition-colors"
              >
                {method}
              </span>
            ))}

            {/* Datasets Tags */}
            {paper.datasets && paper.datasets.slice(0, 2).map(dataset => (
              <span 
                key={dataset}
                className="px-2 py-0.5 rounded text-[10px] bg-gray-50 border border-gray-200 text-[#666666] hover:bg-gray-100 hover:border-gray-300 font-sans tracking-tight transition-colors"
              >
                {dataset}
              </span>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 pt-2 text-[11px] font-serif text-[#888888] border-t border-[#ECECEC]">
            <Link href={`/papers/${paper.id}`} className="hover:text-[#FF6B35] font-semibold transition-colors">
              View Paper Details
            </Link>
            <span>·</span>
            <button 
              onClick={handleOpenRepo}
              className="hover:text-[#FF6B35] transition-colors cursor-pointer flex items-center gap-0.5"
            >
              Repository <ExternalLink size={10} />
            </button>
            <span>·</span>
            <button 
              onClick={onSaveToggle}
              className={`hover:text-[#FF6B35] transition-colors cursor-pointer ${isSaved ? 'text-[#FF6B35] font-bold' : ''}`}
            >
              {isSaved ? 'Saved to Library' : 'Save'}
            </button>
            <span>·</span>
            <button 
              onClick={onBookmarkToggle}
              className={`hover:text-[#FF6B35] transition-colors cursor-pointer ${isBookmarked ? 'text-[#FF6B35] font-bold' : ''}`}
            >
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <span>·</span>
            <button 
              onClick={onCompareSelect}
              className={`hover:text-[#FF6B35] transition-colors cursor-pointer ${isInCompareList ? 'text-[#FF6B35] font-bold' : ''}`}
            >
              {isInCompareList ? 'Remove Compare' : 'Compare'}
            </button>
            <span>·</span>
            <button 
              onClick={onOpenGraph}
              className="hover:text-[#FF6B35] transition-colors cursor-pointer"
            >
              Open Graph
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Metrics Panel */}
      <div className="flex flex-row md:flex-col items-center justify-around md:justify-start gap-4 border-t md:border-t-0 md:border-l border-[#ECECEC] pt-4 md:pt-2 pl-0 md:pl-6 shrink-0 w-full md:w-36 self-stretch">
        
        {/* Popularity Badge */}
        <div className="flex flex-col items-center text-center">
          <span className="text-xs text-[#888888] font-sans font-bold uppercase tracking-wider scale-90">Popularity</span>
          <div className="flex items-center gap-1 mt-1 text-[#FF6B35] bg-[#FFF2EB] border border-[#FF6B35]/20 px-2 py-1 rounded">
            <ThumbsUp size={13} className="fill-[#FF6B35]/10" />
            <span className="text-sm font-bold font-serif leading-none">
              {paper.popularityScore || Math.floor((paper.upvotes || 0) * 1.5 + (paper.citations || 0) * 0.8)}
            </span>
          </div>
        </div>

        {/* GitHub Stars Badge */}
        <div className="flex flex-col items-center text-center">
          <span className="text-xs text-[#888888] font-sans font-bold uppercase tracking-wider scale-90">Stars</span>
          <button 
            onClick={handleOpenRepo}
            className="flex items-center gap-1.5 mt-1 hover:text-[#FF6B35] transition-colors bg-gray-50 border border-gray-200 px-2.5 py-1 rounded cursor-pointer"
          >
            <GithubIcon size={12} className="text-[#111111]" />
            <span className="text-xs font-bold font-serif leading-none">
              ⭐ {formatNumber(paper.stars || 0)}
            </span>
          </button>
        </div>

        {/* Citations Badge */}
        <div className="flex flex-col items-center text-center">
          <span className="text-xs text-[#888888] font-sans font-bold uppercase tracking-wider scale-90">Citations</span>
          <div className="flex items-center gap-1 mt-1 text-[#111111] bg-gray-50 border border-gray-200 px-2.5 py-1 rounded">
            <FileText size={12} className="text-[#666666]" />
            <span className="text-xs font-bold font-serif leading-none">
              📖 {formatNumber(paper.citations || 0)}
            </span>
          </div>
        </div>

        {/* Reading Time */}
        <div className="flex flex-col items-center text-center">
          <span className="text-xs text-[#888888] font-sans font-bold uppercase tracking-wider scale-90">Read Time</span>
          <div className="flex items-center gap-1 mt-1 text-[#555555] bg-gray-50 border border-gray-200 px-2.5 py-1 rounded">
            <Clock size={12} className="text-[#888888]" />
            <span className="text-xs font-bold font-serif leading-none">
              ⏱ {paper.readingTime || '10 min'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
