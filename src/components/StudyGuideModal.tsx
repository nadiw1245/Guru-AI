import React from 'react';
import { X, BookOpen, Sparkles, Lightbulb, HelpCircle, Check, Copy } from 'lucide-react';

interface StudyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertPrompt?: (text: string) => void;
}

const POWER_PROMPTS = [
  {
    title: 'Deconstruct a Concept with Analogies',
    prompt: 'Explain the core mechanics of [Quantum Superposition / Docker Containers / Neural Networks] using a simple kitchen or sports analogy.',
    tag: 'Analogy',
  },
  {
    title: 'Socratic Homework Assistance',
    prompt: 'I am trying to solve this physics problem: [paste question here]. Please do not give me the answer; ask me a guiding question for Step 1.',
    tag: 'Socratic',
  },
  {
    title: 'Identify Reasoning Mistakes',
    prompt: 'Here is my attempt at solving this math problem: [paste your steps]. What part of my reasoning is faulty, and what hint can you provide?',
    tag: 'Diagnostics',
  },
  {
    title: 'Feynman Technique Testing',
    prompt: 'I want to explain [Photosynthesis / DNS / Opportunity Cost] to you in my own words. Please critique my understanding and fill any gaps.',
    tag: 'Active Recall',
  },
];

const STRATEGIES = [
  {
    icon: Lightbulb,
    title: '1. The Power of Everyday Analogies',
    desc: 'Connecting foreign concepts to familiar daily experiences (cooking, traffic, games) converts abstract theory into intuitive visual models for long-term memory.',
  },
  {
    icon: HelpCircle,
    title: '2. The Socratic Method (Guiding Questions)',
    desc: 'Receiving direct answers creates an illusion of competence. Wrestling with guided questions builds true neural pathways and independent problem-solving skill.',
  },
  {
    icon: BookOpen,
    title: '3. Incremental Milestones',
    desc: 'Break large assignment problems down into 3-4 micro-steps: Identify Given Data -> Formulate Relationship -> Calculate -> Sanity Check.',
  },
];

export const StudyGuideModal: React.FC<StudyGuideModalProps> = ({
  isOpen,
  onClose,
  onInsertPrompt,
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopyPrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
    if (onInsertPrompt) {
      onInsertPrompt(prompt);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Learning Strategy & Prompt Guide
              </h3>
              <p className="text-xs text-slate-500">
                Maximize retention with Socratic inquiry and analogical reasoning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Strategies */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Core Learning Principles
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {STRATEGIES.map((strat, idx) => {
                const IconComponent = strat.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 mb-0.5">{strat.title}</div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{strat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Prompts to Click/Copy */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-2">
              Effective Prompt Templates (Click to Use)
            </h4>
            <div className="space-y-2">
              {POWER_PROMPTS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCopyPrompt(item.prompt, idx)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900 text-xs group-hover:text-indigo-900">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-800">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed font-mono bg-white p-2 rounded-lg border border-slate-100 mt-1.5 flex items-center justify-between gap-2">
                    <span className="truncate">{item.prompt}</span>
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Tip: Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Enter</kbd> to send questions anytime.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
