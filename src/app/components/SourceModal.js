import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "../Modal.module.css";

const SourceModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const [Source, setSource] = React.useState({
    SourceDATA: "",
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/Source/add", Source);
      toast.success("Source add successful");
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
        <h4>{loading ? "Processing" : "Add Source"}</h4>
        <div className="card-body mt-4">
          <div>
            <div className="mb-4">
              <input
                className="px-4 py-2 border rounded-md w-full"
                onChange={(e) =>
                  setSource({ ...Source, SourceDATA: e.target.value })
                }
                type="text"
                placeholder="Source Name"
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

export default SourceModal;
