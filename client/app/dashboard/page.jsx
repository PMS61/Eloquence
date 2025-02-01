"use client";
import Sidebar from '../components/Sidebar';
import PerformanceChart from '../components/PerformanceChart';
import PerformanceMetrics from '../components/OverallScore';
import RecentSessions from './Recents';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import '../components/bg.css';

export default function Dashboard() {
    const { userId } = useParams();
    const [localUserId, setLocalUserId] = useState('');

    // Fetch userId from local storage when the component mounts
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setLocalUserId(storedUserId);
        }
    }, []);

    return (
        <div>
            <Sidebar />
            <div className="flex w-full static-bg min-h-screen max-h-full">
                <div className="w-full h-full">
                    <div className="flex flex-col mt-4 md:flex-row ml-16 md:ml-28 mx-1 mb-6">
                        <div className="w-full h-full md:w-7/12">
                            {/* PerformanceChart now fetches its own data */}
                            <PerformanceChart />
                        </div>
                        <div className="flex-1 px-6 md:mt-4 ">
                            {/* Pass the userId from local storage to PerformanceMetrics */}
                            <PerformanceMetrics userId={localUserId} />
                        </div>
                    </div>
                    <div className='flex ml-16 md:ml-28 mx-1'>
                        <RecentSessions />
                    </div>
                </div>
            </div>
        </div>
    );
}