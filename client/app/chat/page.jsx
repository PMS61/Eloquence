"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Send } from "lucide-react";
import { Satisfy, Playfair_Display } from "next/font/google";
import Markdown from "markdown-to-jsx";
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
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userReports, setUserReports] = useState([]); // State to store user reports

  // Fetch user reports when the component mounts
  useEffect(() => {
    const fetchUserReports = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/user-reports-list?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setUserReports(data); // Store the fetched reports in state
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchUserReports();
  }, []);

  // Transform user reports into a string
  const transformReportsToString = () => {
    return userReports
      .map((report, index) => {
        return `Session ${index + 1}:
- Title: ${report.title || "Untitled Session"}
- Context: ${report.context || "No context available"}
- Transcription: ${report.transcription || "No transcription available"}
- Voice Score: ${report.scores.voice}
- Expressions Score: ${report.scores.expressions}
- Vocabulary Score: ${report.scores.vocabulary}
- Vocabulary Report: ${report.vocabulary_report || "No vocabulary report available"}
- Speech Report: ${report.speech_report || "No speech report available"}
- Expression Report: ${report.expression_report || "No expression report available"}`;
      })
      .join("\n\n");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    console.log("Sending message to API:", userMessage);

    try {
      // Transform reports into a string
      const reportsString = transformReportsToString();

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
              "TextInput-LiP6A": {
                value: reportsString, // Pass the reports string as a tweak
              },
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
      <div className="flex w-full max-h-full min-h-screen static-bg">
        <div className="w-full h-full ">
          <div className="flex flex-col mx-4 ml-16 md:ml-28">
            <div className="glass-bg w-full min-h-screen flex flex-col rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h1
                  className={`${satisfy.className} text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text`}
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
                          ? "bg-gradient-to-r from-[#0159a1] to-[#c6069c] text-white"
                          : "glass-bg text-gray-100"
                      }`}
                    >
                      <div className={`${playfair.className} prose prose-invert max-w-none`}>
                        <Markdown>{message.content}</Markdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="glass-bg text-gray-100 max-w-[70%] rounded-lg p-3">
                      <p className={`${playfair.className}`}>Thinking...</p>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 text-gray-100 placeholder-gray-400 border border-gray-700 rounded-lg glass-bg focus:outline-none focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className={`bg-gradient-to-r from-[#0159a1] to-[#c6069c] text-white p-3 rounded-lg hover:opacity-90 focus:outline-none transition-all duration-200 ${
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