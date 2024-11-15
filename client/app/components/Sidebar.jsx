import { useState } from 'react';
import Link from 'next/link';
import { Menu, Grid, BarChart, PieChart, Settings, LucideScanFace,Plus } from 'lucide-react';

export default function Sidebar() {
    

    return (
        <div>
            
            <aside
                className='w-24 h-screen bg-gray-800 text-white  fixed'
            >
                <Link href="/">
                        <div className='flex justify-center items-center mt-4 '>
                            <img src="/logo.png" alt="logo" className='w-20 h-20' />
                            </div>
                            
                        
                    </Link>
                {/* Navigation Links */}
                <nav className="mt-16 ">
                
                    
                    <Link href="/dashboard">
                        <button className="flex justify-center items-center gap-4 py-2.5 px-4  text-white hover:bg-gray-700 w-full">
                            <Grid size={36} />
                            
                        </button>
                    </Link>
                    <Link href="/session-analysis">
                        <button className="flex justify-center items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                            <BarChart size={36}/>
                            
                        </button>
                    </Link>
                    <Link href="/performance-history">
                        <button className="flex justify-center items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                            <PieChart size={36}/>
                            
                        </button>
                    </Link>
                    <Link href="/insights">
                        <button className="flex justify-center items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                            <LucideScanFace size={36}/>
                            
                        </button>
                    </Link>
                    <Link href="/settings">
                        <button className="flex justify-center items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                            <Settings size={36}/>
                           
                        </button>
                    </Link>

                </nav>
                <Link href="/session">
                    <button className="flex justify-center items-center  mt-8  py-2.5  mx-2 text-white bg-blue-700 hover:bg-blue-800 w-4/5 rounded-md">
                        <Plus size={36}/>
                     
                    </button>
                </Link>
            </aside>
        </div>
    );
}
