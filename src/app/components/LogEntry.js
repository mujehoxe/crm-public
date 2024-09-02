import React from "react";
import { formatDistanceToNow } from "date-fns";

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
    <div key={index} className="border-b border-gray-200 pb-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
        </span>
      </div>
      <div className="flex flex-row items-center gap-2 align-middle h-10">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <img
            className="rounded-full border-0 p-1 border-white bg-transparent object-cover w-full top-0 right-0 h-full z-10"
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${log.Userid?.Avatar}`}
            alt=""
          />
          <i className="absolute w-full h-full text-center align-middle pt-[6px] text-gray-500 fa fa-user z-0"></i>
        </div>
        <div className="text-gray-700 align-middle my-auto">
          <span className="font-semibold">{log.Userid?.username}</span>{" "}
          {renderLogContent()}
          {log.description && (
            <p className="text-sm line-clamp-2">
              <b>Description:</b> {log.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogEntry;
