"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { FloatingToolbar } from "../components/FloatingToolbar";

export type CollaborativeEditorRef = {
  insertTextAtSelection: (text: string) => void;
};

export function getRandomColor(): string {
  const colors = ["#ef4444", "#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#06b6d4"];
  return colors[Math.floor(Math.random() * colors.length)];
}

export const CollaborativeEditor = forwardRef<CollaborativeEditorRef, { roomId: string }>(
  ({ roomId }, ref) => {
    const ydoc = useMemo(() => new Y.Doc(), []);
    const [provider, setProvider] = useState<WebrtcProvider | null>(null);
    const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
    const [selectedText, setSelectedText] = useState<string>("");

    const userName = useMemo(() => `user-${Math.floor(Math.random() * 1000)}`, []);
    const userColor = useMemo(() => getRandomColor(), []);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({ history: false }),
        Placeholder.configure({ placeholder: "Start typing..." }),
        Collaboration.configure({ document: ydoc }),
        ...(provider
          ? [
              CollaborationCursor.configure({
                provider,
                user: { name: userName, color: userColor },
              }),
            ]
          : []),
      ],
      content: "",
      onSelectionUpdate: ({ editor }) => {
        const { from, to } = editor.state.selection;
        if (from !== to) {
          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            const rect = domSelection.getRangeAt(0).getBoundingClientRect();
            setSelectionRect(rect);
            setSelectedText(domSelection.toString());
          }
        } else {
          setSelectionRect(null);
          setSelectedText("");
        }
      },
    }, [provider, userName, userColor, ydoc]);

    useEffect(() => {
      const p = new WebrtcProvider(roomId, ydoc, { signaling: ["wss://signaling.yjs.dev"] });
      setProvider(p);
      return () => {
        p.destroy();
        setProvider(null);
      };
    }, [roomId, ydoc]);

    useImperativeHandle(ref, () => ({
      insertTextAtSelection: (text: string) => {
        if (!editor) return;
        const { from, to } = editor.state.selection;
        editor.commands.insertContentAt({ from, to }, text);
      },
    }));

    return (
      <div className="relative">
        <div className="border rounded-lg p-4 min-h-[320px]">
          <EditorContent editor={editor} className="tiptap" />
        </div>
        {selectionRect && selectedText ? (
          <FloatingToolbar
            rect={selectionRect}
            selectedText={selectedText}
            onClose={() => setSelectionRect(null)}
            onApply={(replacement: string) => {
              if (!editor) return;
              const { from, to } = editor.state.selection;
              editor.commands.insertContentAt({ from, to }, replacement);
              setSelectionRect(null);
            }}
          />
        ) : null}
      </div>
    );
  }
);

CollaborativeEditor.displayName = "CollaborativeEditor";


