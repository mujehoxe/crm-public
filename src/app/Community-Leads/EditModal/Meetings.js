import React from "react";
import Meeting from "./Meeting";

const Meetings = ({ meetingModalOpen, setMeetingModalOpen, leadData }) => {
  const [meetings, setMeetings] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchMeetings = async () => {
      if (!leadData || !leadData._id) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/Meeting/get/${leadData._id}`);
        const data = await res.json();

        if (data && Array.isArray(data.data)) {
          setMeetings(data.data);
        } else {
          console.error("No valid data returned");
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    !meetingModalOpen && fetchMeetings();
  }, [meetingModalOpen]);

  return (
    <section className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <svg
            className="animate-spin h-5 w-5 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 4 5.373 4 12zm19.53 1.56L18 16.17V4h-.53a3 3 0 110 6z"
            ></path>
          </svg>
          Loading meetings...
        </div>
      ) : (
        <>
          {!meetings.length ? (
            <p className="text-center text-gray-500">No meetings found.</p>
          ) : (
            <ul className="space-y-4 list-none pl-[0.1px]">
              {meetings.map((meeting, index) => (
                <li key={index} className=" rounded-lg">
                  <Meeting meeting={meeting} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setMeetingModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          <i className="fa fa-plus" /> Add Meeting
        </button>
      </div>
    </section>
  );
};

export default Meetings;
