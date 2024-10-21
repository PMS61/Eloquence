"use client";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState } from 'react';

const Scores = () => {
  // Mock data for voice metrics
  const metrics = [
    { label: 'Pace', value: 75, color: '#00FF00' },        // Pace out of 100
    { label: 'Modulation', value: 85, color: '#00FF00' },  // Modulation out of 100
    { label: 'Clarity', value: 65, color: '#FF4500' },     // Clarity out of 100
    { label: 'Relevance', value: 89, color: '#FF4500' },   // Contextual Relevance out of 100
  ];

  return (
    <div className="flex flex-col justify-center items-center bg-gray-800 p-8 rounded-md w-4/5 shadow-lg">
      <div className="flex flex-row items-center space-y-4 m-5 ">
        {metrics.map((metric, index) => (
          <div key={index} className="relative w-40 h-40 mx-8 group">
            <CircularProgressbar
              value={metric.value}
              maxValue={100}
              text={`${metric.label}`}
              styles={buildStyles({
                textColor: "#fff",
                pathColor: metric.value > 50 ? metric.color : "#FF4500",
                trailColor: "#d6d6d6",
                textSize: '12px',
              })}
            />
            {/* Tooltip positioned in the upper right corner */}
            <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 bg-black text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {`${metric.label}: ${metric.value}/100`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scores;
