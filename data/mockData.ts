import { Paper, Model, Entity, Signal, Topic, Lab, FollowUpdate, DatasetItem, BenchmarkLeaderboardItem, ModelRanking, ActivityFeedItem } from '@/types';

export const trendingPapers: Paper[] = [
  {
    id: '1',
    title: 'GROOT N1: An Open Foundation Model for Generalist Humanoid Robots',
    authors: ['J. Achiam', 'S. Adler', 'S. Agarwal', 'L. Zhang', 'et al.'],
    pubDate: '15 May 2024',
    citations: 1200,
    references: 85,
    source: 'arXiv',
    isBookmarked: false,
    category: 'Robotics',
    organization: 'OpenAI & Figure',
    summary: 'Introduces an end-to-end foundation model for humanoid robot control. Demonstrates zero-shot transfer for physical tasks and adaptive pathing in real-time.',
    stars: 2400,
    models: ['GROOT-Base', 'CLIP-ViT'],
    datasets: ['RoboNet v2', 'Ego4D'],
    benchmarks: 'Task Success: 94%',
    impact: '98%',
    velocity: '+145/mo',
    thumbnailBg: 'from-orange-400 to-amber-600'
  },
  {
    id: '2',
    title: 'Scaling Laws for LLMs: The Compute-Optimal Frontier',
    authors: ['J. Hoffmann', 'S. Adler', 'M. Moradi', 'A. Roberts', 'et al.'],
    pubDate: '14 May 2024',
    citations: 987,
    references: 42,
    source: 'arXiv',
    isBookmarked: true,
    category: 'LLMs',
    organization: 'Google DeepMind',
    summary: 'Re-evaluates scaling parameters of large autoregressive models, proving that compute-optimal models require training on more data rather than just increasing parameters.',
    stars: 1800,
    models: ['Chinchilla-70B', 'Gopher'],
    datasets: ['MassiveText', 'C4'],
    benchmarks: 'MMLU: 67.5%',
    impact: '99%',
    velocity: '+280/mo',
    thumbnailBg: 'from-emerald-400 to-teal-600'
  },
  {
    id: '3',
    title: 'Qwen3 Technical Report',
    authors: ['Qwen Team'],
    pubDate: '13 May 2024',
    citations: 756,
    references: 31,
    source: 'arXiv',
    isBookmarked: false,
    category: 'LLMs',
    organization: 'Alibaba Cloud',
    summary: 'Presents a technical report on the Qwen3 suite, outlining data preprocessing pipelines, RLHF methodology, and cross-lingual alignment architectures.',
    stars: 3200,
    models: ['Qwen3-72B-Chat', 'Qwen3-VL'],
    datasets: ['Qwen-WebText', 'RefinedWeb'],
    benchmarks: 'GSM8k: 89.2%',
    impact: '95%',
    velocity: '+312/mo',
    thumbnailBg: 'from-indigo-400 to-purple-600'
  },
  {
    id: '4',
    title: 'VideoLLaMA 3: Frontier Multimodal Foundation Models for Video Generation',
    authors: ['Z. He', 'Y. Wang', 'Y. Li', 'et al.'],
    pubDate: '12 May 2024',
    citations: 612,
    references: 28,
    source: 'arXiv',
    isBookmarked: false,
    category: 'Multimodal',
    organization: 'Meta AI & DAMO Lab',
    summary: 'A specialized multimodal foundation model for spatial-temporal video understanding. Integrates visual features into a LLM tokenizer to enable raw sequence reasoning.',
    stars: 1500,
    models: ['VideoLLaMA-3-8B', 'Llama 3'],
    datasets: ['Video-CC3M', 'ActivityNet'],
    benchmarks: 'Video-MME: 56.4%',
    impact: '92%',
    velocity: '+98/mo',
    thumbnailBg: 'from-rose-400 to-pink-600'
  },
  {
    id: '5',
    title: 'DreamerV3: Towards General World Models via Video Generation',
    authors: ['D. Hafner', 'T. Lillicrap', 'J. Ba', 'et al.'],
    pubDate: '11 May 2024',
    citations: 532,
    references: 19,
    source: 'arXiv',
    isBookmarked: false,
    category: 'Reinforcement Learning',
    organization: 'Google DeepMind',
    summary: 'Presents a world model reinforcement learning agent that scales successfully to diverse tasks without tuning hyperparameters. Achieves superhuman Atari scores.',
    stars: 920,
    models: ['DreamerV3-RL', 'RSSM'],
    datasets: ['Atari-57', 'Crafter'],
    benchmarks: 'Atari Score: 98.4%',
    impact: '94%',
    velocity: '+45/mo',
    thumbnailBg: 'from-blue-400 to-cyan-600'
  }
];

