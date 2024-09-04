import React, { useEffect } from "react";
import ReminderCard from "./ReminderCard";
import InlineLoader from "../InlineLoader";

const Reminders = ({
  reminderModalOpenForLead,
  setReminderModalOpenForLead,
  leadData,
}) => {
  const [reminders, setReminders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const fetchReminders = async () => {
      if (!leadData || !leadData._id) return;

      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    !reminderModalOpenForLead && fetchReminders();
  }, [reminderModalOpenForLead]);

  const handleDeleteReminder = async (reminderId) => {
    setIsLoading(true);
    try {
      await fetch(`/api/Reminder/delete/${reminderId}`, { method: "DELETE" });
      setReminders(reminders.filter((m) => m._id !== reminderId));
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
    setIsLoading(false);
  };

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex justify-center">
        <button
          onClick={() => setReminderModalOpenForLead(leadData._id)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          <i className="fa fa-plus" /> Add Reminder
        </button>
      </div>
      {isLoading ? (
        <InlineLoader className="text-blue-900" />
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
                    isLoading={isLoading}
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
