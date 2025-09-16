import { useState } from "react";
import data from "../../../data.json";
import { Send, X } from "lucide-react";
import Markdown from 'react-markdown';

const getAllContents = () => {
  let contents = [];
  for (const section of data.sections) {
    contents.push(`# ${section.title}\n${section.description || ''}`);
    if (section.features?.length) {
      contents.push(`## Features\n${section.features.map(f => `- ${f}`).join('\n')}`);
    }
    if (section.benefits?.length) {
      contents.push(`## Benefits\n${section.benefits.map(b => `- ${b}`).join('\n')}`);
    }
    if (section.examples?.length) {
      contents.push(`## Examples\n${section.examples.map(e => `- ${e}`).join('\n')}`);
    }
    if (section.steps?.length) {
      contents.push(
        `## Steps\n${section.steps
          .map((s, i) => `${i + 1}. ${s.text}${s.image ? ` (Image: ${s.image})` : ''}`)
          .join('\n')}`
      );
    }
  }
  return contents.join("\n\n");
};

const Loader = () => (
  <div className="flex items-center gap-2 text-primary text-sm animate-pulse">
    <span className="w-2 h-2 rounded-full bg-primary"></span>
    <span className="w-2 h-2 rounded-full bg-primary"></span>
    <span className="w-2 h-2 rounded-full bg-primary"></span>
    <span>Recherche...</span>
  </div>
);

interface DocsChatProps {
  onClose: () => void;
}

interface WebhookResponse {
  answer?: string;
}

const DocsChat = ({ onClose }: DocsChatProps) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "💬 Posez-moi une question sur AH Digital !" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (loading) return;

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage = { sender: "user", text: trimmedInput };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const webhookUrl = "https://n8n-supabase-7soe.onrender.com/webhook/fdb75e32-b836-4de5-8e2f-326888d8ea63";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatInput: userMessage.text }),
      }).then(res => {
        console.log(res);
        return res;
      });

      console.log("Response status:", response.status);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      let data: WebhookResponse = {};
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text) as WebhookResponse;
        } catch {
          data = { answer: text }; // Fallback if response is not JSON
        }
      }

      const botMessage = { 
        sender: "bot", 
        text: data.answer ?? "Désolé, une erreur est survenue." 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Erreur lors de la communication avec n8n:", error);
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "Oups! Je n'ai pas pu me connecter au service. Veuillez réessayer."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md h-[600px] bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl flex flex-col animate-fade-in-scale"
      style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl flex items-center justify-between">
        <span className="font-bold text-lg flex items-center gap-2">
          <span className="text-2xl">📘</span> AH Digital Assistant
        </span>
        <button
          className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-all"
          onClick={onClose}
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex w-full mt-2 ${msg.sender === "bot" ? "justify-start" : "justify-end"} animate-slide-in`}
          >
            <span
              className={`block px-4 py-2 rounded-2xl shadow-md max-w-[80%] break-words ${
                msg.sender === "bot"
                  ? "bg-gray-100 text-gray-800 mr-auto"
                  : "bg-blue-600 text-white ml-auto"
              }`}
            >
              <Markdown>{msg.text}</Markdown>
            </span>
          </div>
        ))}
        {loading && (
          <div className="flex mt-2 justify-start">
            <Loader />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex gap-2">
        <input
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all bg-white shadow-sm"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Votre question sur AH Digital..."
          onKeyDown={e => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-2"
          onClick={handleSend}
          disabled={loading}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-subtle {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.3s ease-out; }
        .animate-slide-in { animation: slide-in 0.2s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.3s ease-out; }
        .animate-pulse-subtle { animation: pulse-subtle 2s infinite; }
      `}</style>
    </div>
  );
};

export default DocsChat;