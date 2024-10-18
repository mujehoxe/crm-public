import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InlineLoader from "../../../components/InlineLoader";
import SearchableSelect from "../../../Leads/dropdown";
import styles from "../../../Modal.module.css";

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

  const [reminder, setReminder] = React.useState({
    DateTime: "",
    Assignees: "",
    Leadid: lead,
    Comment: "",
  });

  const handleSelectChange = (reminder, selectedOption) => {
    setReminder((prevReminder) => ({
      ...prevReminder,
      [reminder]: selectedOption.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/Reminder/add", reminder);
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
        <button
          className="text-gray-500 hover:text-gray-700 cursor-pointer absolute top-4 right-4"
          onClick={onClose}
          aria-label="Close"
        >
          <XMarkIcon className="size-6" />
        </button>
        <h4>Add Reminder</h4>
        <h5>{loading && <InlineLoader />}</h5>
        <div className="mt-4">
          <div className="mb-4 text-left">
            <input
              className="css-13cymwt-control css-hlgwow css-1jqq78o-placeholder text-inherit bg-transparent opacity-100 w-full min-w-[2px] border-0 m-0 outline-none p-0"
              type="datetime-local"
              onChange={(e) =>
                setReminder({ ...reminder, DateTime: e.target.value })
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
              className="css-13cymwt-control css-hlgwow css-1jqq78o-placeholder  css-19bb58m text-inherit bg-transparent opacity-100 w-full min-w-[2px] border-0 m-0 outline-none p-0"
              onChange={(e) =>
                setReminder({ ...reminder, Comment: e.target.value })
              }
              type="text"
              placeholder="Reminder Description"
            />
          </div>

          <div className="mb-4">
            <button
              className="bg-miles-600 text-white hover:bg-miles-800 w-full py-2 rounded-md"
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

export default ReminderModal;
