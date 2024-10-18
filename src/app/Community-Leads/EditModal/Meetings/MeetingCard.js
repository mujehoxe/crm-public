import { TrashIcon } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import { FaRegUserCircle } from "react-icons/fa";

const priorityMap = {
  Low: { bg: "bg-yellow-100", text: "fill-yellow-800" },
  Medium: { bg: "bg-orange-100", text: "fill-orange-800" },
  High: { bg: "bg-purple-100", text: "fill-purple-800" },
  Urgent: { bg: "bg-red-100", text: "fill-red-800" },
};

function MeetingCard({ meeting, onDelete, isLoading }) {
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <header className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg text-gray-800">
            {meeting.Subject}
          </h3>
          <div className="flex items-center gap-1">
            <span
              className={`flex items-center text-xs px-2 py-1 rounded-full ${
                priorityMap[meeting.Priority]?.bg || "bg-gray-100"
              }`}
            >
              <svg
                viewBox="0 0 6 6"
                aria-hidden="true"
                className={`size-1.5 rounded-full mr-1 ${
                  priorityMap[meeting.Priority]?.text || "fill-gray-700"
                }`}
              >
                <circle r={3} cx={3} cy={3} />
              </svg>
              {meeting.Priority}
            </span>
            <button
              onClick={onDelete}
              disabled={isLoading}
              className="text-xs bg-red-200 text-red-800 flex justify-center items-center text-center size-6 rounded-full"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Status: <span className="font-medium">{meeting.Status}</span>
        </p>
        <div className="flex items-center text-sm text-gray-600">
          <span>
            Added by:{" "}
            <span className="font-medium">{meeting.addedby.username}</span>
          </span>
          <div className="size-6 ml-1 bg-gray-200 group-hover:bg-miles-300 overflow-hidden rounded-full flex justify-center items-center">
            {meeting?.addedby.Avatar ? (
              <img
                className="size-6 object-cover"
                src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${
                  meeting?.addedby.Avatar
                }`}
                alt={"Avatar"}
              />
            ) : (
              <FaRegUserCircle />
            )}
          </div>{" "}
        </div>
      </header>

      <div className="p-4 space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <i className="fa fa-calendar mr-2" />
          <span>{formatDate(meeting.MeetingDate)}</span>
        </div>

        {meeting.MeetingType &&
          (meeting.Developer || meeting.directoragnet) && (
            <div className="flex text-sm text-gray-600 rounded-lg p-3 bg-gray-50">
              {meeting.MeetingType === "Secondary" ? (
                <>
                  <i className="fa fa-user mt-1 mr-2" />
                  {meeting.directoragnet === "Agent" ? (
                    <div className="flex flex-col">
                      <span className="">Agent</span>
                      <span>
                        Name:{" "}
                        <span className="font-medium">{meeting.agentName}</span>
                      </span>
                      <span>
                        Phone:{" "}
                        <span className="font-medium">
                          {meeting.agentPhone}
                        </span>
                      </span>
                      <span>
                        Company:{" "}
                        <span className="font-medium">
                          {meeting.agentCompany}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <span>Direct / No Agent</span>
                  )}
                </>
              ) : (
                <div className="flex flex-col text-sm gap-1 text-gray-600">
                  {meeting.Developer && (
                    <span>
                      <i className="fa fa-user mr-2" />
                      Developer:{" "}
                      <span className="font-medium">{meeting.Developer}</span>
                    </span>
                  )}
                  {meeting.Location && (
                    <span>
                      <i className="fa fa-map-marker-alt mr-2" />
                      Location:{" "}
                      <span className="font-medium">{meeting.Location}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
      </div>

      {meeting.MeetingType && meeting.Comment && (
        <footer className="bg-gray-100 px-4 py-3">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Meeting Type: {meeting.MeetingType}</span>
            {meeting.Comment && (
              <div className="flex items-center text-miles-500 gap-2">
                <ChatBubbleOvalLeftIcon className="size-4 text-miles-400" />
                <span className="first-letter:uppercase">
                  {meeting.Comment}
                </span>
              </div>
            )}
          </div>
        </footer>
      )}
    </article>
  );
}

export default MeetingCard;
