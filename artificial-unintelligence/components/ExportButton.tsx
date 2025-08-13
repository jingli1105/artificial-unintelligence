"use client"

import { Download, FileText, File } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  rawData?: Array<Record<string, unknown>> | null;
}

interface ExportButtonProps {
  messages: ChatMessage[];
  uploadedFile: string | null;
}

export default function ExportButton({ messages, uploadedFile }: ExportButtonProps) {

  const exportToMarkdown = () => {
    let markdown = `# Chat Export\n\n`;
    
    if (uploadedFile) {
      markdown += `**File:** ${uploadedFile}\n\n`;
    }
    
    markdown += `**Exported:** ${new Date().toLocaleString()}\n\n---\n\n`;
    
    messages.forEach((message, index) => {
      const timestamp = message.timestamp.toLocaleString();
      const role = message.role === 'user' ? 'You' : 'Assistant';
      
      markdown += `## ${role} - ${timestamp}\n\n`;
      markdown += `${message.content}\n\n`;
      
      if (message.rawData) {
        markdown += `### Raw Data\n\n`;
        markdown += `\`\`\`json\n${JSON.stringify(message.rawData, null, 2)}\n\`\`\`\n\n`;
      }
      
      if (index < messages.length - 1) {
        markdown += `---\n\n`;
      }
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async () => {
    // For PDF export, we'll create HTML content and use the browser's print functionality
    // This is a simple approach that works without additional dependencies
    
    let htmlContent = `
      <html>
        <head>
          <title>Chat Export</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
            .header { border-bottom: 2px solid #ddd; padding-bottom: 20px; margin-bottom: 30px; }
            .message { margin-bottom: 30px; }
            .message-header { font-weight: bold; color: #666; margin-bottom: 10px; }
            .user { background: #f0f9ff; padding: 15px; border-left: 4px solid #0ea5e9; }
            .assistant { background: #f8fafc; padding: 15px; border-left: 4px solid #64748b; }
            .raw-data { background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; overflow-x: auto; margin-top: 15px; }
            .raw-data pre { margin: 0; font-size: 12px; }
            .timestamp { font-size: 14px; color: #9ca3af; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Chat Export</h1>
            ${uploadedFile ? `<p><strong>File:</strong> ${uploadedFile}</p>` : ''}
            <p><strong>Exported:</strong> ${new Date().toLocaleString()}</p>
          </div>
    `;
    
    messages.forEach(message => {
      const timestamp = message.timestamp.toLocaleString();
      const roleClass = message.role;
      const roleName = message.role === 'user' ? 'You' : 'Assistant';
      
      htmlContent += `
        <div class="message ${roleClass}">
          <div class="message-header">
            ${roleName} <span class="timestamp">${timestamp}</span>
          </div>
          <div>${message.content.replace(/\n/g, '<br>')}</div>
          ${message.rawData ? `
            <div class="raw-data">
              <strong>Raw Data:</strong>
              <pre>${JSON.stringify(message.rawData, null, 2)}</pre>
            </div>
          ` : ''}
        </div>
      `;
    });
    
    htmlContent += `
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 text-sm text-slate-400 hover:text-slate-300 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export Chat</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className= "bg-slate-800 border border-slate-800/40">
        <DropdownMenuItem onClick={exportToMarkdown} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          <span>Export as Markdown</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
          <File className="mr-2 h-4 w-4" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}