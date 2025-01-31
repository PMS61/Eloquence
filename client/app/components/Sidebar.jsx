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
      <aside className="fixed w-12 h-screen mr-6 text-white bg-gray-800 md:w-24 glass-bg">
        <Link href="/">
          <div className="flex items-center justify-center mt-4">
            <img src="/logo1.png" alt="logo" className="w-24 h-10" />
          </div>
        </Link>

        <nav className="mt-16">
          <Link href="/dashboard">
            <button className="flex justify-center items-center gap-4 py-2.5 px-2 text-white hover:bg-gray-700 w-full">
              <Grid size={30} />
            </button>
          </Link>
          <Link href="/report">
            <button className="flex justify-center items-center gap-4 py-2.5 px-2 text-white hover:bg-gray-700 w-full">
              <BarChart size={30} />
            </button>
          </Link>
          <Link href="/chat">
            <button className="flex justify-center items-center gap-4 py-2.5 px-2 text-white hover:bg-gray-700 w-full">
              <MessageCircle size={30} />
            </button>
          </Link>
          <Link href="/session">
            <button className="flex justify-center items-center mt-8 gap-4 py-2.5 px-2 text-white bg-blue-700 hover:bg-blue-800 w-full rounded-md">
              <Plus size={30} />
            </button>
          </Link>
        </nav>

        {/* Display the username at the bottom */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-300">
          {username ? `Hi, ${username}` : "Loading..."}
        </div>
      </aside>

      <style jsx>{`
        .glass-bg {
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
        }
      `}</style>
    </div>
  );
}