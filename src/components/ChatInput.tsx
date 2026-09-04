import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, Compass, Sliders, BookOpen, Lightbulb } from 'lucide-react';
import { TutorMode } from '../types';
import { QUICK_PROMPTS_ENGLISH } from '../data/sampleTopics';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  mode: TutorMode;
  onOpenStudyGuide: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  mode,
  onOpenStudyGuide,
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition in English if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setVoiceNotice('Your browser does not support Speech Recognition. Please type your question.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setVoiceNotice(null);
      } catch (err) {
        console.error(err);
        setIsRecording(false);
        setVoiceNotice('Microphone access is unavailable.');
        setTimeout(() => setVoiceNotice(null), 4000);
      }
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const getModePlaceholder = () => {
    if (mode === 'sandbox' || mode === 'assignment') {
      return 'Type a prompt draft or ask: "How should I ask AI to help me draft a letter or plan a schedule?"...';
    }
    if (mode === 'analogy') {
      return 'Type any AI buzzword (e.g. Tokens, Neural Network, Hallucinations) for an everyday kitchen or car analogy...';
    }
    return 'Ask anything about AI from scratch! (e.g. "What is AI?", "Can AI think for itself?", "How do I use it?")...';
  };

  return (
    <div className="space-y-2">
      {/* Quick Prompts Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Quick Questions for Beginners:</span>
        </span>
        {QUICK_PROMPTS_ENGLISH.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInput(prompt);
              if (textareaRef.current) textareaRef.current.focus();
            }}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200 hover:border-indigo-300 text-slate-700 transition-all font-medium text-[11px] cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Main Input Box */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all p-2">
        {/* Mode Indicator Bar */}
        <div className="flex items-center justify-between px-2 pb-1.5 border-b border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            {mode === 'sandbox' || mode === 'assignment' ? (
              <span className="text-amber-800 font-semibold flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                <span>Prompt Lab: Learn how to talk to AI and write effective prompts</span>
              </span>
            ) : mode === 'analogy' ? (
              <span className="text-violet-800 font-semibold flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-violet-600" />
                <span>Everyday AI Analogies: Clear mental models mapped to real life</span>
              </span>
            ) : (
              <span className="text-indigo-800 font-semibold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Learn AI from Scratch: Friendly, step-by-step beginner guidance</span>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onOpenStudyGuide}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
          >
            <Compass className="w-3 h-3 text-slate-400" />
            <span>Beginner Guide & Myths</span>
          </button>
        </div>

        {/* Textarea */}
        <textarea
          id="tutor-chat-input-textarea"
          ref={textareaRef}
          value={input}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder={getModePlaceholder()}
          className="w-full resize-none p-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 placeholder:text-slate-400 max-h-40"
        />

        {voiceNotice && (
          <div className="mx-2 mb-2 p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium flex items-center justify-between">
            <span>ℹ️ {voiceNotice}</span>
            <button
              type="button"
              onClick={() => setVoiceNotice(null)}
              className="text-amber-700 hover:text-amber-950 text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-1">
            <button
              id="voice-mic-input-btn"
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                isRecording
                  ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={isRecording ? 'Stop voice recording' : 'Dictate with Voice (English)'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording && <span className="text-[11px] font-bold">Listening...</span>}
            </button>
          </div>

          <button
            id="send-chat-message-btn"
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span>Ask guruAI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
