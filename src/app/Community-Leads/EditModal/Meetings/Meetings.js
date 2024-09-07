import React, { useEffect } from "react";
import MeetingCard from "./MeetingCard";
import SkeletonLoader from "../../Components/SkeletonLoader";

const Meetings = ({ modalStates, leadData }) => {
  const [meetings, setMeetings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!leadData || !leadData._id) return;

      setLoading(true);
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
        setLoading(false);
      }
    };

    !modalStates.meetingOpenForLead && fetchMeetings();
  }, [modalStates.meetingOpenForLead]);

  const handleDeleteMeeting = async (meetingId) => {
    setLoading(true);
    try {
      await fetch(`/api/Meeting/delete/${meetingId}`, { method: "DELETE" });
      setMeetings(meetings.filter((m) => m._id !== meetingId));
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
    setLoading(false);
  };

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex justify-center">
        <button
          onClick={() => modalStates.setMeetingOpenForLead(leadData._id)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          <i className="fa fa-plus" /> Add Meeting
        </button>
      </div>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div>
          {!meetings.length ? (
            <p className="text-center text-gray-500">No meetings found.</p>
          ) : (
            <ul className="space-y-2 list-none pl-[0.1px]">
              {meetings.map((meeting, index) => (
                <li key={index} className="rounded-lg">
                  <MeetingCard
                    meeting={meeting}
                    onDelete={() => handleDeleteMeeting(meeting._id)}
                    isLoading={loading}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};

export default Meetings;
