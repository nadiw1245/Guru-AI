import React from 'react';
import { Sparkles, Lightbulb, HelpCircle, ArrowRight, BookOpen, Code2, Leaf, Zap, TrendingUp, Layers } from 'lucide-react';
import { SAMPLE_TOPICS } from '../data/sampleTopics';
import { TopicSuggestion, TutorMode } from '../types';

interface WelcomeBannerProps {
  onSelectTopic: (topic: TopicSuggestion) => void;
  onSetMode: (mode: TutorMode) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Code2':
      return <Code2 className="w-4 h-4 text-sky-600" />;
    case 'Leaf':
      return <Leaf className="w-4 h-4 text-emerald-600" />;
    case 'Zap':
      return <Zap className="w-4 h-4 text-amber-600" />;
    case 'TrendingUp':
      return <TrendingUp className="w-4 h-4 text-rose-600" />;
    case 'Layers':
      return <Layers className="w-4 h-4 text-indigo-600" />;
    default:
      return <HelpCircle className="w-4 h-4 text-amber-600" />;
  }
};

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onSelectTopic, onSetMode }) => {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-slate-700/50">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Concept & Socratic Homework Tutor</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Master Any Difficult Concept <br className="hidden sm:block" />
            Through{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-indigo-200 to-sky-300">
              Intuitive Everyday Analogies
            </span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Learn complex science, math, programming, and economics through vivid daily life analogies. For assignments and homework, I never provide direct answers—I guide you step-by-step with Socratic questions so you master the logic yourself.
          </p>

          {/* Core Feature Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div
              onClick={() => onSetMode('analogy')}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-3.5 flex items-start gap-3 cursor-pointer transition-all hover:border-indigo-400/50"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-indigo-200">Everyday Analogy Engine</div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Transform abstract theories into tangible real-world visuals (cooking, sports, traffic, games).
                </div>
              </div>
            </div>

            <div
              onClick={() => onSetMode('assignment')}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-3.5 flex items-start gap-3 cursor-pointer transition-all hover:border-amber-400/50"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-amber-200">Socratic Homework Guidance</div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Zero spoon-fed answers. Structured milestones with gentle prompts to build genuine competence.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background ambient glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Suggested Starter Topics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Explore Featured Topics & Sample Prompts:
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:block">
            Click any card to launch interactive tutoring
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelectTopic(topic)}
              className="text-left p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    {topic.categoryLabel}
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                    {getCategoryIcon(topic.icon)}
                  </div>
                </div>

                <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-900 transition-colors">
                  {topic.title}
                </h4>

                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  💡 {topic.analogyHint}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-600 group-hover:text-indigo-900">
                <span>{topic.mode === 'assignment' ? 'Solve with Socratic Coach' : 'Learn with Analogy'}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
