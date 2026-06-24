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
    upvotes: 412,
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
    upvotes: 287,
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
    upvotes: 521,
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
    upvotes: 198,
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
    upvotes: 167,
    models: ['DreamerV3-RL', 'RSSM'],
    datasets: ['Atari-57', 'Crafter'],
    benchmarks: 'Atari Score: 98.4%',
    impact: '94%',
    velocity: '+45/mo',
    thumbnailBg: 'from-blue-400 to-cyan-600'
  },
  {
    id: '6',
    title: 'GLM-5.2: Built for Long-Horizon Tasks',
    authors: ['GLM Team', 'Z.ai Research'],
    pubDate: 'Jun 16, 2026',
    citations: 30,
    references: 12,
    source: 'arXiv',
    isBookmarked: false,
    category: 'Agents',
    organization: 'Z.ai',
    summary: 'GLM-5.2 is Z.ai\'s latest flagship open-weight model for long-horizon agentic engineering. The release extends GLM-5.1 with a solid 1M-token context, IndexShare sparse-attention efficiency, improved MTP speculative decoding, and flexible thinking-effort controls.',
    stars: 120,
    upvotes: 84,
    models: ['GLM-5.2'],
    datasets: ['AIME 2026', 'HMMT Feb 2026', 'PostTrainBench'],
    benchmarks: 'FrontierSWE: #3',
    impact: '97%',
    velocity: '+20/mo',
    thumbnailBg: 'from-violet-400 to-purple-600'
  },
  {
    id: '7',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
    pubDate: 'Dec 10, 2015',
    citations: 231200,
    references: 120,
    source: 'arXiv',
    isBookmarked: false,
    category: 'Computer Vision',
    organization: 'Microsoft Research',
    summary: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We provide comprehensive empirical evidence showing that these residual networks are easier to optimize.',
    stars: 99100,
    upvotes: 1240,
    models: ['ResNet-152', 'ResNet-50'],
    datasets: ['ImageNet (ILSVRC 2015)', 'COCO 2015'],
    benchmarks: 'ImageNet error: 3.57%',
    impact: '100%',
    velocity: '+1800/mo',
    thumbnailBg: 'from-teal-400 to-emerald-600'
  },
  {
    id: '8',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'et al.'],
    pubDate: 'Jun 12, 2017',
    citations: 180900,
    references: 98,
    source: 'arXiv',
    isBookmarked: false,
    category: 'NLP',
    organization: 'Google Brain',
    summary: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    stars: 78300,
    upvotes: 1890,
    models: ['Transformer-Base', 'Transformer-Big'],
    datasets: ['WMT 2014 En-Fr', 'WMT 2014 En-De'],
    benchmarks: 'EN-DE BLEU: 28.4',
    impact: '100%',
    velocity: '+2100/mo',
    thumbnailBg: 'from-amber-400 to-orange-600'
  },
  {
    id: '9',
    title: 'Generative Adversarial Nets',
    authors: ['Ian J. Goodfellow', 'Jean Pouget-Abadie', 'Mehdi Mirza', 'Bing Xu', 'David Warde-Farley', 'et al.'],
    pubDate: 'Jun 10, 2014',
    citations: 72400,
    references: 64,
    source: 'arXiv',
    isBookmarked: false,
    category: 'Generative AI',
    organization: 'Université de Montréal',
    summary: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data.',
    stars: 32100,
    upvotes: 954,
    models: ['GAN-Base'],
    datasets: ['MNIST', 'CIFAR-10'],
    benchmarks: 'FID score: 4.8',
    impact: '99%',
    velocity: '+850/mo',
    thumbnailBg: 'from-fuchsia-400 to-pink-600'
  },
  {
    id: '10',
    title: 'Llama 3: Open Foundation Models',
    authors: ['Meta AI Llama Team'],
    pubDate: 'Jul 23, 2024',
    citations: 450,
    references: 154,
    source: 'arXiv',
    isBookmarked: false,
    category: 'LLMs',
    organization: 'Meta AI',
    summary: 'We introduce a new suite of open foundation models, Llama 3, which is a collection of pretrained and instruction-tuned generative text models in 8B, 70B, and 405B sizes. Llama 3 instruction-tuned models are optimized for dialogue use cases and outperform open models on benchmarks.',
    stars: 21500,
    upvotes: 680,
    models: ['Llama-3-405B', 'Llama-3-70B', 'Llama-3-8B'],
    datasets: ['Common Crawl', 'RefinedWeb'],
    benchmarks: 'MMLU: 88.6%',
    impact: '98%',
    velocity: '+620/mo',
    thumbnailBg: 'from-blue-500 to-indigo-600'
  }
];

