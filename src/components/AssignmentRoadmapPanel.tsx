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
    problemSubject: string;
    keyPrinciples: string[];
    steps: { stepNumber: number; title: string; guidingQuestion: string }[];
    starterMessage: string;
  } | null>(null);

  const sampleAssignmentPrompts = [
    'Algebra: Solve the quadratic equation x² - 5x + 6 = 0.',
    'Physics: A 10N force is applied to a 2kg mass. Calculate its acceleration.',
    'Chemistry: Balance the reaction Fe + O₂ → Fe₂O₃ and identify the limiting reagent.',
    'Computer Science: Write a recursive function to compute the Fibonacci sequence.',
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
        throw new Error('Failed to analyze assignment roadmap.');
      }
      const data = await res.json();
      setRoadmapData(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the assignment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToChat = () => {
    if (!roadmapData) return;
    const prompt = `Here is my assignment problem: "${problemInput}"\n\nPlease do not give me the direct answer. Let's begin with Step 1 and your guiding question: "${roadmapData.steps[0]?.guidingQuestion || ''}"`;
    onStartAssignmentGuidance(prompt, roadmapData.steps[0]?.guidingQuestion);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      {/* Banner */}
      <div className="bg-linear-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-4 sm:p-5 border-b border-amber-200/60">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Socratic Assignment & Homework Coach
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                We break your assignment into structured milestone steps and guide your reasoning without spoiling the solution.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            Socratic Method
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Paste your homework question or problem statement:
          </label>
          <div className="relative">
            <textarea
              id="assignment-problem-textarea"
              rows={3}
              value={problemInput}
              onChange={(e) => setProblemInput(e.target.value)}
              placeholder="e.g., Calculate the velocity of a falling object after 3 seconds, or solve x² - 5x + 6 = 0..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Quick Examples */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Sample Problems:</span>
            {sampleAssignmentPrompts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setProblemInput(sample)}
                className="text-[11px] px-2 py-1 rounded-md bg-slate-100 hover:bg-amber-50 hover:text-amber-900 border border-slate-200 hover:border-amber-200 text-slate-600 transition-colors truncate max-w-[240px]"
                title={sample}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-800 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Zero direct answers • Step-by-step Socratic breakdown only</span>
          </div>
          <button
            id="analyze-assignment-btn"
            onClick={handleAnalyze}
            disabled={loading || !problemInput.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-all shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Problem...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Socratic Roadmap</span>
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
            <div className="flex items-center justify-between bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-950">
                  Subject Area: {roadmapData.problemSubject}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {roadmapData.keyPrinciples.map((principle, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900"
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
                <span>Guided Step Breakdown:</span>
              </h4>
              <div className="space-y-2.5">
                {roadmapData.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-amber-300 transition-all flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-slate-900 mb-1">{step.title}</div>
                      <div className="text-slate-600 bg-amber-50/70 p-2 rounded-lg border border-amber-200 text-amber-950 font-medium">
                        💡 <strong>Guiding Question:</strong> {step.guidingQuestion}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Chat Button */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-amber-300">Ready to tackle Step 1?</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Launch an interactive Socratic dialogue with the AI tutor.
                </div>
              </div>
              <button
                id="start-socratic-chat-btn"
                onClick={handleSendToChat}
                className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <span>Start Socratic Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