export const topModels: Model[] = [
  {
    id: '1',
    name: 'GPT-4o',
    creator: 'OpenAI',
    date: '13 May 2024',
    popularity: 98.5,
    downloads: '5.2M',
    researchMentions: 125000,
    logoColor: 'bg-emerald-500'
  },
  {
    id: '2',
    name: 'Qwen3-72B',
    creator: 'Alibaba',
    date: '12 May 2024',
    popularity: 72.1,
    downloads: '3.1M',
    researchMentions: 87000,
    logoColor: 'bg-indigo-500'
  },
  {
    id: '3',
    name: 'Claude 3.5 Sonnet',
    creator: 'Anthropic',
    date: '10 May 2024',
    popularity: 56.3,
    downloads: '2.7M',
    researchMentions: 45000,
    logoColor: 'bg-amber-600'
  },
  {
    id: '4',
    name: 'Gemini 1.5 Pro',
    creator: 'Google DeepMind',
    date: '9 May 2024',
    popularity: 45.6,
    downloads: '2.1M',
    researchMentions: 96000,
    logoColor: 'bg-blue-600'
  },
  {
    id: '5',
    name: 'Llama 3 70B',
    creator: 'Meta AI',
    date: '8 May 2024',
    popularity: 38.9,
    downloads: '1.8M',
    researchMentions: 87000,
    logoColor: 'bg-sky-500'
  }
];

export const browseEntities: Entity[] = [
  {
    name: 'Authors',
    count: '1.1M+',
    iconName: 'Users',
    trendData: [10, 15, 23, 20, 28, 35, 42, 50, 48, 55],
    colorScheme: 'orange',
    path: '/authors'
  },
  {
    name: 'Labs',
    count: '12K+',
    iconName: 'FlaskConical',
    trendData: [30, 28, 32, 38, 42, 39, 45, 52, 60, 58],
    colorScheme: 'pink',
    path: '/labs'
  },
  {
    name: 'Universities',
    count: '5.2K+',
    iconName: 'GraduationCap',
    trendData: [20, 22, 21, 25, 28, 31, 35, 33, 40, 42],
    colorScheme: 'indigo',
    path: '/universities'
  },
  {
    name: 'Models',
    count: '8.6K+',
    iconName: 'Cpu',
    trendData: [5, 12, 18, 25, 32, 45, 58, 65, 78, 92],
    colorScheme: 'blue',
    path: '/models'
  },
  {
    name: 'Datasets',
    count: '15K+',
    iconName: 'Database',
    trendData: [15, 18, 20, 24, 28, 30, 35, 41, 48, 52],
    colorScheme: 'emerald',
    path: '/datasets'
  },
  {
    name: 'Benchmarks',
    count: '2.3K+',
    iconName: 'BarChart3',
    trendData: [8, 12, 15, 14, 18, 22, 25, 28, 30, 35],
    colorScheme: 'green',
    path: '/benchmarks'
  },
  {
    name: 'Tasks',
    count: '1.2K+',
    iconName: 'Briefcase',
    trendData: [25, 27, 26, 29, 32, 30, 33, 37, 40, 41],
    colorScheme: 'amber',
    path: '/tasks'
  },
  {
    name: 'Repositories',
    count: '1.7M+',
    iconName: 'Code2',
    trendData: [12, 18, 24, 30, 36, 42, 50, 58, 64, 72],
    colorScheme: 'cyan',
    path: '/repositories'
  },
  {
    name: 'Conferences',
    count: '98+',
    iconName: 'Calendar',
    trendData: [50, 48, 52, 55, 53, 57, 59, 62, 60, 65],
    colorScheme: 'rose',
    path: '/conferences'
  }
];

