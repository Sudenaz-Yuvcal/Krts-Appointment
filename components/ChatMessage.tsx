"use client";

import { User, Bot } from "lucide-react";
import { Message } from "@/type/chat";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  if (!message.text) return null;

  return (
    <div
      className={`flex items-start gap-3.5 max-w-[80%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs shrink-0 shadow-xs ${
          isUser ? "bg-[#4A1D24] text-white" : "bg-purple-100 text-purple-700"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className="space-y-3 w-full">
        <div
          className={`p-4 rounded-2xl text-sm font-semibold leading-relaxed shadow-xs ${
            isUser
              ? "bg-[#4A1D24] text-white rounded-tr-none"
              : "bg-white border border-purple-100 text-[#4A1D24] rounded-tl-none"
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}
