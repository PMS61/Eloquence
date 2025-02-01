"use client";
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Link from 'next/link';
import '../components/bg.css';
import { useRouter } from 'next/navigation';

const RecentSessions = ({ sessions }) => {
  const router = useRouter();
  const [userReports, setUserReports] = useState([]); // State to store user reports
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const reportsPerPage = 5; // Number of reports to display per page

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
          throw new Error('Failed to fetch reports');
        }
        const data = await response.json();
        setUserReports(data); // Set the fetched reports in state
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchUserReports();
  }, []);

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = userReports.slice(indexOfFirstReport, indexOfLastReport);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle row click to navigate to the report
  const handleRowClick = (reportId) => {
    router.push(`/report?report=${encodeURIComponent(JSON.stringify(reportId))}`);
  };

  return (
    <div className='flex flex-col w-full'>
    <div className="w-full overflow-hidden shadow-md rounded-lg border-2">
      <div className="max-h-[360px] overflow-y-auto">
        <table className="w-full text-center text-gray-500">
          <thead className="uppercase text-white glass-bg border-b-2">
            <tr>
              <th scope="col" className="pr-1 py-2 text-[12px] sm:text-sm">Session<br />Name</th>
              <th scope="col" className="px-1 py-2 text-[12px] sm:text-sm">Voice</th>
              <th scope="col" className="px-1 py-2 text-[12px] sm:text-sm">Body Language</th>
              <th scope="col" className="pr-2 py-2 text-[12px] sm:text-sm">Vocabulary</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((report) => (
              <tr
                key={report._id}
                onClick={() => handleRowClick(report)}
                className="glass-bg border-b hover:bg-gray-800 text-white cursor-pointer transition-all duration-300"
              >
                <td className="px-4 py-3 text-center text-[10px] sm:text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 sm:hidden mr-2"></span>
                  {report.title || 'Untitled Session'}
                </td>
                {['voice', 'expressions', 'vocabulary'].map((attr, i) => (
                  <td key={i} className="px-1 py-2 text-[6px] sm:text-sm">
                    <div className="w-11 h-11 mx-auto">
                      <CircularProgressbar
                        value={report.scores[attr] || 0}
                        text={`${report.scores[attr] || 0}%`}
                        styles={buildStyles({
                          pathColor: '#00C853',
                          textColor: '#ffffff',
                          trailColor: '#333',
                        })}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            {currentReports.length === 0 && (
              <tr className="h-full">
                <td colSpan="4">
                  <div className="flex justify-center items-center my-4">
                    <Link href="/session">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">New Session</button>
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
    
    </div>
    <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mx-1 disabled:bg-gray-500"
        >
          Previous
        </button>
        <span className="text-white mx-2">
          Page {currentPage} of {Math.ceil(userReports.length / reportsPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(userReports.length / reportsPerPage)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mx-1 disabled:bg-gray-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RecentSessions;