export const researchSignals: Signal[] = [
  { id: '1', title: 'Novel Papers', value: 142, changePct: 18, trend: 'up' },
  { id: '2', title: 'High Impact', value: 37, changePct: 22, trend: 'up' },
  { id: '3', title: 'Fast Rising', value: 26, changePct: 35, trend: 'up' },
  { id: '4', title: 'New Models', value: 12, changePct: 25, trend: 'up' }
];

export const trendingTopics: Topic[] = [
  {
    rank: 1,
    name: 'Large Language Models',
    paperCount: '2,341 papers',
    changePct: 23,
    trendData: [15, 18, 22, 28, 35, 41, 48, 55, 62, 70]
  },
  {
    rank: 2,
    name: 'AI Agents',
    paperCount: '1,876 papers',
    changePct: 28,
    trendData: [10, 12, 16, 22, 27, 34, 42, 50, 58, 68]
  },
  {
    rank: 3,
    name: 'Multimodal Learning',
    paperCount: '1,234 papers',
    changePct: 16,
    trendData: [20, 22, 25, 24, 28, 31, 35, 38, 42, 48]
  },
  {
    rank: 4,
    name: 'Diffusion Models',
    paperCount: '987 papers',
    changePct: 12,
    trendData: [35, 36, 38, 37, 40, 42, 45, 43, 47, 50]
  },
  {
    rank: 5,
    name: 'Reinforcement Learning',
    paperCount: '765 papers',
    changePct: 10,
    trendData: [25, 26, 28, 27, 29, 31, 30, 32, 33, 35]
  }
];

