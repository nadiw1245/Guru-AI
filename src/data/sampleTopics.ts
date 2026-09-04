import { TopicSuggestion } from '../types';

export const SAMPLE_TOPICS: TopicSuggestion[] = [
  {
    id: 'ai-what-is-it',
    title: 'What is AI Really? (Magic or Math?)',
    category: 'foundations',
    categoryLabel: 'AI 101 for Beginners',
    prompt: 'Can you explain what Artificial Intelligence actually is to someone who has never worked with computers? Use an everyday analogy like cooking or driving.',
    mode: 'learn',
    icon: 'Sparkles',
    analogyHint: 'Like a master chef who tasted 10 million recipes and instantly knows how to spice a new dish.',
    badge: 'Start Here',
  },
  {
    id: 'ai-how-it-learns',
    title: 'How Does AI Learn? (Training Data)',
    category: 'how_ai_works',
    categoryLabel: 'Machine Learning',
    prompt: 'How does a machine actually "learn"? How is it different from traditional software with rigid rules? Please explain using a simple training analogy.',
    mode: 'learn',
    icon: 'Brain',
    analogyHint: 'Traditional software is a rigid instruction manual; AI is like raising a puppy with treats and gentle corrections.',
    badge: 'Core Concept',
  },
  {
    id: 'ai-tokens-explained',
    title: 'What in the World is a "Token"?',
    category: 'how_ai_works',
    categoryLabel: 'Under the Hood',
    prompt: 'I keep hearing about "tokens" in AI. What are tokens, and why does AI read in tokens instead of regular words?',
    mode: 'analogy',
    icon: 'Layers',
    analogyHint: 'Like syllable puzzle pieces or Scrabble tiles that AI arranges into sentences.',
    badge: 'Popular',
  },
  {
    id: 'ai-llm-how-they-talk',
    title: 'How Do LLMs (ChatGPT & Gemini) Talk?',
    category: 'llm_prompts',
    categoryLabel: 'Generative AI',
    prompt: 'How does a Large Language Model generate sentences? Is it actually thinking or just guessing the next word?',
    mode: 'learn',
    icon: 'MessageSquare',
    analogyHint: 'Like your smartphone keyboard autocomplete, but trained on practically all human books and conversations.',
    badge: 'Essential',
  },
  {
    id: 'ai-prompt-formula',
    title: 'The Magic Prompt Formula (CLEAR)',
    category: 'llm_prompts',
    categoryLabel: 'Prompt Skills',
    prompt: 'Teach me how to write great prompts for any AI tool so I get helpful, accurate answers every single time.',
    mode: 'sandbox',
    icon: 'Sliders',
    analogyHint: 'Giving instructions to a super-smart intern who needs context, clear tasks, and guidelines.',
    badge: 'Practical Skill',
  },
  {
    id: 'ai-hallucinations',
    title: 'Why Does AI Make Things Up? (Hallucinations)',
    category: 'myths',
    categoryLabel: 'AI Safety & Truth',
    prompt: 'Why do AI chatbots sometimes confidently tell lies or make up fake facts (hallucinations)? How can I spot and prevent them?',
    mode: 'analogy',
    icon: 'AlertTriangle',
    analogyHint: 'Like a charismatic storyteller at a dinner party who fills in fuzzy memories with plausible-sounding details.',
    badge: 'Must Know',
  },
  {
    id: 'ai-image-generation',
    title: 'How AI Creates Images & Photos (Diffusion)',
    category: 'creative',
    categoryLabel: 'Creative AI',
    prompt: 'How can AI turn a text description into a realistic photograph or painting? Explain how image models work simply.',
    mode: 'learn',
    icon: 'Image',
    analogyHint: 'Like a sculptor looking at a foggy TV static screen and progressively chiseling away the noise until a clear picture emerges.',
    badge: 'Mind Blowing',
  },
  {
    id: 'ai-myths-facts',
    title: 'Can AI Feel Emotions or Think for Itself?',
    category: 'myths',
    categoryLabel: 'Myths vs Reality',
    prompt: 'My dad is worried AI has consciousness or feelings like a human. Is AI truly conscious? What can it do, and what can it NOT do?',
    mode: 'learn',
    icon: 'ShieldCheck',
    analogyHint: 'A calculator does arithmetic faster than any human, but it has no idea what numbers mean or feel.',
    badge: 'Dad Favorite',
  },
];

export const STUDENT_LEVELS = [
  {
    id: 'dad_beginner',
    label: '👨‍🦳 Dad & Beginner (Zero Jargon)',
    desc: 'Crystal clear, everyday household metaphors, patient & gentle',
  },
  {
    id: 'curious_explorer',
    label: '🎒 Curious Explorer',
    desc: 'Everyday practical applications, smartphone tools, clear examples',
  },
  {
    id: 'hands_on',
    label: '🛠️ Prompt Creator & Practitioner',
    desc: 'Learn how to craft powerful prompts and master AI tools',
  },
  {
    id: 'deep_tech',
    label: '🔬 Deep Tech Curious',
    desc: 'Architectures, neural weights, token embeddings, and technical mechanics',
  },
];

export const QUICK_PROMPTS = [
  'Explain this to me like I am 60 and have never coded',
  'Give me an everyday kitchen or garage analogy for this',
  'What is a practical way I can use this in my daily life?',
  'Why did the AI give this answer instead of something else?',
  'Quiz me with a fun question to check if I got it!',
];

export const QUICK_PROMPTS_ENGLISH = QUICK_PROMPTS;

export const AI_CONCEPT_ANALOGIES = [
  {
    term: 'Large Language Model (LLM)',
    tag: 'Foundations',
    analogy: 'Like an encyclopedic librarian who has read millions of books and can predict the most logical next sentence in a conversation.',
  },
  {
    term: 'Tokens',
    tag: 'Under the Hood',
    analogy: 'Like syllables or puzzle pieces. The word "fantastic" is broken into "fan-tas-tic" so the computer can process it mathematically.',
  },
  {
    term: 'Neural Network',
    tag: 'Architecture',
    analogy: 'Like a busy bakery assembly line where each baker inspects one aspect (smell, shape, crust) before passing it to the next.',
  },
  {
    term: 'Training Data',
    tag: 'Learning',
    analogy: 'Like thousands of past driving hours a student driver reviews with an instructor before getting their license.',
  },
  {
    term: 'Hallucination',
    tag: 'Quirk',
    analogy: 'Like a confident jazz musician improvising notes when they forget the exact sheet music.',
  },
  {
    term: 'Temperature (Creativity)',
    tag: 'Parameter',
    analogy: 'Like how experimental a chef is: Low temperature sticks strictly to grandmother’s recipe; high temperature throws in wild exotic spices.',
  },
];

export const SAMPLE_SANDBOX_PROMPTS = [
  {
    label: 'Email to Doctor / Clinic',
    rawPrompt: 'Write an email to my doctor asking about my prescription refill.',
  },
  {
    label: 'Fixing Squeaky Door',
    rawPrompt: 'How do I fix a squeaking wooden door at home?',
  },
  {
    label: 'Healthy Meal Planning',
    rawPrompt: 'Give me dinner ideas with chicken and broccoli.',
  },
  {
    label: 'Trip Planning for Seniors',
    rawPrompt: 'Plan a 3-day relaxed trip to national parks with minimal walking.',
  },
];
