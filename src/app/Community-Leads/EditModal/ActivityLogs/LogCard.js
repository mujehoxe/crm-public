import React from "react";
import { formatDistanceToNow } from "date-fns";
import { FaRegUserCircle } from "react-icons/fa";

const LogEntry = ({ log, leadData, index }) => {
  const renderLogContent = () => {
    switch (true) {
      case log.action.includes("Lead status updated") ||
        log.action.includes("Lead Field"):
        return (
          <>
            changed <span className="font-semibold">{leadData.Name}'s</span>{" "}
            {!log.action.includes("Lead status")
              ? log.action.split(" ")[2]
              : "Lead Status"}{" "}
            {log.previousLeadstatus && log.previousLeadstatus !== "" ? (
              <>
                from{" "}
                <span className="font-semibold">{log.previousLeadstatus}</span>{" "}
              </>
            ) : null}
            to <span className="font-semibold">{log.leadstatus}</span>
          </>
        );
      case log.action.includes("Tags added"):
        return (
          <>
            added tag(s):{" "}
            <span className="font-semibold">{log.tags.join(", ")}</span> to{" "}
            <span className="font-semibold">{leadData.Name}'s</span> lead
          </>
        );
      case log.action.includes("Status added"):
        return (
          <>
            added status: <span className="font-semibold">{log.status}</span> to{" "}
            <span className="font-semibold">{leadData.Name}'s</span> lead
          </>
        );
      case log.action.includes("Lead added"):
        return (
          <>
            added a new lead{" "}
            <span className="font-semibold">{leadData.Name}</span>
          </>
        );
      case log.action.includes("Order added"):
        return (
          <>
            added a new order for{" "}
            <span className="font-semibold">{leadData.Name}</span>
          </>
        );
      case log.action.includes("Whatsapp Template"):
        return (
          <>
            sent a WhatsApp template to{" "}
            <span className="font-semibold">{leadData.Name}</span>
          </>
        );
      default:
        return (
          <>
            performed an action:{" "}
            <span className="font-semibold">{log.action}</span>
          </>
        );
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-4">
      <header className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <div className="  size-8 bg-gray-200 group-hover:bg-blue-300 overflow-hidden cursor-pointer rounded-full flex justify-center items-center">
            {currentLead?.Assigned?.Avatar ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${
                  currentLead?.Assigned.Avatar
                }`}
              />
            ) : (
              <FaRegUserCircle />
            )}
          </div>
          <div>
            <span className="font-semibold">{log.Userid?.username}</span>{" "}
            {renderLogContent()}
          </div>
        </div>
      </header>

      {log.description && (
        <div className="p-4">
          <p className="text-sm text-gray-700">
            <b>Description:</b> {log.description}
          </p>
        </div>
      )}
    </article>
  );
};

export default LogEntry;
