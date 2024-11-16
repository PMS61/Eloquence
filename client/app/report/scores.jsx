"use client";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../components/bg.css";

const Scores = () => {
  const metrics = [
    { label: "Voice", value: 89, color: "#FF4500" },
    { label: "Expression", value: 89, color: "#FF4500" },
    { label: "Vocabulary", value: 89, color: "#FF4500" },
    { label: "Relevance", value: 89, color: "#FF4500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-7xl h-full mx-auto">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-6 glass-bg rounded-md shadow-lg"
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
              textSize: "14px",
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
