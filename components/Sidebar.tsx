'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Compass, Cpu, Database, Award, Users, Landmark, 
  Bookmark, Sparkles, Network, ChevronLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  currentView: string;
  onViewChange: (viewId: string) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const groups = [
    {
      title: 'Discover',
      items: [
        { id: 'latest-papers', name: 'Latest Papers' },
        { id: 'trending-papers', name: 'Trending Papers' },
        { id: 'most-cited', name: 'Most Cited Papers' },
        { id: 'github-stars', name: 'Most GitHub Stars' }
      ]
    },
    {
      title: 'Research',
      items: [
        { id: 'papers', name: 'Papers' },
        { id: 'models', name: 'Models' },
        { id: 'datasets', name: 'Datasets' },
        { id: 'benchmarks', name: 'Benchmarks' },
        { id: 'authors', name: 'Authors' },
        { id: 'organizations', name: 'Organizations' }
      ]
    },
    {
      title: 'Research Areas',
      items: [
        { id: 'area-agents', name: 'Agents' },
        { id: 'area-reasoning', name: 'Reasoning' },
        { id: 'area-language', name: 'Language Modeling' },
        { id: 'area-coding', name: 'Coding Agents' },
        { id: 'area-computer', name: 'Computer Use' },
        { id: 'area-world', name: 'World Models' },
        { id: 'area-robotics', name: 'Robotics' }
      ]
    },
    {
      title: 'Methods',
      items: [
        { id: 'method-transformers', name: 'Transformers' },
        { id: 'method-cot', name: 'Chain of Thought' },
        { id: 'method-react', name: 'ReAct' },
        { id: 'method-lora', name: 'LoRA' },
        { id: 'method-rlhf', name: 'RLHF' },
        { id: 'method-dpo', name: 'DPO' },
        { id: 'method-mcp', name: 'MCP' }
      ]
    },
    {
      title: 'Generation',
      items: [
        { id: 'gen-text', name: 'Text Generation' },
        { id: 'gen-image', name: 'Image Generation' },
        { id: 'gen-video', name: 'Video Generation' },
        { id: 'gen-audio', name: 'Audio Generation' }
      ]
    },
    {
      title: 'Library',
      items: [
        { id: 'lib-reading', name: 'Reading List' },
        { id: 'lib-saved', name: 'Saved Papers' },
        { id: 'lib-collections', name: 'Collections' },
        { id: 'lib-bookmarks', name: 'Bookmarks' }
      ]
    },
    {
      title: 'AI Tools',
      items: [
        { id: 'tool-graph', name: 'Research Graph' },
        { id: 'tool-insights', name: 'AI Insights' },
        { id: 'tool-alerts', name: 'Research Alerts' },
        { id: 'tool-briefings', name: 'Daily Briefings' }
      ]
    }
  ];

  // Primary navigation shortcuts to render as icon list when collapsed
  const collapsedIcons = [
    { id: 'home', name: 'Home Dashboard', icon: Home },
    { id: 'latest-papers', name: 'Latest Papers', icon: Compass },
    { id: 'models', name: 'Models Explorer', icon: Cpu },
    { id: 'datasets', name: 'Datasets Registry', icon: Database },
    { id: 'benchmarks', name: 'Benchmark Leaderboard', icon: Award },
    { id: 'authors', name: 'Researcher Profiles', icon: Users },
    { id: 'organizations', name: 'Research Labs', icon: Landmark },
    { id: 'lib-bookmarks', name: 'Bookmarks', icon: Bookmark },
    { id: 'tool-insights', name: 'AI Insights', icon: Sparkles },
    { id: 'tool-graph', name: 'Research Graph', icon: Network }
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 68 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="h-screen sticky top-0 flex flex-col bg-card border-r border-border-warm overflow-hidden shrink-0 select-none"
    >
      {/* Sidebar Header Logo */}
      <div className="p-4 border-b border-border-warm flex items-center justify-between shrink-0 h-[65px]">
        {!isCollapsed && (
          <div 
            onClick={() => onViewChange('home')}
            className="flex items-center gap-2 font-extrabold text-lg text-text-primary tracking-tight cursor-pointer"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/20">
              AH
            </span>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              AI Hub OS
            </span>
          </div>
        )}
        {isCollapsed && (
          <span 
            onClick={() => onViewChange('home')}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/20 font-bold text-xs mx-auto cursor-pointer"
          >
            AH
          </span>
        )}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-accent/40 text-text-secondary hover:text-primary transition-colors cursor-pointer focus:outline-none"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        
        {/* Full Expanded Sidebar List */}
        {!isCollapsed && (
          <>
            <button
              onClick={() => onViewChange('home')}
              className={`flex items-center gap-3 px-3 py-2 w-full rounded-xl transition-all duration-150 text-left font-semibold text-xs uppercase cursor-pointer ${
                currentView === 'home'
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-text-primary hover:bg-accent/40 hover:text-primary'
              }`}
            >
              <Home size={14} />
              <span>Home Dashboard</span>
            </button>

            {groups.map((group, idx) => (
              <div key={idx} className="space-y-1 pt-1.5">
                <h4 className="px-3 text-[9px] font-bold uppercase tracking-wider text-text-secondary/60">
                  {group.title}
                </h4>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                      <Link
                        key={item.id}
                        href={`/${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onViewChange(item.id);
                        }}
                        className={`flex items-center justify-between px-3 py-1.5 w-full rounded-lg text-left text-xs transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-accent/50 text-primary font-bold border-l-2 border-primary pl-2.5'
                            : 'text-text-secondary hover:bg-accent/25 hover:text-text-primary font-medium'
                        }`}
                      >
                        <span>{item.name}</span>
                        {isActive && <ChevronRight size={10} className="text-primary" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Collapsed Icon-Only List */}
        {isCollapsed && (
          <div className="flex flex-col items-center gap-2">
            {collapsedIcons.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Link
                  key={item.id}
                  href={`/${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange(item.id);
                  }}
                  className={`relative p-2.5 rounded-xl transition-all duration-150 flex items-center justify-center group cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                      : 'text-text-secondary hover:bg-accent/30 hover:text-primary'
                  }`}
                >
                  <Icon size={18} />
                  
                  {/* Tooltip Overlay */}
                  <div className="absolute left-14 bg-text-primary text-white text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap shadow-lg border border-border-warm/25">
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>

      {/* Collapse Trigger for Collapsed State at bottom */}
      {isCollapsed && (
        <div className="p-3 border-t border-border-warm text-center shrink-0">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-xl bg-accent/40 text-primary hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Bottom CTA block */}
      {!isCollapsed && (
        <div className="p-3 border-t border-border-warm bg-accent/5 shrink-0">
          <div className="p-3.5 rounded-2xl bg-card border border-border-warm flex flex-col gap-2 shadow-sm text-left">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-primary fill-primary/10" />
              <span className="font-bold text-[11px] text-text-primary">Enterprise Core</span>
            </div>
            <p className="text-[10px] text-text-secondary leading-snug">
              Connected to 2.4M+ papers and 8.6K+ models.
            </p>
          </div>
        </div>
      )}

    </motion.aside>
  );
}
