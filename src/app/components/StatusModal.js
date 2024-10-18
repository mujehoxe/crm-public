import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "../Modal.module.css";
const StatusModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const [Status, setStatus] = React.useState({
    Status: "",
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/Status/add", Status);
      toast.success("Status add successful");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={onClose}>
          &times;
        </span>
        <h4>{loading ? "Processing" : "Add Status"}</h4>
        <div className="card-body mt-4">
          <div>
            <div className="mb-4">
              <input
                className="px-4 py-2 border rounded-md w-full"
                onChange={(e) =>
                  setStatus({ ...Status, Status: e.target.value })
                }
                type="text"
                placeholder="Status Name"
              />
            </div>
            <div className="mb-4">
              <button
                className="w-full bg-miles-700 hover:bg-miles-800 text-white font-medium rounded-lg text-sm px-6 py-1"
                onClick={onSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
