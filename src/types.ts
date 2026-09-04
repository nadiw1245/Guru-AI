export type TutorMode = 'learn' | 'sandbox' | 'analogy' | 'quiz' | 'concept' | 'assignment';

export type StudentLevel =
  | 'dad_beginner'
  | 'curious_explorer'
  | 'hands_on'
  | 'deep_tech'
  | 'beginner'
  | 'elementary'
  | 'high_school'
  | 'university';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  mode?: TutorMode;
  isGuidingQuestion?: boolean;
  conceptMetadata?: {
    topic?: string;
    analogyTitle?: string;
    keyTerms?: { term: string; explanation: string }[];
  };
}

export interface TopicSuggestion {
  id: string;
  title: string;
  category: 'foundations' | 'how_ai_works' | 'llm_prompts' | 'daily_life' | 'myths' | 'creative';
  categoryLabel: string;
  prompt: string;
  mode: TutorMode;
  icon: string;
  analogyHint: string;
  badge?: string;
}

export interface PromptAnalysis {
  clarityScore: number;
  critique: string;
  formulaBreakdown: {
    role: string;
    task: string;
    context: string;
    constraints: string;
  };
  improvedPrompt: string;
  whyItWorks: string;
  proTip: string;
}

export interface AnalogyExploration {
  title: string;
  shortSummary: string;
  everydayAnalogy: string;
  keyMechanics: string[];
  vocabulary: { term: string; definition: string }[];
  guidingQuestion: string;
}

export interface SocraticStep {
  stepNumber: number;
  title: string;
  guidingQuestion: string;
}

export interface AssignmentRoadmap {
  problemSubject: string;
  keyPrinciples: string[];
  steps: SocraticStep[];
  starterMessage: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  analogyClue: string;
  isMythBuster?: boolean;
}
