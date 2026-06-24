'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, TrendingUp, Clock, Star, Landmark, Bookmark, Sparkles, FolderOpen, 
  BookOpen, ChevronLeft, ChevronRight, PlusCircle, Compass, Cpu, Database, 
  Award, Users, Network, BrainCircuit, Workflow, FileText
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  currentView: string;
  onViewChange: (viewId: string) => void;
  isDrawer?: boolean;
}

export default function Sidebar({ currentView, onViewChange, isDrawer = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasManuallyToggled, setHasManuallyToggled] = useState(false);

  useEffect(() => {
    if (isDrawer) {
      setIsCollapsed(false);
      return;
    }

    const handleResize = () => {
      if (hasManuallyToggled) return;
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasManuallyToggled, isDrawer]);

  const groups = [
    {
      title: 'Discover',
      items: [
        { id: 'home', name: 'Home', icon: Home },
        { id: 'trending-papers', name: 'Trending Papers', icon: TrendingUp },
        { id: 'latest-papers', name: 'Latest Papers', icon: Clock },
        { id: 'github-stars', name: 'Most GitHub Stars', icon: Star }
      ]
    },
    {
      title: 'Tasks',
      items: [
        { id: 'area-agents', name: 'Agents', icon: Cpu },
        { id: 'area-reasoning', name: 'Reasoning', icon: BrainCircuit },
        { id: 'area-language', name: 'Language Modeling', icon: Database },
        { id: 'area-coding', name: 'Coding Agents', icon: Users },
        { id: 'area-computer', name: 'Computer Use', icon: Compass },
        { id: 'area-world', name: 'World Models', icon: Network },
        { id: 'area-robotics', name: 'Robotics', icon: Award }
      ]
    },
    {
      title: 'Methods',
      items: [
        { id: 'method-transformers', name: 'Transformer', icon: Workflow },
        { id: 'method-cot', name: 'Chain Of Thought', icon: Sparkles },
        { id: 'method-react', name: 'ReAct', icon: Sparkles },
        { id: 'method-lora', name: 'LoRA', icon: Workflow },
        { id: 'method-rlhf', name: 'RLHF', icon: Users },
        { id: 'method-dpo', name: 'DPO', icon: Users },
        { id: 'method-mcp', name: 'MCP', icon: Network }
      ]
    },
    {
      title: 'Generation',
      items: [
        { id: 'gen-text', name: 'Text Generation', icon: FileText },
        { id: 'gen-image', name: 'Image Generation', icon: Sparkles },
        { id: 'gen-video', name: 'Video Generation', icon: Compass },
        { id: 'gen-audio', name: 'Audio Generation', icon: Database }
      ]
    },
    {
      title: 'Library',
      items: [
        { id: 'organizations', name: 'Organizations', icon: Landmark },
        { id: 'lib-collections', name: 'Collections', icon: FolderOpen }
      ]
    },
    {
      title: 'Personal',
      items: [
        { id: 'lib-bookmarks', name: 'Bookmarks', icon: Bookmark },
        { id: 'lib-reading', name: 'Reading List', icon: BookOpen }
      ]
    }
  ];

  // Collapsed state icon mapping
  const collapsedIcons = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'trending-papers', name: 'Trending Papers', icon: TrendingUp },
    { id: 'latest-papers', name: 'Latest Papers', icon: Clock },
    { id: 'github-stars', name: 'Most GitHub Stars', icon: Star },
    { id: 'area-agents', name: 'Agents', icon: Cpu },
    { id: 'method-cot', name: 'Chain Of Thought', icon: Sparkles },
    { id: 'gen-text', name: 'Text Gen', icon: FileText },
    { id: 'organizations', name: 'Organizations', icon: Landmark },
    { id: 'lib-bookmarks', name: 'Bookmarks', icon: Bookmark },
    { id: 'lib-reading', name: 'Reading List', icon: BookOpen }
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 68 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-screen sticky top-0 flex flex-col bg-card border-r border-border-warm overflow-hidden shrink-0 select-none text-left"
    >
      {/* Sidebar Header Logo */}
      <div className="p-4 border-b border-border-warm flex items-center justify-between shrink-0 h-[65px]">
        {!isCollapsed && (
          <div 
            onClick={() => onViewChange('home')}
            className="flex items-center gap-2 font-extrabold text-base text-text-primary tracking-tight cursor-pointer"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 font-display">
              AH
            </span>
            <span className="font-extrabold font-display text-text-primary hover:text-primary transition-colors">
              AI Hub
            </span>
          </div>
        )}
        {isCollapsed && (
          <span 
            onClick={() => onViewChange('home')}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 font-bold text-xs mx-auto cursor-pointer"
          >
            AH
          </span>
        )}
        {!isCollapsed && !isDrawer && (
          <button
            onClick={() => {
              setIsCollapsed(true);
              setHasManuallyToggled(true);
            }}
            className="p-1.5 rounded-lg hover:bg-accent text-text-secondary hover:text-primary transition-colors cursor-pointer focus:outline-none"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        
        {/* Full Expanded Sidebar List */}
        {!isCollapsed && (
          <div className="space-y-4">
             {groups.map((group, idx) => (
              <div key={idx} className="space-y-1 pt-1.5">
                <h4 className="px-3 text-[9px] font-extrabold uppercase tracking-widest text-text-secondary/60">
                  {group.title}
                </h4>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = currentView === item.id || 
                      (item.id.startsWith('area-') && currentView === item.id.replace('area-', '')) ||
                      (item.id.startsWith('method-') && currentView === item.id.replace('method-', '')) ||
                      (item.id.startsWith('gen-') && currentView === item.id.replace('gen-', '')) ||
                      (item.id.startsWith('lib-') && currentView === item.id);
                    
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.id}
                        href={`/${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onViewChange(item.id);
                        }}
                        className={`flex items-center gap-2.5 px-3 py-2 w-full rounded-xl text-left text-[11px] font-bold transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-active text-primary border-l-2 border-primary pl-2.5 shadow-sm'
                            : 'text-text-secondary hover:bg-accent hover:text-primary font-bold'
                        }`}
                      >
                        <Icon size={13} className={isActive ? 'text-primary' : 'text-text-secondary/80'} />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Submit Paper CTA */}
            <div className="pt-2">
              <button
                onClick={() => onViewChange('submit-paper')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-primary hover:bg-primary-hover text-white text-[11px] font-extrabold rounded-xl shadow-md shadow-primary/10 transition-all cursor-pointer hover:shadow-lg"
              >
                <PlusCircle size={14} />
                <span>Submit Paper</span>
              </button>
            </div>
          </div>
        )}

        {/* Collapsed Icon-Only List */}
        {isCollapsed && (
          <div className="flex flex-col items-center gap-2">
            {collapsedIcons.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || 
                (item.id.startsWith('area-') && currentView === item.id.replace('area-', '')) ||
                (item.id.startsWith('method-') && currentView === item.id.replace('method-', ''));
              
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
                      ? 'bg-active text-primary border border-primary/20 scale-105 shadow-sm' 
                      : 'text-text-secondary hover:bg-accent hover:text-primary'
                  }`}
                >
                  <Icon size={16} />
                  
                  {/* Tooltip Overlay */}
                  <div className="absolute left-14 bg-text-primary text-white text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap shadow-lg border border-border-warm/20">
                    {item.name}
                  </div>
                </Link>
              );
            })}

            {/* Collapsed Submit Paper Icon */}
            <button
              onClick={() => onViewChange('submit-paper')}
              className="mt-3 p-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white transition-all shadow-md shadow-primary/10 flex items-center justify-center cursor-pointer group"
              aria-label="Submit Paper"
            >
              <PlusCircle size={16} />
              <div className="absolute left-14 bg-text-primary text-white text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap shadow-lg border border-border-warm/20">
                Submit Paper
              </div>
            </button>
          </div>
        )}

      </div>

      {/* Collapse Trigger at bottom */}
      {isCollapsed && !isDrawer && (
        <div className="p-3 border-t border-border-warm text-center shrink-0">
          <button
            onClick={() => {
              setIsCollapsed(false);
              setHasManuallyToggled(true);
            }}
            className="p-2 rounded-xl bg-active text-primary hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Bottom info block */}
      {!isCollapsed && (
        <div className="p-3 border-t border-border-warm bg-active/20 shrink-0">
          <div className="p-3 rounded-xl bg-white border border-border-warm flex flex-col gap-1.5 shadow-sm">
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-primary fill-primary/10" />
              <span className="font-bold text-[10px] text-text-primary uppercase tracking-wider">AI Hub OS</span>
            </div>
            <p className="text-[10px] text-text-secondary leading-snug">
              2.4M+ papers & 8.6K+ models monitored.
            </p>
          </div>
        </div>
      )}

    </motion.aside>
  );
}
