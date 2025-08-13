"use client"

import { useState, useEffect, useRef } from "react";
import Greeting from "./Greeting";
import FeatureCards from "./FeatureCards";
import TabbedInput from "./Input";
import ThinkingIndicator from "./ThinkingIndicator";
import StreamingChatBubble from "./StreamingChatBubble";
import { queryData } from "@/lib/api";
import { Trash2 } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const sampleQuestions = [
    "What are the main topics discussed?",
    "Who were the key participants?",
    "What decisions were made?",
    "Are there any action items?"
  ];

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = async (inputValue: string) => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);
    setIsChatMode(true);

    try {
      const response = await queryData(inputValue);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        role: 'assistant',
        timestamp: new Date()
      };
      
      // Start streaming the response
      setStreamingMessageId(assistantMessage.id);
      setMessages(prev => [...prev, assistantMessage]);
      
      // Stop streaming after the message is fully displayed
      setTimeout(() => {
        setStreamingMessageId(null);
      }, response.answer.length * 30 + 500); // Based on character count and streaming speed
      
    } catch (error) {
      console.error('Query failed:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleFileUploaded = (filename: string) => {
    setUploadedFile(filename);
    console.log('File uploaded to server:', filename);
  };

  const clearChat = () => {
    setMessages([]);
    setIsChatMode(false);
    setUploadedFile(null);
    setIsThinking(false);
    setStreamingMessageId(null);
  };

  const handleSampleQuestion = (question: string) => {
    handleSubmit(question);
  };


  return (
    <main className="font-sans flex flex-col p-4 lg:p-8 min-h-screen">
      {!isChatMode ? (
        <div className="flex flex-col items-center justify-center flex-1 space-y-8 lg:space-y-12">
          <Greeting name="John" />
          <FeatureCards />
        </div>
      ) : (
        <div className="flex-1 mx-auto w-full max-w-4xl">
          {/* Clear Chat Button */}
          <div className="flex justify-between items-center mb-4 px-2 lg:px-4">
            <h2 className="text-lg font-semibold text-slate-300">Conversation</h2>
            <button
              onClick={clearChat}
              className="text-sm text-red-400 hover:text-red-300 underline"
            >
              <Trash2 className="h-6 w-6 text-red-700"/>
            </button>
          </div>
          <div className="p-2 lg:p-4 space-y-4">
            {messages.map(message => (
              <StreamingChatBubble 
                key={message.id} 
                message={message} 
                isStreaming={streamingMessageId === message.id}
              />
            ))}
            {isThinking && <ThinkingIndicator />}
            {/* Auto-scroll target */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
      
      {/* Sticky input area at bottom */}
      <div className="sticky bottom-0 bg-background p-4 ">
        {uploadedFile && (
          <div className="mb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="9"/>
                </svg>
                <span className="text-sm">File uploaded: {uploadedFile}</span>
              </div>
            </div>
            
            {/* Sample Questions - only show if no conversation started */}
            {!isChatMode && (
              <div className="max-w-2xl mx-auto">
                <p className="text-sm text-slate-400 mb-3 text-center">Try asking:</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {sampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleQuestion(question)}
                      className="text-left p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-sm text-slate-300 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-center">
          <TabbedInput onSubmit={handleSubmit} onFileUploaded={handleFileUploaded} />
        </div>
      </div>
    </main>
  );
}