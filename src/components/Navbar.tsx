import React from 'react';
import { Sparkles, BookOpen, HelpCircle, Lightbulb, CheckCircle2, RotateCcw, Volume2, VolumeX, HelpCircle as HelpIcon, Compass } from 'lucide-react';
import { TutorMode, StudentLevel } from '../types';
import { STUDENT_LEVELS } from '../data/sampleTopics';

interface NavbarProps {
  mode: TutorMode;
  setMode: (mode: TutorMode) => void;
  studentLevel: StudentLevel;
  setStudentLevel: (level: StudentLevel) => void;
  onResetChat: () => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  onOpenStudyGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  studentLevel,
  setStudentLevel,
  onResetChat,
  audioEnabled,
  setAudioEnabled,
  onOpenStudyGuide,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    AI Concept & Homework Tutor
                    <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      Socratic & Everyday Analogies
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Master complex topics with intuitive analogies • Step-by-step Socratic homework guidance
                </p>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                id="mobile-audio-toggle"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                  audioEnabled
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
                title={audioEnabled ? 'Voice read-aloud active' : 'Voice read-aloud muted'}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                id="mobile-guide-btn"
                onClick={onOpenStudyGuide}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs"
                title="Study Strategy Guide"
              >
                <Compass className="w-4 h-4" />
              </button>

              <button
                id="mobile-reset-chat-btn"
                onClick={onResetChat}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs"
                title="Start New Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <button
              id="mode-tab-concept"
              onClick={() => setMode('concept')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'concept'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Learn Concepts</span>
            </button>

            <button
              id="mode-tab-assignment"
              onClick={() => setMode('assignment')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'assignment'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold ring-1 ring-amber-500/40 text-amber-950'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Homework Coach</span>
            </button>

            <button
              id="mode-tab-analogy"
              onClick={() => setMode('analogy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'analogy'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-violet-600" />
              <span>Analogy Explorer</span>
            </button>

            <button
              id="mode-tab-quiz"
              onClick={() => setMode('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'quiz'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Self-Quiz</span>
            </button>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-2">
            <select
              id="student-level-select"
              value={studentLevel}
              onChange={(e) => setStudentLevel(e.target.value as StudentLevel)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              {STUDENT_LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.label}
                </option>
              ))}
            </select>

            <button
              id="desktop-audio-toggle"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                audioEnabled
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              title={audioEnabled ? 'Voice read-aloud active' : 'Voice read-aloud muted'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              id="desktop-guide-btn"
              onClick={onOpenStudyGuide}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs hover:text-slate-900 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              <span>Study Tips</span>
            </button>

            <button
              id="desktop-reset-chat-btn"
              onClick={onResetChat}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs hover:text-slate-900 transition-colors"
              title="Start a fresh conversation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>New Chat</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
