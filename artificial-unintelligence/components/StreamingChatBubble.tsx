"use client"

import { useState, useEffect } from "react";
import RawDataModal from "./RawDataModal";

interface StreamingChatBubbleProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    rawData?: Array<Record<string, unknown>> | null;
  };
  isStreaming?: boolean;
}

export default function StreamingChatBubble({ message, isStreaming = false }: StreamingChatBubbleProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRawData, setShowRawData] = useState(false);

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
    <>
      <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[85%] lg:max-w-md ${
          message.role === 'user' ? 'items-end' : 'items-start'
        } flex flex-col space-y-2`}>
          <div className={`px-3 lg:px-4 py-2 rounded-lg ${
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
          {/* Raw Data Button - only for assistant messages with data */}
          {message.role === 'assistant' && message.rawData && !isStreaming && (
            <button
              onClick={() => setShowRawData(true)}
              className="text-xs text-slate-400 hover:text-slate-300 underline self-start"
            >
              See raw data
            </button>
          )}
        </div>
      </div>
      {/* Raw Data Modal */}
      <RawDataModal
        isOpen={showRawData}
        onClose={() => setShowRawData(false)}
        data={message.rawData}
      />
    </>
  );
}