import React from "react";
import { FaRegUserCircle } from "react-icons/fa";

const formatDateAndTime = (dateTimeString) => {
  const dateObj = new Date(dateTimeString);

  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = dateObj.toLocaleDateString(undefined, dateOptions);

  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
  const formattedTime = dateObj.toLocaleTimeString(undefined, timeOptions);

  const now = new Date();
  const diffInSeconds = Math.abs((now - dateObj) / 1000);
  const daysDiff = Math.floor(diffInSeconds / (24 * 60 * 60));

  return (
    <div>
      <i
        className={`fa fa-calendar mr-2 ${
          daysDiff > 0 ? "text-red-600" : "text-miles-600"
        }`}
      />
      <span className="font-medium ">
        <span
          className={`font-medium ${
            daysDiff > 0 ? "text-red-600" : "text-miles-600"
          }`}
        >
          {formattedDate} {formattedTime}
        </span>
      </span>
    </div>
  );
};

function ReminderCard({ reminder, onDelete, isLoading }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <header className="p-4 py-2 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg text-gray-800">
            <span>Assignees: </span>
            <span className="!mb-0 !mt-0 font-semibold text-black text-lg flex flex-row gap-2">
              {reminder.Assignees.username}
              <div className="size-6 ml-1 bg-gray-200 group-hover:bg-miles-300 overflow-hidden rounded-full flex justify-center items-center">
                {reminder?.Assignees.Avatar ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${
                      reminder?.Assignees.Avatar
                    }`}
                    alt={""}
                  />
                ) : (
                  <FaRegUserCircle />
                )}
              </div>{" "}
            </span>
          </h3>
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="text-xs bg-red-200 text-red-800 p-1 w-6 h-6 rounded-full ml-2"
          >
            <i className="fa fa-trash" />
          </button>
        </div>
      </header>

      <footer className="bg-gray-100 px-4 py-3">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="w-full justify-between flex gap-2 items-center">
            <span className="!mb-0 !mt-0 mr-2">
              {formatDateAndTime(reminder.DateTime)}
            </span>
          </div>
          {reminder.Comment && (
            <div className="flex items-center text-miles-500">
              <i className="fas fa-comment mr-2" />
              <span>{reminder.Comment}</span>
            </div>
          )}
        </div>
      </footer>
    </article>
  );
}

export default ReminderCard;
