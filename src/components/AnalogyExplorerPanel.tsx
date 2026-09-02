import React, { useState } from 'react';
import { Lightbulb, Sparkles, Loader2, BookOpen, HelpCircle, MessageSquare, Volume2 } from 'lucide-react';
import { StudentLevel } from '../types';

interface AnalogyData {
  titleSinhala: string;
  titleEnglish: string;
  shortSummarySinhala: string;
  everydayAnalogySinhala: string;
  keyPointsSinhala: string[];
  englishGlossary: { englishTerm: string; sinhalaMeaning: string }[];
  guidingQuestionSinhala: string;
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
    { title: 'පරිගණකයේ API', query: 'What is an API in Computer Science?' },
    { title: 'ප්‍රභාසංස්ලේෂණය', query: 'Photosynthesis in plants' },
    { title: 'නිව්ටන්ගේ 3 වන නියමය', query: "Newton's 3rd Law of Motion" },
    { title: 'උද්ධමනය (Inflation)', query: 'Inflation and purchasing power' },
    { title: 'Blockchain තාක්ෂණය', query: 'How Blockchain works' },
    { title: 'DNA සහ ජාන', query: 'DNA and Genetics' },
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
        throw new Error('උපමා පැහැදිලි කිරීම ලබාගැනීමට නොහැකි විය.');
      }
      const data = await res.json();
      setAnalogyData(data);
    } catch (err: any) {
      setError(err.message || 'දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      {/* Banner */}
      <div className="bg-linear-to-r from-amber-500/10 via-amber-400/15 to-orange-500/10 p-4 sm:p-5 border-b border-amber-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              එදිනෙදා උපමා ගවේෂකය (Everyday Analogy Explorer)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              ඕනෑම සංකීර්ණ විද්‍යාත්මක, තාක්ෂණික හෝ ආර්ථික සංකල්පයක් අපේ ගෙදර දොරේ හෝ පරිසරයේ උපමාවකින් තේරුම් ගන්න.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Search / Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            තේරුම් ගැනීමට අවශ්‍ය සංකල්පය ඇතුළත් කරන්න (Enter any concept):
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
              placeholder="උදා: Gravity, Photosynthesis, Recursion, RAM vs ROM, Inflation..."
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
            <button
              id="generate-analogy-btn"
              onClick={() => handleGenerate()}
              disabled={loading || !conceptInput.trim()}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>උපමාව සොයමින්...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>උපමාවෙන් පහදන්න</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Concept Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium">නිතර සොයන මාතෘකා:</span>
            {popularConcepts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setConceptInput(item.query);
                  handleGenerate(item.query);
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-900 border border-slate-200 hover:border-amber-200 text-slate-700 transition-all font-medium"
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
            <div className="p-4 rounded-2xl bg-linear-to-br from-amber-50/90 via-orange-50/60 to-white border border-amber-200/80 shadow-xs space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-amber-800 uppercase px-2 py-0.5 rounded-md bg-amber-100/80 border border-amber-200">
                    {analogyData.titleEnglish}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {analogyData.titleSinhala}
                  </h4>
                </div>
                {onSpeakText && (
                  <button
                    onClick={() =>
                      onSpeakText(
                        `${analogyData.titleSinhala}. ${analogyData.shortSummarySinhala}. සරල උපමාව: ${analogyData.everydayAnalogySinhala}`
                      )
                    }
                    className="p-2 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-amber-700 border border-slate-200/80 shadow-2xs transition-colors"
                    title="හඬින් සවන් දෙන්න"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Short Summary */}
              <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-200/60">
                {analogyData.shortSummarySinhala}
              </p>

              {/* Everyday Analogy Box */}
              <div className="bg-amber-100/50 border border-amber-300/80 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>අපේ එදිනෙදා ජීවිතයේ සරල උපමාව (Everyday Analogy):</span>
                </div>
                <p className="text-xs text-slate-900 leading-relaxed font-medium">
                  {analogyData.everydayAnalogySinhala}
                </p>
              </div>

              {/* Key Mechanics */}
              <div>
                <h5 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                  <span>ප්‍රධාන කරුණු (Key Takeaways):</span>
                </h5>
                <ul className="space-y-1 pl-1">
                  {analogyData.keyPointsSinhala.map((pt, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* English Glossary */}
              {analogyData.englishGlossary?.length > 0 && (
                <div className="pt-2 border-t border-amber-200/60">
                  <h5 className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                    ඉංග්‍රීසි තාක්ෂණික වචන සහ තේරුම (Glossary):
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {analogyData.englishGlossary.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-900">{item.englishTerm}</span>
                        <span className="text-slate-500 text-[11px]">{item.sinhalaMeaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guiding Question */}
              <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                  <HelpCircle className="w-4 h-4" />
                  <span>තේරුම් ගත්තාද බලන්න මඟපෙන්වන ප්‍රශ්නයක්:</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  {analogyData.guidingQuestionSinhala}
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() =>
                      onAskFollowUp(
                        `"${analogyData.titleSinhala}" ගැන AI ගුරුතුමා ඇසූ ප්‍රශ්නය: "${analogyData.guidingQuestionSinhala}". මගේ පිළිතුර මෙයයි: `
                      )
                    }
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>AI ගුරුතුමාට පිළිතුරු දෙන්න</span>
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
