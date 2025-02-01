import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Grid,
  BarChart,
  MessageCircle,
  Plus,
} from "lucide-react";
import "./bg.css";

export default function Sidebar() {
  const [username, setUsername] = useState("");

  // Fetch the username from local storage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div>
      <aside className="fixed w-20 h-screen p-2 text-white bg-[#1E293B] border-r border-[#334155] shadow-lg">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center justify-center mt-6">
            <img src="/logo1.png" alt="logo" className="w-16 h-8" />
          </div>
        </Link>

        {/* Navigation */}
        <nav className="mt-12">
          <Link href="/dashboard">
            <button className="flex flex-col items-center justify-center gap-2 py-3 px-4 text-[#C9CBD0] hover:bg-[#334155] w-full transition-all duration-200">
              <Grid size={24} />
              <span className="text-xs">Dashboard</span>
            </button>
          </Link>
          <Link href="/allreports">
            <button className="flex flex-col items-center justify-center gap-2 py-3 px-4 text-[#C9CBD0] hover:bg-[#334155] w-full transition-all duration-200">
              <BarChart size={24} />
              <span className="text-xs">Reports</span>
            </button>
          </Link>
          <Link href="/chat">
            <button className="flex flex-col items-center justify-center gap-2 py-3 px-4 text-[#C9CBD0] hover:bg-[#334155] w-full transition-all duration-200">
              <MessageCircle size={24} />
              <span className="text-xs">Chat</span>
            </button>
          </Link>
          <Link href="/session">
            <button className="flex flex-col items-center justify-center gap-2 rounded-lg  py-3 px-4 mt-8 text-white bg-gradient-to-r from-[#3ABDF8] to-[#818CF8] hover:opacity-90 w-full transition-all duration-200">
              <Plus size={24} />
              <span className="text-xs">New Session</span>
            </button>
          </Link>
        </nav>

       
      </aside>
    </div>
  );
}