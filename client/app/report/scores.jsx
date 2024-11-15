"use client";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Scores = () => {
  // Mock data for voice metrics
  const metrics = [
    { label: "Voice", value: 89, color: "#FF4500" },
    { label: "Expression", value: 89, color: "#FF4500" },
    { label: "Vocabulary", value: 89, color: "#FF4500" },
    { label: "Relevance", value: 89, color: "#FF4500" },
  ];

  return (
    <div className="flex flex-wrap justify-center items-center h-full p-4 space-y-4 md:space-y-0 md:flex-row md:space-x-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="flex flex-col items-center m-2 p-6 bg-gray-800 rounded-md w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 shadow-lg"
        >
          
            <CircularProgressbar
              value={metric.value}
              maxValue={100}
              className="w-24 h-24"
              text={`${metric.label}`}
              styles={buildStyles({
                textColor: "#fff",
                pathColor: metric.value > 50 ? metric.color : "#FF4500",
                trailColor: "#d6d6d6",
                textSize: "14px", // Slightly reduce text size for smaller devices
              })}
            />
        
          <p className="mt-4 text-center text-sm sm:text-base text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde totam
            alias fugiat veritatis qui laboriosam animi inventore consectetur
            repudiandae tenetur?
          </p>
        </div>
      ))}
    </div>
  );
};

export default Scores;
