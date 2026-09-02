export type TutorMode = 'concept' | 'assignment' | 'quiz' | 'analogy';

export type StudentLevel = 'primary' | 'secondary' | 'ol_al' | 'university' | 'beginner';

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
    englishTerms?: { term: string; sinhalaMeaning: string }[];
  };
}

export interface TopicSuggestion {
  id: string;
  title: string;
  sinhalaTitle: string;
  category: 'science' | 'math' | 'it' | 'economics' | 'physics' | 'daily';
  categoryLabel: string;
  prompt: string;
  mode: TutorMode;
  icon: string;
  analogyHint: string;
}

export interface SocraticStep {
  stepNumber: number;
  title: string;
  description: string;
  completed: boolean;
  guidingQuestion: string;
}

export interface QuizQuestion {
  id: string;
  questionSinhala: string;
  options: string[];
  correctIndex: number;
  explanationSinhala: string;
  analogyClue: string;
}
