import React, { useEffect, useState } from "react";
import styles from "../Modal.module.css";
import axios from "axios";
import SearchableSelect from "../Leads/dropdown";
import "bootstrap/dist/css/bootstrap.css";
import { toast } from "react-toastify";
import InlineLoader from "../Community-Leads/InlineLoader";

const ReminderModal = ({ onClose, lead }) => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [assigneesOptions, setAssigneesOptions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/staff/get");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const newOptions = users.map((user) => ({
      value: user._id,
      label: user.username,
    }));
    setAssigneesOptions(newOptions);
  }, [users]);

  const [Reminder, setReminder] = React.useState({
    DateTime: "",
    Assignees: "",
    Leadid: lead,
    Comment: "",
  });

  const handleSelectChange = (Reminder, selectedOption) => {
    setReminder((prevReminder) => ({
      ...prevReminder,
      [Reminder]: selectedOption.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/Reminder/add", Reminder);
      onClose();
      toast.success("Reminder Added successfully");
    } catch (error) {
      console.error("Error adding reminder:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.error || error.message;
        toast.error(`Failed to add reminder: ${errorMessage}`);
      } else {
        toast.error("An unexpected error occurred while adding the reminder.");
      }
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
        <h4>Add Reminder</h4>
        <h5>{loading && <InlineLoader />}</h5>
        <div className="card-body mt-4">
          <div className="mb-4 text-left">
            <input
              className="form-control"
              type="datetime-local"
              onChange={(e) =>
                setReminder({ ...Reminder, DateTime: e.target.value })
              }
              id="example-datetime-local-input"
            />
          </div>

          <div className="mb-4 text-left">
            <SearchableSelect
              options={assigneesOptions}
              onChange={(selectedOption) =>
                handleSelectChange("Assignees", selectedOption)
              }
              placeholder="Assignees..."
            />
          </div>

          <div className="mb-4 text-left">
            <input
              className="form-control"
              onChange={(e) =>
                setReminder({ ...Reminder, Comment: e.target.value })
              }
              type="text"
              placeholder="Reminder Description"
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
  );
};

export default ReminderModal;
