"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RawDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Array<Record<string, unknown>> | null | undefined;
}

export default function RawDataModal({ isOpen, onClose, data }: RawDataModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] border border-slate-800/40">
        <DialogHeader>
          <DialogTitle>Raw Data</DialogTitle>
          
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh]">
          <pre className="bg-slate-800/40 p-4 rounded-lg text-sm overflow-x-auto">
            <code>
              {JSON.stringify(data, null, 2)}
            </code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}