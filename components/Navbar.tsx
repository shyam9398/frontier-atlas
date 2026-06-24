'use client';

import React from 'react';
import { Bell, Bookmark, PlusCircle, Menu } from 'lucide-react';
import SearchBar from './SearchBar';

interface NavbarProps {
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onViewChange?: (viewId: string) => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function Navbar({ 
  onMenuClick, 
  onNotificationClick, 
  onProfileClick,
  onViewChange,
  searchQuery = '',
  onSearchChange
}: NavbarProps) {
  
  const handleLogoClick = () => {
    if (onViewChange) onViewChange('home');
  };

  const handleSavedClick = () => {
    if (onViewChange) onViewChange('lib-bookmarks');
  };

  const handleSubmitClick = () => {
    if (onViewChange) onViewChange('submit-paper');
  };

  return (
    <header className="bg-white border-b border-border-warm py-3.5 px-6 flex items-center justify-between gap-4 shrink-0 sticky top-0 z-50">
      
      {/* Left Area: Logo & Mobile Hamburger Menu */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-xl text-text-secondary hover:bg-bg-sub hover:text-primary transition-all shrink-0 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* AI Hub Branding Logo */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm font-display tracking-tight group-hover:scale-105 transition-transform duration-200 shadow-sm">
            AH
          </span>
          <span className="font-extrabold font-display text-text-primary text-base tracking-tight group-hover:text-primary transition-colors hidden sm:block">
            AI Hub
          </span>
        </div>
      </div>

      {/* Center: Large Integrated Search Bar */}
      <div className="flex-1 max-w-xl mx-2 md:mx-6">
        <SearchBar variant="navbar" value={searchQuery} onChange={onSearchChange} />
      </div>

      {/* Right Area: Action Items (Submit, Alerts, Saved, Profile Avatar) */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Submit Paper Action */}
        <button
          onClick={handleSubmitClick}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-warm hover:border-primary/20 hover:bg-bg-sub text-xs font-bold text-text-secondary hover:text-primary transition-all cursor-pointer"
        >
          <PlusCircle size={14} className="shrink-0" />
          <span>Submit</span>
        </button>

        {/* Saved Papers Action */}
        <button
          onClick={handleSavedClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-warm hover:border-primary/20 hover:bg-bg-sub text-xs font-bold text-text-secondary hover:text-primary transition-all cursor-pointer"
          title="Saved Papers"
        >
          <Bookmark size={14} className="shrink-0" />
          <span className="hidden md:inline">Saved</span>
        </button>

        {/* Alerts Button with Notification Count Badge */}
        <button 
          onClick={onNotificationClick}
          className="relative p-2.5 rounded-xl border border-border-warm hover:bg-bg-sub text-text-secondary hover:text-primary transition-all cursor-pointer"
          aria-label="Open notifications"
        >
          <Bell size={16} />
          {/* Notification Count Badge */}
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[8px] font-extrabold text-white ring-2 ring-white">
            3
          </span>
        </button>

        {/* Profile Avatar Trigger (Real Avatar Image) */}
        <div 
          onClick={onProfileClick}
          className="flex items-center gap-2 cursor-pointer select-none group shrink-0 border-l border-border-warm pl-3"
        >
          <div className="relative w-8 h-8 rounded-full border border-border-warm overflow-hidden shadow-sm group-hover:border-primary transition-all">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="User profile avatar image" 
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>
        </div>

      </div>

    </header>
  );
}
