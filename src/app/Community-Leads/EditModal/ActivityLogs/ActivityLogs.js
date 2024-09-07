import React, { useEffect, useState } from "react";
import LogEntry from "./LogCard";
import axios from "axios";
import SkeletonLoader from "../../Components/SkeletonLoader";

const ActivityLogs = ({ leadData }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (leadData._id) {
          setLoading(true);
          const response = await axios.get(`/api/log/${leadData._id}`);
          setLogs(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchData();
  }, [leadData._id]);

  return (
    <div className="container mx-auto space-y-4">
      {loading ? (
        <SkeletonLoader />
      ) : logs.length <= 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 md:w-96 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-4 h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
          <p className="text-lg font-medium text-gray-900">
            No logs to display
          </p>
          <p className="mt-1 text-sm text-gray-500">
            There are currently no log entries available.
          </p>
        </div>
      ) : (
        logs.map((log, index) => (
          <LogEntry key={index} log={log} leadData={leadData} index={index} />
        ))
      )}
    </div>
  );
};

export default ActivityLogs;
