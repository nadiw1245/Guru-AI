import React, { useState } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, ArrowRight, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { SocraticStep } from '../types';

interface AssignmentRoadmapPanelProps {
  onStartAssignmentGuidance: (problemText: string, firstQuestion: string) => void;
  activeProblemText: string;
}

export const AssignmentRoadmapPanel: React.FC<AssignmentRoadmapPanelProps> = ({
  onStartAssignmentGuidance,
  activeProblemText,
}) => {
  const [problemInput, setProblemInput] = useState(activeProblemText || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmapData, setRoadmapData] = useState<{
    problemSubjectSinhala: string;
    keyPrinciplesSinhala: string[];
    steps: { stepNumber: number; titleSinhala: string; guidingQuestionSinhala: string }[];
    starterMessageSinhala: string;
  } | null>(null);

  const sampleAssignmentPrompts = [
    'ගණිතය: x² - 5x + 6 = 0 වර්ගජ සමීකරණය විසඳන්න.',
    'භෞතික විද්‍යාව: 10N බලයක් 2kg ස්කන්ධයක් මත යෙදූ විට ත්වරණය කොපමණද?',
    'විද්‍යාව: යකඩ ඇණයක් ජලයේ ගිලෙන නමුත් විශාල යකඩ නැවක් පාවෙන්නේ ඇයි?',
    'පරිගණක: 1 සිට n දක්වා සංඛ්‍යාවල එකතුව සෙවීමට For loop එකක් ලියන්නේ කෙසේද?',
  ];

  const handleAnalyze = async () => {
    if (!problemInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/assignment/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemText: problemInput }),
      });
      if (!res.ok) {
        throw new Error('පැවරුම විශ්ලේෂණය කිරීම අසාර්ථක විය.');
      }
      const data = await res.json();
      setRoadmapData(data);
    } catch (err: any) {
      setError(err.message || 'දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToChat = () => {
    if (!roadmapData) return;
    const prompt = `මගේ පැවරුම: "${problemInput}"\n\nකරුණාකර මට කෙළින්ම උත්තරය නොදී, පළමු පියවර ලෙස මෙම මඟපෙන්වන ප්‍රශ්නයෙන් ආරම්භ කර මට තනිවම පිළිතුර සොයා ගැනීමට උදව් කරන්න: "${roadmapData.steps[0]?.guidingQuestionSinhala || ''}"`;
    onStartAssignmentGuidance(prompt, roadmapData.steps[0]?.guidingQuestionSinhala);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      {/* Banner */}
      <div className="bg-linear-to-r from-orange-50 via-amber-50 to-orange-100/50 p-4 sm:p-5 border-b border-orange-200/60">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                පැවරුම් සහ ගෙදර වැඩ සහයක (Socratic Assignment Coach)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                AI ගුරුතුමා ඔබට සෘජු පිළිතුරු නොදෙන අතර, ගැටලුව ඔබ විසින්ම තේරුම් ගෙන විසඳීමට පියවරෙන් පියවර මඟපෙන්වයි.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
            සොක්‍රටීස් ක්‍රමය
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            ඔබේ පැවරුම හෝ ගැටලුව මෙතැනට ඇතුළත් කරන්න (Paste your question):
          </label>
          <div className="relative">
            <textarea
              id="assignment-problem-textarea"
              rows={3}
              value={problemInput}
              onChange={(e) => setProblemInput(e.target.value)}
              placeholder="උදාහරණ: x² - 5x + 6 = 0 සමීකරණය විසඳීම හෝ භෞතික විද්‍යා ප්‍රශ්නයක්..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Quick Examples */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500">උදාහරණ තෝරන්න:</span>
            {sampleAssignmentPrompts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setProblemInput(sample)}
                className="text-[11px] px-2 py-1 rounded-md bg-slate-100 hover:bg-orange-50 hover:text-orange-900 border border-slate-200 hover:border-orange-200 text-slate-600 transition-colors truncate max-w-[220px]"
                title={sample}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-700">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>සෘජු පිළිතුරු ලබා නොදේ • ගැටලුව විසඳීමට පියවර සහ ඉඟි පමණි</span>
          </div>
          <button
            id="analyze-assignment-btn"
            onClick={handleAnalyze}
            disabled={loading || !problemInput.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>විශ්ලේෂණය කරමින්...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>මඟපෙන්වීමේ සැලැස්ම සකසන්න</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Roadmap Results */}
        {roadmapData && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between bg-orange-50/70 p-3 rounded-xl border border-orange-200/60">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-700" />
                <span className="text-xs font-bold text-orange-950">
                  විෂය: {roadmapData.problemSubjectSinhala}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {roadmapData.keyPrinciplesSinhala.map((principle, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-orange-200 text-orange-800"
                  >
                    {principle}
                  </span>
                ))}
              </div>
            </div>

            {/* Socratic Steps */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ගැටලුව තනිවම විසඳා ගැනීමේ පියවර සැලැස්ම:</span>
              </h4>
              <div className="space-y-2.5">
                {roadmapData.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-orange-300 transition-all flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-slate-900 mb-1">{step.titleSinhala}</div>
                      <div className="text-slate-600 bg-amber-50/60 p-2 rounded-lg border border-amber-200/50 text-amber-950 font-medium">
                        💡 <strong>මඟපෙන්වන ප්‍රශ්නය:</strong> {step.guidingQuestionSinhala}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Chat Button */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-amber-300">පළමු පියවරෙන් ආරම්භ කරමු!</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  AI ගුරුතුමා සමඟ එක්ව පියවරෙන් පියවර පිළිතුර ගොඩනඟා ගන්න.
                </div>
              </div>
              <button
                id="start-socratic-chat-btn"
                onClick={handleSendToChat}
                className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <span>සංවාදය ආරම්භ කරන්න</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
