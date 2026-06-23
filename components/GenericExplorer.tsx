'use client';

import React, { useState } from 'react';
import { Search, ArrowUpDown, Cpu, Database, Award, Users, Landmark, Flame } from 'lucide-react';

interface ExplorerItem {
  id: string;
  name: string;
  creatorOrOrg: string;
  metricLabel: string;
  metricValue: string;
  tag: string;
  dateOrSpec: string;
}

interface GenericExplorerProps {
  viewId: string;
}

export default function GenericExplorer({ viewId }: GenericExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'value'>('name');

  // Multi-domain mock database
  const database: Record<string, { title: string; desc: string; icon: React.ComponentType<{ size?: number; className?: string }>; items: ExplorerItem[] }> = {
    'models': {
      title: 'Model Explorer',
      desc: 'Browse and track State-of-the-Art foundation and reasoning models',
      icon: Cpu,
      items: [
        { id: 'm1', name: 'GPT-4o', creatorOrOrg: 'OpenAI', metricLabel: 'Parameters / Context', metricValue: 'Multi-Modal / 128K', tag: 'Reasoning', dateOrSpec: 'May 2024' },
        { id: 'm2', name: 'Claude 3.5 Sonnet', creatorOrOrg: 'Anthropic', metricLabel: 'Parameters / Context', metricValue: 'Dense / 200K', tag: 'Coding & Analysis', dateOrSpec: 'Jun 2024' },
        { id: 'm3', name: 'Gemini 1.5 Pro', creatorOrOrg: 'Google DeepMind', metricLabel: 'Parameters / Context', metricValue: 'MoE / 2M Context', tag: 'Multimodal Long-Context', dateOrSpec: 'May 2024' },
        { id: 'm4', name: 'Qwen3-72B', creatorOrOrg: 'Alibaba Cloud', metricLabel: 'Parameters / Context', metricValue: '72B Dense / 32K', tag: 'Multimodal & Code', dateOrSpec: 'May 2024' },
        { id: 'm5', name: 'Llama 3 70B', creatorOrOrg: 'Meta AI', metricLabel: 'Parameters / Context', metricValue: '70B Dense / 8K', tag: 'Open Weights', dateOrSpec: 'Apr 2024' },
        { id: 'm6', name: 'Mistral Large 2', creatorOrOrg: 'Mistral AI', metricLabel: 'Parameters / Context', metricValue: '123B Dense / 128K', tag: 'Multilingual', dateOrSpec: 'Jul 2024' }
      ]
    },
    'datasets': {
      title: 'Dataset Registry',
      desc: 'Discover training corpora, instruction-tuning caches, and multimodal logs',
      icon: Database,
      items: [
        { id: 'd1', name: 'RoboNet v2', creatorOrOrg: 'Berkeley Robotics', metricLabel: 'File Size / Samples', metricValue: '4.2 TB / 1.2M trials', tag: 'Humanoid Control', dateOrSpec: 'Jan 2024' },
        { id: 'd2', name: 'Ego4D', creatorOrOrg: 'Meta & Consortium', metricLabel: 'File Size / Samples', metricValue: '12 TB / 3,000 hrs video', tag: 'First-Person Video', dateOrSpec: 'Nov 2023' },
        { id: 'd3', name: 'MassiveText', creatorOrOrg: 'Google DeepMind', metricLabel: 'File Size / Samples', metricValue: '8 TB / 3.4T tokens', tag: 'Pretraining Corpus', dateOrSpec: 'Mar 2022' },
        { id: 'd4', name: 'RefinedWeb', creatorOrOrg: 'TII UAE', metricLabel: 'File Size / Samples', metricValue: '2.8 TB / 900B tokens', tag: 'Web Crawl Filtered', dateOrSpec: 'Jun 2023' },
        { id: 'd5', name: 'Atari-57 RL Logs', creatorOrOrg: 'DeepMind', metricLabel: 'File Size / Samples', metricValue: '450 GB / 50M steps', tag: 'Reinforcement Learning', dateOrSpec: 'Dec 2023' }
      ]
    },
    'benchmarks': {
      title: 'Benchmarks & Evaluation Grid',
      desc: 'Verify model capabilities against standard and custom AI stress tests',
      icon: Award,
      items: [
        { id: 'b1', name: 'MMLU (Massive Multitask)', creatorOrOrg: 'UC Berkeley', metricLabel: 'SOTA Leader', metricValue: '91.2% (GPT-4o)', tag: 'General Knowledge', dateOrSpec: '57 subjects' },
        { id: 'b2', name: 'GSM8k (Grade School Math)', creatorOrOrg: 'OpenAI', metricLabel: 'SOTA Leader', metricValue: '98.5% (Claude 3.5)', tag: 'Math Reasoning', dateOrSpec: '8.5K problems' },
        { id: 'b3', name: 'HumanEval (Coding)', creatorOrOrg: 'OpenAI', metricLabel: 'SOTA Leader', metricValue: '94.2% (Claude 3.5)', tag: 'Code Synthesis', dateOrSpec: '164 challenges' },
        { id: 'b4', name: 'Video-MME (Multimodal)', creatorOrOrg: 'DAMO Lab', metricLabel: 'SOTA Leader', metricValue: '61.2% (Gemini 1.5)', tag: 'Video Reasoning', dateOrSpec: '3.2K videos' },
        { id: 'b5', name: 'Chatbot Arena (Elo)', creatorOrOrg: 'LMSYS Org', metricLabel: 'SOTA Leader', metricValue: '1310 Elo (GPT-4o)', tag: 'Human Preferences', dateOrSpec: 'Blind A/B test' }
      ]
    },
    'authors': {
      title: 'Researcher Profiles',
      desc: 'Explore authors, citation maps, and release timelines of key researchers',
      icon: Users,
      items: [
        { id: 'a1', name: 'Yann LeCun', creatorOrOrg: 'Meta & NYU', metricLabel: 'Citations / h-index', metricValue: '280K citations / 185 h-index', tag: 'World Models', dateOrSpec: 'Turing Award' },
        { id: 'a2', name: 'Andrej Karpathy', creatorOrOrg: 'Eureka Labs (ex-Tesla)', metricLabel: 'Citations / h-index', metricValue: '42K citations / 62 h-index', tag: 'Deep Learning', dateOrSpec: 'Stanford CS231n' },
        { id: 'a3', name: 'Ilya Sutskever', creatorOrOrg: 'Safe Superintelligence', metricLabel: 'Citations / h-index', metricValue: '190K citations / 120 h-index', tag: 'Alignment & LLM', dateOrSpec: 'ex-OpenAI co-founder' },
        { id: 'a4', name: 'Fei-Fei Li', creatorOrOrg: 'Stanford University', metricLabel: 'Citations / h-index', metricValue: '160K citations / 145 h-index', tag: 'Computer Vision', dateOrSpec: 'ImageNet founder' },
        { id: 'a5', name: 'Demis Hassabis', creatorOrOrg: 'Google DeepMind', metricLabel: 'Citations / h-index', metricValue: '72K citations / 95 h-index', tag: 'Deep RL & Biotech', dateOrSpec: 'AlphaFold lead' }
      ]
    },
    'organizations': {
      title: 'Organizations & Research Labs',
      desc: 'Browse academic and corporate research bodies funding artificial intelligence',
      icon: Landmark,
      items: [
        { id: 'o1', name: 'OpenAI', creatorOrOrg: 'San Francisco, CA', metricLabel: 'Key Outputs', metricValue: 'GPT series, Sora, DALL-E', tag: 'Commercial Lab', dateOrSpec: 'Founded 2015' },
        { id: 'o2', name: 'Google DeepMind', creatorOrOrg: 'London, UK & Mountain View', metricLabel: 'Key Outputs', metricValue: 'Gemini, AlphaFold, AlphaGo', tag: 'Corporate Lab', dateOrSpec: 'Merged 2023' },
        { id: 'o3', name: 'Meta AI Research (FAIR)', creatorOrOrg: 'Menlo Park, CA', metricLabel: 'Key Outputs', metricValue: 'Llama weights, Segment Anything', tag: 'Open weights Lab', dateOrSpec: 'Founded 2013' },
        { id: 'o4', name: 'Stanford HAI', creatorOrOrg: 'Stanford, CA', metricLabel: 'Key Outputs', metricValue: 'HELM evaluations, Core NLP', tag: 'Academic Institution', dateOrSpec: 'Founded 2019' },
        { id: 'o5', name: 'Anthropic', creatorOrOrg: 'San Francisco, CA', metricLabel: 'Key Outputs', metricValue: 'Claude model suite, Constitutional AI', tag: 'Safety Research Benefit', dateOrSpec: 'Founded 2021' }
      ]
    }
  };

  const defaultMeta = {
    title: 'Explorer Panel',
    desc: 'Deep exploration of index records',
    icon: Flame,
    items: [
      { id: 'g1', name: `${viewId.charAt(0).toUpperCase() + viewId.slice(1)} Node 1`, creatorOrOrg: 'AI Hub Index', metricLabel: 'Active Publications', metricValue: '124 papers indexed', tag: 'General', dateOrSpec: 'Updated today' },
      { id: 'g2', name: `${viewId.charAt(0).toUpperCase() + viewId.slice(1)} Node 2`, creatorOrOrg: 'AI Hub Index', metricLabel: 'Active Publications', metricValue: '85 papers indexed', tag: 'Research Area', dateOrSpec: 'Updated 2d ago' },
      { id: 'g3', name: `${viewId.charAt(0).toUpperCase() + viewId.slice(1)} Node 3`, creatorOrOrg: 'AI Hub Index', metricLabel: 'Active Publications', metricValue: '56 papers indexed', tag: 'Methodology', dateOrSpec: 'Updated 3d ago' }
    ]
  };

  const viewData = database[viewId] || defaultMeta;
  const ViewIcon = viewData.icon;

  const filteredItems = viewData.items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creatorOrOrg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return b.metricValue.localeCompare(a.metricValue);
    }
  });

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-sm border border-border-warm bg-card w-full text-left">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-border-warm gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/5 text-primary border border-primary/10">
            <ViewIcon size={24} />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-text-primary tracking-tight">{viewData.title}</h2>
            <p className="text-xs text-text-secondary leading-snug">{viewData.desc}</p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
            <ArrowUpDown size={10} />
            Sort By
          </span>
          <button
            onClick={() => setSortBy('name')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              sortBy === 'name' ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' : 'bg-card text-text-secondary border-border-warm hover:border-primary/30'
            }`}
          >
            Name
          </button>
          <button
            onClick={() => setSortBy('value')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              sortBy === 'value' ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' : 'bg-card text-text-secondary border-border-warm hover:border-primary/30'
            }`}
          >
            Metric Value
          </button>
        </div>
      </div>

      {/* Explorer Search inside pane */}
      <div className="relative flex items-center w-full max-w-md my-5 group">
        <div className="absolute left-3.5 text-text-secondary/70 group-focus-within:text-primary transition-colors">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder={`Filter ${viewData.title.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-border-warm bg-card text-text-primary text-xs shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-border-warm/80"
        />
      </div>

      {/* Database Grid */}
      {sortedItems.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border-warm rounded-2xl">
          <p className="text-xs text-text-secondary font-semibold">No results match your search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-border-warm bg-accent/5 hover:bg-accent/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-text-secondary font-bold">{item.dateOrSpec}</span>
                </div>
                
                <h4 className="font-extrabold text-sm text-text-primary leading-snug truncate">
                  {item.name}
                </h4>
                
                <p className="text-[10px] font-semibold text-text-secondary mt-1">
                  Origin: <span className="text-text-primary/80">{item.creatorOrOrg}</span>
                </p>
              </div>

              {/* Metric spec */}
              <div className="mt-4 pt-4 border-t border-border-warm/50 flex flex-col">
                <span className="text-[8px] font-bold text-text-secondary uppercase tracking-wider leading-none">
                  {item.metricLabel}
                </span>
                <span className="text-xs font-extrabold text-text-primary mt-1 block leading-none">
                  {item.metricValue}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
