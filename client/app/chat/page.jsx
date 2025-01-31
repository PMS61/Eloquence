"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Send } from "lucide-react";
import { Inter, Roboto_Mono } from "next/font/google";
import Markdown from "markdown-to-jsx";
import "../components/bg.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    console.log("Sending message to API:", userMessage);

    try {
      const response = await fetch(
        "https://aurum79-langflow.hf.space/api/v1/run/ffd2d954-40e6-41a8-aa0d-63eb0f14e169?stream=false",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer <TOKEN>",
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_LANGFLOW_API_KEY,
          },
          body: JSON.stringify({
            input_value: userMessage.content,
            output_type: "chat",
            input_type: "chat",
            tweaks: {
              "ChatInput-O8Dm1": {},
              "ChatOutput-gop4R": {},
              "GroqModel-akwmH": {},
              "CombineText-OgpZW": {},
              "TextInput-LiP6A": {},
            },
          }),
        }
      );

      const data = await response.json();
      console.log("API response:", data);

      if (data?.outputs) {
        const assistantMessage = {
          role: "assistant",
          content: data.outputs[0].outputs[0].artifacts.message,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="flex w-full max-h-full min-h-screen bg-[#0F172A]">
        <div className="w-full h-full">
          <div className="flex flex-col mx-4 mt-4 ml-16 md:ml-28">
            <div className="w-full h-[95vh] flex flex-col rounded-lg overflow-hidden bg-[#1E293B] border border-[#334155]">
              <div className="p-4 border-b border-[#334155]">
                <h1
                  className={`${robotoMono.className} text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-[#3ABDF8] to-[#818CF8] bg-clip-text`}
                >
                  Chat Assistant
                </h1>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-[#3ABDF8] to-[#818CF8] text-white"
                          : "bg-[#334155] text-[#C9CBD0]"
                      }`}
                    >
                      <div className={`${inter.className} prose prose-invert max-w-none`}>
                        <Markdown>{message.content}</Markdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#334155] text-[#C9CBD0] max-w-[70%] rounded-lg p-3">
                      <p className={`${inter.className}`}>Thinking...</p>
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-[#334155]"
              >
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 text-[#C9CBD0] placeholder-[#818CF8] border border-[#334155] rounded-lg bg-[#1E293B] focus:outline-none focus:border-[#3ABDF8]"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className={`bg-gradient-to-r from-[#3ABDF8] to-[#818CF8] text-white p-3 rounded-lg hover:opacity-90 focus:outline-none transition-all duration-200 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
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
          background: linear-gradient(to bottom, #3ABDF8, #818CF8);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #3ABDF8, #6B7BFF);
        }
      `}</style>
    </div>
  );
}