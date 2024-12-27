import { useState } from 'react';
import Link from 'next/link';
import { Menu, Grid, BarChart, PieChart, Settings, LucideScanFace,Plus } from 'lucide-react';
import './bg.css'

export default function Sidebar() {
    

    return (
        <div>
            
            <aside className='w-12 md:w-24 glass-bg h-screen mr-6 bg-gray-800  text-white  fixed '>


                <Link href="/">
                        <div className='flex justify-center items-center mt-4 '>
                            <img src="/logo1.png" alt="logo" className='w-24 h-10' />
                            </div>
                            
                        
                    </Link>
                {/* Navigation Links */}
                <nav className="mt-16 ">
                
                    
                    <Link href="/dashboard">
                        <button className="flex justify-center items-center gap-4 py-2.5 px-2  text-white hover:bg-gray-700 w-full">
                            <Grid size={30} />
                            
                        </button>
                    </Link>
                    <Link href="/report">
                        <button className="flex justify-center items-center gap-4 py-2.5 px-2 text-white hover:bg-gray-700 w-full">
                            <BarChart size={30}/>
                            
                        </button>
                    </Link>
                    
                    <Link href="/session">
                    <button className="flex justify-center items-center mt-8  gap-4 py-2.5 px-2 text-white bg-blue-700 hover:bg-blue-800 w-full rounded-md">
                        <Plus size={30}/>
                     
                    </button>
                </Link>
                </nav>
                
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
