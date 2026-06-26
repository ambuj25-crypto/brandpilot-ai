"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, AlertTriangle } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "ai",
  content:
    "Hello! I've reviewed your brand profile. What kind of campaign or content are we planning today?",
};

export default function StudioPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      // Send full history (excluding the initial AI greeting as it's not from Gemini)
      const historyToSend = updatedMessages.slice(1); // omit seed greeting

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: historyToSend.slice(0, -1), // history = everything before the new message
          message: trimmed,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to get a response.");

      setMessages((prev) => [...prev, { role: "ai", content: data.text }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0d0d0f] text-white">
      {/* Header */}
      <div className="flex-none px-6 py-4 border-b border-white/10 bg-[#111114]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">AI Content Studio</h1>
            <p className="text-xs text-gray-400">Your Social Media Strategist</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* AI avatar */}
            {msg.role === "ai" && (
              <div className="flex-none flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md shadow-blue-500/20">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-sm"
                  : "bg-[#1e1e24] border border-white/8 text-gray-200 rounded-bl-sm"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>

            {/* User avatar */}
            {msg.role === "user" && (
              <div className="flex-none flex h-7 w-7 items-center justify-center rounded-full bg-[#2a2a35] border border-white/10">
                <User className="h-3.5 w-3.5 text-gray-300" />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-end gap-2.5 justify-start">
            <div className="flex-none flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md shadow-blue-500/20">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="bg-[#1e1e24] border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Error message — shown as an inline chat bubble */}
        {error && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="flex-none flex h-7 w-7 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed shadow-lg bg-red-950/60 border border-red-500/30">
              <p className="text-red-300 font-semibold mb-0.5">Error</p>
              <p className="text-red-400 whitespace-pre-wrap break-words">{error}</p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex-none p-4 border-t border-white/10 bg-[#111114]/80 backdrop-blur-sm">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-grow: reset then set scrollHeight
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Message your strategist... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="w-full resize-none overflow-hidden bg-[#1e1e24] border border-white/10 rounded-xl px-4 py-3 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              style={{ minHeight: "48px", maxHeight: "160px" }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex-none flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-center text-xs text-gray-600 mt-2">
          Powered by Gemini · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
