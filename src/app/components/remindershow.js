import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Modal.module.css";
const Remindershowmodal = ({ onClose, lead }) => {
  const [Reminders, setReminders] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/Reminder/get/${lead}`);
        console.log(response);
        setReminders(response.data.data);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchData();
  }, [lead]);

  return (
    <div className={styles.modalBackdrop}>
      <ToastContainer />
      <div className={styles.modalContent}>
        <h4>Reminder</h4>
        <span className={styles.closeButton} onClick={onClose}>
          &times;
        </span>
        <div className="mt-4">
          <div className="bg-gray-100 p-4 rounded-md">
            {Reminders.map((reminder) => (
              <p key={reminder._id} className="mb-2">
                Reminder {reminder.Comment} assigned to{" "}
                {reminder.Assignees.username}, Date and time {reminder.DateTime}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Remindershowmodal;
