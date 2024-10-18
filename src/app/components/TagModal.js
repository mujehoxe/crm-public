import axios from "axios";
import React, { useState } from "react";
import styles from "../Modal.module.css";

const TagMOdal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const [Tags, setTags] = React.useState({
    Tags: "",
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/tags/add", Tags);
      console.log("Tags add success", response.data);
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
        <h4>{loading ? "Processing" : "Add Tags"}</h4>
        <div className="card-body mt-4">
          <div>
            <div className="mb-4">
              <input
                className="form-control px-4 py-2 border rounded-md"
                onChange={(e) => setTags({ ...Tags, Tags: e.target.value })}
                type="text"
                placeholder="Tag Name"
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

export default TagMOdal;
