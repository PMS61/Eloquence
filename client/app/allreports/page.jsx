"use client";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRouter } from "next/navigation";
import "../components/bg.css";
import Sidebar from "../components/Sidebar";

const UserReportsList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/user-reports-list?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <>
    <div className="flex ">
    <div>
    <Sidebar />
    </div>
    <div className="static-bg flex flex-col w-full items-center justify-center p-3">
    <div className="w-3/4 space-y-4   min-h-screen mx-auto ">
      {reports.map((report) => (
        <div
          key={report._id}
          onClick={() => {
            // Construct the URL with the report data as a query parameter
            const url = `/report?report=${encodeURIComponent(JSON.stringify(report))}`;
            router.push(url);
          }}
          className="flex glass-bg rounded-md shadow-lg p-8 items-center gap-4 cursor-pointer  transition-colors"
        >
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">{report.title}</h2>
          </div>
          <div className="flex gap-4">
            <div className="w-24 h-24">
              <CircularProgressbar
                value={report.scores.vocabulary}
                maxValue={100}
                text={`${report.scores.vocabulary}`}
                styles={buildStyles({
                  textColor: "#fff",
                  pathColor: report.scores.vocabulary > 50 ? "#4CAF50" : "#FF4500",
                  trailColor: "#d6d6d6",
                  textSize: "24px",
                })}
              />
              <p className="text-center text-white mt-2">Vocabulary</p>
            </div>
            <div className="w-24 h-24">
              <CircularProgressbar
                value={report.scores.voice}
                maxValue={100}
                text={`${report.scores.voice}`}
                styles={buildStyles({
                  textColor: "#fff",
                  pathColor: report.scores.voice > 50 ? "#4CAF50" : "#FF4500",
                  trailColor: "#d6d6d6",
                  textSize: "24px",
                })}
              />
              <p className="text-center text-white mt-2">Voice</p>
            </div>
            <div className="w-24 h-24">
              <CircularProgressbar
                value={report.scores.expressions}
                maxValue={100}
                text={`${report.scores.expressions}`}
                styles={buildStyles({
                  textColor: "#fff",
                  pathColor: report.scores.expressions > 50 ? "#4CAF50" : "#FF4500",
                  trailColor: "#d6d6d6",
                  textSize: "24px",
                })}
              />
              <p className="text-center text-white mt-2">Expressions</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
    </div>
    </>
  );
};

export default UserReportsList;