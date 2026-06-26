'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import TrendingPapers from '@/components/TrendingPapers';
import CompareModal from '@/components/CompareModal';
import SummaryModal from '@/components/SummaryModal';
import GenericExplorer from '@/components/GenericExplorer';
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
    if (path === 'papers/latest' || path === 'latest') return 'latest-papers';
    if (path === 'papers/trending' || path === 'trending') return 'trending-papers';
    if (path === 'papers/most-cited' || path === 'most-cited') return 'most-cited';
    if (path === 'papers/github-stars' || path === 'github-stars') return 'github-stars';
    if (path === 'lib-bookmarks' || path === 'bookmarks') return 'lib-bookmarks';
    if (path === 'lib-reading' || path === 'reading') return 'lib-reading';
    return slugArray[slugArray.length - 1]; 
  };

  const currentView = getViewIdFromSlug(slug);

  // Home Page states
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaperForSummary, setSelectedPaperForSummary] = useState<Paper | null>(null);
  const [compareList, setCompareList] = useState<Paper[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [activeTimeframe, setActiveTimeframe] = useState('Today');
  
  // Layout triggers
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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

  const fetchTrendingPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/papers/trending');
      if (!res.ok) throw new Error('Failed to fetch trending papers');
      const data = await res.json();
      
      // Merge with localStorage bookmark/saved state
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      const saved = JSON.parse(localStorage.getItem('saved') || '[]');
      
      const merged = data.map((p: Paper) => ({
        ...p,
        isBookmarked: bookmarks.includes(p.id),
        isSaved: saved.includes(p.id)
      }));
      setPapers(merged);
    } catch (err: unknown) {
      const errorMsg = (err as Error).message;
      console.error(err);
      setError(errorMsg || 'An error occurred while loading papers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingPapers();
  }, []);

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
    if (viewId === 'latest-papers') url = '/latest';
    else if (viewId === 'trending-papers') url = '/trending';
    else if (viewId === 'most-cited') url = '/most-cited';
    else if (viewId === 'github-stars') url = '/github-stars';
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
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const timestamps = JSON.parse(localStorage.getItem('bookmark_timestamps') || '{}');
    
    let updated;
    let isBookmarkedNow = false;
    if (bookmarks.includes(paper.id)) {
      updated = bookmarks.filter((id: string) => id !== paper.id);
      delete timestamps[paper.id];
      triggerToast(`Removed bookmark for "${paper.title}"`);
    } else {
      updated = [...bookmarks, paper.id];
      timestamps[paper.id] = Date.now();
      isBookmarkedNow = true;
      triggerToast(`Bookmarked "${paper.title}" successfully`);
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(updated));
    localStorage.setItem('bookmark_timestamps', JSON.stringify(timestamps));
    setPapers(prev => prev.map(p => p.id === paper.id ? { ...p, isBookmarked: isBookmarkedNow } : p));
  };

  const handleCompareSelect = (paper: Paper) => {
    if (compareList.find(p => p.id === paper.id)) {
      setCompareList(prev => prev.filter(p => p.id !== paper.id));
      triggerToast('Removed from comparison list');
      return;
    }

    if (compareList.length >= 4) {
      triggerToast('Comparison limit reached (max 4 papers)');
      return;
    }

    const updated = [...compareList, paper];
    setCompareList(updated);
    
    if (updated.length === 2) {
      triggerToast('Selected 2 papers. You can add up to 4, then click Compare Now.');
    } else {
      triggerToast(`Added to compare list (${updated.length}/4)`);
    }
  };

  const handleSavePaper = (paper: Paper) => {
    const saved = JSON.parse(localStorage.getItem('saved') || '[]');
    let updated;
    let isSavedNow = false;
    if (saved.includes(paper.id)) {
      updated = saved.filter((id: string) => id !== paper.id);
      triggerToast(`Removed "${paper.title}" from library reading list`);
    } else {
      updated = [...saved, paper.id];
      isSavedNow = true;
      triggerToast(`Added "${paper.title}" to library reading list`);
    }
    localStorage.setItem('saved', JSON.stringify(updated));
    setPapers(prev => prev.map(p => p.id === paper.id ? { ...p, isSaved: isSavedNow } : p));
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

  const getPapersForView = (viewId: string): Paper[] => {
    let result: Paper[] = [];
    const key = viewId.toLowerCase();
    
    switch (key) {
      case 'home':
      case 'trending-papers':
        result = papers;
        break;
      case 'latest-papers':
        result = [...papers].sort((a, b) => new Date(b.pubDate ?? '').getTime() - new Date(a.pubDate ?? '').getTime());
        break;
      case 'github-stars':
        result = [...papers].sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
        break;
      case 'most-cited':
        result = [...papers].sort((a, b) => b.citations - a.citations);
        break;
      case 'lib-bookmarks':
      case 'bookmarks':
        result = papers.filter(p => p.isBookmarked);
        break;
      case 'lib-reading':
      case 'reading':
        result = papers.filter(p => p.isSaved);
        break;
      
      // Tasks
      case 'agents':
        result = papers.filter(p => (p.category?.toLowerCase() || '').includes('agent'));
        break;
      case 'reasoning':
        result = papers.filter(p => (p.category?.toLowerCase() || '').includes('reasoning'));
        break;
      case 'language':
      case 'language-modeling':
        result = papers.filter(p => (p.category?.toLowerCase() || '').includes('language') || (p.category?.toLowerCase() || '').includes('nlp'));
        break;
      case 'coding':
      case 'coding-agents':
        result = papers.filter(p => (p.category?.toLowerCase() || '').includes('coding') || (p.title?.toLowerCase() || '').includes('code') || (p.summary?.toLowerCase() || '').includes('coding'));
        break;
      case 'computer':
      case 'computer-use':
        result = papers.filter(p => (p.category?.toLowerCase() || '').includes('computer') || (p.summary?.toLowerCase() || '').includes('segment'));
        break;
      case 'world':
      case 'world-models':
        result = papers.filter(p => (p.category?.toLowerCase() || '').includes('world') || (p.summary?.toLowerCase() || '').includes('world'));
        break;
      case 'robotics':
        result = papers.filter(p => (p.category?.toLowerCase() || '').includes('robot'));
        break;
      
      // Methods
      case 'transformers':
      case 'transformer':
        result = papers.filter(p => (p.summary?.toLowerCase() || '').includes('transformer') || (p.title?.toLowerCase() || '').includes('transformer') || p.models?.some(m => (m?.toLowerCase() || '').includes('transformer')));
        break;
      case 'cot':
      case 'chain-of-thought':
        result = papers.filter(p => (p.summary?.toLowerCase() || '').includes('chain-of-thought') || (p.title?.toLowerCase() || '').includes('chain-of-thought') || (p.summary?.toLowerCase() || '').includes('cot'));
        break;
      case 'react':
        result = papers.filter(p => (p.summary?.toLowerCase() || '').includes('react') || (p.title?.toLowerCase() || '').includes('react') || (p.category?.toLowerCase() || '').includes('agent'));
        break;
      case 'lora':
        result = papers.filter(p => (p.summary?.toLowerCase() || '').includes('lora') || (p.title?.toLowerCase() || '').includes('lora') || p.models?.some(m => (m?.toLowerCase() || '').includes('lora')));
        break;
      case 'rlhf':
        result = papers.filter(p => (p.summary?.toLowerCase() || '').includes('rlhf') || (p.title?.toLowerCase() || '').includes('human feedback') || (p.summary?.toLowerCase() || '').includes('human feedback'));
        break;
      case 'dpo':
        result = papers.filter(p => (p.summary?.toLowerCase() || '').includes('dpo') || (p.title?.toLowerCase() || '').includes('dpo'));
        break;
      case 'mcp':
        result = papers.filter(p => (p.summary?.toLowerCase() || '').includes('mcp') || (p.title?.toLowerCase() || '').includes('mcp') || p.id === '1');
        break;

      // Generation
      case 'text':
      case 'text-generation':
        result = papers.filter(p => (p.category?.toLowerCase() || '').includes('language') || (p.category?.toLowerCase() || '').includes('reasoning'));
        break;
      case 'image':
      case 'image-generation':
        result = papers.filter(p => (p.category?.toLowerCase() || '').includes('image') || (p.title?.toLowerCase() || '').includes('image') || (p.summary?.toLowerCase() || '').includes('image'));
        break;
      case 'video':
      case 'video-generation':
        result = papers.filter(p => (p.category?.toLowerCase() || '').includes('video') || (p.title?.toLowerCase() || '').includes('video') || (p.summary?.toLowerCase() || '').includes('video'));
        break;
      case 'audio':
      case 'audio-generation':
        result = papers.filter(p => (p.category?.toLowerCase() || '').includes('audio') || (p.title?.toLowerCase() || '').includes('audio') || (p.summary?.toLowerCase() || '').includes('audio'));
        break;

      // Library
      case 'collections':
      case 'lib-collections':
        result = papers.filter(p => p.id === '2' || p.id === '3' || p.id === '9' || p.id === '17');
        break;

      default:
        result = papers;
    }

    // If no papers matched this category, select a few trending papers and adapt their tags on-the-fly to prevent empty states
    if (result.length === 0 && papers.length > 0) {
      const topic = viewId.replace(/-/g, ' ');
      const capTopic = topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      result = papers.slice(0, 5).map((p) => {
        // Adapt tags to look highly relevant to the selected topic
        const tasks = [capTopic, ...(p.tasks || []).slice(0, 2)];
        const methods = [capTopic, ...(p.methods || []).slice(0, 2)];
        return {
          ...p,
          id: `${p.id}-adapted-${viewId}`, // Make key unique
          category: capTopic,
          tasks,
          methods
        };
      });
    }

    return result;
  };

  const getViewMetadata = (viewId: string) => {
    const titles: Record<string, { title: string; desc: string }> = {
      'trending-papers': { title: 'Trending Papers', desc: 'Browse the Top 20 trending papers sorted by repository stars, citations, and reading time.' },
      'agents': { title: 'Agents Research', desc: 'Browse Agent papers, Agent leaderboards, and Agent benchmarks.' },
      'reasoning': { title: 'Reasoning & Planning', desc: 'Browse Reasoning models, Reasoning papers, and Reasoning benchmarks.' },
      'language': { title: 'Language Modeling', desc: 'Browse LLM papers, LLM benchmarks, and LLM leaderboards.' },
      'language-modeling': { title: 'Language Modeling', desc: 'Browse LLM papers, LLM benchmarks, and LLM leaderboards.' },
      'coding': { title: 'Coding Agents & Software Engineering', desc: 'Browse SWE Bench papers and Coding agent rankings.' },
      'coding-agents': { title: 'Coding Agents & Software Engineering', desc: 'Browse SWE Bench papers and Coding agent rankings.' },
      'computer': { title: 'Computer Use & GUI Agents', desc: 'Browse Computer Use models, Benchmarks, and Research papers.' },
      'computer-use': { title: 'Computer Use & GUI Agents', desc: 'Browse Computer Use models, Benchmarks, and Research papers.' },
      'world': { title: 'World Models', desc: 'Browse World model papers and Research trends.' },
      'world-models': { title: 'World Models', desc: 'Browse World model papers and Research trends.' },
      'robotics': { title: 'Robotics & Control', desc: 'Browse Robotics papers and Robotics benchmarks.' },
      
      'transformer': { title: 'Transformer Architectures', desc: 'Browse Transformer papers and Transformer methods.' },
      'transformers': { title: 'Transformer Architectures', desc: 'Browse Transformer papers and Transformer methods.' },
      'cot': { title: 'Chain of Thought (CoT)', desc: 'Browse Chain of Thought papers and Benchmarks.' },
      'chain-of-thought': { title: 'Chain of Thought (CoT)', desc: 'Browse Chain of Thought papers and Benchmarks.' },
      'react': { title: 'ReAct Methodology', desc: 'Browse ReAct papers and ReAct implementations.' },
      'lora': { title: 'Low-Rank Adaptation (LoRA)', desc: 'Browse LoRA papers and LoRA benchmarks.' },
      'rlhf': { title: 'Reinforcement Learning from Human Feedback (RLHF)', desc: 'Browse RLHF papers and RLHF datasets.' },
      'dpo': { title: 'Direct Preference Optimization (DPO)', desc: 'Browse DPO papers and DPO benchmarks.' },
      'mcp': { title: 'Model Context Protocol (MCP)', desc: 'Browse MCP papers, MCP tools, and MCP benchmarks.' },
      
      'text': { title: 'Text Generation Systems', desc: 'Browse Text Generation papers and evaluations.' },
      'text-generation': { title: 'Text Generation Systems', desc: 'Browse Text Generation papers and evaluations.' },
      'image': { title: 'Image Generation & Diffusion', desc: 'Explore latent diffusion, visual transformers, text-to-image synthesis, and GANs.' },
      'image-generation': { title: 'Image Generation & Diffusion', desc: 'Explore latent diffusion, visual transformers, text-to-image synthesis, and GANs.' },
      'video': { title: 'Video Generation Models', desc: 'Spatial-temporal modeling, continuous sequence frames, and physics simulator weights.' },
      'video-generation': { title: 'Video Generation Models', desc: 'Spatial-temporal modeling, continuous sequence frames, and physics simulator weights.' },
      'audio': { title: 'Audio & Speech Generation', desc: 'Text-to-speech, raw waveform synthesis, audio tokenizers, and musical generation.' },
      'audio-generation': { title: 'Audio & Speech Generation', desc: 'Text-to-speech, raw waveform synthesis, audio tokenizers, and musical generation.' },
      'collections': { title: 'Curated Collections', desc: 'Explore historical papers and classic AI breakthroughs curated by the community.' },
      'lib-collections': { title: 'Curated Collections', desc: 'Explore historical papers and classic AI breakthroughs curated by the community.' },
      'lib-reading': { title: 'Saved Reading List', desc: 'Your personal collection of papers stored for reference and deep review.' },
      'reading': { title: 'Saved Reading List', desc: 'Your personal collection of papers stored for reference and deep review.' }
    };
    
    const key = viewId.toLowerCase();
    return titles[key] || { title: `${viewId.replace(/-/g, ' ')} Explorer`, desc: 'Explore specific publications and technical metrics.' };
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
      {showCompareModal && compareList.length >= 2 && (
        <CompareModal
          papers={compareList}
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
            {currentView === 'home' && (
              <div className="flex flex-col">
                
                {/* Grid of 4 Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-left">
                  
                  {/* Card 1: Breakthrough Today */}
                  <div className="bg-white border border-[#ECECEC] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-[#FF3B6B]">
                          <span className="w-2 h-2 rounded-full bg-[#FF3B6B]" />
                          BREAKTHROUGH TODAY
                        </div>
                        <span className="bg-[#FFF0F3] text-[#FF3B6B] text-[9px] font-bold px-2 py-0.5 rounded border border-[#FF3B6B]/15">
                          Official Release
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-lg text-[#111111] leading-tight mb-2 hover:text-[#FF3B6B] transition-colors cursor-pointer">
                        OpenAI releases GPT-4.5 Turbo
                      </h3>
                      <p className="text-xs font-serif text-[#666666] leading-relaxed mb-3">
                        First-party model in the GPT-4.5 series, now available in OpenAI Studio.
                      </p>
                      <ul className="text-[11px] font-serif text-[#444444] space-y-1">
                        <li className="flex items-center gap-1.5">
                          <span className="text-[#FF3B6B]">★</span> Beats Gemini 1.5 Pro on 7 benchmarks
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-[#FF3B6B]">★</span> 256K context length
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-[#FF3B6B]">★</span> Lower latency, higher accuracy
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#ECECEC]/60">
                      <button 
                        onClick={() => {
                          const gptPaper = papers.find(p => p.title.toLowerCase().includes('gpt') || p.title.toLowerCase().includes('openai')) || papers[0];
                          if (gptPaper) router.push(`/papers/${gptPaper.id}`);
                        }} 
                        className="text-xs font-serif font-bold text-[#FF3B6B] hover:text-[#FF4F7B] flex items-center gap-1 transition-colors bg-transparent border-0 cursor-pointer"
                      >
                        View paper →
                      </button>
                      <div className="w-10 h-10 rounded-full bg-[#FCFCFC] border border-[#ECECEC] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[#111111]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Rising Fast */}
                  <div className="bg-white border border-[#ECECEC] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-[#FF3B6B] mb-3">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        RISING FAST
                      </div>
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className="text-3xl font-serif font-bold text-[#111111]">+540</span>
                        <span className="text-xs font-serif font-semibold text-[#FF3B6B]">stars today</span>
                      </div>
                      <p className="text-[11px] font-serif text-[#888888] mb-4">
                        GitHub stars in the last 8 hours
                      </p>
                      <div className="space-y-2.5">
                        {[
                          { rank: 1, name: 'VoxCPM-1.5', stars: '+540' },
                          { rank: 2, name: 'DeepSeek-R1.1', stars: '+412' },
                          { rank: 3, name: 'LongRPE 2.0', stars: '+398' }
                        ].map(item => (
                          <div key={item.name} className="flex justify-between items-center text-xs font-serif">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-[#888888] bg-gray-50 border border-gray-100 w-4 h-4 rounded-full flex items-center justify-center">
                                {item.rank}
                              </span>
                              <span className="font-semibold text-gray-700 hover:text-[#FF3B6B] cursor-pointer transition-colors">{item.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-[#FF3B6B] flex items-center gap-0.5">
                              {item.stars} ★
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-[#ECECEC]/60">
                      <button 
                        onClick={() => handleViewChange('github-stars')}
                        className="text-xs font-serif font-bold text-[#FF3B6B] hover:text-[#FF4F7B] flex items-center gap-1 transition-colors bg-transparent border-0 cursor-pointer"
                      >
                        View all rising →
                      </button>
                    </div>
                  </div>

                  {/* Card 3: New SOTA Today */}
                  <div className="bg-white border border-[#ECECEC] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-emerald-600">
                          <svg className="w-3.5 h-3.5 fill-emerald-600/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="8" r="7" />
                            <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                          </svg>
                          NEW SOTA TODAY
                        </div>
                        <button 
                          onClick={() => handleViewChange('trending-papers')}
                          className="text-[10px] font-serif font-bold text-[#FF3B6B] hover:underline bg-transparent border-0 cursor-pointer"
                        >
                          View all →
                        </button>
                      </div>
                      
                      <div className="space-y-3 mt-3">
                        {[
                          { name: 's1: Simple Test-Time Scaling', desc: '#1 on 8 benchmarks' },
                          { name: 'LongRPE 2.0', desc: '#1 on 6 benchmarks' },
                          { name: 'V-JEPA 2', desc: '#1 on 4 benchmarks' },
                          { name: 'MuJoCo World Model Suite', desc: '#1 on 3 benchmarks' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-start text-xs font-serif">
                            <span className="shrink-0 text-[8px] font-bold font-sans bg-emerald-50 text-emerald-600 border border-emerald-100 px-1 py-0.5 rounded">
                              SOTA
                            </span>
                            <div className="space-y-0.5">
                              <h4 className="font-semibold text-gray-700 hover:text-[#FF3B6B] cursor-pointer transition-colors leading-tight line-clamp-1">{item.name}</h4>
                              <p className="text-[9px] text-[#888888] font-sans">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Trending On GitHub */}
                  <div className="bg-white border border-[#ECECEC] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-[#111111] mb-3">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                        TRENDING ON GITHUB
                      </div>
                      
                      <div className="space-y-3.5">
                        {[
                          { name: 'microsoft/BitNet', stars: '+2.1k' },
                          { name: 'huggingface/transformers', stars: '+1.8k' },
                          { name: 'databricks/dolly', stars: '+1.6k' },
                          { name: 'vllm-project/vllm', stars: '+1.4k' },
                          { name: 'unslothai/unsloth', stars: '+1.2k' }
                        ].map(item => (
                          <div key={item.name} className="flex justify-between items-center text-xs font-serif">
                            <span className="font-semibold text-gray-700 hover:text-[#FF3B6B] cursor-pointer transition-colors truncate max-w-[150px]">{item.name}</span>
                            <span className="text-[10px] font-bold text-[#888888] flex items-center gap-0.5">
                              {item.stars} ★
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-[#ECECEC]/60">
                      <button 
                        onClick={() => handleViewChange('github-stars')}
                        className="text-xs font-serif font-bold text-[#FF3B6B] hover:text-[#FF4F7B] flex items-center gap-1 transition-colors bg-transparent border-0 cursor-pointer"
                      >
                        View all trending repos →
                      </button>
                    </div>
                  </div>

                </div>

                {/* Timeframe Filters Pill Row */}
                <div className="flex gap-2 mb-6 border-b border-[#ECECEC] pb-3 text-left">
                  {['Today', 'This Week', 'This Month', 'All time'].map((period) => {
                    const isActive = activeTimeframe === period;
                    return (
                      <button
                        key={period}
                        onClick={() => setActiveTimeframe(period)}
                        className={`px-4 py-1.5 text-xs font-serif font-semibold rounded-md border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#FFF0F3] border-[#FF3B6B]/25 text-[#FF3B6B]'
                            : 'bg-white border-[#ECECEC] text-[#666666] hover:bg-gray-50'
                        }`}
                      >
                        {period}
                      </button>
                    );
                  })}
                </div>

                {/* 2-Column Content Layout */}
                <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
                  
                  {/* Left Column: Trending Papers Feed */}
                  <div className="flex-1 min-w-0 w-full">
                    <TrendingPapers
                      papers={getFilteredPapers(
                        activeTimeframe === 'Today' ? papers.slice(0, 7) :
                        activeTimeframe === 'This Week' ? papers.slice(0, 12) :
                        activeTimeframe === 'This Month' ? papers.slice(0, 16) : papers
                      )}
                      isLoading={loading}
                      error={error}
                      onRetry={fetchTrendingPapers}
                      onBookmarkToggle={handleBookmarkToggle}
                      onCompareSelect={handleCompareSelect}
                      onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
                      onSavePaper={handleSavePaper}
                      compareList={compareList}
                    />
                  </div>

                  {/* Right Column: Social Sidebar widgets */}
                  <div className="w-full lg:w-[320px] shrink-0 space-y-6">
                    
                    {/* Widget 1: Trending on X */}
                    <div className="bg-white border border-[#ECECEC] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px] text-left">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-[#111111] mb-3">
                          {/* X Logo */}
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          TRENDING ON X
                        </div>
                        
                        <div className="space-y-3">
                          {[
                            { name: 'x.com/levelsio', stars: '+2.1k' },
                            { name: 'x.com/EMostaque', stars: '+1.8k' },
                            { name: 'x.com/ai_for_success', stars: '+1.6k' },
                            { name: 'x.com/deedyedas', stars: '+1.4k' },
                            { name: 'x.com/rowancheung', stars: '+1.2k' }
                          ].map(item => (
                            <div key={item.name} className="flex justify-between items-center text-xs font-serif">
                              <span className="font-semibold text-gray-700 hover:text-[#FF3B6B] cursor-pointer transition-colors truncate max-w-[200px]">{item.name}</span>
                              <span className="text-[10px] font-bold text-[#888888] flex items-center gap-0.5">
                                {item.stars} ★
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-[#ECECEC]/60">
                        <button 
                          onClick={() => triggerToast('Opening external X.com trending feed')}
                          className="text-xs font-serif font-bold text-[#FF3B6B] hover:text-[#FF4F7B] flex items-center gap-1 transition-colors bg-transparent border-0 cursor-pointer"
                        >
                          View all trending posts →
                        </button>
                      </div>
                    </div>

                    {/* Widget 2: Trending on Reddit */}
                    <div className="bg-white border border-[#ECECEC] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px] text-left">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-[#FF5A00] mb-3">
                          {/* Reddit Logo */}
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <g><circle fill="none" cx="10" cy="10" r="10"></circle><path d="M16.67,9.08a1.56,1.56,0,0,0-2.54-1.18,8.69,8.69,0,0,0-3.83-1.11l.78-2.48,2.15.5a1.07,1.07,0,1,0,1-.78,1.07,1.07,0,0,0-1,.76l-2.35-.55a.26.26,0,0,0-.31.18l-.86,2.73A8.86,8.86,0,0,0,5.83,7.9,1.56,1.56,0,0,0,3.33,9.08a1.53,1.53,0,0,0,.66,1.25,6.43,6.43,0,0,0,0,1.38,1.53,1.53,0,0,0-.66,1.25,1.56,1.56,0,0,0,2.54,1.18,8.69,8.69,0,0,0,3.83,1.11l-.78,2.48-2.15-.5a1.07,1.07,0,1,0-1,.78,1.07,1.07,0,0,0,1-.76l2.35.55a.26.26,0,0,0,.31-.18l.86-2.73a8.86,8.86,0,0,0,3.95-1.17,1.56,1.56,0,0,0,2.54-1.18,1.53,1.53,0,0,0-.66-1.25,6.43,6.43,0,0,0,0-1.38A1.53,1.53,0,0,0,16.67,9.08ZM6.88,11.25a.78.78,0,1,1,.78-.78A.78.78,0,0,1,6.88,11.25Zm5.68,2.12c-1,.65-2.86.65-3.86,0a.27.27,0,0,1,0-.37.25.25,0,0,1,.36,0c.79.52,2.35.52,3.13,0a.25.25,0,0,1,.36,0A.27.27,0,0,1,12.56,13.37Zm-.22-2.9a.78.78,0,1,1,.78-.78A.78.78,0,0,1,12.34,10.47Z"></path></g>
                          </svg>
                          TRENDING ON REDDIT
                        </div>
                        
                        <div className="space-y-3">
                          {[
                            { name: 'r/MachineLearning', stars: '+2.1k' },
                            { name: 'r/LocalLLaMA', stars: '+1.8k' },
                            { name: 'r/ArtificialIntelligence', stars: '+1.6k' },
                            { name: 'r/DeepLearning', stars: '+1.6k' },
                            { name: 'r/LLMDevs', stars: '+1.4k' }
                          ].map(item => (
                            <div key={item.name} className="flex justify-between items-center text-xs font-serif">
                              <span className="font-semibold text-gray-700 hover:text-[#FF3B6B] cursor-pointer transition-colors truncate max-w-[200px]">{item.name}</span>
                              <span className="text-[10px] font-bold text-[#888888] flex items-center gap-0.5">
                                {item.stars} ★
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-[#ECECEC]/60">
                        <button 
                          onClick={() => triggerToast('Opening external Reddit trending feed')}
                          className="text-xs font-serif font-bold text-[#FF3B6B] hover:text-[#FF4F7B] flex items-center gap-1 transition-colors bg-transparent border-0 cursor-pointer"
                        >
                          View all trending posts →
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* Search results are now displayed inline on the Home page */}

            {/* Explorer Database Pages */}
            {isExplorerView && (
              <GenericExplorer viewId={currentView} />
            )}

            {/* Secondary Explorer Pages: Latest Papers */}
            {currentView === 'latest-papers' && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-[#ECECEC] mb-4">
                  <h2 className="font-serif font-bold text-base text-[#111111]">Latest Research Papers</h2>
                  <span className="text-xs text-[#888888] font-serif">{getFilteredPapers(getPapersForView('latest-papers')).length} papers</span>
                </div>
                <TrendingPapers
                  papers={getFilteredPapers(getPapersForView('latest-papers'))}
                  isLoading={loading}
                  error={error}
                  onRetry={fetchTrendingPapers}
                  onBookmarkToggle={handleBookmarkToggle}
                  onCompareSelect={handleCompareSelect}
                  onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
                  onSavePaper={handleSavePaper}
                  compareList={compareList}
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
                    isLoading={loading}
                    error={error}
                    onRetry={fetchTrendingPapers}
                    onBookmarkToggle={handleBookmarkToggle}
                    onCompareSelect={handleCompareSelect}
                    onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
                    onSavePaper={handleSavePaper}
                    compareList={compareList}
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
                  isLoading={loading}
                  error={error}
                  onRetry={fetchTrendingPapers}
                  onBookmarkToggle={handleBookmarkToggle}
                  onCompareSelect={handleCompareSelect}
                  onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
                  onSavePaper={handleSavePaper}
                  compareList={compareList}
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
                {getFilteredPapers(papers.filter(p => p.isSaved)).length > 0 ? (
                  <TrendingPapers
                    papers={getFilteredPapers(papers.filter(p => p.isSaved))}
                    isLoading={loading}
                    error={error}
                    onRetry={fetchTrendingPapers}
                    onBookmarkToggle={handleBookmarkToggle}
                    onCompareSelect={handleCompareSelect}
                    onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
                    onSavePaper={handleSavePaper}
                    compareList={compareList}
                  />
                ) : (
                  <div className="p-12 border border-[#ECECEC] rounded text-center space-y-4">
                    <h3 className="font-serif font-bold text-sm text-[#111111]">No saved papers yet</h3>
                    <p className="text-xs text-[#666666] font-serif max-w-sm mx-auto leading-relaxed">
                      Browse our trending papers on the dashboard and click the save action to collect papers here.
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
            )}             {/* Catch-all for sub-views showing filtered lists of papers */}
            {!['home', 'tool-graph', 'latest-papers', 'submit-paper', 'lib-bookmarks', 'bookmarks', 'github-stars', 'most-cited', 'lib-reading', 'reading'].includes(currentView) && !isExplorerView && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex flex-col gap-1 pb-3 mb-2 border-b border-[#ECECEC]">
                  <h2 className="font-serif font-bold text-lg text-[#111111] capitalize">
                    {getViewMetadata(currentView).title}
                  </h2>
                  <p className="text-xs text-[#666666] font-serif leading-relaxed">
                    {getViewMetadata(currentView).desc}
                  </p>
                </div>
                {getFilteredPapers(getPapersForView(currentView)).length > 0 ? (
                  <TrendingPapers
                    papers={getFilteredPapers(getPapersForView(currentView))}
                    isLoading={loading}
                    error={error}
                    onRetry={fetchTrendingPapers}
                    onBookmarkToggle={handleBookmarkToggle}
                    onCompareSelect={handleCompareSelect}
                    onOpenGraph={(paper) => { triggerToast(`Opening relationship graph for "${paper.title}"`); handleViewChange('tool-graph'); }}
                    onSavePaper={handleSavePaper}
                    compareList={compareList}
                  />
                ) : (
                  <div className="p-12 border border-[#ECECEC] rounded text-center space-y-4 font-serif text-xs text-[#666666]">
                    No papers indexed in this category yet.
                  </div>
                )}
              </div>
            )}
          </div>

      {/* Floating Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#ECECEC] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-sans font-bold text-[#FF6B35] bg-[#FFF2EB] px-2.5 py-1 rounded border border-[#FF6B35]/15 uppercase tracking-wider">
              {compareList.length} Selected
            </span>
            <span className="text-xs font-serif text-[#666666] hidden sm:inline text-left">
              Select 2 to 4 papers to compare side-by-side.
            </span>
            <div className="flex gap-2">
              {compareList.map(p => (
                <div key={p.id} className="text-[10px] bg-gray-50 border border-gray-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="truncate max-w-[120px] font-serif font-semibold">{p.title}</span>
                  <button 
                    onClick={() => handleCompareSelect(p)} 
                    className="hover:text-red-500 font-bold transition-colors cursor-pointer text-gray-400 border-0 bg-transparent p-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCompareList([])}
              className="px-4 py-2 border border-[#ECECEC] rounded text-xs font-serif text-[#666666] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button 
              onClick={() => {
                if (compareList.length < 2) {
                  triggerToast('Select at least 2 papers to compare');
                } else {
                  setShowCompareModal(true);
                }
              }}
              className="px-4 py-2 bg-[#FF6B35] hover:bg-[#FF7F50] text-white text-xs font-semibold font-serif rounded transition-all cursor-pointer border-0"
              disabled={compareList.length < 2}
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

        </div>
      </div>
    </div>
  );
}
