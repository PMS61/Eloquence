import React from 'react';
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

const PerformanceChart = ({ performanceData }) => {
    const { labels, paceData, modulationData, clarityData } = performanceData;

    // Transform data into a format Recharts understands
    const chartData = labels.map((label, index) => ({
        session: label,
        Pace: paceData[index],
        Modulation: modulationData[index],
        Clarity: clarityData[index],
    }));

    return (
        <div className="w-full border-2  border-slate-700 rounded-md p-2 bg-[#1E293B]" style={{ minHeight: '300px' }}>
            {/* ResponsiveContainer makes the chart fully responsive */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" label={{ value: 'Session', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Pace" stroke="#4bc0c0" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Modulation" stroke="#9966FF" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Clarity" stroke="#FF9F40" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceChart;
