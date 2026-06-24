'use client';

import React from 'react';
import { Bell, Bookmark, Upload, Menu } from 'lucide-react';
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
    <header className="bg-white border-b border-border-warm py-4 px-8 flex items-center justify-between gap-6 shrink-0 sticky top-0 z-50">
      
      {/* Left Area: Logo & Mobile Hamburger Menu */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-xl text-text-secondary hover:bg-bg-sub hover:text-primary transition-all shrink-0 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* AI Hub Branding Logo: GraphOne */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center cursor-pointer select-none group"
        >
          <span className="font-serif font-bold text-[#FF6B35] text-2xl tracking-normal">
            GraphOne
          </span>
        </div>
      </div>

      {/* Center: Large Integrated Search Bar */}
      <div className="flex-1 max-w-2xl mx-6">
        <SearchBar variant="navbar" value={searchQuery} onChange={onSearchChange} />
      </div>

      {/* Right Area: Action Items (Submit, Alerts, Bookmarks, Sign Up / Profile) */}
      <div className="flex items-center gap-6 shrink-0">
        
        {/* Submit Paper Action */}
        <button
          onClick={handleSubmitClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:text-[#FF6B35] text-xs font-medium text-[#111111] transition-all cursor-pointer bg-transparent border-0"
        >
          <Upload size={16} className="shrink-0 text-[#111111] group-hover:text-[#FF6B35]" />
          <span className="hidden sm:inline">Submit</span>
        </button>

        {/* Alerts Action */}
        <button 
          onClick={onNotificationClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:text-[#FF6B35] text-xs font-medium text-[#111111] transition-all cursor-pointer bg-transparent border-0"
        >
          <Bell size={16} className="shrink-0 text-[#111111]" />
          <span className="hidden sm:inline">Alerts</span>
        </button>

        {/* Bookmarks Action */}
        <button
          onClick={handleSavedClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:text-[#FF6B35] text-xs font-medium text-[#111111] transition-all cursor-pointer bg-transparent border-0"
        >
          <Bookmark size={16} className="shrink-0 text-[#111111]" />
          <span className="hidden sm:inline">Bookmarks</span>
        </button>

        {/* Profile Avatar / Sign Up button exactly like reference image */}
        <button
          onClick={onProfileClick}
          className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#FF7F50] text-white text-xs font-medium rounded-md transition-all shadow-sm cursor-pointer"
        >
          Sign Up
        </button>

      </div>

    </header>
  );
}
