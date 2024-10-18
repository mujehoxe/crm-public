import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Modal.module.css";
const Meetingshowmodal = ({ onClose, lead }) => {
  const [Meeting, setMeetings] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/Meeting/get/${lead}`);
        setMeetings(response.data.data);
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
        <h4 className="text-center">Meeting</h4>
        <span className={styles.closeButton} onClick={onClose}>
          &times;
        </span>
        <div className="mt-4">
          <div className="bg-gray-100 p-4 rounded-md">
            {Meeting.map((meeting) => (
              <p key={meeting._id} className="text-left mb-2">
                Subject: {meeting.Subject} With Developer: {meeting.Developer}{" "}
                On Date: {meeting.MeetingDate}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meetingshowmodal;
