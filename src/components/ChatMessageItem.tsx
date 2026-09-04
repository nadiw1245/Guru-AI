import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Sparkles, User, Copy, Check, Volume2, VolumeX, Sliders, Lightbulb, BookOpen } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onSpeak,
  isSpeaking = false,
}) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if content contains guiding question cues
  const isGuidingQuestion =
    message.isGuidingQuestion ||
    message.content.toLowerCase().includes('guiding question') ||
    message.content.toLowerCase().includes('what do you think') ||
    message.content.toLowerCase().includes('give it a try');

  return (
    <div
      className={`group flex items-start gap-3.5 sm:gap-4 py-4 px-3.5 sm:px-5 rounded-2xl transition-all ${
        isAssistant
          ? 'bg-white border border-slate-200/80 shadow-xs hover:border-slate-300'
          : 'bg-indigo-50/60 border border-indigo-200/60'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
          isAssistant
            ? 'bg-linear-to-br from-indigo-600 via-violet-600 to-purple-600 text-white shadow-indigo-500/20'
            : 'bg-slate-800 text-indigo-200'
        }`}
      >
        {isAssistant ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header line */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">
              {isAssistant ? 'guruAI' : 'You'}
            </span>
            {isAssistant && (message.mode === 'sandbox' || message.mode === 'assignment') && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-amber-600" />
                <span>Prompt Lab</span>
              </span>
            )}
            {isAssistant && message.mode === 'analogy' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-violet-100 text-violet-900 border border-violet-200 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-violet-600" />
                <span>AI Analogy</span>
              </span>
            )}
            {isAssistant && (message.mode === 'learn' || message.mode === 'concept') && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-200 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-indigo-600" />
                <span>AI 101</span>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {isAssistant && onSpeak && (
              <button
                type="button"
                onClick={() => onSpeak(message.content)}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  isSpeaking
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={isSpeaking ? 'Stop voice readout' : 'Listen with Speech Synthesis'}
              >
                {isSpeaking ? (
                  <VolumeX className="w-3.5 h-3.5 text-indigo-700 animate-pulse" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs transition-colors cursor-pointer"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Guiding Callout Badge */}
        {isAssistant && isGuidingQuestion && (
          <div className="bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-950 flex items-center gap-2">
            <span className="text-base">💡</span>
            <span>
              <strong>guruAI Check-in:</strong> What are your thoughts? Give it a try in your own words!
            </span>
          </div>
        )}

        {/* Text Content with Markdown */}
        <div className="text-sm tutor-prose break-words">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    </div>
  );
};
