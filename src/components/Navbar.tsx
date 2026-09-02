import React from 'react';
import { Sparkles, BookOpen, HelpCircle, Lightbulb, CheckCircle2, RotateCcw, Volume2, VolumeX, Keyboard } from 'lucide-react';
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
  onOpenSinglishModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  studentLevel,
  setStudentLevel,
  onResetChat,
  audioEnabled,
  setAudioEnabled,
  onOpenSinglishModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                    සිංහල AI ගුරුතුමා
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Sinhala AI Tutor
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  එදිනෙදා උපමා මඟින් සංකල්ප ඉගෙනීම සහ පැවරුම් සඳහා මඟපෙන්වීම
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                id="mobile-audio-toggle"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                  audioEnabled
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
                title={audioEnabled ? 'ශබ්දය සක්‍රියයි' : 'ශබ්දය අක්‍රියයි'}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                id="mobile-singlish-btn"
                onClick={onOpenSinglishModal}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs"
                title="Singlish අකුරු මඟපෙන්වීම"
              >
                <Keyboard className="w-4 h-4" />
              </button>

              <button
                id="mobile-reset-chat-btn"
                onClick={onResetChat}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs"
                title="නව සංවාදයක්"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/70">
            <button
              id="mode-tab-concept"
              onClick={() => setMode('concept')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'concept'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>සංකල්ප ඉගෙනීම</span>
            </button>

            <button
              id="mode-tab-assignment"
              onClick={() => setMode('assignment')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'assignment'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold ring-1 ring-orange-400/40'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
              <span>පැවරුම් මඟපෙන්වීම (Socratic)</span>
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
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>උපමා ගවේෂකය</span>
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
              <span>ස්වයං ඇගයීම</span>
            </button>
          </div>

          {/* Desktop Controls: Level & Tools */}
          <div className="hidden md:flex items-center gap-2">
            <select
              id="student-level-select"
              value={studentLevel}
              onChange={(e) => setStudentLevel(e.target.value as StudentLevel)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              {STUDENT_LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.labelSinhala}
                </option>
              ))}
            </select>

            <button
              id="desktop-audio-toggle"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                audioEnabled
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              title={audioEnabled ? 'ශබ්දය සක්‍රියයි (Voice TTS ON)' : 'ශබ්දය අක්‍රියයි (Voice TTS OFF)'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              id="desktop-singlish-btn"
              onClick={onOpenSinglishModal}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs"
            >
              <Keyboard className="w-3.5 h-3.5 text-slate-500" />
              <span>Singlish සහාය</span>
            </button>

            <button
              id="desktop-reset-chat-btn"
              onClick={onResetChat}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs hover:text-slate-900 transition-colors"
              title="නව සංවාදයක් ආරම්භ කරන්න"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>නව සංවාදයක්</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
