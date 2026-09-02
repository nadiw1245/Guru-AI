import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Sparkles, User, Copy, Check, Volume2, VolumeX, HelpCircle, Lightbulb } from 'lucide-react';
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
    message.content.includes('මඟපෙන්වන ප්‍රශ්නය') ||
    message.content.includes('සිතා බලන්න') ||
    message.content.includes('ඉඟිය:');

  return (
    <div
      className={`group flex items-start gap-3.5 sm:gap-4 py-4 px-3.5 sm:px-5 rounded-2xl transition-all ${
        isAssistant
          ? 'bg-white border border-slate-200/80 shadow-xs hover:border-slate-300'
          : 'bg-amber-50/60 border border-amber-200/60'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
          isAssistant
            ? 'bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/20'
            : 'bg-slate-800 text-amber-200'
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
              {isAssistant ? 'සිංහල AI ගුරුතුමා (Sinhala AI Tutor)' : 'ඔබ (You)'}
            </span>
            {isAssistant && message.mode === 'assignment' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                <span>පැවරුම් මඟපෙන්වීම</span>
              </span>
            )}
            {isAssistant && message.mode === 'analogy' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                <span>එදිනෙදා උපමාව</span>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {isAssistant && onSpeak && (
              <button
                type="button"
                onClick={() => onSpeak(message.content)}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  isSpeaking
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={isSpeaking ? 'හඬ නැවැත්වීමට' : 'හඬින් සවන් දෙන්න (Listen in Voice)'}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-700 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs transition-colors"
              title="පිටපත් කරගන්න (Copy)"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Guiding Callout Badge if assignment guiding question */}
        {isAssistant && isGuidingQuestion && (
          <div className="bg-amber-100/70 border-l-4 border-amber-500 px-3 py-2 rounded-r-lg text-xs font-semibold text-amber-950 flex items-center gap-2">
            <span className="text-base">🎯</span>
            <span>
              <strong>සිතා බලන්න:</strong> සෘජු පිළිතුර ලබාගැනීමට වඩා පියවරෙන් පියවර තර්කනය සොයාගැනීම ඔබව දක්ෂ කරයි!
            </span>
          </div>
        )}

        {/* Text Content with Markdown */}
        <div className="text-sm sinhala-prose break-words">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    </div>
  );
};
