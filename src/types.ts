export type TutorMode = 'concept' | 'assignment' | 'analogy' | 'quiz';

export type StudentLevel = 'elementary' | 'middle_school' | 'high_school' | 'university' | 'beginner';

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
  guidingQuestion: string;
}

export interface AssignmentRoadmap {
  problemSubject: string;
  keyPrinciples: string[];
  steps: SocraticStep[];
  starterMessage: string;
}

export interface AnalogyExploration {
  title: string;
  shortSummary: string;
  everydayAnalogy: string;
  keyMechanics: string[];
  vocabulary: { term: string; definition: string }[];
  guidingQuestion: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  analogyClue: string;
}

