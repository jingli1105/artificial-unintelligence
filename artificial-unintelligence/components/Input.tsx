"use client"

import { useState, useRef } from "react";
import { uploadFile } from "@/lib/api";
import { Progress } from "@/components/ui/progress";

interface TabbedInputProps {
  onSubmit: (inputValue: string) => void;
  onFileUploaded?: (filename: string) => void;
}

export default function TabbedInput({ onSubmit, onFileUploaded }: TabbedInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onSubmit(inputValue);
    setInputValue('');
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    // Simulate progress for mock uploads
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 20, 90));
    }, 300);

    try {
      await uploadFile(file);
      setUploadProgress(100);
      setTimeout(() => {
        console.log('File uploaded successfully:', file.name);
        onFileUploaded?.(file.name);
        // Reset states
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 500);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => setIsUploading(false), 500);
    }
  };

  const retryUpload = () => {
    setUploadError(null);
    if (fileInputRef.current?.files?.[0]) {
      handleFileChange({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.pdf,.doc,.docx,.json"
        className="hidden"
      />

      {/* Upload Progress */}
      {isUploading && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700">Uploading file...</span>
            <span className="text-sm text-blue-600">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-700">{uploadError}</span>
            <button
              onClick={retryUpload}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Input Field */}
      <div className="p-2 lg:p-4">
        <div className="relative flex items-center">
          <button 
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors cursor-pointer ${
              isUploading 
                ? 'text-blue-500 cursor-not-allowed' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={handleFileUpload}
            disabled={isUploading}
            title={isUploading ? "Uploading..." : "Upload file"}
          >
            {isUploading ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                <path d="M21 12A9 9 0 11.64 9.64"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v8"/>
                <path d="M8 12h8"/>
              </svg>
            )}
          </button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={`Upload a transcript to get started...`}
            className="w-full p-3 pl-12 pr-12 border border-gray-800 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent text-slate-300 placeholder-gray-500 text-base lg:text-sm"
            rows={1}
          />
          {inputValue.trim() && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-600 transition-colors"
              onClick={handleSubmit}
              title="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}