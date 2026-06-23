'use client';

import React from 'react';
import { X, GitCommit, Database, Milestone } from 'lucide-react';
import { Paper } from '@/types';

interface CompareModalProps {
  paper1: Paper;
  paper2: Paper;
  onClose: () => void;
}

export default function CompareModal({ paper1, paper2, onClose }: CompareModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/45 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-card border border-border-warm rounded-3xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-warm bg-accent/10">
          <div>
            <h3 className="font-extrabold text-base text-text-primary tracking-tight">Compare Research Papers</h3>
            <p className="text-xs text-text-secondary">Side-by-side structural comparison of AI research breakthroughs</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-accent/40 text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            
            {/* Paper 1 Panel */}
            <div className="p-5 rounded-2xl border border-border-warm bg-accent/5 flex flex-col justify-between">
              <div>
                <span className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider mb-3">
                  Baseline
                </span>
                <h4 className="font-extrabold text-base text-text-primary mb-2 line-clamp-2">
                  {paper1.title}
                </h4>
                <p className="text-xs font-semibold text-primary/90 mb-1">{paper1.organization}</p>
                <p className="text-[11px] text-text-secondary mb-4">{paper1.authors.join(', ')}</p>
                <p className="text-xs text-text-secondary leading-relaxed italic bg-card p-3.5 rounded-xl border border-border-warm/70">
                  &ldquo;{paper1.summary}&rdquo;
                </p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3.5 mt-5 pt-5 border-t border-border-warm/60">
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Citations</span>
                  <p className="text-sm font-extrabold text-text-primary mt-0.5">{paper1.citations.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Stars</span>
                  <p className="text-sm font-extrabold text-text-primary mt-0.5">{(paper1.stars || 0).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Impact Score</span>
                  <p className="text-sm font-extrabold text-primary mt-0.5">{paper1.impact || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Velocity</span>
                  <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{paper1.velocity || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Paper 2 Panel */}
            <div className="p-5 rounded-2xl border border-border-warm bg-accent/5 flex flex-col justify-between">
              <div>
                <span className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold bg-secondary/15 text-secondary border border-secondary/20 uppercase tracking-wider mb-3">
                  Comparison
                </span>
                <h4 className="font-extrabold text-base text-text-primary mb-2 line-clamp-2">
                  {paper2.title}
                </h4>
                <p className="text-xs font-semibold text-secondary mb-1">{paper2.organization}</p>
                <p className="text-[11px] text-text-secondary mb-4">{paper2.authors.join(', ')}</p>
                <p className="text-xs text-text-secondary leading-relaxed italic bg-card p-3.5 rounded-xl border border-border-warm/70">
                  &ldquo;{paper2.summary}&rdquo;
                </p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3.5 mt-5 pt-5 border-t border-border-warm/60">
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Citations</span>
                  <p className="text-sm font-extrabold text-text-primary mt-0.5">{paper2.citations.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Stars</span>
                  <p className="text-sm font-extrabold text-text-primary mt-0.5">{(paper2.stars || 0).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Impact Score</span>
                  <p className="text-sm font-extrabold text-secondary mt-0.5">{paper2.impact || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Velocity</span>
                  <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{paper2.velocity || 'N/A'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Connected Entities Table */}
          <div className="p-5 border border-border-warm rounded-2xl bg-card">
            <h5 className="font-bold text-xs text-text-primary uppercase tracking-wider mb-4">Entity Grounding</h5>
            
            <div className="space-y-4">
              {/* Models */}
              <div className="flex items-center justify-between pb-3 border-b border-border-warm/50 text-xs">
                <span className="font-bold text-text-secondary flex items-center gap-1.5 shrink-0">
                  <GitCommit size={14} className="text-primary" />
                  Related Models
                </span>
                <div className="grid grid-cols-2 gap-6 w-[70%] text-right font-semibold text-text-primary">
                  <span className="truncate">{paper1.models?.join(', ') || 'None'}</span>
                  <span className="truncate">{paper2.models?.join(', ') || 'None'}</span>
                </div>
              </div>

              {/* Datasets */}
              <div className="flex items-center justify-between pb-3 border-b border-border-warm/50 text-xs">
                <span className="font-bold text-text-secondary flex items-center gap-1.5 shrink-0">
                  <Database size={14} className="text-emerald-500" />
                  Related Datasets
                </span>
                <div className="grid grid-cols-2 gap-6 w-[70%] text-right font-semibold text-text-primary">
                  <span className="truncate">{paper1.datasets?.join(', ') || 'None'}</span>
                  <span className="truncate">{paper2.datasets?.join(', ') || 'None'}</span>
                </div>
              </div>

              {/* Benchmarks */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-secondary flex items-center gap-1.5 shrink-0">
                  <Milestone size={14} className="text-amber-500" />
                  Primary Benchmark
                </span>
                <div className="grid grid-cols-2 gap-6 w-[70%] text-right font-semibold text-text-primary">
                  <span>{paper1.benchmarks || 'N/A'}</span>
                  <span>{paper2.benchmarks || 'N/A'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-accent/5 border-t border-border-warm flex justify-end gap-3.5">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border-warm rounded-xl text-xs font-semibold text-text-secondary hover:text-primary hover:bg-accent/10 transition-all cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
