import { useState } from "react";
import data from "../../../data.json";
import { Send } from "lucide-react";
import Markdown from 'react-markdown';

const getAllContents = () => {
  let contents = [];
  for (const nav of data.navigation) {
    if (nav.content) contents.push(nav.content);
    if (nav.children) {
      for (const child of nav.children) {
        if (child.content) contents.push(child.content);
      }
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

const DocsChat = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "💬 Pose-moi une question sur la documentation !" }
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
    const webhookUrl = "http://localhost:5678/webhook/fdb75e32-b836-4de5-8e2f-326888d8ea63"

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatInput: userMessage.text }),
    }).then(res => console.log(res) || res);

    console.log("Response status:", response.status);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    
    let data = {};
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { answer: text }; // <- fallback si ce n'est pas JSON
      }
    }

    const botMessage = { 
      sender: "bot", 
      text: data.answer || "Désolé, une erreur est survenue." 
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
    <div className="h-3/4 bg-white border border-border-light rounded-lg shadow-2xl flex flex-col animate-fade-in-scale w-full max-w-3xl"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)", backdropFilter: "blur(2px)" }}>
      
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary to-blue-500 text-white rounded-t-2xl flex items-center justify-between">
        <span className="font-bold text-lg flex items-center gap-2">
          <span className="text-2xl">🤖</span> Chat Documentation
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar" style={{ scrollbarWidth: "thin" }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex w-full mt-2 ${msg.sender === "bot" ? "justify-start" : "justify-end"
          } animate-fade-in`}>
            <span className={`block px-3 py-2 rounded-xl shadow-sm max-w-[80%] break-words ${
              msg.sender === "bot" ? "bg-gray-100 text-gray-800 mr-auto" : "bg-primary text-white ml-auto"
            }`}>
              <Markdown>
                {msg.text}
              </Markdown>
            </span>
          </div>
        ))}
      
        {loading && (
          <div className="flex mt-1 justify-start">
            <Loader />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2 bg-gray-50 rounded-b-2xl">
        <input
          className="flex-1 border border-border-light rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Votre question..."
          onKeyDown={e => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button
          className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow transition-all flex items-center gap-2"
          onClick={handleSend}
          disabled={loading}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Custom scrollbar style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e7ef; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none;} }
        .animate-fade-in { animation: fade-in 0.3s; }
        .animate-fade-in-scale { animation: fade-in 0.4s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
};

export default DocsChat;
