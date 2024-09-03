import React from "react";
import moment from "moment";

const priorityMap = {
  Low: { bg: "bg-yellow-200", text: "text-yellow-800" },
  Medium: { bg: "bg-orange-200", text: "text-orange-800" },
  High: { bg: "bg-purple-200", text: "text-purple-800" },
  Urgent: { bg: "bg-red-200", text: "text-red-800" },
};

function Meeting({ meeting }) {
  return (
    <article className="flex flex-col gap-2 p-4 border rounded-md shadow-sm">
      <header className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{meeting.Subject}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            priorityMap[meeting.Priority]?.bg || "bg-gray-100"
          }`}
        >
          <i
            className={`fa fa-circle ${
              priorityMap[meeting.Priority]?.text || "text-gray-700"
            } mr-1`}
          />{" "}
          {meeting.Priority}
        </span>
      </header>

      <div className="flex flex-wrap gap-2">
        <div className="flex-col">
          <p className="mb-2">
            <i className="fa fa-user" /> Added by: {meeting.addedby.username}
          </p>
          <p className="mb-2">
            <i className="fa fa-calendar" />{" "}
            {((date) => moment(date).format("DD/MM/YYYY"))(meeting.MeetingDate)}
          </p>
        </div>

        {meeting.MeetingType === "Secondary" ? (
          <p className="mb-2">
            <i className="fa fa-user" /> Agent Name: {meeting.directoragnet}
          </p>
        ) : (
          <p className="mb-2">
            <i className="fa fa-user" /> Developer: {meeting.Developer}
          </p>
        )}

        <p className="mb-2">
          <i className="fa fa-map-marker-alt" /> {meeting.Location}
        </p>
        <p className="mb-2">Status: {meeting.Status}</p>
      </div>

      <footer className="mt-auto flex justify-between items-center">
        <p className="text-xs text-gray-500">
          Meeting Type: {meeting.MeetingType}
        </p>
        {meeting.Comment && (
          <p className="text-xs text-gray-500">
            <i className="fas fa-comment" /> {meeting.Comment}
          </p>
        )}
      </footer>
    </article>
  );
}

export default Meeting;
