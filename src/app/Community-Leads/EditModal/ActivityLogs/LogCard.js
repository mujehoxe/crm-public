import React from "react";
import { formatDistanceToNow } from "date-fns";
import { FaRegUserCircle } from "react-icons/fa";

const LogEntry = ({ log, leadData: lead, index }) => {
  const renderLogContent = () => {
    switch (true) {
      case log.action.includes("Lead status updated") ||
        log.action.includes("Lead Field"):
        return (
          <>
            Changed <span className="font-semibold">{lead.Name}'s</span>{" "}
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
            Added tag(s):{" "}
            <span className="font-semibold">{log.tags.join(", ")}</span> to{" "}
            <span className="font-semibold">{lead.Name}'s</span> lead
          </>
        );
      case log.action.includes("Status added"):
        return (
          <>
            Added status: <span className="font-semibold">{log.status}</span> to{" "}
            <span className="font-semibold">{lead.Name}'s</span> lead
          </>
        );
      case log.action.includes("Lead added"):
        return (
          <>
            Added a new lead <span className="font-semibold">{lead.Name}</span>
          </>
        );
      case log.action.includes("Order added"):
        return (
          <>
            Added a new order for{" "}
            <span className="font-semibold">{lead.Name}</span>
          </>
        );
      case log.action.includes("Whatsapp Template"):
        return (
          <>
            Sent a WhatsApp template to{" "}
            <span className="font-semibold">{lead.Name}</span>
          </>
        );
      default:
        return (
          <>
            Performed an action:{" "}
            <span className="font-semibold">{log.action}</span>
          </>
        );
    }
  };

  return (
    <article
      key={index}
      className="bg-white w-[40rem] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-4"
    >
      <header className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-row items-center">
            <div className="size-8 bg-gray-200 mr-2 group-hover:bg-miles-300 overflow-hidden cursor-pointer rounded-full flex justify-center items-center">
              {log?.Userid?.Avatar ? (
                <imgd
                  className="size-8 object-cover"
                  src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${
                    log?.Userid.Avatar
                  }`}
                  alt={"Avatar"}
                />
              ) : (
                <FaRegUserCircle />
              )}
            </div>
            <span className="font-semibold">{log.Userid?.username}</span>{" "}
          </div>
          <span className="px-2 py-1 bg-miles-100 text-miles-800 rounded-full text-xs font-medium">
            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <div>{renderLogContent()}</div>
        </div>
      </header>

      {log.description && (
        <footer className="bg-gray-100 px-4 py-3 text-xs text-miles-500">
          <i className="fas fa-comment mr-2" />
          <span className="font-bold">Description:</span>{" "}
          <span>{log.description}</span>
        </footer>
      )}
    </article>
  );
};

export default LogEntry;
