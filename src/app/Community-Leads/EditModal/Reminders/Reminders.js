import { PlusIcon } from "@heroicons/react/24/solid";
import React, { useEffect } from "react";
import SkeletonLoader from "../../Components/SkeletonLoader";
import ReminderCard from "./ReminderCard";

const Reminders = ({ modalStates, leadData }) => {
  const [reminders, setReminders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const fetchReminders = async () => {
      if (!leadData || !leadData._id) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/Reminder/get/${leadData._id}`);
        const data = await res.json();

        if (data && Array.isArray(data.data)) {
          setReminders(data.data);
        } else {
          console.error("No valid data returned");
        }
      } catch (error) {
        console.error("Error fetching reminders:", error);
      } finally {
        setLoading(false);
      }
    };

    !modalStates.reminderOpenForLead && fetchReminders();
  }, [modalStates.reminderOpenForLead]);

  const handleDeleteReminder = async (reminderId) => {
    setLoading(true);
    try {
      await fetch(`/api/Reminder/delete/${reminderId}`, { method: "DELETE" });
      setReminders(reminders.filter((m) => m._id !== reminderId));
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
    setLoading(false);
  };

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex justify-center">
        <button
          onClick={() => modalStates.setMeetingOpenForLead(leadData._id)}
          className="flex items-center bg-miles-500 hover:bg-miles-600 text-white px-6 rounded"
        >
          <PlusIcon className="size-4" /> Add Reminder
        </button>
      </div>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div>
          {!reminders.length ? (
            <p className="text-center text-gray-500">No reminders found.</p>
          ) : (
            <ul className="space-y-2 list-none pl-[0.1px]">
              {reminders.map((reminder, index) => (
                <li key={index} className="rounded-lg">
                  <ReminderCard
                    reminder={reminder}
                    onDelete={() => handleDeleteReminder(reminder._id)}
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

export default Reminders;
