import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { WelcomeBanner } from './components/WelcomeBanner';
import { ChatMessageItem } from './components/ChatMessageItem';
import { ChatInput } from './components/ChatInput';
import { AssignmentRoadmapPanel } from './components/AssignmentRoadmapPanel';
import { AnalogyExplorerPanel } from './components/AnalogyExplorerPanel';
import { QuizPanel } from './components/QuizPanel';
import { SinglishHelperModal } from './components/SinglishHelperModal';
import { ChatMessage, TutorMode, StudentLevel, TopicSuggestion } from './types';
import { Sparkles, Loader2, BookOpen, HelpCircle, Lightbulb, CheckCircle2, MessageSquare } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<TutorMode>('concept');
  const [studentLevel, setStudentLevel] = useState<StudentLevel>('beginner');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [isSinglishModalOpen, setIsSinglishModalOpen] = useState<boolean>(false);
  const [activeSpeakingText, setActiveSpeakingText] = useState<string | null>(null);
  const [activeProblemText, setActiveProblemText] = useState<string>('');

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

  // Handle Text-To-Speech
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('ඔබගේ බ්‍රවුසරය හඬ කියවීම (Speech Synthesis) සඳහා සහාය නොදක්වයි.');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (activeSpeakingText === text) {
        setActiveSpeakingText(null);
        return;
      }
    }

    // Clean markdown symbols for cleaner voice speech
    const cleanText = text
      .replace(/[*#`_~[\]()]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'si-LK'; // Sinhala
    utterance.rate = 0.95;

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
          errorData?.error || 'AI ගුරුතුමා සම්බන්ධ කරගැනීමේ දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.'
        );
      }

      if (!response.body) {
        throw new Error('ප්‍රතිචාර ප්‍රවාහය (Stream) ලබාගත නොහැක.');
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
        buffer = lines.pop() || ''; // Keep trailing incomplete segment

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

      // If audio enabled, speak completed message
      if (audioEnabled && accumulatedText) {
        handleSpeakText(accumulatedText);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errMsg = err?.message || 'නැවත උත්සාහ කරන්න.';
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: `⚠️ **දෝෂයක් සිදුවිය:** ${errMsg}\n\nකරුණාකර Settings වෙතින් **GEMINI_API_KEY** නිවැරදිව ලබා දී ඇත්දැයි පරීක්ෂා කර නැවත උත්සාහ කරන්න.`,
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
    if (topic.mode === 'assignment') {
      setActiveProblemText(topic.prompt);
    }
    handleSendMessage(topic.prompt, topic.mode);
  };

  // Handle Socratic Assignment Guidance initiation
  const handleStartAssignmentGuidance = (problemText: string) => {
    setMode('assignment');
    handleSendMessage(problemText, 'assignment');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-500/20 selection:text-amber-900">
      {/* Top Navigation */}
      <Navbar
        mode={mode}
        setMode={setMode}
        studentLevel={studentLevel}
        setStudentLevel={setStudentLevel}
        onResetChat={handleResetChat}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        onOpenSinglishModal={() => setIsSinglishModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Main Workspace Column */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Active Mode Notice / Mini Tab Bar */}
          <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                {mode === 'concept' && <BookOpen className="w-4 h-4 text-amber-600" />}
                {mode === 'assignment' && <HelpCircle className="w-4 h-4 text-orange-600" />}
                {mode === 'analogy' && <Lightbulb className="w-4 h-4 text-amber-500" />}
                {mode === 'quiz' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                <span>
                  වත්මන් මාදිලිය:{' '}
                  {mode === 'concept' && 'සංකල්ප ඉගෙනීම (Concept Learning)'}
                  {mode === 'assignment' && 'පැවරුම් මඟපෙන්වීම (Socratic Guidance)'}
                  {mode === 'analogy' && 'උපමා ගවේෂකය (Analogy Explorer)'}
                  {mode === 'quiz' && 'ස්වයං ඇගයීම (Self Quiz)'}
                </span>
              </span>
            </div>

            <div className="text-[11px] font-medium text-slate-500">
              {messages.length > 0 ? `${messages.length} පණිවිඩ` : 'සංවාදය සූදානම්'}
            </div>
          </div>

          {/* Chat Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 min-h-[440px] max-h-[640px] overflow-y-auto bg-slate-100/60 rounded-3xl p-4 sm:p-5 border border-slate-200/80 space-y-4"
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
                <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                <span>AI ගුරුතුමා පිළිතුර සකසමින් සිටී...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            mode={mode}
            onOpenSinglishModal={() => setIsSinglishModalOpen(true)}
          />
        </div>

        {/* Right Interactive Sidebar Panels */}
        <div className="lg:col-span-4 space-y-5">
          {/* Conditional panel based on current mode or quick access cards */}
          {mode === 'assignment' ? (
            <AssignmentRoadmapPanel
              activeProblemText={activeProblemText}
              onStartAssignmentGuidance={handleStartAssignmentGuidance}
            />
          ) : mode === 'analogy' ? (
            <AnalogyExplorerPanel
              studentLevel={studentLevel}
              onAskFollowUp={handleSendMessage}
              onSpeakText={handleSpeakText}
            />
          ) : mode === 'quiz' ? (
            <QuizPanel onAskChatQuestion={handleSendMessage} />
          ) : (
            // Default Concept Mode: Show Quick Socratic Assignment Coach & Quick Analogy Tool
            <div className="space-y-4">
              <AnalogyExplorerPanel
                studentLevel={studentLevel}
                onAskFollowUp={handleSendMessage}
                onSpeakText={handleSpeakText}
              />

              <div className="p-4 rounded-2xl bg-linear-to-br from-orange-50 to-amber-50 border border-orange-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 text-orange-950 font-bold text-xs">
                  <HelpCircle className="w-4 h-4 text-orange-600" />
                  <span>පැවරුමක් හෝ ගෙදර වැඩක් තියෙනවාද?</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  සෘජු පිළිතුර නොගෙන, ඔබ විසින්ම ගැටලුව විසඳා ගැනීමට AI ගුරුතුමාගේ Socratic මඟපෙන්වීම ලබාගන්න.
                </p>
                <button
                  id="switch-to-assignment-mode-btn"
                  onClick={() => setMode('assignment')}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                >
                  පැවරුම් මඟපෙන්වීමට පිවිසෙන්න
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Singlish Helper Modal */}
      <SinglishHelperModal
        isOpen={isSinglishModalOpen}
        onClose={() => setIsSinglishModalOpen(false)}
      />
    </div>
  );
}
