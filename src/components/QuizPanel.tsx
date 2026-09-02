import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, Loader2, RotateCcw, Award, Lightbulb, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';

interface QuizPanelProps {
  onAskChatQuestion: (prompt: string) => void;
}

export const QuizPanel: React.FC<QuizPanelProps> = ({ onAskChatQuestion }) => {
  const [topicInput, setTopicInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const starterTopics = [
    'Photosynthesis & Light Reactions',
    "Newton's Laws of Motion",
    'Recursion & Algorithms',
    'Inflation & Supply Curves',
  ];

  const handleGenerateQuiz = async (topicToUse?: string) => {
    const query = topicToUse || topicInput;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: query, count: 3 }),
      });
      if (!res.ok) {
        throw new Error('Failed to generate interactive quiz questions.');
      }
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    if (correctCount > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      {/* Banner */}
      <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-100/40 p-4 sm:p-5 border-b border-emerald-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Interactive Concept Quiz & Self-Assessment
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Verify your conceptual understanding with targeted questions and everyday analogy explanations.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Search */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Enter a topic or subject for your custom quiz:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="quiz-topic-input"
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerateQuiz();
              }}
              placeholder="e.g. Photosynthesis, Newton's Laws, Python Loops, Fractions, Opportunity Cost..."
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
            <button
              id="generate-quiz-btn"
              onClick={() => handleGenerateQuiz()}
              disabled={loading || !topicInput.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Quiz...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Quiz</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Sample Topics:</span>
            {starterTopics.map((top, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTopicInput(top);
                  handleGenerateQuiz(top);
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200 hover:border-emerald-200 text-slate-600 transition-colors"
              >
                {top}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Questions List */}
        {questions.length > 0 && (
          <div className="space-y-4 pt-2">
            {questions.map((q, qIndex) => {
              const selected = selectedAnswers[q.id];
              const isOptionSelected = selected !== undefined;
              const isCorrect = selected === q.correctIndex;

              return (
                <div
                  key={q.id || qIndex}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pl-8">
                    {q.options.map((opt, optIndex) => {
                      const isOptionChosen = selected === optIndex;
                      const isThisCorrect = q.correctIndex === optIndex;

                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/30';
                      if (showResults) {
                        if (isThisCorrect) {
                          btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                        } else if (isOptionChosen && !isCorrect) {
                          btnStyle = 'bg-red-100 border-red-300 text-red-950';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      } else if (isOptionChosen) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                      }

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIndex)}
                          disabled={showResults}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {showResults && isThisCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {showResults && isOptionChosen && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Clue and Explanation if Results Shown */}
                  {showResults && (
                    <div className="pl-8 pt-2 space-y-2 animate-in fade-in duration-200">
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                          <span>Conceptual Explanation:</span>
                        </div>
                        <p className="leading-relaxed">{q.explanation}</p>
                        {q.analogyClue && (
                          <p className="mt-1 text-[11px] text-amber-800 font-medium">
                            💡 Analogy Clue: {q.analogyClue}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom Actions */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              {!showResults ? (
                <>
                  <span className="text-xs text-slate-600">
                    {Object.keys(selectedAnswers).length} of {questions.length} questions answered
                  </span>
                  <button
                    id="submit-quiz-answers-btn"
                    onClick={handleCheckAnswers}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Check Answers
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-bold text-slate-900">
                      Your Score: {calculateScore()} / {questions.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowResults(false);
                        setSelectedAnswers({});
                      }}
                      className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                    <button
                      onClick={() =>
                        onAskChatQuestion(
                          `I completed the quiz on "${topicInput || 'this topic'}". Please explain the concepts I missed with an intuitive everyday analogy.`
                        )
                      }
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Review with AI Tutor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
