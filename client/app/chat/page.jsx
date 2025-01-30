"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Send } from "lucide-react";
import { Satisfy, Playfair_Display } from "next/font/google";
import "../components/bg.css";

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: ["400"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now(),
          text: inputMessage,
          sender: "user",
        },
      ]);
      setInputMessage("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: "This is a simulated response. Replace with actual API integration.",
            sender: "ai",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="flex w-full max-h-full min-h-screen static-bg">
        <div className="w-full h-full">
          <div className="flex flex-col mx-4 mt-4 ml-16 md:ml-28">
            {/* Main Chat Container */}
            <div className="glass-bg w-full h-[85vh] flex flex-col rounded-lg overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700">
                <h1
                  className={`${satisfy.className} text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text`}
                >
                  Chat Assistant
                </h1>
              </div>

              {/* Messages Container */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-[#0159a1] to-[#c6069c] text-white"
                          : "glass-bg text-gray-100"
                      }`}
                    >
                      <p className={`${playfair.className}`}>{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-700"
              >
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 text-gray-100 placeholder-gray-400 border border-gray-700 rounded-lg glass-bg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#0159a1] to-[#c6069c] text-white p-3 rounded-lg hover:opacity-90 focus:outline-none transition-all duration-200"
                  >
                    <Send size={24} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #0159a1, #c6069c);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0159a1, #8510c4);
        }
      `}</style>
    </div>
  );
}
