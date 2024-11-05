"use client";
import Sidebar from '../components/Sidebar';
import PerformanceChart from '../components/PerformanceChart';
import PerformanceMetrics from '../components/OverallScore';
import RecentSessions from './Recents';

export default function Dashboard() {
    // Sample performance data (in a real app, this would come from your backend)
    const performanceData = {
        labels: ['Session 1', 'Session 2', 'Session 3', 'Session 4', 'Session 5'], // x-axis labels
        paceData: [70, 75, 78, 82, 85], // Pace scores for each session
        modulationData: [65, 68, 72, 76, 79], // Modulation scores
        clarityData: [80, 82, 85, 88, 90], // Clarity scores
    };

    const sessions = [
        {
          _id: '1',
          sessionName: 'Impromptu Speaking',
          Voice: '72/100',
          BodyLanguage: '72/100',
          Vocabulary: '72/100'
        },
        {
          _id: '2',
          sessionName: 'Impromptu Speaking',
          Voice: '72/100',
          BodyLanguage: '72/100',
          Vocabulary: '72/100'
        },
        {
          _id: '3',
          sessionName: 'Impromptu Speaking',
          Voice: '72/100',
          BodyLanguage: '72/100',
          Vocabulary: '72/100'
        },
        {
          _id: '4',
          sessionName: 'Impromptu Speaking',
          Voice: '72/100',
          BodyLanguage: '72/100',
          Vocabulary: '72/100'
        },
        {
          _id: '5',
          sessionName: 'Impromptu Speaking',
          Voice: '72/100',
          BodyLanguage: '72/100',
          Vocabulary: '72/100'
        },
        // Add other sessions...
      ];
    
    const scores = {
        pace: 80,
        modulation: 65,
        clarity: 75,
    };

    return (
        <div>
            <Sidebar />
            <div className="flex w-full bg-black">
                <div className="w-full h-full mt-4">
                    <div className='flex m-2'>
                        <RecentSessions sessions={sessions}/>
                    </div>
                    <div className="flex flex-col mt-4 md:flex-row "> {/* Stack vertically on small screens, horizontally on medium and larger screens */}
                        <div className="w-full px-2 pb-2 md:w-2/3"> {/* Full width on smaller screens */}
                            <PerformanceChart performanceData={performanceData} />
                        </div>
                        <div className="flex-1  px-2 md: mt-4 md:mt-0"> {/* Add margin on larger screens */}
                            <PerformanceMetrics scores={scores} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
