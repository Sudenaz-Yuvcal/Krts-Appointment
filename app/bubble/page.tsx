"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowLeft, Send, Bot } from "lucide-react";
import { Message ,ApiResponse } from "@/type/chat";
import ChatMessage from "@/components/ChatMessage";
import ResultCard from "@/components/ResultCard";
import SupportCard from "@/components/SupportCard";
import ExitModal from "@/ui/exit-modal";

export default function BubblePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const [detectedService, setDetectedService] = useState("");
  const [detectedLocation, setDetectedLocation] = useState("");
  const [showResultCard, setShowResultCard] = useState(false);
  const [showSupportCard, setShowSupportCard] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showResultCard, showSupportCard]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
      setMessages([
        {
          id: "w-1",
          sender: "bot",
          text: "Merhaba! Ben KRTS AI Asistanınız. Bugün size özel elit salonlarımızı ve uzmanlarımızı bulmak için buradayım. ✨",
          type: "text",
        },
        {
          id: "w-2",
          sender: "bot",
          text: "Bana yaptırmak istediğiniz işlemi ve hangi bölgede olduğunuzu söyler misiniz? İster tek tek, ister tek bir cümlede yazın, sizi dinliyorum! 😊",
          type: "text",
        },
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const askGemini = async (
    userMessage: string,
    chatHistory: Message[],
  ): Promise<ApiResponse | null> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: chatHistory }),
      });

      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("AI bağlantı hatası:", err);
      return null;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    setInputValue("");

    const updatedMessages: Message[] = [
      ...messages,
      {
        id: Math.random().toString(),
        sender: "user",
        text: userText,
        type: "text",
      },
    ];
    setMessages(updatedMessages);
    setIsTyping(true);

    const aiResponse = await askGemini(userText, updatedMessages);
    setIsTyping(false);

    if (!aiResponse) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: "Bağlantımda ufak bir kopukluk oldu ama sorun değil, sizi hemen canlı destek hattımıza aktarabilirim.",
          type: "text",
        },
      ]);
      setShowSupportCard(true);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: "bot",
        text: aiResponse.reply,
        type: "text",
      },
    ]);

    if (aiResponse.extractedData) {
      const { service, location, status } = aiResponse.extractedData;

      if (service) setDetectedService(service);
      if (location) setDetectedLocation(location);

      if (status === "SUCCESS") {
        setShowResultCard(true);
      } else if (status === "FALLBACK") {
        setShowSupportCard(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5F7] text-[#4A1D24] flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Dekoratif Arka Plan Yuvarlakları */}
      <div className="absolute top-0 left-1/4 w-125 h-125 bg-purple-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-pink-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Ana Chat Kapsayıcısı */}
      <div className="w-full max-w-4xl bg-white border border-purple-200/60 rounded-3xl shadow-2xl flex flex-col h-[85vh] relative z-10 overflow-hidden">
        {/* Chat Header Bölümü */}
        <div className="flex items-center justify-between p-5 border-b border-purple-100 bg-white/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-md relative shrink-0">
              <Bot className="w-5 h-5" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-purple-600 uppercase">
                <Sparkles className="w-3 h-3 fill-purple-200 animate-pulse" />{" "}
                GEMINI REAL-TIME AI
              </div>
              <h1 className="text-base font-black text-[#2D0F14]">
                Akıllı Randevu Asistanı
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsExitModalOpen(true)}
            className="flex items-center gap-1 text-xs font-black text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-slate-100 px-3 py-1.5 rounded-xl bg-slate-50/50"
          >
            <ArrowLeft className="w-4 h-4" /> Çıkış Yap
          </button>
        </div>

        {/* Chat İçerik ve Balon Alanı */}
        {isInitializing ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-slate-50/50">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black tracking-wider text-purple-600 uppercase animate-pulse">
              Görüşme Başlatılıyor...
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {/* Dinamik Mesaj Listesi */}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Canlı Destek Durum Kartı */}
            {showSupportCard && <SupportCard />}

            {/* Başarılı Eşleşme ve Sonuç Kartı */}
            {showResultCard && (
              <ResultCard
                detectedLocation={detectedLocation}
                detectedService={detectedService}
              />
            )}

            {/* Bot Yazıyor Üç Nokta Animasyonu */}
            {isTyping && (
              <div className="flex items-start gap-3.5 max-w-[80%] mr-auto animate-pulse">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-purple-100 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-none font-black text-sm flex items-center gap-1">
                  <span className="animate-bounce [animation-delay:-0.3s]">
                    •
                  </span>
                  <span className="animate-bounce [animation-delay:-0.15s]">
                    •
                  </span>
                  <span className="animate-bounce">•</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Mesaj Gönderme Formu Alt Alanı */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-purple-100 bg-white flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isInitializing || isTyping}
            placeholder="Mesajınızı özgürce yazın..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all text-[#4A1D24] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isInitializing || isTyping || !inputValue.trim()}
            className="w-12 h-12 bg-[#4A1D24] text-white rounded-xl flex items-center justify-center hover:bg-purple-700 transition-all cursor-pointer shadow-md shrink-0 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Görüşmeden Çıkış Onay Modalı */}
      <ExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
      />
    </div>
  );
}
