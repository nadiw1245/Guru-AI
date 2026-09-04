import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { PromptAnalysis, StudentLevel } from '../types';
import { SAMPLE_SANDBOX_PROMPTS } from '../data/sampleTopics';

interface PromptSandboxPanelProps {
  onSendToChat: (prompt: string) => void;
  studentLevel: StudentLevel;
}

export const PromptSandboxPanel: React.FC<PromptSandboxPanelProps> = ({
  onSendToChat,
  studentLevel,
}) => {
  const [promptText, setPromptText] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || promptText;
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/prompt/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText: text, studentLevel }),
      });

      if (!res.ok) {
        throw new Error('Could not analyze prompt. Please try again.');
      }

      const data: PromptAnalysis = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (presetText: string) => {
    setPromptText(presetText);
    handleAnalyze(presetText);
  };

  const handleCopyImproved = () => {
    if (analysis?.improvedPrompt) {
      navigator.clipboard.writeText(analysis.improvedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendToChatWithTemp = () => {
    if (!analysis?.improvedPrompt && !promptText) return;
    const finalPrompt = analysis?.improvedPrompt || promptText;
    onSendToChat(finalPrompt);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-linear-to-r from-amber-500/5 via-indigo-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Interactive Prompt Sandbox & Lab
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Beginner Friendly
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Type any request. Watch guruAI score it, break down the formula, and upgrade it to pro quality!
              </p>
            </div>
          </div>
        </div>

        {/* Beginner Preset Suggestions */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500">Try common tasks:</span>
          {SAMPLE_SANDBOX_PROMPTS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleSelectPreset(preset.rawPrompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-amber-50/50 transition-colors font-medium cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Your Raw Prompt (What you want to ask AI):</span>
            <span className="text-[11px] text-slate-400 font-normal">
              Type naturally in plain English
            </span>
          </label>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="e.g., How do I explain AI to my 65-year-old dad? Or: Write a note to my neighbour about trimming a tree branch."
            rows={3}
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Temperature / Creativity Dial for Dad */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-bold text-slate-800">
                AI &quot;Creativity&quot; (Temperature): {temperature.toFixed(1)}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {temperature < 0.4
                ? 'Strict & Factual (Best for facts & instructions)'
                : temperature < 0.8
                ? 'Balanced & Friendly (Recommended for conversation)'
                : 'Wildly Creative (Best for stories & poetry)'}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.1 (Grandma&apos;s Exact Recipe)</span>
            <span>0.7 (Standard Conversation)</span>
            <span>1.0 (Exotic Spice Experiment)</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!promptText.trim() || isLoading}
            onClick={() => handleAnalyze()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>guruAI is analyzing your prompt...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze & Upgrade Prompt</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Analysis Results Display */}
        {analysis && (
          <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in duration-300">
            {/* Score & Critique Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  guruAI Evaluation
                </span>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {analysis.critique}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-amber-200 shadow-2xs">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Clarity Score</div>
                  <div className="text-lg font-black text-amber-600">
                    {analysis.clarityScore}
                    <span className="text-xs text-slate-400 font-normal">/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formula Breakdown: 4 Pillars */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>The 4 Prompt Pillars Breakdown:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <div className="text-[10px] font-bold text-indigo-700 uppercase">1. Assigned Role</div>
                  <div className="text-slate-700 font-medium">{analysis.formulaBreakdown.role}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <div className="text-[10px] font-bold text-indigo-700 uppercase">2. Core Task</div>
                  <div className="text-slate-700 font-medium">{analysis.formulaBreakdown.task}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <div className="text-[10px] font-bold text-indigo-700 uppercase">3. Situation Context</div>
                  <div className="text-slate-700 font-medium">{analysis.formulaBreakdown.context}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <div className="text-[10px] font-bold text-indigo-700 uppercase">4. Format & Rules</div>
                  <div className="text-slate-700 font-medium">{analysis.formulaBreakdown.constraints}</div>
                </div>
              </div>
            </div>

            {/* Upgraded Prompt Card */}
            <div className="p-4 rounded-2xl bg-linear-to-br from-indigo-900 to-slate-900 text-white space-y-3 shadow-md border border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-200">
                    guruAI Master Upgraded Prompt:
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyImproved}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-mono text-indigo-100 leading-relaxed select-all">
                {analysis.improvedPrompt}
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <div className="font-semibold text-amber-300 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why this prompt works 10x better:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {analysis.whyItWorks}
                </p>
              </div>

              {/* One Click Test In Chat */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSendToChatWithTemp}
                  className="py-2 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Test this Prompt in guruAI Chat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pro Tip Callout */}
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
              <span className="text-base leading-none">💡</span>
              <div>
                <strong className="font-bold block">Guru Golden Rule:</strong>
                <span className="text-indigo-800 text-[11px] leading-snug">
                  {analysis.proTip}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
