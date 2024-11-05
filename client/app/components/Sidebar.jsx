import { useState } from 'react';
import Link from 'next/link';
import { Menu, Grid, BarChart, PieChart, Settings, LucideScanFace } from 'lucide-react';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
        <div className=" w-full p-4 bg-gray-800 fixed  ">
            <div className='flex  rounded-md z-10 '>
                <button onClick={toggleSidebar} className="text-white hover:text-cyan-600 focus:outline-none rounded-md border-2 hover:border-cyan-600">
                    <Menu size={32} />
                </button>
                <span className='text-white bold ml-4 text-2xl uppercase font-bold'>Eloquence</span>
            </div>
                
        </div>
        <aside className={`${isOpen ? 'w-64' : 'w-0'} h-screen bg-gray-800 text-white fixed transition-width duration-300 `}>
            {/* Navigation Links */}
            {isOpen && (
                <>
            <nav className="mt-10">
                <Link href="/dashboard">
                    <button className="flex items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                    
                        <span>Dashboard</span>
                    </button>
                </Link>
                <Link href="/session-analysis">
                    <button className="flex items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                       
                        <span>Session Analysis</span>
                    </button>
                </Link>
                <Link href="/performance-history">
                    <button className="flex items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                       
                        <span>Performance History</span>
                    </button>
                </Link>
                <Link href="/insights">
                    <button className="flex items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                        
                        <span>Insights</span>
                    </button>
                </Link>
                <Link href="/settings">
                    <button className="flex items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                        
                      <span>Settings</span>
                    </button>
                </Link>
                
            </nav>
            <Link href="/session">
                    <button className="flex items-center ml-6 mt-8 gap-4 py-2.5 px-4 text-white bg-blue-700 hover:bg-blue-800 w-4/5 rounded-md">
                        <span>New Session</span>
                    </button>
                </Link>
                </>
)}
        </aside>
        </div>
    );
}
