import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './bg.css';

const PerformanceMetrics = ({ scores }) => {
    const { pace, modulation, clarity } = scores;

    // Define colors for each metric
    const colors = {
        pace: "#00C853",         // Green for Pace
        modulation: "#FFB300",    // Yellow for Modulation
        clarity: "#D32F2F"        // Red for Clarity
    };

    return (
        <div className="flex flex-row md:flex-col justify-center items-center gap-x-1 w-full gap-y-6 ">
        <div className="w-full glass-bg text-white p-3 border-2 rounded-lg flex flex-col md:flex-row ">

            {/* Pace Progress Bar */}
            <div className="w-16 h-16 md:w-24 md:h-24  ">
                <CircularProgressbar
                    value={pace}
                    text={`${pace}%`}
                    styles={buildStyles({
                        pathColor: colors.pace,
                        textColor: '#ffffff',
                        trailColor: '#333',
                    })}
                />
                
            </div>
            <p className='text-sm text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, sapiente!'</p>
        </div>
            <div className="w-full  glass-bg text-white p-3 border-2 rounded-lg flex flex-col md:flex-row ">
            {/* Modulation Progress Bar */}
            <div className="w-16 h-16 md:w-24 md:h-24 ">
                <CircularProgressbar
                    value={modulation}
                    text={`${modulation}%`}
                    styles={buildStyles({
                        pathColor: colors.modulation,
                        textColor: '#ffffff',
                        trailColor: '#333',
                    })}
                />
            </div>
            <p className='text-sm text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, sapiente!'</p>
            </div>
            <div className="w-full  glass-bg text-white p-3 gap-x-1  border-2 rounded-lg flex flex-col md:flex-row ">
            {/* Clarity Progress Bar */}
            <div className="w-16 h-16 md:w-24 md:h-24 ">
                <CircularProgressbar
                    value={clarity}
                    text={`${clarity}%`}
                    styles={buildStyles({
                        pathColor: colors.clarity,
                        textColor: '#ffffff',
                        trailColor: '#333',
                    })}
                />
            </div>
            <p className='text-sm text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, sapiente!'</p>
            </div>
            </div>
    );
};

export default PerformanceMetrics;
