import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const PerformanceMetrics = ({ scores }) => {
    const { pace, modulation, clarity } = scores;

    // Define colors for each metric
    const colors = {
        pace: "#00C853",         // Green for Pace
        modulation: "#FFB300",    // Yellow for Modulation
        clarity: "#D32F2F"        // Red for Clarity
    };

    return (
        <div className="flex flex-col w-full gap-y-4 ">
        <div className="w-full bg-black text-white p-4   border-2 rounded-lg flex flex-col ">

            {/* Pace Progress Bar */}
            <div className=" w-24 h-24  ">
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
        </div>
            <div className="w-full  bg-black text-white p-4 mt-5 border-2 rounded-lg flex flex-col ">
            {/* Modulation Progress Bar */}
            <div className="w-24 h-24 ">
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
            </div>
            <div className="w-full  bg-black text-white p-4 mt-5  border-2 rounded-lg flex flex-col ">
            {/* Clarity Progress Bar */}
            <div className="w-24 h-24 ">
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
            </div>
            </div>
    );
};

export default PerformanceMetrics;
