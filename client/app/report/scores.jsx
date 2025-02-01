"use client";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../components/bg.css";

const Scores = ({ report }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageScores, setAverageScores] = useState(null);
  const [overallReports, setOverallReports] = useState({
    voice_report: "",
    expressions_report: "",
    vocabulary_report: "",
  });

  // Define the metrics array based on the report data
  const metrics = [
    {
      label: "Vocabulary",
      value: report?.scores?.vocabulary || 0,
      color: "#00C853", // Green for vocabulary
    },
    {
      label: "Voice",
      value: report?.scores?.voice || 0,
      color: "#2196F3", // Blue for voice
    },
    {
      label: "Expression",
      value: report?.scores?.expressions || 0,
      color: "#FFC107", // Yellow for expressions
    },
  ];

  useEffect(() => {
    if (report) {
      setLoading(false);
    } else {
      setError("No report found. Please upload a recording first.");
      setLoading(false);
    }
  }, [report]);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8 p-4 max-w-7xl h-full mx-auto static-bg">
      {report ? (
        metrics.map((metric, index) => (
          <div
            key={index}
            className="flex bg-[#1E293B] rounded-md shadow-lg p-6 items-center gap-4"
          >
            <div className="items-center p-6">
              <CircularProgressbar
                value={metric.value}
                maxValue={100}
                className="w-24 h-24"
                text={`${metric.label}`}
                styles={buildStyles({
                  textColor: "#fff",
                  pathColor: metric.value > 50 ? metric.color : "#FF4500", // Red for low scores
                  trailColor: "#333", // Dark trail color
                  textSize: "14px",
                })}
              />
            </div>
            <div className="w-3/4">
              <p className="mt-4 text-center text-sm sm:text-base text-gray-300">
                {metric.label === "Vocabulary" && report.vocabulary_report}
                {metric.label === "Voice" && report.speech_report}
                {metric.label === "Expression" && report.expression_report}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold">Average Scores</h2>
          <p>Voice: {averageScores?.avg_voice}</p>
          <p>Expressions: {averageScores?.avg_expressions}</p>
          <p>Vocabulary: {averageScores?.avg_vocabulary}</p>

          <h3 className="text-xl font-bold mt-6">Overall Reports</h3>
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-lg font-semibold">Voice Report</h4>
              <p className="text-sm sm:text-base text-gray-300">
                {overallReports.voice_report}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Expressions Report</h4>
              <p className="text-sm sm:text-base text-gray-300">
                {overallReports.expressions_report}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Vocabulary Report</h4>
              <p className="text-sm sm:text-base text-gray-300">
                {overallReports.vocabulary_report}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scores;