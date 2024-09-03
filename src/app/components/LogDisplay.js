import React from "react";
import LogEntry from "./LogEntry";

const LogDisplay = ({ loading, logs, leadData }) => {
  return (
    <div className="container mx-auto space-y-4">
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : logs.length <= 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-96 text-center">
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

export default LogDisplay;
