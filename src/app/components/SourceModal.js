import React, { useState } from "react";
import styles from "../Modal.module.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import { toast } from "react-toastify";

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
        <h4>{loading ? "processing" : "Add Source"}</h4>
        <div className="card-body mt-4">
          <div>
            <div className="mb-4">
              <input
                className="form-control"
                onChange={(e) =>
                  setSource({ ...Source, SourceDATA: e.target.value })
                }
                type="text"
                placeholder="Source Name"
              />
            </div>

            <div className="mb-4">
              <button className="btn btn-primary w-100" onClick={onSubmit}>
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
