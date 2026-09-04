import React, { useState } from 'react';
import { Lightbulb, Sparkles, Loader2, BookOpen, HelpCircle, MessageSquare, Volume2 } from 'lucide-react';
import { StudentLevel } from '../types';

interface AnalogyData {
  title: string;
  shortSummary: string;
  everydayAnalogy: string;
  keyMechanics: string[];
  vocabulary: { term: string; definition: string }[];
  guidingQuestion: string;
}

interface AnalogyExplorerPanelProps {
  studentLevel: StudentLevel;
  onAskFollowUp: (prompt: string) => void;
  onSpeakText?: (text: string) => void;
}

export const AnalogyExplorerPanel: React.FC<AnalogyExplorerPanelProps> = ({
  studentLevel,
  onAskFollowUp,
  onSpeakText,
}) => {
  const [conceptInput, setConceptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analogyData, setAnalogyData] = useState<AnalogyData | null>(null);

  const popularConcepts = [
    { title: 'What is a Token?', query: 'What are tokens in Large Language Models and why does AI count them?' },
    { title: 'Neural Networks', query: 'How does an Artificial Neural Network learn patterns from data?' },
    { title: 'AI Hallucinations', query: 'Why does AI make up fake information or hallucinate?' },
    { title: 'AI Temperature', query: 'What is Temperature in AI and how does it change creativity?' },
    { title: 'Training Data & Overfitting', query: 'How is AI trained on data and what does overfitting mean?' },
    { title: 'Diffusion & Image Gen', query: 'How do Diffusion models create photos from scratch?' },
    { title: 'RAG (Grounding)', query: 'What is RAG (Retrieval-Augmented Generation) in plain English?' },
  ];

  const handleGenerate = async (conceptToFetch?: string) => {
    const target = conceptToFetch || conceptInput;
    if (!target.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/concept/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept: target, studentLevel }),
      });
      if (!res.ok) {
        throw new Error('Unable to retrieve concept analogy breakdown.');
      }
      const data = await res.json();
      setAnalogyData(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      {/* Banner */}
      <div className="bg-linear-to-r from-violet-500/10 via-indigo-500/10 to-sky-500/10 p-4 sm:p-5 border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Everyday AI Analogy Explorer
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Demystify buzzwords like Tokens, Transformers, and Neural Networks with intuitive household and real-world analogies.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Search / Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Enter any AI concept, buzzword, or term you want explained simply:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="analogy-concept-input"
              type="text"
              value={conceptInput}
              onChange={(e) => setConceptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate();
              }}
              placeholder="e.g. Tokens, Neural Network, Hallucination, Training Weights, Diffusion, Fine-Tuning..."
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
            <button
              id="generate-analogy-btn"
              onClick={() => handleGenerate()}
              disabled={loading || !conceptInput.trim()}
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Explain with Analogy</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Concept Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Core AI Terms:</span>
            {popularConcepts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setConceptInput(item.query);
                  handleGenerate(item.query);
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-violet-50 hover:text-violet-900 border border-slate-200 hover:border-violet-200 text-slate-700 transition-all font-medium cursor-pointer"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Analogy Result Card */}
        {analogyData && (
          <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 rounded-2xl bg-linear-to-br from-violet-50/70 via-indigo-50/50 to-white border border-indigo-200/80 shadow-xs space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-violet-800 uppercase px-2 py-0.5 rounded-md bg-violet-100/80 border border-violet-200">
                    guruAI Mental Model
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {analogyData.title}
                  </h4>
                </div>
                {onSpeakText && (
                  <button
                    onClick={() =>
                      onSpeakText(
                        `${analogyData.title}. ${analogyData.shortSummary}. Everyday Analogy: ${analogyData.everydayAnalogy}`
                      )
                    }
                    className="p-2 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-violet-700 border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
                    title="Read aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Short Summary */}
              <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-200/60">
                {analogyData.shortSummary}
              </p>

              {/* Everyday Analogy Box */}
              <div className="bg-violet-100/60 border border-violet-300/80 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-violet-900">
                  <Lightbulb className="w-4 h-4 text-violet-600" />
                  <span>The Everyday Household Analogy:</span>
                </div>
                <p className="text-xs text-slate-900 leading-relaxed font-medium">
                  {analogyData.everydayAnalogy}
                </p>
              </div>

              {/* Key Mechanics */}
              <div>
                <h5 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                  <span>How It Actually Works Under the Hood:</span>
                </h5>
                <ul className="space-y-1 pl-1">
                  {analogyData.keyMechanics.map((pt, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-violet-600 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vocabulary Glossary */}
              {analogyData.vocabulary?.length > 0 && (
                <div className="pt-2 border-t border-indigo-200/60">
                  <h5 className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                    Plain-English Definitions:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {analogyData.vocabulary.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between gap-2"
                      >
                        <span className="font-semibold text-slate-900">{item.term}</span>
                        <span className="text-slate-500 text-[11px] text-right">{item.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guiding Question */}
              <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                  <HelpCircle className="w-4 h-4" />
                  <span>Check Your Intuition:</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  {analogyData.guidingQuestion}
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() =>
                      onAskFollowUp(
                        `Regarding the concept "${analogyData.title}", you asked: "${analogyData.guidingQuestion}". Here is my reasoning: `
                      )
                    }
                    className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Discuss with guruAI</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
