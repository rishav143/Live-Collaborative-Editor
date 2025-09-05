"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, Wand2, Globe } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export const ChatSidebar: React.FC<{ onInsertToEditor: (text: string) => void }> = ({ onInsertToEditor }) => {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Ask me to edit text or search the web." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Always keep the view pinned to the latest message
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function send(tools?: { search?: boolean }) {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    setInput("");

    try {
      let endpoint = "/api/chat";
      let body: any = { messages: [...messages, userMsg] };
      if (tools?.search) {
        endpoint = "/api/agent/search";
        body = { query: userMsg.content };
      }
      const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const text = data.output ?? data.answer ?? JSON.stringify(data);
      setMessages((m) => [...m, { role: "assistant", content: text }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: "Error: " + e?.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full grid grid-rows-[1fr_auto]">
      <div ref={scrollRef} className="overflow-y-auto space-y-3 pr-1 h-full">
        {messages.map((m, i) => (
          <div key={i} className={`text-sm p-2 rounded ${m.role === "assistant" ? "bg-black/5" : "bg-blue-600 text-white"}`}>
            {m.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 text-sm bg-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!loading) send();
              }
            }}
            placeholder="Ask or instruct the AI..."
          />
          <button className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50" onClick={() => send()} disabled={loading}>
            <Send size={16} />
          </button>
        </div>
        <div className="flex gap-2">
          <button className="px-2 py-1 rounded bg-black/10 hover:bg-black/20 text-xs" onClick={() => onInsertToEditor(messages[messages.length - 1]?.content || "")}>
            <Wand2 size={14} className="inline mr-1" /> Insert last reply
          </button>
          <button className="px-2 py-1 rounded bg-black/10 hover:bg-black/20 text-xs" onClick={() => send({ search: true })}>
            <Globe size={14} className="inline mr-1" /> Web search
          </button>
        </div>
      </div>
    </div>
  );
};


