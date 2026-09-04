import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, Loader2, RotateCcw, Award, Lightbulb, ArrowRight, ShieldAlert } from 'lucide-react';
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
    'AI Basics & Myths for Beginners',
    'How LLMs (ChatGPT & Gemini) Predict Words',
    'What Are Tokens & Why They Matter',
    'AI Hallucinations & Truth Verification',
    'Everyday AI Prompting Skills',
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
              AI Literacy & Mythbuster Quiz
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Check your understanding, bust common AI myths, and test your intuition with fun everyday explanations.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Topic Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Choose an AI topic to test your knowledge:
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
              placeholder="e.g. AI Basics for Dad, Tokens, How ChatGPT works, Prompting rules..."
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
            <button
              id="generate-quiz-btn"
              onClick={() => handleGenerateQuiz()}
              disabled={loading || !topicInput.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Quiz...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start AI Quiz</span>
                </>
              )}
            </button>
          </div>

          {/* Starter Topics */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Popular Quizzes:</span>
            {starterTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTopicInput(topic);
                  handleGenerateQuiz(topic);
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200 hover:border-emerald-200 text-slate-700 transition-all font-medium cursor-pointer"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Questions Display */}
        {questions.length > 0 && (
          <div className="mt-6 space-y-5 animate-in fade-in duration-300">
            {/* Score Banner when completed */}
            {showResults && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Quiz Completed! You scored {calculateScore()} out of {questions.length}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {calculateScore() === questions.length
                        ? 'Master-level understanding! Your intuition for AI is rock solid.'
                        : 'Great effort! Review the everyday explanations below to solidify your understanding.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setShowResults(false);
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Retry Questions</span>
                </button>
              </div>
            )}

            <div className="space-y-4">
              {questions.map((q, qIndex) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const selected = selectedAnswers[q.id];
                const isCorrect = selected === q.correctIndex;

                return (
                  <div
                    key={q.id || qIndex}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold shrink-0 mt-0.5">
                          Q{qIndex + 1}
                        </span>
                        <span>{q.question}</span>
                      </h4>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {q.options.map((option, optIdx) => {
                        let btnStyle =
                          'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-800';

                        if (selected === optIdx) {
                          btnStyle =
                            'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                        }

                        if (showResults) {
                          if (optIdx === q.correctIndex) {
                            btnStyle =
                              'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold';
                          } else if (selected === optIdx && !isCorrect) {
                            btnStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                          } else {
                            btnStyle = 'bg-white border-slate-200 opacity-60 text-slate-600';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            disabled={showResults}
                            className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500 bg-white">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{option}</span>
                            </div>

                            {showResults && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {showResults && selected === optIdx && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Clue and Explanation after answering */}
                    {showResults && (
                      <div className="pt-3 border-t border-slate-200/80 space-y-2 text-xs">
                        <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/60 text-emerald-950 leading-relaxed">
                          <span className="font-bold block mb-1">Explanation:</span>
                          {q.explanation}
                        </div>

                        {q.analogyClue && (
                          <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/60 text-amber-950 flex items-start gap-2 text-[11px]">
                            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>
                              <strong>Analogy Clue:</strong> {q.analogyClue}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() =>
                              onAskChatQuestion(
                                `Can you explain more about this question from the quiz: "${q.question}"? The correct answer is "${q.options[q.correctIndex]}".`
                              )
                            }
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Discuss in guruAI Chat</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Check answers button */}
            {!showResults && (
              <div className="pt-2 flex justify-end">
                <button
                  id="check-quiz-answers-btn"
                  onClick={handleCheckAnswers}
                  disabled={Object.keys(selectedAnswers).length < questions.length}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Check Answers ({Object.keys(selectedAnswers).length}/{questions.length} answered)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
