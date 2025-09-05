"use client";

import React, { useMemo, useState } from "react";
import { Wand2, Check, X, Shrink, StretchHorizontal, Table2 } from "lucide-react";
import { PreviewModal } from "../components/PreviewModal";
import { getServerUrl } from "../lib/server";

type Props = {
  rect: DOMRect;
  selectedText: string;
  onClose: () => void;
  onApply: (replacement: string) => void;
};

async function fetchEdit(prompt: string, input: string): Promise<string> {
  const baseUrl = getServerUrl();
  const res = await fetch(baseUrl + "/api/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, input }),
  });
  if (!res.ok) throw new Error("Failed to fetch edit");
  const data = await res.json();
  return data.output as string;
}

function toTable(text: string): string {
  const lines = text.split(/\n+/).filter(Boolean);
  if (lines.length === 0) return text;
  const cells = lines.map((l) => l.split(/[|,\t]/).map((c) => c.trim())).filter((row) => row.length > 0);
  if (cells.length === 0) return text;
  const header = cells[0];
  const body = cells.slice(1);
  let md = `| ${header.join(" | ")} |\n| ${header.map(() => "---").join(" | ")} |\n`;
  for (const row of body) md += `| ${row.join(" | ")} |\n`;
  return md;
}

export const FloatingToolbar: React.FC<Props> = ({ rect, selectedText, onClose, onApply }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ original: string; suggestion: string } | null>(null);
  const style = useMemo(() => {
    const padding = 10;
    const centerX = rect.left + rect.width / 2;
    const preferAbove = rect.top > 90; // if there's room above
    const top = preferAbove ? rect.top - padding : rect.bottom + padding;
    const left = Math.min(Math.max(centerX, padding), window.innerWidth - padding);
    const transform = preferAbove ? "translate(-50%, -100%)" : "translate(-50%, 0)";
    return { top, left, transform, preferAbove } as any;
  }, [rect]);

  const run = async (mode: "shorten" | "lengthen" | "improve" | "table") => {
    try {
      setLoading(mode);
      let suggestion = selectedText;
      if (mode === "table") {
        suggestion = toTable(selectedText);
      } else {
        const prompt = mode === "shorten" ? "Shorten and tighten the text, preserve meaning."
          : mode === "lengthen" ? "Expand with more detail and clarity, keep tone."
          : "Rewrite to be clearer and more polished without changing content.";
        suggestion = await fetchEdit(prompt, selectedText);
      }
      setPreview({ original: selectedText, suggestion });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const arrowColor = "#111";
  return (
    <div className="floating-toolbar is-dark group backdrop-blur-sm" style={{ top: (style as any).top, left: (style as any).left, transform: (style as any).transform }}>
      {/* Arrow */}
      {((style as any).preferAbove ? (
        <div className="absolute left-1/2 -translate-x-1/2 top-full" style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `6px solid ${arrowColor}` }} />
      ) : (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full" style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: `6px solid ${arrowColor}` }} />
      ))}
      <div className="flex items-center gap-1 text-white">
        <button className="px-2 py-1 rounded hover:bg-white/10 active:bg-white/20 transition-colors" onClick={() => run("improve")} disabled={!!loading} title="Edit with AI">
          <Wand2 size={16} className="text-white" />
        </button>
        <button className="px-2 py-1 rounded hover:bg-white/10 active:bg-white/20 transition-colors" onClick={() => run("shorten")} disabled={!!loading} title="Shorten">
          <Shrink size={16} className="text-white" />
        </button>
        <button className="px-2 py-1 rounded hover:bg-white/10 active:bg-white/20 transition-colors" onClick={() => run("lengthen")} disabled={!!loading} title="Lengthen">
          <StretchHorizontal size={16} className="text-white" />
        </button>
        <button className="px-2 py-1 rounded hover:bg-white/10 active:bg-white/20 transition-colors" onClick={() => run("table")} disabled={!!loading} title="Convert to table">
          <Table2 size={16} className="text-white" />
        </button>
        <button className="px-2 py-1 rounded hover:bg-white/10 active:bg-white/20 transition-colors" onClick={onClose} title="Close">
          <X size={16} className="text-white" />
        </button>
      </div>
      {preview ? (
        <PreviewModal
          original={preview.original}
          suggestion={preview.suggestion}
          onCancel={() => setPreview(null)}
          onConfirm={() => {
            onApply(preview.suggestion);
            setPreview(null);
          }}
        />
      ) : null}
    </div>
  );
};


