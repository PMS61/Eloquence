"use client";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../components/bg.css";

const Scores = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default fallback data
  const defaultReport = {
    scores: {
      voice: 0,
      expressions: 0,
      vocabulary: 0,
    },
    speech_report: "No speech report available.",
    expression_report: "No expression report available.",
    vocabulary_report: "No vocabulary report available.",
  };

  // Fetch report data from the backend
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch("http://localhost:5000/report"); // Replace with your backend endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError(err.message);
        setReport(defaultReport); // Set fallback data if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  // Define metrics based on the fetched report or fallback data
  const metrics = report
    ? [
        { label: "Voice", value: report.scores.voice, color: "#FF4500" },
        { label: "Expression", value: report.scores.expressions, color: "#FF4500" },
        { label: "Vocabulary", value: report.scores.vocabulary, color: "#FF4500" },
      ]
    : [];

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-4 max-w-7xl h-full mx-auto">
      {metrics.map((metric, index) => (
        <div key={index} className="flex glass-bg rounded-md shadow-lg p-6 items-center gap-4">
          <div className="items-center p-6">
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
          </div>
          <div className="w-3/4">
            <p className="mt-4 text-center text-sm sm:text-base text-gray-300">
              {metric.label === "Voice" && report.speech_report}
              {metric.label === "Expression" && report.expression_report}
              {metric.label === "Vocabulary" && report.vocabulary_report}
            </p>
          </div>
        </div>
      ))}
      {error && <div className="text-center text-red-500">Error: {error}</div>}
    </div>
  );
};

export default Scores;