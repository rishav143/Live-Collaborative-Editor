"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createId } from "./lib/id";
import { ChatSidebar } from "./components/ChatSidebar";

const CollaborativeEditor = dynamic(
  () => import("./components/CollaborativeEditor").then((m) => m.CollaborativeEditor),
  { ssr: false }
);

export default function Home() {
  const [roomId] = useState<string>(() => typeof window !== "undefined" ? (new URLSearchParams(window.location.search).get("room") || createId("room")) : "demo-room");
  const editorRef = useRef<{ insertTextAtSelection: (text: string) => void } | null>(null);

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-[1fr_360px]">
      <main className="p-4 md:p-6 overflow-auto">
        <CollaborativeEditor roomId={roomId} ref={editorRef} />
      </main>
      <aside className="border-l border-black/10 dark:border-white/10 p-4 md:p-6 h-full overflow-hidden">
        <ChatSidebar onInsertToEditor={(text) => editorRef.current?.insertTextAtSelection(text)} />
      </aside>
    </div>
  );
}
