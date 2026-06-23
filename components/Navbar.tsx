'use client';

import React from 'react';
import { Bell, Globe, TrendingUp, LayoutDashboard, Wrench, CircleDollarSign, Menu } from 'lucide-react';
import SearchBar from './SearchBar';

interface NavbarProps {
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export default function Navbar({ onMenuClick, onNotificationClick, onProfileClick }: NavbarProps) {
  return (
    <header className="glass-panel rounded-2xl p-3 flex items-center justify-between shadow-sm border border-border-warm mb-6 gap-2 shrink-0">
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-xl text-text-secondary hover:bg-accent/40 hover:text-primary transition-all shrink-0 cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        <Menu size={20} />
      </button>

      {/* Search Bar - Center left */}
      <div className="flex-1 max-w-md">
        <SearchBar variant="navbar" />
      </div>

      {/* Nav Links - Right Side */}
      <div className="hidden lg:flex items-center gap-6 px-4">
        <a href="#explore" className="text-sm font-medium text-text-secondary hover:text-primary flex items-center gap-1.5 transition-colors">
          <Globe size={15} />
          Explore
        </a>
        <a href="#trends" className="text-sm font-medium text-text-secondary hover:text-primary flex items-center gap-1.5 transition-colors">
          <TrendingUp size={15} />
          Trends
        </a>
        <a href="#dashboards" className="text-sm font-medium text-text-secondary hover:text-primary flex items-center gap-1.5 transition-colors">
          <LayoutDashboard size={15} />
          Dashboards
        </a>
        <a href="#tools" className="text-sm font-medium text-text-secondary hover:text-primary flex items-center gap-1.5 transition-colors">
          <Wrench size={15} />
          Tools
        </a>
        <a href="#pricing" className="text-sm font-medium text-text-secondary hover:text-primary flex items-center gap-1.5 transition-colors">
          <CircleDollarSign size={15} />
          Pricing
        </a>
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-3.5 pl-4 border-l border-border-warm/60">
        <button 
          onClick={onNotificationClick}
          className="relative p-2 rounded-xl text-text-secondary hover:bg-accent/40 hover:text-primary transition-all duration-200 cursor-pointer"
          aria-label="Open notifications"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-white"></span>
        </button>
        
        <div 
          onClick={onProfileClick}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="relative w-9 h-9 rounded-xl border border-border-warm bg-accent/30 overflow-hidden shadow-sm group-hover:border-primary transition-all">
            {/* Standard fallback user avatar */}
            <div className="w-full h-full flex items-center justify-center font-bold text-sm text-primary bg-accent/45">
              BZ
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors leading-none">Burla Z.</p>
            <p className="text-[10px] text-text-secondary mt-0.5 font-medium leading-none">Enterprise Partner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
