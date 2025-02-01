"use client";
import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const PerformanceChart = () => {
    const [performanceData, setPerformanceData] = useState({
        labels: [],
        voiceData: [],
        expressionsData: [],
        vocabularyData: [],
        titles: [], // Add titles to the state
    });

    // Fetch user reports from the backend
    useEffect(() => {
        const fetchUserReports = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('User ID not found');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/user-reports-list?userId=${userId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Backend error:', errorData);
                    throw new Error('Failed to fetch reports');
                }
                const data = await response.json();
                console.log('Fetched data:', data); // Log the fetched data for debugging

                // Transform the data into the format expected by the chart
                const labels = data.map((report, index) => `Session ${index + 1}`);
                const voiceData = data.map(report => report.scores.voice);
                const expressionsData = data.map(report => report.scores.expressions);
                const vocabularyData = data.map(report => report.scores.vocabulary);
                const titles = data.map(report => report.title || 'Untitled Session'); // Extract titles

                setPerformanceData({
                    labels,
                    voiceData,
                    expressionsData,
                    vocabularyData,
                    titles, // Store titles in state
                });
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchUserReports();
    }, []);

    // Transform data into a format Recharts understands
    const chartData = performanceData.labels.map((label, index) => ({
        session: label,
        title: performanceData.titles[index], // Include the title in the chart data
        Voice: performanceData.voiceData[index],
        Expressions: performanceData.expressionsData[index],
        Vocabulary: performanceData.vocabularyData[index],
    }));

    // Custom Tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip bg-white p-3 border rounded shadow">
                    <p className="label font-bold">{`${payload[0].payload.title}`}</p> {/* Display the title */}
                    <p className="intro">{`Voice: ${payload[0].value}`}</p>
                    <p className="intro">{`Expressions: ${payload[1].value}`}</p>
                    <p className="intro">{`Vocabulary: ${payload[2].value}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="w-full border-2 rounded-md p-2 glass-bg" style={{ minHeight: '300px' }}>
            {/* ResponsiveContainer makes the chart fully responsive */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip content={<CustomTooltip />} /> {/* Use the custom tooltip */}
                    <Legend />
                    <Line type="monotone" dataKey="Voice" stroke="#4bc0c0" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Expressions" stroke="#9966FF" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Vocabulary" stroke="#FF9F40" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceChart;