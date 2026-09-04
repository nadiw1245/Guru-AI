import React from 'react';
import { X, Sparkles, Lightbulb, ShieldCheck, Copy, Check, Heart, Sliders } from 'lucide-react';

interface StudyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertPrompt?: (text: string) => void;
}

const AI_MYTHS = [
  {
    myth: 'Myth 1: AI is conscious and can think for itself',
    reality:
      'AI does not have feelings, beliefs, or self-awareness. It calculates the most statistically likely words based on patterns in vast training data—just like a super-smart autocomplete.',
  },
  {
    myth: 'Myth 2: You need to know coding or mathematics',
    reality:
      'Zero coding required! AI speaks ordinary everyday English. If you can write a text message or chat with a friend, you already have all the skills to talk to AI.',
  },
  {
    myth: 'Myth 3: AI is always 100% factual and infallible',
    reality:
      'AI can sometimes "hallucinate" (sound very confident while making up a false date or detail). Treat AI like a brilliant intern: always double-check important medical, legal, or financial advice.',
  },
  {
    myth: 'Myth 4: If you make a mistake, you can break the AI',
    reality:
      'You cannot break it! If you give a confusing question, it will just ask for clarification. Experiment freely and have fun without hesitation.',
  },
];

const PROMPT_FORMULA = [
  { letter: 'C', term: 'Context', desc: 'Briefly explain your situation (e.g., "I am 65 and looking to start gardening...")' },
  { letter: 'L', term: 'Length', desc: 'Tell it how long you want the reply (e.g., "in 3 short bullet points")' },
  { letter: 'E', term: 'Examples', desc: 'Give a quick sample of the tone or style you like' },
  { letter: 'A', term: 'Audience', desc: 'Specify who the answer is for (e.g., "explain it for a total beginner")' },
  { letter: 'R', term: 'Role', desc: 'Give the AI a persona (e.g., "Act as a friendly, patient mechanic")' },
];

const BEGINNER_PROMPTS = [
  {
    title: 'Everyday Household Analogy',
    prompt: 'Explain how [AI Tokens / Neural Networks / Cloud Storage] work using a simple kitchen or carpentry analogy.',
    tag: 'Analogy',
  },
  {
    title: 'Polite Communication Assistant',
    prompt: 'Please review and polish this message to [my doctor / landlord / colleague] to make it friendly, clear, and easy to read: [paste message]',
    tag: 'Daily Life',
  },
  {
    title: 'Step-by-Step Home Troubleshooting',
    prompt: 'I have an issue with [squeaky floorboard / slow drain]. Act as an experienced handyman and give me a safe, step-by-step beginner guide with common household tools.',
    tag: 'DIY Help',
  },
  {
    title: 'Travel Planning with Comfort',
    prompt: 'Help me plan a relaxed 3-day weekend trip to [destination] designed for someone who prefers gentle scenic walks, easy parking, and peaceful spots.',
    tag: 'Travel',
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
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-linear-to-r from-indigo-50/70 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                guruAI Beginner Guide & Mythbusters
              </h3>
              <p className="text-xs text-slate-500">
                Essential truths, prompt secrets, and confidence tips for beginners & parents
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs">
          {/* Myths vs Reality */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-700">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>The 4 Big AI Myths Debunked</span>
            </div>

            <div className="space-y-2">
              {AI_MYTHS.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="font-bold text-slate-900 text-xs text-rose-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{item.myth}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 pl-3 leading-relaxed">
                    <strong className="text-emerald-700 font-semibold">The Truth: </strong>
                    {item.reality}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The CLEAR Prompt Formula */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider text-amber-700">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>The &quot;CLEAR&quot; Formula for Great Prompts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
              {PROMPT_FORMULA.map((f) => (
                <div
                  key={f.letter}
                  className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-center flex flex-col items-center justify-center space-y-0.5"
                >
                  <span className="text-sm font-black text-amber-700 bg-white w-6 h-6 rounded-full flex items-center justify-center border border-amber-300 shadow-2xs">
                    {f.letter}
                  </span>
                  <span className="font-bold text-slate-900 text-[11px]">{f.term}</span>
                  <span className="text-[10px] text-slate-500 leading-tight">{f.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Starter Prompts */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider text-violet-700">
              <Lightbulb className="w-4 h-4 text-violet-600" />
              <span>Beginner Power Prompts (Click to Use)</span>
            </div>

            <div className="space-y-2">
              {BEGINNER_PROMPTS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                      {item.tag}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 font-mono bg-white p-2 rounded-lg border border-slate-200/60 leading-relaxed">
                    &quot;{item.prompt}&quot;
                  </p>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCopyPrompt(item.prompt, idx)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-white" />
                          <span>Copied to Chat!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Use in Chat</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Built with care for curious learners of all ages.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
