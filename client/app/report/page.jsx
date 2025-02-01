'use client';

import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import "../components/bg.css";
import { useEffect, useState } from "react";
import Scores from "./scores";

export default function Analysis() {
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        // Check if the user was redirected from the toast (query contains report data)
        const queryParams = new URLSearchParams(window.location.search);
        const reportFromQuery = queryParams.get("report");

        if (reportFromQuery) {
          // If report data is present in the query, decode and use it
          const parsedReport = JSON.parse(decodeURIComponent(reportFromQuery));
          setReport(parsedReport);
        } else {
          // If no report data in the query, fetch the latest report for the user
          const response = await fetch(`http://localhost:5000/user-reports-list?userId=${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch reports");
          }
          const reports = await response.json();
          if (reports.length > 0) {
            // Use the most recent report
            setReport(reports[reports.length - 1]);
          } else {
            setError("No reports found for the user.");
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!report) {
    return <div className="text-center text-white">No report found.</div>;
  }

  return (
    <div className="flex static-bg">
      <div className="w-20 md:24">
        <Sidebar />
      </div>
      <div className="flex flex-col justify-center items-center w-full min-h-screen max-h-full p-4">
        {/* Pass the report as a prop to the Scores component */}
        <Scores report={report} />
      </div>
    </div>
  );
}