import React from 'react';
import {
  Sparkles,
  Lightbulb,
  ArrowRight,
  Brain,
  MessageSquare,
  Layers,
  Sliders,
  AlertTriangle,
  Image,
  ShieldCheck,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { SAMPLE_TOPICS } from '../data/sampleTopics';
import { TopicSuggestion, TutorMode } from '../types';

interface WelcomeBannerProps {
  onSelectTopic: (topic: TopicSuggestion) => void;
  onSetMode: (mode: TutorMode) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Brain':
      return <Brain className="w-4 h-4 text-purple-600" />;
    case 'Layers':
      return <Layers className="w-4 h-4 text-indigo-600" />;
    case 'MessageSquare':
      return <MessageSquare className="w-4 h-4 text-sky-600" />;
    case 'Sliders':
      return <Sliders className="w-4 h-4 text-amber-600" />;
    case 'AlertTriangle':
      return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    case 'Image':
      return <Image className="w-4 h-4 text-teal-600" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    default:
      return <Sparkles className="w-4 h-4 text-indigo-600" />;
  }
};

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onSelectTopic, onSetMode }) => {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>guruAI • Zero-Intimidation AI Learning</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Learn Artificial Intelligence <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-indigo-200 to-sky-300">
              From Absolute Scratch
            </span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Never coded? Unsure what a &quot;prompt&quot; or &quot;LLM&quot; is? Perfect! guruAI breaks down Artificial Intelligence for complete beginners, parents, and curious minds using simple household analogies, zero jargon, and interactive hands-on experiments.
          </p>

          {/* Three Truths for Beginners */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-2.5 flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white block font-semibold">No Magic or Robot Brains:</strong> It&apos;s a pattern-finder, like a recipe book that learned from millions of dishes.
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-2.5 flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white block font-semibold">Speak Plain English:</strong> No computer languages needed; talk to AI just like texting a friendly assistant.
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-2.5 flex items-start gap-2 text-slate-300">
              <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white block font-semibold">You Can&apos;t Break It:</strong> Ask any question, test prompts, and explore with zero fear of making a mistake.
              </span>
            </div>
          </div>

          {/* Core Feature Quick Launchers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div
              onClick={() => onSetMode('analogy')}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 flex items-start gap-3 cursor-pointer transition-all hover:border-violet-400/50 group"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-violet-200">AI Everyday Analogy Explorer</div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Demystify scary terms (Tokens, Hallucinations, Neural Weights) using kitchen, gardening, and carpentry metaphors.
                </div>
              </div>
            </div>

            <div
              onClick={() => onSetMode('sandbox')}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 flex items-start gap-3 cursor-pointer transition-all hover:border-amber-400/50 group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-amber-200">Interactive Prompt Sandbox</div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  Practice writing real prompts! See your clarity score and watch guruAI upgrade ordinary requests into pro prompts.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Suggested Starter Topics: The Zero-to-Hero AI Curriculum */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              The AI Beginner Curriculum (Click to Learn):
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:block">
            Choose any topic to start an interactive lesson
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

                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-slate-900 leading-snug group-hover:text-indigo-900 transition-colors">
                    {topic.title}
                  </h4>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  💡 {topic.analogyHint}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-600 group-hover:text-indigo-900">
                <span>
                  {topic.badge ? `Lesson: ${topic.badge}` : 'Start Lesson'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
