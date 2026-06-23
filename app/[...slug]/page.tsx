'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrendingPapers from '@/components/TrendingPapers';
import CompareModal from '@/components/CompareModal';
import SummaryModal from '@/components/SummaryModal';
import GenericExplorer from '@/components/GenericExplorer';
import { 
  trendingPapers as initialPapers, 
  featuredDatasets, 
  benchmarkLeaderboard, 
  modelRankings, 
  latestActivityFeed,
  researchSignals,
  topLabs
} from '@/data/mockData';
import { Paper } from '@/types';
import { 
  X, FileText, Sparkles, Network, ArrowUpRight, Cpu, 
  Database, Award, Users, Landmark, Activity, CircleDot, 
  ArrowUp
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default function CatchAllPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  // Map slug parameter array to internal viewId
  const getViewIdFromSlug = (slugArray: string[]): string => {
    if (!slugArray || slugArray.length === 0) return 'home';
    const path = slugArray.join('/');
    if (path === 'home') return 'home';
    if (path === 'papers/latest') return 'latest-papers';
    if (path === 'papers/trending') return 'trending-papers';
    if (path === 'papers/most-cited') return 'most-cited';
    if (path === 'papers/github-stars') return 'github-stars';
    if (path === 'lib-bookmarks' || path === 'bookmarks') return 'lib-bookmarks';
    return slugArray[slugArray.length - 1]; 
  };

  const currentView = getViewIdFromSlug(slug);

  // Home Page states
  const [papers, setPapers] = useState<Paper[]>(initialPapers);
  const [selectedPaperForView, setSelectedPaperForView] = useState<Paper | null>(null);
  const [selectedPaperForSummary, setSelectedPaperForSummary] = useState<Paper | null>(null);
  const [compareList, setCompareList] = useState<Paper[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  
  // Layout triggers
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Link view callbacks to router pushes
  const handleViewChange = (viewId: string) => {
    let url = '/home';
    if (viewId === 'latest-papers') url = '/papers/latest';
    else if (viewId === 'trending-papers') url = '/papers/trending';
    else if (viewId === 'most-cited') url = '/papers/most-cited';
    else if (viewId === 'github-stars') url = '/papers/github-stars';
    else if (viewId.startsWith('area-')) url = `/${viewId.replace('area-', '')}`;
    else if (viewId.startsWith('method-')) url = `/${viewId.replace('method-', '')}`;
    else if (viewId.startsWith('gen-')) url = `/${viewId.replace('gen-', '')}`;
    else if (viewId.startsWith('lib-')) url = `/${viewId.replace('lib-', '')}`;
    else if (viewId.startsWith('tool-')) url = `/${viewId.replace('tool-', '')}`;
    else if (viewId !== 'home') url = `/${viewId}`;
    
    router.push(url);
  };

  // Card actions
  const handleBookmarkToggle = (paper: Paper) => {
    setPapers(prev => prev.map(p => p.id === paper.id ? { ...p, isBookmarked: !p.isBookmarked } : p));
    triggerToast(paper.isBookmarked ? 'Removed bookmark' : 'Bookmarked paper successfully');
  };

  const handleCompareSelect = (paper: Paper) => {
    if (compareList.find(p => p.id === paper.id)) {
      setCompareList(prev => prev.filter(p => p.id !== paper.id));
      triggerToast('Removed from comparison list');
      return;
    }

    if (compareList.length >= 2) {
      triggerToast('Comparison limit reached (max 2 papers)');
      return;
    }

    const updated = [...compareList, paper];
    setCompareList(updated);

    if (updated.length === 2) {
      setShowCompareModal(true);
    } else {
      triggerToast('Select one more paper to compare');
    }
  };

  const handleSavePaper = (paper: Paper) => {
    triggerToast(`Added "${paper.title}" to library reading list`);
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const isExplorerView = ['models', 'datasets', 'benchmarks', 'authors', 'organizations'].includes(currentView);

  return (
    <div className="bg-background text-text-primary min-h-screen flex relative overflow-hidden font-sans">
      
      {/* Toast popup */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-text-primary text-white border border-border-warm/25 shadow-xl text-xs font-bold flex items-center gap-2 pointer-events-none"
          >
            <Sparkles size={14} className="text-primary fill-primary/10 animate-bounce" />
            <span>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      {showCompareModal && compareList.length === 2 && (
        <CompareModal
          paper1={compareList[0]}
          paper2={compareList[1]}
          onClose={() => {
            setShowCompareModal(false);
            setCompareList([]);
          }}
        />
      )}

      {/* AI Summary Modal */}
      {selectedPaperForSummary && (
        <SummaryModal
          paper={selectedPaperForSummary}
          onClose={() => setSelectedPaperForSummary(null)}
        />
      )}

      {/* Detailed Paper Viewer Modal */}
      {selectedPaperForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedPaperForView(null)} className="fixed inset-0 bg-black/45 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-card border border-border-warm rounded-3xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-5 border-b border-border-warm bg-accent/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                {selectedPaperForView.category}
              </span>
              <button
                onClick={() => setSelectedPaperForView(null)}
                className="p-2 rounded-xl hover:bg-accent/40 text-text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 text-left">
              <h3 className="font-extrabold text-base sm:text-lg text-text-primary leading-snug">
                {selectedPaperForView.title}
              </h3>
              <p className="text-xs font-semibold text-primary/90">{selectedPaperForView.organization}</p>
              <p className="text-[11px] text-text-secondary">{selectedPaperForView.authors.join(', ')} • {selectedPaperForView.pubDate}</p>
              
              <div className="pt-4 border-t border-border-warm/65 space-y-3.5">
                <h4 className="font-bold text-xs uppercase text-text-secondary tracking-wider">Executive Overview</h4>
                <p className="text-xs text-text-primary leading-relaxed bg-accent/5 p-4 rounded-2xl border border-border-warm/50">
                  {selectedPaperForView.summary}
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-accent/5 border-t border-border-warm flex justify-end gap-2">
              <button
                onClick={() => handleBookmarkToggle(selectedPaperForView)}
                className="px-4 py-2 border border-border-warm rounded-xl text-xs font-semibold text-text-secondary hover:text-primary hover:bg-accent/15 transition-all cursor-pointer"
              >
                {selectedPaperForView.isBookmarked ? 'Remove Bookmark' : 'Bookmark Paper'}
              </button>
              <button
                onClick={() => {
                  const paper = selectedPaperForView;
                  setSelectedPaperForView(null);
                  setSelectedPaperForSummary(paper);
                }}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Generate AI Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      <AnimatePresence>
        {notificationsOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div onClick={() => setNotificationsOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-[320px] h-full bg-card border-l border-border-warm p-5 flex flex-col z-50 shadow-xl text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border-warm mb-4">
                <h3 className="font-extrabold text-sm text-text-primary tracking-tight">Research Alerts</h3>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-accent/40 text-text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="p-3.5 rounded-2xl bg-accent/10 border border-border-warm/65 flex flex-col gap-1.5 text-xs">
                  <span className="font-bold text-primary">System Alert</span>
                  <p className="text-[11px] text-text-secondary font-medium">Model weights database synced with HuggingFace Hub.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-[280px] h-full bg-card z-50 shadow-xl flex"
            >
              <Sidebar currentView={currentView} onViewChange={(viewId) => { handleViewChange(viewId); setMobileMenuOpen(false); }} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-accent/10 text-text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Left Column Sidebar */}
      <div className="hidden md:block shrink-0 h-screen sticky top-0 z-40">
        <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      </div>

      {/* Core Scroll View Pane */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto px-4 sm:px-6 py-4 lg:py-6">
        
        {/* Navbar */}
        <Navbar 
          onMenuClick={() => setMobileMenuOpen(true)} 
          onNotificationClick={() => setNotificationsOpen(true)}
          onProfileClick={() => setProfileOpen(!profileOpen)}
        />

        {/* Profile Dropdown */}
        {profileOpen && (
          <div className="absolute right-10 top-20 z-50 w-52 p-4 rounded-2xl bg-card border border-border-warm shadow-xl text-left flex flex-col gap-2.5">
            <p className="text-xs font-extrabold text-text-primary leading-none">Burla Z.</p>
            <p className="text-[10px] text-text-secondary leading-none">burla@aihub.org</p>
            <div className="border-t border-border-warm/50 my-1" />
            <button 
              onClick={() => { setProfileOpen(false); triggerToast('Profile settings loaded'); }}
              className="text-xs font-semibold text-text-secondary hover:text-primary text-left transition-colors cursor-pointer"
            >
              Manage Account
            </button>
            <button 
              onClick={() => { setProfileOpen(false); triggerToast('Logged out'); }}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 text-left transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}

        {/* Dynamic page contents */}
        <div className="flex-1 mt-3 max-w-[1400px] w-full mx-auto">
          {currentView === 'home' && !isSearching && (
            // Curved, high-density homepage layout
            <div className="flex flex-col gap-6">
              
              {/* Section 1: Hero & Research Graph (R3F Glass Canvas inside) */}
              <Hero onSearchClick={() => setIsSearching(true)} />
              
              {/* Section 2: Platform Statistics Cards (Compact Cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { name: 'Papers', count: '2.4M+', icon: FileText, bg: 'bg-orange-50 text-orange-500' },
                  { name: 'Models', count: '8.6K+', icon: Cpu, bg: 'bg-blue-50 text-blue-500' },
                  { name: 'Datasets', count: '15K+', icon: Database, bg: 'bg-emerald-50 text-emerald-500' },
                  { name: 'Benchmarks', count: '2.3K+', icon: Award, bg: 'bg-amber-50 text-amber-500' },
                  { name: 'Authors', count: '1.1M+', icon: Users, bg: 'bg-rose-50 text-rose-500' },
                  { name: 'Organizations', count: '12K+', icon: Landmark, bg: 'bg-violet-50 text-violet-500' },
                ].map((stat, idx) => (
                  <div key={idx} className="p-3 bg-card border border-border-warm rounded-2xl flex items-center gap-3 hover:-translate-y-0.5 transition-all duration-200 hover:shadow-sm cursor-pointer">
                    <div className={`p-2 rounded-xl shrink-0 ${stat.bg}`}>
                      <stat.icon size={16} />
                    </div>
                    <div className="text-left leading-none">
                      <span className="text-[10px] font-bold text-text-secondary uppercase">{stat.name}</span>
                      <p className="text-sm font-extrabold text-text-primary mt-1">{stat.count}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Home Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column (Wide) - Section 3: Trending Research Papers */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <TrendingPapers
                    papers={papers}
                    onViewPaper={setSelectedPaperForView}
                    onBookmarkToggle={handleBookmarkToggle}
                    onCompareSelect={handleCompareSelect}
                    onGenerateSummary={setSelectedPaperForSummary}
                    onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
                    onSavePaper={handleSavePaper}
                  />

                  {/* Section 5: Featured Datasets */}
                  <div className="glass-panel rounded-3xl p-5 bg-card border border-border-warm text-left">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-warm">
                      <div className="flex items-center gap-2">
                        <Database className="text-emerald-500" size={16} />
                        <h3 className="font-extrabold text-sm text-text-primary tracking-tight">Featured Datasets</h3>
                      </div>
                      <a href="#datasets" onClick={() => handleViewChange('datasets')} className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                        View All <span className="text-sm">→</span>
                      </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {featuredDatasets.slice(0, 4).map((dataset) => (
                        <div key={dataset.id} className="p-4 rounded-2xl bg-accent/5 border border-border-warm/65 hover:bg-accent/10 transition-colors flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                                {dataset.domain}
                              </span>
                              <span className="text-[10px] font-bold text-text-secondary">{dataset.size}</span>
                            </div>
                            <h4 className="font-extrabold text-xs text-text-primary leading-tight hover:text-primary cursor-pointer truncate">{dataset.name}</h4>
                            <p className="text-[11px] text-text-secondary mt-1.5 leading-snug line-clamp-2">{dataset.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 6: Benchmark Leaderboard */}
                  <div className="glass-panel rounded-3xl p-5 bg-card border border-border-warm text-left">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-warm">
                      <div className="flex items-center gap-2">
                        <Award className="text-amber-500" size={16} />
                        <h3 className="font-extrabold text-sm text-text-primary tracking-tight">Benchmark Leaderboard</h3>
                      </div>
                      <a href="#benchmarks" onClick={() => handleViewChange('benchmarks')} className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                        Explore Rankings <span className="text-sm">→</span>
                      </a>
                    </div>
                    <div className="flex flex-col gap-2">
                      {benchmarkLeaderboard.map((bench) => (
                        <div key={bench.id} className="flex items-center justify-between gap-4 p-2.5 hover:bg-accent/10 rounded-xl transition-all duration-150">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-xs text-text-primary hover:text-primary cursor-pointer truncate leading-tight">{bench.name}</h4>
                              <p className="text-[9px] text-text-secondary font-bold uppercase mt-0.5">{bench.metric} • {bench.totalModels} models</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 text-right">
                            <div>
                              <p className="text-xs font-extrabold text-text-primary leading-none">{bench.score}</p>
                              <span className="text-[9px] font-bold text-text-secondary mt-0.5 block leading-none">Leader: {bench.leader}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column (Narrow) */}
                <div className="lg:col-span-5 flex flex-col gap-6">

                  {/* Section 4: Top Models (List) */}
                  <div className="glass-panel rounded-3xl p-5 bg-card border border-border-warm text-left">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-warm">
                      <div className="flex items-center gap-2">
                        <Cpu className="text-blue-500" size={16} />
                        <h3 className="font-extrabold text-sm text-text-primary tracking-tight">Top Models</h3>
                      </div>
                      <a href="#models" onClick={() => handleViewChange('models')} className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                        View All <span className="text-sm">→</span>
                      </a>
                    </div>
                    <div className="flex flex-col gap-2">
                      {modelRankings.map((model) => (
                        <div key={model.rank} className="flex items-center justify-between gap-3 p-2 hover:bg-accent/10 rounded-xl transition-colors">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-extrabold text-xs text-text-secondary w-4 text-center shrink-0">{model.rank}</span>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 ${model.logoColor}`}>
                              {model.name.substring(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-text-primary hover:text-primary cursor-pointer truncate leading-tight">{model.name}</h4>
                              <p className="text-[9px] text-text-secondary leading-none mt-0.5">{model.creator}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0 text-right">
                            <div>
                              <p className="text-[11px] font-extrabold text-text-primary leading-none">{model.downloads}</p>
                              <span className="text-[8px] font-bold text-text-secondary mt-0.5 block leading-none">Downloads</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-0.5 text-primary leading-none">
                                <ArrowUp size={8} className="stroke-[3px]" />
                                <span className="text-[11px] font-extrabold">{model.growth}</span>
                              </div>
                              <span className="text-[8px] font-bold text-text-secondary mt-0.5 block leading-none">Growth</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 7: Research Signals (Compact metrics) */}
                  <div className="glass-panel rounded-3xl p-5 bg-card border border-border-warm text-left">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-warm">
                      <div className="flex items-center gap-2">
                        <Activity className="text-primary" size={16} />
                        <h3 className="font-extrabold text-sm text-text-primary tracking-tight">Research Signals</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {researchSignals.map((sig) => (
                        <div key={sig.id} className="p-3 rounded-2xl bg-accent/15 border border-border-warm/65 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-text-secondary">{sig.title}</span>
                          <div className="flex items-baseline gap-1.5 mt-2">
                            <span className="text-xl font-extrabold text-text-primary">{sig.value}</span>
                            <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-100 flex items-center">
                              <ArrowUpRight size={8} />
                              {sig.changePct}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 8: Top Organizations */}
                  <div className="glass-panel rounded-3xl p-5 bg-card border border-border-warm text-left">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-warm">
                      <div className="flex items-center gap-2">
                        <Landmark className="text-violet-500" size={16} />
                        <h3 className="font-extrabold text-sm text-text-primary tracking-tight">Top Organizations</h3>
                      </div>
                      <a href="#organizations" onClick={() => handleViewChange('organizations')} className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                        View All <span className="text-sm">→</span>
                      </a>
                    </div>
                    <div className="flex flex-col gap-2">
                      {topLabs.slice(0, 4).map((lab) => (
                        <div key={lab.rank} className="flex items-center justify-between gap-3 p-2 hover:bg-accent/10 rounded-xl transition-colors">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${lab.logoBg}`}>
                              {lab.name.substring(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-text-primary hover:text-primary cursor-pointer truncate leading-tight">{lab.name}</h4>
                              <p className="text-[9px] text-text-secondary truncate mt-0.5">{lab.papersCount}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-extrabold text-text-primary shrink-0">{lab.citationsCount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 9: Latest Research Activity Feed */}
                  <div className="glass-panel rounded-3xl p-5 bg-card border border-border-warm text-left">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-warm">
                      <div className="flex items-center gap-2">
                        <CircleDot className="text-primary animate-pulse" size={16} />
                        <h3 className="font-extrabold text-sm text-text-primary tracking-tight">Latest Activity Feed</h3>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3.5">
                      {latestActivityFeed.map((activity) => (
                        <div key={activity.id} className="flex gap-2.5 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-text-primary font-bold leading-tight hover:text-primary cursor-pointer truncate">{activity.title}</p>
                            <p className="text-[10px] text-text-secondary mt-0.5 leading-snug">{activity.description}</p>
                            <span className="text-[8px] font-bold text-text-secondary/60 mt-1 block">{activity.timeAgo} • {activity.user}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Explorer Database Pages */}
          {isExplorerView && (
            <GenericExplorer viewId={currentView} />
          )}

          {/* Secondary Explorer Pages */}
          {currentView === 'latest-papers' && (
            <div className="flex flex-col gap-6">
              <TrendingPapers
                papers={papers}
                onViewPaper={setSelectedPaperForView}
                onBookmarkToggle={handleBookmarkToggle}
                onCompareSelect={handleCompareSelect}
                onGenerateSummary={setSelectedPaperForSummary}
                onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
                onSavePaper={handleSavePaper}
              />
            </div>
          )}

          {/* Dedicated Tools: Research Graph */}
          {currentView === 'tool-graph' && (
            <div className="glass-panel rounded-3xl p-6 bg-card border border-border-warm text-left space-y-4">
              <h2 className="font-extrabold text-base text-text-primary tracking-tight flex items-center gap-2">
                <Network className="text-primary" size={18} />
                Global Research Network Explorer
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
                Inspect institutional funding maps, dependency layers, and release timelines in full WebGL space. Drag to rotate the node clusters.
              </p>
              
              <div className="w-full bg-accent/5 border border-border-warm rounded-2xl h-[550px] overflow-hidden flex items-center justify-center relative">
                <GenericExplorer viewId="models" />
              </div>
            </div>
          )}

          {/* Fallback View Panel */}
          {!['home', 'tool-graph', 'latest-papers'].includes(currentView) && !isExplorerView && (
            <div className="glass-panel rounded-3xl p-12 bg-card border border-border-warm text-center space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary border border-primary/15 flex items-center justify-center mx-auto">
                <FileText size={22} />
              </div>
              <h3 className="font-extrabold text-base text-text-primary tracking-tight capitalize">
                {currentView.replace(/-/g, ' ')} Explorer
              </h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                You are currently browsing the dedicated {currentView.replace(/-/g, ' ')} view inside the AI Research OS environment.
              </p>
              <button
                onClick={() => handleViewChange('home')}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="w-full max-w-[1400px] mx-auto mt-10 pt-6 pb-4 border-t border-border-warm flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
          <span>© 2026 AI Hub Operating System.</span>
          <span className="flex items-center gap-1">
            <Sparkles size={11} className="text-primary" />
            Grounding AI Research and Benchmarks
          </span>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-primary">Privacy</a>
            <a href="#terms" className="hover:text-primary">Terms</a>
          </div>
        </div>

      </div>
    </div>
  );
}
