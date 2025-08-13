"use client"

import { useState, useEffect, useRef } from "react";
import Greeting from "./Greeting";
import FeatureCards from "./FeatureCards";
import TabbedInput from "./Input";
import ThinkingIndicator from "./ThinkingIndicator";
import StreamingChatBubble from "./StreamingChatBubble";
import { queryData } from "@/lib/api";
import { Trash2 } from "lucide-react";
import ExportButton from "./ExportButton";

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  rawData?: Array<Record<string, unknown>> | null;
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
        timestamp: new Date(),
        rawData: response.data
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
          {!uploadedFile && <FeatureCards />}
          
          {/* Show uploaded file info and sample questions */}
          {uploadedFile && (
            <div className="max-w-2xl w-full space-y-6">
              {/* File Upload Success */}
              <div className="flex justify-center">
                <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="9"/>
                  </svg>
                  <span className="font-medium">File uploaded: {uploadedFile}</span>
                </div>
              </div>
              
              {/* Sample Questions */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-300 mb-4">Try asking:</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {sampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleQuestion(question)}
                      className="text-left p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-slate-300 transition-colors border border-slate-600/20 hover:border-slate-500/30"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 mx-auto w-full max-w-4xl">
          {/* Header with Clear Chat and Export Buttons */}
          <div className="flex justify-between items-center mb-4 px-2 lg:px-4">
            <h2 className="text-lg font-semibold text-slate-300">Conversation</h2>
            <div className="flex items-center space-x-4">
              <ExportButton messages={messages} uploadedFile={uploadedFile} />
              <button
                onClick={clearChat}
                className="text-sm text-red-400 hover:text-red-300 underline"
              >
                <Trash2 className="h-6 w-6 text-red-700"/>
              </button>
            </div>
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
      <div className="sticky bottom-0 bg-background p-4">
        <div className="flex justify-center">
          <TabbedInput onSubmit={handleSubmit} onFileUploaded={handleFileUploaded} />
        </div>
      </div>
    </main>
  );
}