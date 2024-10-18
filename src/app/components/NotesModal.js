import axios from "axios";
import React from "react";
import styles from "../Modal.module.css";
const NotesModal = ({ onClose, lead }) => {
  const [Notes, setNotes] = React.useState({
    Comment: "",
    Leadid: lead,
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/notes/add", Notes);
      console.log("Notes add success", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = React.useState(false);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={onClose}>
          &times;
        </span>
        <h4 className="text-center">{loading ? "Processing" : "Add Notes"}</h4>
        <div className="mt-4">
          <div className="mb-4 text-left">
            <input
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-miles-600"
              onChange={(e) => setNotes({ ...Notes, Comment: e.target.value })}
              type="text"
              placeholder="Notes Description"
            />
          </div>

          <div className="mb-4">
            <button
              className="w-full text-white bg-miles-600 hover:bg-miles-800 rounded-md py-2 font-medium"
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
