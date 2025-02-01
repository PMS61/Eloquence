import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './bg.css';

const PerformanceMetrics = ({ scores }) => {
    const { pace, modulation, clarity } = scores;

    const colors = {
        pace: "#00C853",
        modulation: "#FFB300",
        clarity: "#D32F2F"
    };

    return (
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full p-4">
            {/* Pace Metric */}
            <div className="w-full md:w-1/3 bg-[#1E293B] text-white p-4 border-2 rounded-lg flex flex-col items-center gap-4">
                <div className="w-24 h-24">
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
                <p className="text-sm text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, sapiente!
                </p>
            </div>

            {/* Modulation Metric */}
            <div className="w-full md:w-1/3 bg-[#1E293B] text-white p-4 border-2 rounded-lg flex flex-col items-center gap-4">
                <div className="w-24 h-24">
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
                <p className="text-sm text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, sapiente!
                </p>
            </div>

            {/* Clarity Metric */}
            <div className="w-full md:w-1/3 bg-[#1E293B] text-white p-4 border-2  border-slate-700 rounded-lg flex flex-col items-center gap-4">
                <div className="w-24 h-24">
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
                <p className="text-sm text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, sapiente!
                </p>
            </div>
        </div>
    );
};

export default PerformanceMetrics;