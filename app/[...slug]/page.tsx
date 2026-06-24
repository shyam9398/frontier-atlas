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
import { trendingPapers as initialPapers } from '@/data/mockData';
import { Paper } from '@/types';
import { 
  X, Sparkles, Network, Bookmark, PlusCircle, BookOpenCheck
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
    <div className="bg-white text-[#111111] h-screen w-screen flex flex-col overflow-hidden font-sans">
      
      {/* Toast popup */}
      <AnimatePresence mode="wait">
        {showToast && (
          <motion.div
            key={showToast}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-[#111111] text-white border border-[#ECECEC]/10 shadow-lg text-xs font-serif flex items-center gap-2 pointer-events-none rounded"
          >
            <Sparkles size={14} className="text-[#FF6B35]" />
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
          <div onClick={handleCloseSubmitModal} className="fixed inset-0 bg-black/30 backdrop-blur-xs" />
          <div className="relative w-full max-w-xl bg-white border border-[#ECECEC] rounded-md shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh] text-left">
            <div className="flex items-center justify-between p-5 border-b border-[#ECECEC]">
              <h3 className="font-serif font-bold text-base text-[#111111]">
                Submit New Research Paper
              </h3>
              <button
                onClick={handleCloseSubmitModal}
                className="p-1 rounded hover:bg-gray-50 text-[#666666] hover:text-[#FF6B35] transition-colors cursor-pointer"
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
              }} className="space-y-4 text-xs font-serif text-[#666666]">
                <div className="flex flex-col gap-1">
                  <label htmlFor="modalPaperTitle" className="font-bold text-[#111111]">Title *</label>
                  <input id="modalPaperTitle" name="paperTitle" required placeholder="e.g. Scaling Laws for Multi-Agent Consensus" className="p-2 rounded border border-[#ECECEC] bg-white text-[#111111] focus:outline-none focus:border-[#FF6B35]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="modalPaperAbstract" className="font-bold text-[#111111]">Abstract *</label>
                  <textarea id="modalPaperAbstract" name="paperAbstract" required rows={4} placeholder="Summarize the core findings and contributions of this work..." className="p-2 rounded border border-[#ECECEC] bg-white text-[#111111] focus:outline-none focus:border-[#FF6B35] resize-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="modalPaperAuthors" className="font-bold text-[#111111]">Authors *</label>
                  <input id="modalPaperAuthors" name="paperAuthors" required placeholder="e.g. Jane Doe, John Smith (comma separated)" className="p-2 rounded border border-[#ECECEC] bg-white text-[#111111] focus:outline-none focus:border-[#FF6B35]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="modalPaperUrl" className="font-bold text-[#111111]">Paper URL *</label>
                    <input id="modalPaperUrl" name="paperUrl" type="url" required placeholder="https://arxiv.org/abs/..." className="p-2 rounded border border-[#ECECEC] bg-white text-[#111111] focus:outline-none focus:border-[#FF6B35]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="modalGithubUrl" className="font-bold text-[#111111]">GitHub URL</label>
                    <input id="modalGithubUrl" name="githubUrl" type="url" placeholder="https://github.com/..." className="p-2 rounded border border-[#ECECEC] bg-white text-[#111111] focus:outline-none focus:border-[#FF6B35]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="modalDatasetUrl" className="font-bold text-[#111111]">Dataset URL</label>
                    <input id="modalDatasetUrl" name="datasetUrl" type="url" placeholder="https://huggingface.co/datasets/..." className="p-2 rounded border border-[#ECECEC] bg-white text-[#111111] focus:outline-none focus:border-[#FF6B35]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="modalResearchArea" className="font-bold text-[#111111]">Research Area *</label>
                    <select id="modalResearchArea" name="researchArea" required className="p-2 rounded border border-[#ECECEC] bg-white text-[#111111] focus:outline-none focus:border-[#FF6B35]">
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
                <button type="submit" className="w-full mt-2 py-2.5 bg-[#FF6B35] hover:bg-[#FF7F50] text-white text-xs font-semibold rounded transition-all cursor-pointer">
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
          <div onClick={() => setSelectedPaperForView(null)} className="fixed inset-0 bg-black/35 backdrop-blur-xs" />
          <div className="relative w-full max-w-2xl bg-white border border-[#ECECEC] rounded-md shadow-xl overflow-hidden z-10 flex flex-col max-h-[85vh] text-left">
            <div className="flex items-center justify-between p-5 border-b border-[#ECECEC]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35] bg-[#FFF2EB] px-2 py-0.5 rounded border border-[#FF6B35]/15">
                {selectedPaperForView.category}
              </span>
              <button
                onClick={() => setSelectedPaperForView(null)}
                className="p-1 rounded hover:bg-gray-50 text-[#666666] hover:text-[#FF6B35] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#111111] leading-snug">
                {selectedPaperForView.title}
              </h3>
              <p className="text-xs font-serif font-bold text-[#FF6B35]">{selectedPaperForView.organization}</p>
              <p className="text-xs font-serif text-[#666666]">{selectedPaperForView.authors.join(', ')} • {selectedPaperForView.pubDate}</p>
              
              <div className="pt-4 border-t border-[#ECECEC] space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#111111] tracking-wider">Executive Overview</h4>
                <p className="text-xs text-[#666666] font-serif leading-relaxed bg-gray-50 p-4 border border-[#ECECEC] rounded">
                  {selectedPaperForView.summary}
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-[#ECECEC] flex justify-end gap-2">
              <button
                onClick={() => handleBookmarkToggle(selectedPaperForView)}
                className="px-4 py-2 border border-[#ECECEC] rounded text-xs font-serif text-[#666666] hover:text-[#FF6B35] hover:bg-white transition-all cursor-pointer"
              >
                {selectedPaperForView.isBookmarked ? 'Remove Bookmark' : 'Bookmark Paper'}
              </button>
              <button
                onClick={() => {
                  const paper = selectedPaperForView;
                  setSelectedPaperForView(null);
                  setSelectedPaperForSummary(paper);
                }}
                className="px-4 py-2 bg-[#FF6B35] hover:bg-[#FF7F50] text-white text-xs font-serif rounded transition-all cursor-pointer"
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
            <div onClick={() => setNotificationsOpen(false)} className="fixed inset-0 bg-black/15" />
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-[320px] h-full bg-white border-l border-[#ECECEC] p-6 flex flex-col z-50 shadow-xl text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC] mb-4">
                <h3 className="font-serif font-bold text-sm text-[#111111]">Research Alerts</h3>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1 rounded hover:bg-gray-50 text-[#666666] hover:text-[#FF6B35] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6 text-xs text-[#666666] font-serif">
                <div className="space-y-3">
                  <h4 className="font-bold text-[#111111] uppercase tracking-wider">
                    Recent Alerts Feed
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 border border-[#ECECEC] rounded">
                      <span className="font-bold text-[#FF6B35]">Trending Papers</span>
                      <p className="text-[11px] text-[#666666] mt-1">GLM-5.2 is index-sharing at SOTA velocity on SWE-Bench.</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-[#ECECEC] rounded">
                      <span className="font-bold text-[#FF6B35]">New Models</span>
                      <p className="text-[11px] text-[#666666] mt-1">Qwen3-72B weights published directly to HuggingFace.</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-[#ECECEC] rounded">
                      <span className="font-bold text-[#FF6B35]">Model Releases</span>
                      <p className="text-[11px] text-[#666666] mt-1">DeepSeek-V3 checkpoints released under MIT License.</p>
                    </div>
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
            <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/35 backdrop-blur-xs" />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-[260px] h-full bg-white z-50 shadow-xl flex"
            >
              <Sidebar currentView={currentView} onViewChange={(viewId) => { handleViewChange(viewId); setMobileMenuOpen(false); }} isDrawer={true} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded bg-gray-100 text-[#666666] hover:text-[#FF6B35] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <Navbar 
        onMenuClick={() => setMobileMenuOpen(true)} 
        onNotificationClick={() => setNotificationsOpen(true)}
        onProfileClick={() => setProfileOpen(!profileOpen)}
        onViewChange={handleViewChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Left Column Sidebar */}
        <div className="hidden md:block shrink-0 h-full border-r border-[#ECECEC]">
          <Sidebar currentView={currentView} onViewChange={handleViewChange} />
        </div>

        {/* Core Scroll View Pane */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto px-8 py-6">

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-8 top-4 z-50 w-52 p-4 rounded bg-white border border-[#ECECEC] shadow-md text-left flex flex-col gap-2.5">
              <p className="text-xs font-serif font-bold text-[#111111] leading-none">Burla Z.</p>
              <p className="text-[10px] text-[#666666] leading-none">burla@aihub.org</p>
              <div className="border-t border-[#ECECEC] my-1" />
              <button 
                onClick={() => { setProfileOpen(false); triggerToast('Profile settings loaded'); }}
                className="text-xs font-serif text-[#666666] hover:text-[#FF6B35] text-left transition-colors cursor-pointer bg-transparent border-0"
              >
                My Profile
              </button>
              <button 
                onClick={() => { setProfileOpen(false); handleViewChange('lib-bookmarks'); }}
                className="text-xs font-serif text-[#666666] hover:text-[#FF6B35] text-left transition-colors cursor-pointer bg-transparent border-0"
              >
                Bookmarks
              </button>
              <button 
                onClick={() => { setProfileOpen(false); handleViewChange('lib-reading'); }}
                className="text-xs font-serif text-[#666666] hover:text-[#FF6B35] text-left transition-colors cursor-pointer bg-transparent border-0"
              >
                Reading List
              </button>
              <button 
                onClick={() => { setProfileOpen(false); triggerToast('Settings panel opened'); }}
                className="text-xs font-serif text-[#666666] hover:text-[#FF6B35] text-left transition-colors cursor-pointer bg-transparent border-0"
              >
                Settings
              </button>
              <div className="border-t border-[#ECECEC] my-0.5" />
              <button 
                onClick={() => { setProfileOpen(false); triggerToast('Logged out successfully'); }}
                className="text-xs font-serif text-rose-500 hover:text-rose-600 text-left transition-colors cursor-pointer bg-transparent border-0"
              >
                Logout
              </button>
            </div>
          )}

          <div className="flex-1 max-w-[1400px] w-full mx-auto">
            {currentView === 'home' && !isSearching && (
              <div className="flex flex-col">
                
                {/* Hero Section */}
                <Hero 
                  onSearchClick={() => setIsSearching(true)} 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
                
                {/* Paper stream filter bar exactly matching reference layout */}
                <div className="flex justify-between items-center w-full mt-2 text-left">
                  <div className="flex gap-2">
                    <button className="bg-[#FF6B35] text-white px-4 py-1.5 text-xs font-serif font-semibold rounded cursor-pointer border-0">
                      Trending
                    </button>
                    <button className="bg-white border border-[#ECECEC] text-[#666666] hover:text-[#FF6B35] px-4 py-1.5 text-xs font-serif rounded cursor-pointer">
                      Newest
                    </button>
                    <button className="bg-white border border-[#ECECEC] text-[#666666] hover:text-[#FF6B35] px-4 py-1.5 text-xs font-serif rounded cursor-pointer">
                      Most Cited
                    </button>
                  </div>
                  <span className="text-xs text-[#888888] font-serif">
                    20 papers
                  </span>
                </div>

                <div className="border-b border-[#ECECEC] my-4" />

                {/* Trending papers feed */}
                <TrendingPapers
                  papers={getFilteredPapers(papers)}
                  onViewPaper={setSelectedPaperForView}
                  onBookmarkToggle={handleBookmarkToggle}
                  onCompareSelect={handleCompareSelect}
                  onGenerateSummary={setSelectedPaperForSummary}
                  onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
                  onSavePaper={handleSavePaper}
                />

                {/* Discovery sections exactly below papers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 w-full text-left">
                  
                  {/* TOP MODELS PANEL */}
                  <div className="bg-white border border-[#ECECEC] rounded-md p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC]">
                      <h3 className="font-serif font-bold text-base text-[#111111]">Top Models</h3>
                      <button onClick={() => handleViewChange('models')} className="text-xs font-serif text-[#FF6B35] hover:underline bg-transparent border-0 cursor-pointer">
                        View All
                      </button>
                    </div>
                    <div className="divide-y divide-[#ECECEC] text-xs font-serif">
                      {[
                        { rank: 1, name: 'GPT-5', creator: 'OpenAI', downloads: '5.2M', growth: '+18%' },
                        { rank: 2, name: 'Claude 3.5 Sonnet', creator: 'Anthropic', downloads: '4.8M', growth: '+24%' },
                        { rank: 3, name: 'Gemini 1.5 Pro', creator: 'Google DeepMind', downloads: '3.2M', growth: '+15%' },
                        { rank: 4, name: 'Qwen3-72B', creator: 'Alibaba', downloads: '2.1M', growth: '+32%' },
                        { rank: 5, name: 'DeepSeek-V3', creator: 'DeepSeek AI', downloads: '1.8M', growth: '+45%' },
                        { rank: 6, name: 'Llama 3.1 405B', creator: 'Meta AI', downloads: '1.9M', growth: '+20%' }
                      ].map((model) => (
                        <div key={model.rank} className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-[#888888] w-4 text-center">#{model.rank}</span>
                            <div className="min-w-0">
                              <h4 className="font-bold text-[#111111] truncate">{model.name}</h4>
                              <p className="text-[10px] text-[#666666]">{model.creator}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <p className="font-bold text-[#111111]">{model.downloads}</p>
                              <span className="text-[9px] text-[#888888] block">DLs</span>
                            </div>
                            <div className="w-10">
                              <span className="font-bold text-emerald-600 block">{model.growth}</span>
                              <span className="text-[9px] text-[#888888] block">Growth</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TOP DATASETS PANEL */}
                  <div className="bg-white border border-[#ECECEC] rounded-md p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC]">
                      <h3 className="font-serif font-bold text-base text-[#111111]">Top Datasets</h3>
                      <button onClick={() => handleViewChange('datasets')} className="text-xs font-serif text-[#FF6B35] hover:underline bg-transparent border-0 cursor-pointer">
                        View All
                      </button>
                    </div>
                    <div className="divide-y divide-[#ECECEC] text-xs font-serif">
                      {[
                        { id: '1', name: 'ImageNet', domain: 'Computer Vision', mentions: '12.5K', downloads: '85K' },
                        { id: '2', name: 'Common Crawl', domain: 'Web Corpus', mentions: '15.2K', downloads: '120K' },
                        { id: '3', name: 'The Pile', domain: 'Language Modeling', mentions: '9.8K', downloads: '45K' },
                        { id: '4', name: 'MMLU', domain: 'General Knowledge', mentions: '14.1K', downloads: '95K' },
                        { id: '5', name: 'HumanEval', domain: 'Coding / Dev', mentions: '6.4K', downloads: '38K' },
                        { id: '6', name: 'GPQA', domain: 'Advanced Reasoning', mentions: '8.8K', downloads: '54K' }
                      ].map((dataset) => (
                        <div key={dataset.id} className="flex items-center justify-between py-2.5">
                          <div className="min-w-0">
                            <h4 className="font-bold text-[#111111] truncate">{dataset.name}</h4>
                            <p className="text-[10px] text-[#666666]">{dataset.domain}</p>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <p className="font-bold text-[#111111]">{dataset.mentions}</p>
                              <span className="text-[9px] text-[#888888] block">Mentions</span>
                            </div>
                            <div>
                              <p className="font-bold text-[#111111]">{dataset.downloads}</p>
                              <span className="text-[9px] text-[#888888] block">Downloads</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TOP BENCHMARKS PANEL */}
                  <div className="bg-white border border-[#ECECEC] rounded-md p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC]">
                      <h3 className="font-serif font-bold text-base text-[#111111]">Top Benchmarks</h3>
                      <button onClick={() => handleViewChange('benchmarks')} className="text-xs font-serif text-[#FF6B35] hover:underline bg-transparent border-0 cursor-pointer">
                        View All
                      </button>
                    </div>
                    <div className="divide-y divide-[#ECECEC] text-xs font-serif">
                      {[
                        { rank: 1, name: 'MMLU (General QA)', leader: 'GPT-5', score: '88.7%', totalModels: 142 },
                        { rank: 2, name: 'GPQA (Advanced Reasoning)', leader: 'Claude 3.5 Sonnet', score: '65.2%', totalModels: 86 },
                        { rank: 3, name: 'HumanEval (Code Execution)', leader: 'Claude 3.5 Sonnet', score: '92.0%', totalModels: 110 },
                        { rank: 4, name: 'SWE-Bench (Software Engineering)', leader: 'GPT-5 (Agentic)', score: '27.3%', totalModels: 42 }
                      ].map((bench) => (
                        <div key={bench.rank} className="flex items-center justify-between py-2.5">
                          <div className="min-w-0">
                            <h4 className="font-bold text-[#111111] truncate">{bench.name}</h4>
                            <p className="text-[10px] text-[#666666]">Leader: <span className="text-[#FF6B35] font-semibold">{bench.leader}</span></p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-[#FF6B35]">{bench.score}</span>
                            <span className="text-[9px] text-[#888888] block">{bench.totalModels} models</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TOP ORGANIZATIONS PANEL */}
                  <div className="bg-white border border-[#ECECEC] rounded-md p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC]">
                      <h3 className="font-serif font-bold text-base text-[#111111]">Top Organizations</h3>
                      <button onClick={() => handleViewChange('organizations')} className="text-xs font-serif text-[#FF6B35] hover:underline bg-transparent border-0 cursor-pointer">
                        View All
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: 'OpenAI', papers: '2,341', citations: '125K' },
                        { name: 'Anthropic', papers: '987', citations: '45K' },
                        { name: 'Google DeepMind', papers: '2,102', citations: '96K' },
                        { name: 'Meta AI', papers: '1,876', citations: '87K' },
                        { name: 'Microsoft Research', papers: '1,234', citations: '56K' },
                        { name: 'Mistral', papers: '624', citations: '18K' }
                      ].map((lab) => (
                        <div key={lab.name} className="p-3.5 border border-[#ECECEC] rounded bg-gray-50 flex flex-col justify-between h-20 text-xs font-serif">
                          <span className="font-bold text-[#111111]">{lab.name}</span>
                          <div className="flex justify-between text-[10px] text-[#666666] mt-2">
                            <span>{lab.papers} papers</span>
                            <span>{lab.citations} cites</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Filtered Search Results or Explorer Database Pages */}
            {(isSearching || searchQuery.trim() !== '') && currentView === 'home' && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC]">
                  <h2 className="font-serif font-bold text-base text-[#111111]">
                    Search Results for &quot;{searchQuery}&quot;
                  </h2>
                  <button 
                    onClick={() => { setSearchQuery(''); setIsSearching(false); }}
                    className="text-xs font-serif text-[#FF6B35] hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
                {getFilteredPapers(papers).length > 0 ? (
                  <TrendingPapers
                    papers={getFilteredPapers(papers)}
                    onViewPaper={setSelectedPaperForView}
                    onBookmarkToggle={handleBookmarkToggle}
                    onCompareSelect={handleCompareSelect}
                    onGenerateSummary={setSelectedPaperForSummary}
                    onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
                    onSavePaper={handleSavePaper}
                  />
                ) : (
                  <div className="p-12 border border-[#ECECEC] rounded text-center font-serif text-sm text-[#666666]">
                    No papers found matching your query.
                  </div>
                )}
              </div>
            )}

            {/* Explorer Database Pages */}
            {isExplorerView && (
              <GenericExplorer viewId={currentView} />
            )}

            {/* Secondary Explorer Pages: Latest Papers */}
            {currentView === 'latest-papers' && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC] mb-4">
                  <h2 className="font-serif font-bold text-base text-[#111111]">Latest Research Papers</h2>
                  <span className="text-xs text-[#888888] font-serif">{getFilteredPapers(papers).length} papers</span>
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

            {/* Secondary Explorer Pages: Bookmarks List */}
            {(currentView === 'lib-bookmarks' || currentView === 'bookmarks') && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center gap-2 pb-3 mb-2 border-b border-[#ECECEC]">
                  <Bookmark className="text-[#FF6B35] fill-[#FF6B35]/10" size={18} />
                  <h2 className="font-serif font-bold text-base text-[#111111]">Your Bookmarked Papers</h2>
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
                  <div className="p-12 border border-[#ECECEC] rounded text-center space-y-4">
                    <h3 className="font-serif font-bold text-sm text-[#111111]">No bookmarked papers yet</h3>
                    <p className="text-xs text-[#666666] font-serif max-w-sm mx-auto leading-relaxed">
                      Browse our trending papers on the dashboard and click the bookmark action to collect papers here.
                    </p>
                    <button
                      onClick={() => handleViewChange('home')}
                      className="px-4 py-2 bg-[#FF6B35] hover:bg-[#FF7F50] text-white text-xs font-serif rounded transition-all cursor-pointer border-0"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Secondary Explorer Pages: Most Citations or GitHub Stars */}
            {(currentView === 'github-stars' || currentView === 'most-cited') && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC] mb-4">
                  <h2 className="font-serif font-bold text-base text-[#111111]">
                    {currentView === 'github-stars' ? 'Most GitHub Stars' : 'Most Cited Papers'}
                  </h2>
                  <span className="text-xs text-[#888888] font-serif">{getFilteredPapers(papers).length} papers</span>
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
              <div className="p-8 bg-white border border-[#ECECEC] rounded-md text-left space-y-6 max-w-xl mx-auto">
                <div className="flex items-center gap-2 pb-3 border-b border-[#ECECEC]">
                  <PlusCircle className="text-[#FF6B35]" size={20} />
                  <h2 className="font-serif font-bold text-base text-[#111111]">Submit New Research Paper</h2>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as HTMLFormElement;
                  const title = (target.elements.namedItem('paperTitle') as HTMLInputElement).value;
                  triggerToast(`Submitted "${title}" successfully! Pending peer review.`);
                  target.reset();
                  handleViewChange('home');
                }} className="space-y-4 text-xs font-serif text-[#666666]">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="paperTitle" className="font-bold text-[#111111]">Paper Title *</label>
                    <input id="paperTitle" name="paperTitle" required placeholder="e.g. Scaling Laws for Multi-Agent Consensus" className="p-2 rounded border border-[#ECECEC] bg-white text-[#111111] focus:outline-none focus:border-[#FF6B35]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="paperAuthors" className="font-bold text-[#111111]">Authors (Comma separated) *</label>
                    <input id="paperAuthors" name="paperAuthors" required placeholder="e.g. Jane Doe, John Smith" className="p-2 rounded border border-[#ECECEC] bg-white text-[#111111] focus:outline-none focus:border-[#FF6B35]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="paperOrg" className="font-bold text-[#111111]">Organization *</label>
                      <input id="paperOrg" name="paperOrg" required placeholder="e.g. Stanford University" className="p-2 rounded border border-[#ECECEC] bg-white text-[#111111] focus:outline-none focus:border-[#FF6B35]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="paperCategory" className="font-bold text-[#111111]">Primary Category *</label>
                      <select id="paperCategory" name="paperCategory" required className="p-2 rounded border border-[#ECECEC] bg-white text-[#111111] focus:outline-none focus:border-[#FF6B35]">
                        <option value="LLMs">LLMs</option>
                        <option value="Robotics">Robotics</option>
                        <option value="Agents">Agents</option>
                        <option value="Reasoning">Reasoning</option>
                        <option value="Multimodal">Multimodal</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="paperAbstract" className="font-bold text-[#111111]">Abstract / Executive Summary *</label>
                    <textarea id="paperAbstract" name="paperAbstract" required rows={4} placeholder="Summarize the core findings and contributions of this work..." className="p-2 rounded border border-[#ECECEC] bg-white text-[#111111] focus:outline-none focus:border-[#FF6B35] resize-none" />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-[#FF6B35] hover:bg-[#FF7F50] text-white text-xs font-semibold rounded transition-all cursor-pointer border-0">
                    Submit Publication
                  </button>
                </form>
              </div>
            )}

            {/* Fallback View: Generic Explorable reading list files / conference templates */}
            {currentView === 'lib-reading' && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center gap-2 pb-3 mb-2 border-b border-[#ECECEC]">
                  <BookOpenCheck className="text-[#FF6B35]" size={18} />
                  <h2 className="font-serif font-bold text-base text-[#111111]">Your Reading List</h2>
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
              <div className="p-6 bg-white border border-[#ECECEC] rounded-md text-left space-y-4">
                <h2 className="font-serif font-bold text-lg text-[#111111] flex items-center gap-2">
                  <Network className="text-[#FF6B35]" size={18} />
                  Global Research Network Explorer
                </h2>
                <p className="text-xs text-[#666666] font-serif leading-relaxed max-w-xl">
                  Inspect institutional funding maps, dependency layers, and release timelines in full WebGL space. Drag to rotate the node clusters.
                </p>
                
                <div className="w-full bg-gray-50 border border-[#ECECEC] rounded h-[500px] overflow-hidden flex items-center justify-center relative shadow-inner">
                  <GenericExplorer viewId="models" />
                </div>
              </div>
            )}

            {/* Fallback View Panel */}
            {!['home', 'tool-graph', 'latest-papers', 'submit-paper', 'lib-bookmarks', 'bookmarks', 'github-stars', 'most-cited', 'lib-reading'].includes(currentView) && !isExplorerView && (
              <div className="p-12 bg-white border border-[#ECECEC] rounded-md text-center space-y-4">
                <h3 className="font-serif font-bold text-base text-[#111111] capitalize">
                  {currentView.replace(/-/g, ' ')} Explorer
                </h3>
                <p className="text-xs text-[#666666] font-serif max-w-sm mx-auto leading-relaxed">
                  You are currently browsing the dedicated {currentView.replace(/-/g, ' ')} view inside the GraphOne AI Research environment.
                </p>
                <button
                  onClick={() => handleViewChange('home')}
                  className="px-4 py-2 bg-[#FF6B35] hover:bg-[#FF7F50] text-white text-xs font-serif rounded transition-all cursor-pointer border-0"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Footer at the end of the scroll pane */}
          <div className="mt-12">
            <Footer />
          </div>

        </div>
      </div>
    </div>
  );
}
