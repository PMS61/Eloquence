"use client";
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './bg.css';

const PerformanceMetrics = ({ userId }) => {
    const [scores, setScores] = useState({ pace: 0, modulation: 0, clarity: 0 });
    const [reports, setReports] = useState({
        voice_report: '',
        expressions_report: '',
        vocabulary_report: ''
    });

    useEffect(() => {
        const fetchOverallScores = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user-reports?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch overall scores');
                }
                const data = await response.json();
                setScores({
                    pace: data.avg_voice,
                    modulation: data.avg_expressions,
                    clarity: data.avg_vocabulary
                });
                setReports(data.overall_reports);
            } catch (error) {
                console.error('Error fetching overall scores:', error);
            }
        };

        fetchOverallScores();
    }, [userId]);

    const colors = {
        pace: "#00C853",
        modulation: "#FFB300",
        clarity: "#D32F2F"
    };

    return (
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full p-4">
            {/* Pace Metric */}
            <div className="w-full md:w-1/3 glass-bg text-white p-4 border-2 rounded-lg flex flex-col items-center gap-4">
                <div className="w-24 h-24">
                    <CircularProgressbar
                        value={scores.pace}
                        text={`${scores.pace}%`}
                        styles={buildStyles({
                            pathColor: colors.pace,
                            textColor: '#ffffff',
                            trailColor: '#333',
                        })}
                    />
                </div>
                <p className="text-sm text-center">
                    {reports.voice_report}
                </p>
            </div>

            {/* Modulation Metric */}
            <div className="w-full md:w-1/3 glass-bg text-white p-4 border-2 rounded-lg flex flex-col items-center gap-4">
                <div className="w-24 h-24">
                    <CircularProgressbar
                        value={scores.modulation}
                        text={`${scores.modulation}%`}
                        styles={buildStyles({
                            pathColor: colors.modulation,
                            textColor: '#ffffff',
                            trailColor: '#333',
                        })}
                    />
                </div>
                <p className="text-sm text-center">
                    {reports.expressions_report}
                </p>
            </div>

            {/* Clarity Metric */}
            <div className="w-full md:w-1/3 glass-bg text-white p-4 border-2 rounded-lg flex flex-col items-center gap-4">
                <div className="w-24 h-24">
                    <CircularProgressbar
                        value={scores.clarity}
                        text={`${scores.clarity}%`}
                        styles={buildStyles({
                            pathColor: colors.clarity,
                            textColor: '#ffffff',
                            trailColor: '#333',
                        })}
                    />
                </div>
                <p className="text-sm text-center">
                    {reports.vocabulary_report}
                </p>
            </div>
        </div>
    );
};

export default PerformanceMetrics;