'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare } from 'lucide-react';

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Welcome! This is a centered chat assistant. How can I help?',
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');

    // Simulated Bot Reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I'm processing your request...",
          sender: 'bot'
        }
      ]);
    }, 800);
  };

  return (
    <>
      {/* 1. PERSISTENT TOGGLE ICON (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex transform items-center justify-center rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 ${
            isOpen ? 'bg-zinc-800 text-white' : 'bg-blue-600 text-white'
          }`}
        >
          {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </button>
      </div>

      {/* 2. CENTERED CHAT BODY WITH MOTION */}
      <AnimatePresence>
        {isOpen && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
            {/* Dark Overlay (Optional - click to close) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="pointer-events-auto absolute inset-0 bg-black/20 backdrop-blur-sm"
            />

            {/* Chat Box - Max width mimics AI Studio (approx 768px - 1024px) */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="pointer-events-auto relative flex h-[650px] max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-blue-500" />
                  <span className="font-bold uppercase tracking-tighter text-zinc-700 dark:text-zinc-200">
                    AI Studio Assistant
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 transition-colors hover:text-zinc-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Body (Display area on top) */}
              <div
                ref={scrollRef}
                className="scrollbar-thin scrollbar-thumb-zinc-300 flex-1 space-y-6 overflow-y-auto scroll-smooth p-8"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'rounded-br-none bg-blue-600 text-white'
                          : 'rounded-bl-none bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input (Bottom) */}
              <div className="border-t border-zinc-100 bg-gradient-to-t from-zinc-50 to-white p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900">
                <form onSubmit={handleSendMessage} className="group relative">
                  <input
                    type="text"
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full rounded-2xl border-2 border-zinc-100 bg-white py-4 pl-6 pr-14 text-zinc-800 shadow-inner outline-none transition-all focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-blue-600 p-2.5 text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 disabled:bg-zinc-200 dark:disabled:bg-zinc-700"
                  >
                    <Send size={18} />
                  </button>
                </form>
                <div className="mt-3 text-center">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                    Powering your workflow
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatBot;
