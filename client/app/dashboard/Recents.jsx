import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Link from 'next/link';



const handleRowClick = (sessionId) => {
  console.log(`Session ID: ${sessionId} clicked`);
};

const RecentSessions = ({sessions}) => {
  const minRows = 5;
  const emptyRows = Math.max(minRows - sessions.length, 0);

  return (
    <div className="w-full overflow-hidden shadow-md rounded-lg border-2  ">
      <div className="max-h-[360px] overflow-y-auto">
        <table className="w-full text-center text-gray-500">
          <thead className="uppercase text-white border-b-2">
            <tr>
              <th scope="col" className="pr-1 py-2 text-[12px] sm:text-sm">Session<br />Name</th>
              <th scope="col" className="px-1 py-2 text-[12px] sm:text-sm">Voice</th>
              <th scope="col" className="px-1 py-2 text-[12px] sm:text-sm">Body Language</th>
              <th scope="col" className="pr-2 py-2 text-[12px] sm:text-sm">Vocabulary</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr
                key={session._id}
                onClick={() => handleRowClick(session._id)}
                className="bg-black border-b hover:bg-gray-800 text-white cursor-pointer transition-all duration-300"
              >
                <td className="px-4 py-3 text-center text-[10px] sm:text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 sm:hidden mr-2"></span>
                  {session.sessionName}
                </td>
                {['Voice', 'BodyLanguage', 'Vocabulary'].map((attr, i) => (
                  <td key={i} className="px-1 py-2 text-[6px] sm:text-sm">
                    <div className="w-11 h-11 mx-auto">
                      <CircularProgressbar
                        value={session[attr].split('/')[0]}
                        text={`${session[attr].split('/')[0]}%`}
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
            {emptyRows > 0 && (
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
    </div>
  );
};

export default RecentSessions;
