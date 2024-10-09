import { formatDistanceToNow } from "date-fns";
import { FaRegUserCircle } from "react-icons/fa";

const LogEntry = ({ log, leadData: lead, index }) => {
  const renderLogContent = () => {
    console.log(log);
    switch (true) {
      case log.action.includes("Lead added"):
        return (
          <>
            Added a new lead <span className="font-semibold">{lead.Name}</span>
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
            <span className="font-semibold capitalize">{log.action}</span>{" "}
            {log.previousValue && log.previousValue !== "" ? (
              <>
                from <span className="font-semibold">{log.previousValue}</span>{" "}
              </>
            ) : null}
            {log.newValue && log.newValue !== "" && (
              <>
                to <span className="font-semibold">{log.newValue}</span>
              </>
            )}
          </>
        );
    }
  };

  return (
    <article
      key={index}
      className="bg-white min-w-[40rem] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-4"
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
