import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { WelcomeBanner } from './components/WelcomeBanner';
import { ChatMessageItem } from './components/ChatMessageItem';
import { ChatInput } from './components/ChatInput';
import { PromptSandboxPanel } from './components/PromptSandboxPanel';
import { AnalogyExplorerPanel } from './components/AnalogyExplorerPanel';
import { QuizPanel } from './components/QuizPanel';
import { StudyGuideModal } from './components/StudyGuideModal';
import { ChatMessage, TutorMode, StudentLevel, TopicSuggestion } from './types';
import {
  Sparkles,
  Loader2,
  BookOpen,
  Sliders,
  Lightbulb,
  CheckCircle2,
  Compass,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<TutorMode>('learn');
  const [studentLevel, setStudentLevel] = useState<StudentLevel>('dad_beginner');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [isStudyGuideOpen, setIsStudyGuideOpen] = useState<boolean>(false);
  const [activeSpeakingText, setActiveSpeakingText] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  // Handle Text-To-Speech (English)
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (activeSpeakingText === text) {
        setActiveSpeakingText(null);
        return;
      }
    }

    const cleanText = text
      .replace(/[*#`_~[\]()]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;

    utterance.onend = () => {
      setActiveSpeakingText(null);
    };

    utterance.onerror = () => {
      setActiveSpeakingText(null);
    };

    setActiveSpeakingText(text);
    window.speechSynthesis.speak(utterance);
  };

  // Reset chat
  const handleResetChat = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeakingText(null);
    setMessages([]);
  };

  // Send message to Streaming endpoint
  const handleSendMessage = async (userPrompt: string, overrideMode?: TutorMode) => {
    const activeMode = overrideMode || mode;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: Date.now(),
      mode: activeMode,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const placeholderAssistant: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      mode: activeMode,
    };

    setMessages([...newMessages, placeholderAssistant]);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode: activeMode,
          studentLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || 'Failed to connect to guruAI. Please check your API configuration and try again.'
        );
      }

      if (!response.body) {
        throw new Error('Response stream is not available.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const jsonStr = trimmed.slice(6).trim();
            if (!jsonStr || jsonStr === '[DONE]') continue;
            try {
              const data = JSON.parse(jsonStr);
              if (data.error) {
                throw new Error(data.error);
              }
              if (data.text) {
                accumulatedText += data.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId ? { ...msg, content: accumulatedText } : msg
                  )
                );
              }
            } catch (err: any) {
              if (err.message && !jsonStr.includes('"done":true')) {
                console.warn('Stream chunk parsing note:', err);
              }
            }
          }
        }
      }

      if (audioEnabled && accumulatedText) {
        handleSpeakText(accumulatedText);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errMsg = err?.message || 'Unable to complete response.';
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: `⚠️ **Error Encountered:** ${errMsg}\n\nPlease ensure your **GEMINI_API_KEY** is configured in your platform settings / environment variables.`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Starter Topic Selection
  const handleSelectTopic = (topic: TopicSuggestion) => {
    setMode(topic.mode);
    handleSendMessage(topic.prompt, topic.mode);
  };

  const isLearnMode = mode === 'learn' || mode === 'concept';
  const isSandboxMode = mode === 'sandbox' || mode === 'assignment';
  const isAnalogyMode = mode === 'analogy';
  const isQuizMode = mode === 'quiz';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-950 font-sans">
      {/* Top Navigation */}
      <Navbar
        mode={mode}
        setMode={setMode}
        studentLevel={studentLevel}
        setStudentLevel={setStudentLevel}
        onResetChat={handleResetChat}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        onOpenStudyGuide={() => setIsStudyGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Main Workspace Column */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Active Mode Notice Header */}
          <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {isLearnMode && <BookOpen className="w-4 h-4 text-indigo-600" />}
                {isSandboxMode && <Sliders className="w-4 h-4 text-amber-600" />}
                {isAnalogyMode && <Lightbulb className="w-4 h-4 text-violet-600" />}
                {isQuizMode && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                <span>
                  Active Mode:{' '}
                  {isLearnMode && 'AI 101: Learn Artificial Intelligence from Scratch'}
                  {isSandboxMode && 'Prompt Sandbox & Lab: Learn How to Talk to AI'}
                  {isAnalogyMode && 'Everyday Household AI Analogies'}
                  {isQuizMode && 'AI Literacy & Mythbuster Quiz'}
                </span>
              </span>
            </div>

            <div className="text-[11px] font-medium text-slate-500">
              {messages.length > 0 ? `${messages.length} messages` : 'Ready to Learn'}
            </div>
          </div>

          {/* Chat Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 min-h-[440px] max-h-[640px] overflow-y-auto bg-slate-100/70 rounded-3xl p-4 sm:p-5 border border-slate-200/80 space-y-4 shadow-inner"
          >
            {messages.length === 0 ? (
              <WelcomeBanner
                onSelectTopic={handleSelectTopic}
                onSetMode={(m) => setMode(m)}
              />
            ) : (
              messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  onSpeak={handleSpeakText}
                  isSpeaking={activeSpeakingText === msg.content}
                />
              ))
            )}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex items-center gap-2 p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 shadow-2xs">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                <span>guruAI is thinking & crafting your explanation...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            mode={mode}
            onOpenStudyGuide={() => setIsStudyGuideOpen(false)}
          />
        </div>

        {/* Right Interactive Sidebar Panels */}
        <div className="lg:col-span-4 space-y-5">
          {isSandboxMode ? (
            <PromptSandboxPanel
              onSendToChat={(prompt) => handleSendMessage(prompt, 'sandbox')}
              studentLevel={studentLevel}
            />
          ) : isAnalogyMode ? (
            <AnalogyExplorerPanel
              studentLevel={studentLevel}
              onAskFollowUp={handleSendMessage}
              onSpeakText={handleSpeakText}
            />
          ) : isQuizMode ? (
            <QuizPanel onAskChatQuestion={handleSendMessage} />
          ) : (
            <div className="space-y-4">
              <PromptSandboxPanel
                onSendToChat={(prompt) => handleSendMessage(prompt, 'sandbox')}
                studentLevel={studentLevel}
              />

              <div className="p-4 rounded-2xl bg-linear-to-br from-violet-50 to-indigo-50/70 border border-violet-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 text-violet-950 font-bold text-xs">
                  <Lightbulb className="w-4 h-4 text-violet-600" />
                  <span>Confused by an AI buzzword?</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Explore how Tokens, Neural Networks, Hallucinations, and Image Diffusion work using simple everyday kitchen and garage metaphors.
                </p>
                <button
                  id="switch-to-analogy-mode-btn"
                  onClick={() => setMode('analogy')}
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Open Everyday AI Analogies</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Beginner Strategy & Mythbuster Guide Modal */}
      <StudyGuideModal
        isOpen={isStudyGuideOpen}
        onClose={() => setIsStudyGuideOpen(false)}
        onInsertPrompt={(prompt) => {
          setIsStudyGuideOpen(false);
          handleSendMessage(prompt);
        }}
      />
    </div>
  );
}
