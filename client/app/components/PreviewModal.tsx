"use client";

import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { createPortal } from "react-dom";

export const PreviewModal: React.FC<{
  original: string;
  suggestion: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ original, suggestion, onCancel, onConfirm }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-3xl w-full p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-2">Original</div>
            <pre className="text-xs whitespace-pre-wrap bg-black/5 p-3 rounded">{original}</pre>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Suggestion</div>
            <pre className="text-xs whitespace-pre-wrap bg-black/5 p-3 rounded">{suggestion}</pre>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="px-3 py-1 rounded bg-black/10 hover:bg-black/20" onClick={onCancel}>
            <X className="inline mr-1" size={14} /> Cancel
          </button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={onConfirm}>
            <Check className="inline mr-1" size={14} /> Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};