export const topModels: Model[] = [
  {
    id: '1',
    name: 'GPT-5',
    creator: 'OpenAI',
    date: '13 May 2024',
    popularity: 98.5,
    downloads: '5.2M',
    researchMentions: 125000,
    logoColor: 'bg-emerald-500'
  },
  {
    id: '2',
    name: 'Claude 3.5 Sonnet',
    creator: 'Anthropic',
    date: '10 May 2024',
    popularity: 96.4,
    downloads: '4.8M',
    researchMentions: 110000,
    logoColor: 'bg-amber-600'
  },
  {
    id: '3',
    name: 'Gemini 1.5 Pro',
    creator: 'Google DeepMind',
    date: '9 May 2024',
    popularity: 89.1,
    downloads: '3.2M',
    researchMentions: 96000,
    logoColor: 'bg-blue-600'
  },
  {
    id: '4',
    name: 'Qwen3-72B',
    creator: 'Alibaba',
    date: '12 May 2024',
    popularity: 81.2,
    downloads: '2.1M',
    researchMentions: 87000,
    logoColor: 'bg-indigo-500'
  },
  {
    id: '5',
    name: 'DeepSeek-V3',
    creator: 'DeepSeek AI',
    date: '14 May 2024',
    popularity: 92.0,
    downloads: '1.8M',
    researchMentions: 45000,
    logoColor: 'bg-sky-600'
  },
  {
    id: '6',
    name: 'Llama 3.1 405B',
    creator: 'Meta AI',
    date: '15 May 2024',
    popularity: 94.5,
    downloads: '1.9M',
    researchMentions: 98000,
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
    name: 'Anthropic',
    papersCount: '987 papers',
    citationsCount: '45K citations',
    logoBg: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    rank: 3,
    name: 'Google DeepMind',
    papersCount: '2,102 papers',
    citationsCount: '96K citations',
    logoBg: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    rank: 4,
    name: 'Meta AI',
    papersCount: '1,876 papers',
    citationsCount: '87K citations',
    logoBg: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  {
    rank: 5,
    name: 'Microsoft Research',
    papersCount: '1,234 papers',
    citationsCount: '56K citations',
    logoBg: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    rank: 6,
    name: 'Mistral AI',
    papersCount: '624 papers',
    citationsCount: '18K citations',
    logoBg: 'bg-violet-100 text-violet-800 border-violet-200'
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
  { id: 'fd5', name: 'GPQA', size: '25 MB', domain: 'Advanced Reasoning', impact: 'Emerging', desc: 'Graduate-level biology, chemistry, and physics questions designed by experts.', logoBg: 'from-violet-500/10 to-indigo-600/20' },
  { id: 'fd6', name: 'HumanEval', size: '1.5 MB', domain: 'Coding / Dev', impact: 'High', desc: 'Handcrafted coding questions to measure functional correctness of python code.', logoBg: 'from-red-500/10 to-orange-600/20' }
];

export const benchmarkLeaderboard: BenchmarkLeaderboardItem[] = [
  { id: 'bl1', name: 'MMLU (General)', leader: 'GPT-5', score: '88.7%', metric: 'Accuracy (5-Shot)', totalModels: 142 },
  { id: 'bl2', name: 'GPQA (Advanced QA)', leader: 'Claude 3.5 Sonnet', score: '65.2%', metric: 'Accuracy (0-Shot)', totalModels: 86 },
  { id: 'bl3', name: 'HumanEval (Coding)', leader: 'Claude 3.5 Sonnet', score: '92.0%', metric: 'Pass@1', totalModels: 110 },
  { id: 'bl4', name: 'SWE Bench (Eng)', leader: 'GPT-5 (Agentic)', score: '27.3%', metric: 'Task Solve %', totalModels: 42 },
  { id: 'bl5', name: 'ARC AGI (Reasoning)', leader: 'Claude 3.5 Sonnet', score: '52.4%', metric: 'Accuracy', totalModels: 58 }
];

export const modelRankings: ModelRanking[] = [
  { rank: 1, name: 'GPT-5', creator: 'OpenAI', downloads: '5.2M', popularity: '98.5%', growth: '+18%', logoColor: 'bg-emerald-500' },
  { rank: 2, name: 'Claude 3.5 Sonnet', creator: 'Anthropic', downloads: '4.8M', popularity: '96.4%', growth: '+24%', logoColor: 'bg-amber-600' },
  { rank: 3, name: 'Gemini 1.5 Pro', creator: 'Google DeepMind', downloads: '3.2M', popularity: '89.1%', growth: '+15%', logoColor: 'bg-blue-600' },
  { rank: 4, name: 'Qwen3-72B', creator: 'Alibaba', downloads: '2.1M', popularity: '81.2%', growth: '+32%', logoColor: 'bg-indigo-500' },
  { rank: 5, name: 'DeepSeek-V3', creator: 'DeepSeek AI', downloads: '1.8M', popularity: '92.0%', growth: '+45%', logoColor: 'bg-sky-600' },
  { rank: 6, name: 'Llama 3.1 405B', creator: 'Meta AI', downloads: '1.9M', popularity: '94.5%', growth: '+20%', logoColor: 'bg-sky-500' }
];

export const latestActivityFeed: ActivityFeedItem[] = [
  { id: 'af1', type: 'paper', title: 'Understanding World Models published', description: 'Yann LeCun published a new paper introducing JEPA scaling updates.', timeAgo: '2h ago', user: 'Yann LeCun' },
  { id: 'af2', type: 'model', title: 'DeepSeek-V3 Open Weights released', description: 'DeepSeek AI released its 671B parameter Mixture-of-Experts model.', timeAgo: '4h ago', user: 'DeepSeek AI' },
  { id: 'af3', type: 'benchmark', title: 'MMLU evaluation updated for Qwen3', description: 'Official benchmark score recorded at 89.2% on standard 5-shot.', timeAgo: '6h ago', user: 'Alibaba Cloud' },
  { id: 'af4', type: 'alert', title: 'Citation spike warning: GROOT N1', description: 'GROOT N1 citations spiked (+40% velocity) following robotics hardware tests.', timeAgo: '8h ago', user: 'System Agent' }
];
