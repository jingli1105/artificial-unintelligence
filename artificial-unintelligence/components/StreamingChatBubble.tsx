"use client"

import { useState, useEffect } from "react";

interface StreamingChatBubbleProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  };
  isStreaming?: boolean;
}

export default function StreamingChatBubble({ message, isStreaming = false }: StreamingChatBubbleProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isStreaming || message.role === 'user') {
      setDisplayedContent(message.content);
      return;
    }

    if (currentIndex < message.content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(message.content.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30); // Adjust speed here (lower = faster)

      return () => clearTimeout(timer);
    }
  }, [currentIndex, message.content, isStreaming, message.role]);

  // Reset when message content changes
  useEffect(() => {
    if (isStreaming && message.role === 'assistant') {
      setCurrentIndex(0);
      setDisplayedContent('');
    }
  }, [message.content, isStreaming, message.role]);

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        message.role === 'user' 
          ? 'bg-slate-600/40 text-slate-300' 
          : 'bg-slate-400 text-gray-800'
      }`}>
        <p className="text-sm whitespace-pre-wrap">
          {displayedContent}
          {isStreaming && message.role === 'assistant' && currentIndex < message.content.length && (
            <span className="animate-pulse">|</span>
          )}
        </p>
      </div>
    </div>
  );
}