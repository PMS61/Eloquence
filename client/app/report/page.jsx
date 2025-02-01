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
        const queryParams = new URLSearchParams(window.location.search);
        const reportFromQuery = queryParams.get("report");

        if (reportFromQuery) {
          const parsedReport = JSON.parse(decodeURIComponent(reportFromQuery));
          setReport(parsedReport);
        } else {
          const response = await fetch(`http://localhost:5000/user-reports-list?userId=${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch reports");
          }
          const reports = await response.json();
          if (reports.length > 0) {
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
        <Scores report={report} />
      </div>
    </div>
  );
}