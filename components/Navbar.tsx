'use client';

import React from 'react';
import { Menu, ChevronDown } from 'lucide-react';
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
  onProfileClick,
  onViewChange,
  searchQuery = '',
  onSearchChange
}: NavbarProps) {
  
  const handleLogoClick = () => {
    if (onViewChange) onViewChange('home');
  };

  const handleSubmitClick = () => {
    if (onViewChange) onViewChange('submit-paper');
  };

  return (
    <header className="bg-white border-b border-[#ECECEC] py-3.5 px-8 flex items-center justify-between gap-6 shrink-0 sticky top-0 z-50">
      
      {/* Left Area: Logo & Mobile Hamburger Menu */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-xl text-[#666666] hover:bg-[#FFF0F3] hover:text-[#FF3B6B] transition-all shrink-0 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Frontier Atlas Branding Logo */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          {/* Stylized Red/Pink Fold Logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF3B6B] to-[#FF5A7A] flex items-center justify-center shadow-[0_2px_8px_rgba(255,59,107,0.25)] shrink-0">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L3 22h6l3-7 3 7h6L12 2zm0 5l2.5 5.8H9.5L12 7z" />
            </svg>
          </div>
          <span className="font-serif font-bold text-[#111111] text-xl tracking-normal">
            Frontier Atlas
          </span>
        </div>
      </div>

      {/* Center: Large Integrated Search Bar */}
      <div className="flex-1 max-w-2xl mx-6">
        <SearchBar variant="navbar" value={searchQuery} onChange={onSearchChange} placeholder="Search papers, authors, topics..." />
      </div>

      {/* Right Area: Submit Button & Profile Avatar Dropdown */}
      <div className="flex items-center gap-4 shrink-0">
        
        {/* Submit Paper Action */}
        <button
          onClick={handleSubmitClick}
          className="px-5 py-2 bg-gradient-to-r from-[#FF3B6B] to-[#FF5A7A] hover:from-[#FF4F7B] hover:to-[#FF5A7A] text-white text-xs font-serif font-bold rounded-lg shadow-sm transition-all cursor-pointer border-0 active:scale-[0.98]"
        >
          Submit
        </button>

        {/* Profile Avatar / Dropdown Trigger */}
        <button
          onClick={onProfileClick}
          className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-100 transition-all cursor-pointer border-0"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 border border-[#ECECEC] flex items-center justify-center overflow-hidden">
            {/* User Profile silhouette SVG */}
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <ChevronDown size={14} className="text-gray-500" />
        </button>

      </div>

    </header>
  );
}
