import { TopicSuggestion } from '../types';

export const SAMPLE_TOPICS: TopicSuggestion[] = [
  {
    id: 'it-recursion',
    title: 'Recursion in Programming',
    category: 'it',
    categoryLabel: 'Computer Science',
    prompt: 'Can you teach me what Recursion is in programming using a simple, relatable everyday analogy?',
    mode: 'concept',
    icon: 'Code2',
    analogyHint: 'Like Russian nesting dolls or standing between two parallel mirrors.',
  },
  {
    id: 'it-api',
    title: 'How APIs Work',
    category: 'it',
    categoryLabel: 'Computer Science',
    prompt: 'Explain what an API (Application Programming Interface) is using an everyday real-world analogy.',
    mode: 'concept',
    icon: 'Layers',
    analogyHint: 'Like a restaurant waiter delivering orders between your table and the kitchen.',
  },
  {
    id: 'science-photosynthesis',
    title: 'Photosynthesis Process',
    category: 'science',
    categoryLabel: 'Biology',
    prompt: 'Can you explain the process of photosynthesis using a cooking or baking recipe analogy?',
    mode: 'concept',
    icon: 'Leaf',
    analogyHint: 'Like a solar-powered bakery mixing sunlight, water from roots, and carbon dioxide from air to bake sugar loaves.',
  },
  {
    id: 'physics-newton3',
    title: "Newton's 3rd Law of Motion",
    category: 'physics',
    categoryLabel: 'Physics',
    prompt: 'Explain Newton’s Third Law ("For every action, there is an equal and opposite reaction") using skateboarding or jumping off a boat.',
    mode: 'concept',
    icon: 'Zap',
    analogyHint: 'Like jumping off a small canoe and watching the boat push backward as you leap forward.',
  },
  {
    id: 'math-assignment-quad',
    title: 'Solve Quadratic: x² - 5x + 6 = 0',
    category: 'math',
    categoryLabel: 'Algebra Assignment',
    prompt: 'I need help solving this quadratic equation for homework: x² - 5x + 6 = 0. Please do not give me the answer; guide me step-by-step with Socratic questions!',
    mode: 'assignment',
    icon: 'HelpCircle',
    analogyHint: 'Finding two numbers that multiply to give 6 and add up to -5.',
  },
  {
    id: 'science-assignment-density',
    title: 'Why Steel Ships Float vs. Nails Sink',
    category: 'science',
    categoryLabel: 'Physics Assignment',
    prompt: 'Here is my assignment question: "A small iron nail sinks in water, but a huge ship made of tons of steel floats easily. Why?" Ask me guiding questions so I can deduce the answer myself.',
    mode: 'assignment',
    icon: 'HelpCircle',
    analogyHint: 'Exploring density, volume, and displaced water weight.',
  },
  {
    id: 'econ-inflation',
    title: 'What Causes Inflation?',
    category: 'economics',
    categoryLabel: 'Economics',
    prompt: 'Explain what Inflation is and why money loses purchasing power over time using an everyday story.',
    mode: 'concept',
    icon: 'TrendingUp',
    analogyHint: 'Like an arcade where too many tokens are printed, making the prizes require more tokens to claim.',
  },
  {
    id: 'it-cloud-computing',
    title: 'Cloud Computing Architecture',
    category: 'it',
    categoryLabel: 'Technology',
    prompt: 'What is Cloud Computing? Explain it simply using an analogy like the municipal electric grid or clean running water.',
    mode: 'concept',
    icon: 'Cloud',
    analogyHint: 'Instead of building your own private power generator, you plug into the city electric grid on demand.',
  },
];

export const STUDENT_LEVELS = [
  { id: 'beginner', label: 'General / Beginner Friendly', desc: 'Simple, intuitive, zero jargon' },
  { id: 'elementary', label: 'Elementary / Middle School', desc: 'Grades 5–8 conceptual foundation' },
  { id: 'high_school', label: 'High School / AP Level', desc: 'Structured rigor with clear mechanics' },
  { id: 'university', label: 'College / University', desc: 'Deep technical nuance & principles' },
];

export const QUICK_PROMPTS = [
  'Explain with another everyday analogy',
  'Is my reasoning and answer correct?',
  'Give me a gentle hint for the next step',
  'How is this concept applied in real life?',
  'Quiz me with a thought question to test my understanding',
];

export const QUICK_PROMPTS_ENGLISH = QUICK_PROMPTS;