export const topLabs: Lab[] = [
  {
    rank: 1,
    name: 'OpenAI',
    papersCount: '2,341 papers',
    citationsCount: '125K citations',
    logoBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    rank: 2,
    name: 'Google DeepMind',
    papersCount: '2,102 papers',
    citationsCount: '96K citations',
    logoBg: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    rank: 3,
    name: 'Meta AI',
    papersCount: '1,876 papers',
    citationsCount: '87K citations',
    logoBg: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  {
    rank: 4,
    name: 'Microsoft Research',
    papersCount: '1,234 papers',
    citationsCount: '56K citations',
    logoBg: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    rank: 5,
    name: 'Anthropic',
    papersCount: '987 papers',
    citationsCount: '45K citations',
    logoBg: 'bg-orange-100 text-orange-800 border-orange-200'
  }
];

export const followUpdates: FollowUpdate[] = [
  {
    id: 'u1',
    researcherName: 'Yann LeCun',
    actionText: 'published a new paper',
    targetName: 'Understanding World Models',
    timeAgo: '2h ago',
    type: 'paper'
  },
  {
    id: 'u2',
    researcherName: 'OpenAI',
    actionText: 'released a new model',
    targetName: 'GPT-4o-mini',
    timeAgo: '5h ago',
    type: 'model'
  },
  {
    id: 'u3',
    researcherName: 'Zheng Zhang',
    actionText: 'starred a repository',
    targetName: 'OpenRLHF',
    timeAgo: '7h ago',
    type: 'repository'
  }
];

export const featuredDatasets: DatasetItem[] = [
  { id: 'fd1', name: 'ImageNet', size: '150 GB', domain: 'Computer Vision', impact: 'High', desc: 'Curated database of 14M+ images with manual bounding boxes and labels.', logoBg: 'from-orange-500/10 to-primary/20' },
  { id: 'fd2', name: 'The Pile', size: '825 GB', domain: 'Language Modeling', impact: 'High', desc: 'Diverse, open-source English language dataset for training large models.', logoBg: 'from-emerald-500/10 to-teal-600/20' },
  { id: 'fd3', name: 'Common Crawl', size: 'Petabytes', domain: 'Web Corpus', impact: 'Critical', desc: 'Massive repository of raw web page data gathered over 12+ years.', logoBg: 'from-blue-500/10 to-sky-600/20' },
  { id: 'fd4', name: 'MMLU', size: '1.2 GB', domain: 'General Knowledge', impact: 'High', desc: '57 subjects covering humanities, STEM, social sciences, and more.', logoBg: 'from-pink-500/10 to-rose-600/20' },
  { id: 'fd5', name: 'GPQA', size: '25 MB', domain: 'Advanced Reasoning', impact: 'Emerging', desc: 'Graduate-level biology, chemistry, and physics questions designed by experts.', logoBg: 'from-violet-500/10 to-indigo-600/20' }
];

export const benchmarkLeaderboard: BenchmarkLeaderboardItem[] = [
  { id: 'bl1', name: 'MMLU (General)', leader: 'GPT-4o', score: '88.7%', metric: 'Accuracy (5-Shot)', totalModels: 142 },
  { id: 'bl2', name: 'GPQA (Advanced QA)', leader: 'Claude 3.5 Sonnet', score: '65.2%', metric: 'Accuracy (0-Shot)', totalModels: 86 },
  { id: 'bl3', name: 'HumanEval (Coding)', leader: 'Claude 3.5 Sonnet', score: '92.0%', metric: 'Pass@1', totalModels: 110 },
  { id: 'bl4', name: 'SWE Bench (Eng)', leader: 'GPT-4o (Agentic)', score: '27.3%', metric: 'Task Solve %', totalModels: 42 },
  { id: 'bl5', name: 'ARC AGI (Reasoning)', leader: 'Claude 3.5 Sonnet', score: '52.4%', metric: 'Accuracy', totalModels: 58 }
];

export const modelRankings: ModelRanking[] = [
  { rank: 1, name: 'GPT-4o', creator: 'OpenAI', downloads: '5.2M', popularity: '98.5%', growth: '+18%', logoColor: 'bg-emerald-500' },
  { rank: 2, name: 'Claude 3.5 Sonnet', creator: 'Anthropic', downloads: '4.8M', popularity: '96.4%', growth: '+24%', logoColor: 'bg-amber-600' },
  { rank: 3, name: 'Gemini 1.5 Pro', creator: 'Google DeepMind', downloads: '3.2M', popularity: '89.1%', growth: '+15%', logoColor: 'bg-blue-600' },
  { rank: 4, name: 'Qwen3-72B', creator: 'Alibaba', downloads: '2.1M', popularity: '81.2%', growth: '+32%', logoColor: 'bg-indigo-500' },
  { rank: 5, name: 'DeepSeek-V3', creator: 'DeepSeek AI', downloads: '1.8M', popularity: '92.0%', growth: '+45%', logoColor: 'bg-sky-600' }
];

export const latestActivityFeed: ActivityFeedItem[] = [
  { id: 'af1', type: 'paper', title: 'Understanding World Models published', description: 'Yann LeCun published a new paper introducing JEPA scaling updates.', timeAgo: '2h ago', user: 'Yann LeCun' },
  { id: 'af2', type: 'model', title: 'DeepSeek-V3 Open Weights released', description: 'DeepSeek AI released its 671B parameter Mixture-of-Experts model.', timeAgo: '4h ago', user: 'DeepSeek AI' },
  { id: 'af3', type: 'benchmark', title: 'MMLU evaluation updated for Qwen3', description: 'Official benchmark score recorded at 89.2% on standard 5-shot.', timeAgo: '6h ago', user: 'Alibaba Cloud' },
  { id: 'af4', type: 'alert', title: 'Citation spike warning: GROOT N1', description: 'GROOT N1 citations spiked (+40% velocity) following robotics hardware tests.', timeAgo: '8h ago', user: 'System Agent' }
];
