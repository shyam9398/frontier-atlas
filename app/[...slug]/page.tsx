'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrendingPapers from '@/components/TrendingPapers';
import CompareModal from '@/components/CompareModal';
import SummaryModal from '@/components/SummaryModal';
import GenericExplorer from '@/components/GenericExplorer';
import Footer from '@/components/Footer';
import { 
  trendingPapers as initialPapers, 
  featuredDatasets, 
  benchmarkLeaderboard, 
  modelRankings, 
  topLabs
} from '@/data/mockData';
import { Paper } from '@/types';
import { 
  X, FileText, Sparkles, Network, Cpu, 
  Database, Award, Landmark, Bookmark, PlusCircle, 
  BookOpenCheck, Star, TrendingUp
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
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [alertSubscriptions, setAlertSubscriptions] = useState({
    papers: true,
    models: false,
    datasets: true,
    benchmarks: false,
    organizations: false
  });

  const [searchQuery, setSearchQuery] = useState('');

  const getFilteredPapers = (rawPapers: Paper[]) => {
    if (!searchQuery.trim()) return rawPapers;
    
    const query = searchQuery.toLowerCase().trim();
    return rawPapers.filter(paper => {
      const titleMatch = paper.title.toLowerCase().includes(query);
      const authorsMatch = paper.authors.some(author => author.toLowerCase().includes(query));
      const orgMatch = paper.organization?.toLowerCase().includes(query) || false;
      const categoryMatch = paper.category.toLowerCase().includes(query);
      const modelsMatch = paper.models?.some(model => model.toLowerCase().includes(query)) || false;
      const datasetsMatch = paper.datasets?.some(dataset => dataset.toLowerCase().includes(query)) || false;
      const benchmarksMatch = paper.benchmarks?.toLowerCase().includes(query) || false;
      
      return titleMatch || authorsMatch || orgMatch || categoryMatch || modelsMatch || datasetsMatch || benchmarksMatch;
    });
  };

  useEffect(() => {
    if (currentView === 'submit-paper') {
      setSubmitModalOpen(true);
    }
  }, [currentView]);

  const handleCloseSubmitModal = () => {
    setSubmitModalOpen(false);
    if (currentView === 'submit-paper') {
      router.push('/home');
    }
  };

  // Link view callbacks to router pushes
  const handleViewChange = (viewId: string) => {
    if (viewId === 'submit-paper') {
      setSubmitModalOpen(true);
      return;
    }
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

  const getSortedPapers = (view: string) => {
    if (view === 'github-stars') {
      return [...papers].sort((a, b) => (b.stars || 0) - (a.stars || 0));
    }
    if (view === 'most-cited') {
      return [...papers].sort((a, b) => b.citations - a.citations);
    }
    return papers;
  };

  const isExplorerView = ['models', 'datasets', 'benchmarks', 'authors', 'organizations'].includes(currentView);

  return (
    <div className="bg-background text-text-primary min-h-screen flex relative overflow-hidden font-sans">
      
      {/* Toast popup */}
      <AnimatePresence mode="wait">
        {showToast && (
          <motion.div
            key={showToast}
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

      {/* Submit Paper Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={handleCloseSubmitModal} className="fixed inset-0 bg-black/45 backdrop-blur-sm" />
          <div className="relative w-full max-w-xl bg-card border border-border-warm rounded-3xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-border-warm bg-accent/5">
              <div className="flex items-center gap-2">
                <PlusCircle className="text-primary animate-pulse" size={18} />
                <h3 className="font-extrabold text-sm sm:text-base font-display text-text-primary tracking-tight">
                  Submit New Research Paper
                </h3>
              </div>
              <button
                onClick={handleCloseSubmitModal}
                className="p-2 rounded-xl hover:bg-accent/40 text-text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as HTMLFormElement;
                const title = (target.elements.namedItem('paperTitle') as HTMLInputElement).value;
                triggerToast(`Submitted "${title}" successfully! Pending peer review.`);
                target.reset();
                handleCloseSubmitModal();
              }} className="space-y-4 text-xs font-bold text-text-secondary text-left">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modalPaperTitle">Title *</label>
                  <input id="modalPaperTitle" name="paperTitle" required placeholder="e.g. Scaling Laws for Multi-Agent Consensus" className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modalPaperAbstract">Abstract *</label>
                  <textarea id="modalPaperAbstract" name="paperAbstract" required rows={4} placeholder="Summarize the core findings and contributions of this work..." className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium resize-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modalPaperAuthors">Authors *</label>
                  <input id="modalPaperAuthors" name="paperAuthors" required placeholder="e.g. Jane Doe, John Smith (comma separated)" className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="modalPaperUrl">Paper URL *</label>
                    <input id="modalPaperUrl" name="paperUrl" type="url" required placeholder="https://arxiv.org/abs/..." className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="modalGithubUrl">GitHub URL</label>
                    <input id="modalGithubUrl" name="githubUrl" type="url" placeholder="https://github.com/..." className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="modalDatasetUrl">Dataset URL</label>
                    <input id="modalDatasetUrl" name="datasetUrl" type="url" placeholder="https://huggingface.co/datasets/..." className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="modalResearchArea">Research Area *</label>
                    <select id="modalResearchArea" name="researchArea" required className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium">
                      <option value="Agents">Agents</option>
                      <option value="Reasoning">Reasoning</option>
                      <option value="Language Modeling">Language Modeling</option>
                      <option value="Coding Agents">Coding Agents</option>
                      <option value="Computer Use">Computer Use</option>
                      <option value="World Models">World Models</option>
                      <option value="Robotics">Robotics</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full mt-2 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/10 cursor-pointer">
                  Submit Paper
                </button>
              </form>
            </div>
          </div>
        </div>
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
          <motion.div 
            key="notifications-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end"
          >
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
              <div className="flex-1 overflow-y-auto space-y-5 text-xs text-text-secondary">
                <div className="space-y-3">
                  <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-text-primary">
                    Manage Subscriptions
                  </h4>
                  
                  <div className="space-y-3 bg-accent/5 p-4 rounded-2xl border border-border-warm">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="font-bold text-text-primary group-hover:text-primary transition-colors">New Papers</span>
                      <input 
                        type="checkbox" 
                        checked={alertSubscriptions.papers} 
                        onChange={(e) => {
                          setAlertSubscriptions(prev => ({ ...prev, papers: e.target.checked }));
                          triggerToast(e.target.checked ? "Subscribed to new papers alerts" : "Unsubscribed from new papers alerts");
                        }}
                        className="w-4 h-4 rounded border-border-warm text-primary focus:ring-primary cursor-pointer accent-primary" 
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="font-bold text-text-primary group-hover:text-primary transition-colors">New Models</span>
                      <input 
                        type="checkbox" 
                        checked={alertSubscriptions.models} 
                        onChange={(e) => {
                          setAlertSubscriptions(prev => ({ ...prev, models: e.target.checked }));
                          triggerToast(e.target.checked ? "Subscribed to new models alerts" : "Unsubscribed from new models alerts");
                        }}
                        className="w-4 h-4 rounded border-border-warm text-primary focus:ring-primary cursor-pointer accent-primary" 
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="font-bold text-text-primary group-hover:text-primary transition-colors">Dataset Updates</span>
                      <input 
                        type="checkbox" 
                        checked={alertSubscriptions.datasets} 
                        onChange={(e) => {
                          setAlertSubscriptions(prev => ({ ...prev, datasets: e.target.checked }));
                          triggerToast(e.target.checked ? "Subscribed to dataset updates" : "Unsubscribed from dataset updates");
                        }}
                        className="w-4 h-4 rounded border-border-warm text-primary focus:ring-primary cursor-pointer accent-primary" 
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="font-bold text-text-primary group-hover:text-primary transition-colors">Benchmark Changes</span>
                      <input 
                        type="checkbox" 
                        checked={alertSubscriptions.benchmarks} 
                        onChange={(e) => {
                          setAlertSubscriptions(prev => ({ ...prev, benchmarks: e.target.checked }));
                          triggerToast(e.target.checked ? "Subscribed to benchmark changes" : "Unsubscribed from benchmark changes");
                        }}
                        className="w-4 h-4 rounded border-border-warm text-primary focus:ring-primary cursor-pointer accent-primary" 
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="font-bold text-text-primary group-hover:text-primary transition-colors">Organization Updates</span>
                      <input 
                        type="checkbox" 
                        checked={alertSubscriptions.organizations} 
                        onChange={(e) => {
                          setAlertSubscriptions(prev => ({ ...prev, organizations: e.target.checked }));
                          triggerToast(e.target.checked ? "Subscribed to organization updates" : "Unsubscribed from organization updates");
                        }}
                        className="w-4 h-4 rounded border-border-warm text-primary focus:ring-primary cursor-pointer accent-primary" 
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t border-border-warm pt-4 space-y-3">
                  <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-text-primary">
                    Recent System Logs
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-accent/10 border border-border-warm/65 flex flex-col gap-1.5 text-xs">
                    <span className="font-bold text-primary">System Alert</span>
                    <p className="text-[11px] text-text-secondary font-medium">Model weights database synced with HuggingFace Hub.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            key="mobile-sidebar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex md:hidden"
          >
            <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-[280px] h-full bg-card z-50 shadow-xl flex"
            >
              <Sidebar currentView={currentView} onViewChange={(viewId) => { handleViewChange(viewId); setMobileMenuOpen(false); }} isDrawer={true} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-accent/10 text-text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
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
          onViewChange={handleViewChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Profile Dropdown */}
        {profileOpen && (
          <div className="absolute right-10 top-20 z-50 w-52 p-4 rounded-2xl bg-card border border-border-warm shadow-xl text-left flex flex-col gap-2.5">
            <p className="text-xs font-extrabold text-text-primary leading-none">Burla Z.</p>
            <p className="text-[10px] text-text-secondary leading-none">burla@aihub.org</p>
            <div className="border-t border-border-warm/50 my-1" />
            <button 
              onClick={() => { setProfileOpen(false); triggerToast('Profile settings loaded'); }}
              className="text-xs font-bold text-text-secondary hover:text-primary text-left transition-colors cursor-pointer"
            >
              My Profile
            </button>
            <button 
              onClick={() => { setProfileOpen(false); handleViewChange('lib-bookmarks'); }}
              className="text-xs font-bold text-text-secondary hover:text-primary text-left transition-colors cursor-pointer"
            >
              Bookmarks
            </button>
            <button 
              onClick={() => { setProfileOpen(false); handleViewChange('lib-reading'); }}
              className="text-xs font-bold text-text-secondary hover:text-primary text-left transition-colors cursor-pointer"
            >
              Reading List
            </button>
            <button 
              onClick={() => { setProfileOpen(false); triggerToast('Settings panel opened'); }}
              className="text-xs font-bold text-text-secondary hover:text-primary text-left transition-colors cursor-pointer"
            >
              Settings
            </button>
            <div className="border-t border-border-warm/30 my-0.5" />
            <button 
              onClick={() => { setProfileOpen(false); triggerToast('Logged out successfully'); }}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 text-left transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}

    <div className="flex-1 mt-3 max-w-[1400px] w-full mx-auto font-sans">
      {currentView === 'home' && !isSearching && (
        <div className="flex flex-col gap-6">
          
          {/* Section 1: Hero & 3D Interactive Layers Canvas */}
          <Hero 
            onSearchClick={() => setIsSearching(true)} 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          {/* Full-width Layout for Trending Papers Feed & Discovery Panels */}
          <div className="w-full flex flex-col gap-8 text-left">
            <TrendingPapers
              papers={getFilteredPapers(papers)}
              onViewPaper={setSelectedPaperForView}
              onBookmarkToggle={handleBookmarkToggle}
              onCompareSelect={handleCompareSelect}
              onGenerateSummary={setSelectedPaperForSummary}
              onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
              onSavePaper={handleSavePaper}
            />

            {/* Horizontal Grid for Discovery Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 w-full">
              
              {/* TOP MODELS PANEL */}
              <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 text-left space-y-4 shadow-sm hover:border-[#FF4D3A]/20 transition-colors duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
                  <div className="flex items-center gap-2">
                    <Cpu className="text-[#FF4D3A]" size={16} />
                    <h3 className="font-extrabold text-xs sm:text-sm font-display text-[#111827] uppercase tracking-wider">Top Models</h3>
                  </div>
                  <a href="#models" onClick={() => handleViewChange('models')} className="text-[11px] font-bold text-[#FF4D3A] hover:text-[#FF4D3A]/90 transition-colors">
                    View All
                  </a>
                </div>
                <div className="divide-y divide-[#EEEEEE]">
                  {modelRankings.map((model) => (
                    <div key={model.rank} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 hover:bg-[#FAFAFA] transition-colors rounded-lg px-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-extrabold text-xs text-[#6B7280] w-4 text-center shrink-0">#{model.rank}</span>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] text-white shrink-0 ${model.logoColor || 'bg-[#FF4D3A]'}`}>
                          {model.name.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-[#111827] truncate leading-tight">{model.name}</h4>
                          <p className="text-[9px] text-[#6B7280] leading-none mt-0.5">{model.creator}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-right text-[10px]">
                        <div>
                          <p className="font-extrabold text-[#111827] leading-none">{model.downloads}</p>
                          <span className="text-[8px] font-bold text-[#6B7280] leading-none block mt-0.5">DLs</span>
                        </div>
                        <div className="w-10">
                          <span className="font-extrabold text-emerald-600 block leading-none">{model.growth}</span>
                          <span className="text-[8px] font-bold text-[#6B7280] leading-none block mt-0.5">Growth</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOP DATASETS PANEL */}
              <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 text-left space-y-4 shadow-sm hover:border-[#FF4D3A]/20 transition-colors duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
                  <div className="flex items-center gap-2">
                    <Database className="text-emerald-500" size={16} />
                    <h3 className="font-extrabold text-xs sm:text-sm font-display text-[#111827] uppercase tracking-wider">Top Datasets</h3>
                  </div>
                  <a href="#datasets" onClick={() => handleViewChange('datasets')} className="text-[11px] font-bold text-[#FF4D3A] hover:text-[#FF4D3A]/90 transition-colors">
                    View All
                  </a>
                </div>
                <div className="divide-y divide-[#EEEEEE]">
                  {featuredDatasets.map((dataset, idx) => {
                    const mentions = ['12.5K', '9.8K', '15.2K', '14.1K', '6.4K', '8.8K'][idx] || '5K';
                    const dls = ['85K', '45K', '120K', '95K', '38K', '54K'][idx] || '20K';
                    return (
                      <div key={dataset.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 hover:bg-[#FAFAFA] transition-colors rounded-lg px-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {dataset.name.substring(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-[#111827] truncate leading-tight">{dataset.name}</h4>
                            <p className="text-[9px] text-[#6B7280] leading-none mt-0.5">{dataset.domain}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-right text-[10px]">
                          <div>
                            <p className="font-extrabold text-[#111827] leading-none">{mentions}</p>
                            <span className="text-[8px] font-bold text-[#6B7280] leading-none block mt-0.5">Mentions</span>
                          </div>
                          <div>
                            <p className="font-extrabold text-[#111827] leading-none">{dls}</p>
                            <span className="text-[8px] font-bold text-[#6B7280] leading-none block mt-0.5">Downloads</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TRENDING BENCHMARKS PANEL */}
              <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 text-left space-y-4 shadow-sm hover:border-[#FF4D3A]/20 transition-colors duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
                  <div className="flex items-center gap-2">
                    <Award className="text-amber-500" size={16} />
                    <h3 className="font-extrabold text-xs sm:text-sm font-display text-[#111827] uppercase tracking-wider">Trending Benchmarks</h3>
                  </div>
                  <a href="#benchmarks" onClick={() => handleViewChange('benchmarks')} className="text-[11px] font-bold text-[#FF4D3A] hover:text-[#FF4D3A]/90 transition-colors">
                    View All
                  </a>
                </div>
                <div className="divide-y divide-[#EEEEEE]">
                  {benchmarkLeaderboard.map((bench) => (
                    <div key={bench.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 hover:bg-[#FAFAFA] transition-colors rounded-lg px-1.5">
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-[#111827] truncate leading-tight">{bench.name}</h4>
                        <p className="text-[9px] text-[#6B7280] leading-none mt-0.5 font-bold uppercase">
                          Leader: <span className="text-[#FF4D3A]">{bench.leader}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-[#FF4D3A]">{bench.score}</span>
                        <span className="text-[8px] font-bold text-[#6B7280] block leading-none mt-0.5">{bench.totalModels} models</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOP ORGANIZATIONS PANEL */}
              <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 text-left space-y-4 shadow-sm hover:border-[#FF4D3A]/20 transition-colors duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
                  <div className="flex items-center gap-2">
                    <Landmark className="text-violet-500" size={16} />
                    <h3 className="font-extrabold text-xs sm:text-sm font-display text-[#111827] uppercase tracking-wider">Top Organizations</h3>
                  </div>
                  <a href="#organizations" onClick={() => handleViewChange('organizations')} className="text-[11px] font-bold text-[#FF4D3A] hover:text-[#FF4D3A]/90 transition-colors">
                    View All
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {topLabs.map((lab) => {
                    const initials = lab.name
                      .split(' ')
                      .filter((w) => w[0] === w[0].toUpperCase())
                      .map((w) => w[0])
                      .join('')
                      .substring(0, 2);

                    return (
                      <div key={lab.rank} className="p-3 rounded-xl border border-[#EEEEEE] hover:border-[#FF4D3A]/20 bg-[#FAFAFA]/40 transition-colors flex flex-col justify-between h-20 text-left font-sans">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[9px] border ${lab.logoBg || 'bg-accent/20 border-[#EEEEEE] text-[#FF4D3A]'}`}>
                            {initials}
                          </span>
                          <span className="text-[9px] font-bold text-[#6B7280]">#{lab.rank}</span>
                        </div>
                        <div className="min-w-0 mt-1">
                          <h4 className="font-bold text-[10px] text-[#111827] truncate leading-tight">{lab.name}</h4>
                          <p className="text-[8px] text-[#6B7280] truncate mt-0.5 font-semibold">{lab.papersCount.split(' ')[0]} papers</p>
                        </div>
                      </div>
                    );
                  })}
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

      {/* Secondary Explorer Pages: Latest Papers */}
      {currentView === 'latest-papers' && (
        <div className="flex flex-col gap-6">
          <TrendingPapers
            papers={getFilteredPapers(papers)}
            onViewPaper={setSelectedPaperForView}
            onBookmarkToggle={handleBookmarkToggle}
            onCompareSelect={handleCompareSelect}
            onGenerateSummary={setSelectedPaperForSummary}
            onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
            onSavePaper={handleSavePaper}
          />
        </div>
      )}

      {/* Secondary Explorer Pages: Bookmarks List */}
      {(currentView === 'lib-bookmarks' || currentView === 'bookmarks') && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-3 mb-2 border-b border-border-warm text-left">
            <Bookmark className="text-primary fill-primary/10" size={18} />
            <h2 className="font-extrabold text-sm sm:text-base font-display text-text-primary tracking-tight">Your Bookmarked Papers</h2>
          </div>
          {getFilteredPapers(papers.filter(p => p.isBookmarked)).length > 0 ? (
            <TrendingPapers
              papers={getFilteredPapers(papers.filter(p => p.isBookmarked))}
              onViewPaper={setSelectedPaperForView}
              onBookmarkToggle={handleBookmarkToggle}
              onCompareSelect={handleCompareSelect}
              onGenerateSummary={setSelectedPaperForSummary}
              onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
              onSavePaper={handleSavePaper}
            />
          ) : (
            <div className="glass-panel rounded-3xl p-12 bg-card border border-border-warm text-center space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-active text-primary border border-primary/10 flex items-center justify-center mx-auto">
                <Bookmark size={22} />
              </div>
              <h3 className="font-extrabold text-sm text-text-primary tracking-tight">No bookmarked papers yet</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed font-medium">
                Browse our trending papers on the dashboard and click the bookmark button to collect papers here.
              </p>
              <button
                onClick={() => handleViewChange('home')}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md shadow-primary/10 transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      )}

      {/* Secondary Explorer Pages: Most Citations or GitHub Stars */}
      {(currentView === 'github-stars' || currentView === 'most-cited') && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-3 mb-2 border-b border-border-warm text-left">
            {currentView === 'github-stars' ? <Star className="text-primary fill-primary/10" size={18} /> : <TrendingUp className="text-primary" size={18} />}
            <h2 className="font-extrabold text-sm sm:text-base font-display text-text-primary tracking-tight">
              {currentView === 'github-stars' ? 'Most GitHub Stars' : 'Most Cited Papers'}
            </h2>
          </div>
          <TrendingPapers
            papers={getFilteredPapers(getSortedPapers(currentView))}
            onViewPaper={setSelectedPaperForView}
            onBookmarkToggle={handleBookmarkToggle}
            onCompareSelect={handleCompareSelect}
            onGenerateSummary={setSelectedPaperForSummary}
            onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
            onSavePaper={handleSavePaper}
          />
        </div>
      )}

      {/* Interactive Form for submit-paper action */}
      {currentView === 'submit-paper' && (
        <div className="glass-panel rounded-3xl p-6 md:p-8 bg-card border border-border-warm text-left space-y-6 max-w-xl mx-auto shadow-premium">
          <div className="flex items-center gap-2 pb-3 border-b border-border-warm">
            <PlusCircle className="text-primary" size={20} />
            <h2 className="font-extrabold text-base text-text-primary tracking-tight font-display">Submit New Research Paper</h2>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const target = e.target as HTMLFormElement;
            const title = (target.elements.namedItem('paperTitle') as HTMLInputElement).value;
            triggerToast(`Submitted "${title}" successfully! Pending peer review.`);
            target.reset();
            handleViewChange('home');
          }} className="space-y-4 text-xs font-bold text-text-secondary">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="paperTitle">Paper Title *</label>
              <input id="paperTitle" name="paperTitle" required placeholder="e.g. Scaling Laws for Multi-Agent Consensus" className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="paperAuthors">Authors (Comma separated) *</label>
              <input id="paperAuthors" name="paperAuthors" required placeholder="e.g. Jane Doe, John Smith" className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="paperOrg">Organization *</label>
                <input id="paperOrg" name="paperOrg" required placeholder="e.g. Stanford University" className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="paperCategory">Primary Category *</label>
                <select id="paperCategory" name="paperCategory" required className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium">
                  <option value="LLMs">LLMs</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Agents">Agents</option>
                  <option value="Reasoning">Reasoning</option>
                  <option value="Multimodal">Multimodal</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="paperAbstract">Abstract / Executive Summary *</label>
              <textarea id="paperAbstract" name="paperAbstract" required rows={4} placeholder="Summarize the core findings and contributions of this work..." className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="paperModels">Associated Models</label>
                <input id="paperModels" name="paperModels" placeholder="e.g. Llama-3, GPT-4o (optional)" className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="paperDatasets">Associated Datasets</label>
                <input id="paperDatasets" name="paperDatasets" placeholder="e.g. MMLU, GSM8k (optional)" className="p-2.5 rounded-xl border border-border-warm bg-white text-text-primary focus:outline-none focus:border-primary font-medium" />
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/10 cursor-pointer">
              Submit Publication
            </button>
          </form>
        </div>
      )}

      {/* Fallback View: Generic Explorable reading list files / conference templates */}
      {currentView === 'lib-reading' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-3 mb-2 border-b border-border-warm text-left">
            <BookOpenCheck className="text-primary" size={18} />
            <h2 className="font-extrabold text-sm sm:text-base font-display text-text-primary tracking-tight">Your Reading List</h2>
          </div>
          <TrendingPapers
            papers={getFilteredPapers(papers)}
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
        <div className="glass-panel rounded-3xl p-6 bg-card border border-border-warm text-left space-y-4 shadow-premium">
          <h2 className="font-extrabold text-base text-text-primary tracking-tight flex items-center gap-2 font-display">
            <Network className="text-primary" size={18} />
            Global Research Network Explorer
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed max-w-xl font-medium">
            Inspect institutional funding maps, dependency layers, and release timelines in full WebGL space. Drag to rotate the node clusters.
          </p>
          
          <div className="w-full bg-active/40 border border-border-warm rounded-2xl h-[550px] overflow-hidden flex items-center justify-center relative shadow-inner">
            <GenericExplorer viewId="models" />
          </div>
        </div>
      )}

      {/* Fallback View Panel */}
      {!['home', 'tool-graph', 'latest-papers', 'submit-paper', 'lib-bookmarks', 'bookmarks', 'github-stars', 'most-cited', 'lib-reading'].includes(currentView) && !isExplorerView && (
        <div className="glass-panel rounded-3xl p-12 bg-card border border-border-warm text-center space-y-3.5 shadow-premium">
          <div className="w-12 h-12 rounded-2xl bg-active text-primary border border-primary/10 flex items-center justify-center mx-auto">
            <FileText size={22} />
          </div>
          <h3 className="font-extrabold text-base text-text-primary tracking-tight capitalize font-display">
            {currentView.replace(/-/g, ' ')} Explorer
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed font-medium">
            You are currently browsing the dedicated {currentView.replace(/-/g, ' ')} view inside the AI Research OS environment.
          </p>
          <button
            onClick={() => handleViewChange('home')}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md shadow-primary/10 transition-all cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>

    {/* Footer */}
    <Footer />

      </div>
    </div>
  );
}
