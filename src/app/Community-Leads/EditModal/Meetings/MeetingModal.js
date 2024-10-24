import SearchableSelect from "@/app/Leads/dropdown";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InlineLoader from "../../../components/InlineLoader";
import styles from "../../../Modal.module.css";

const MeetingModal = ({ onClose, leadId }) => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

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

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Urgent", label: "Urgent" },
  ];

  const statusOptions = [
    { value: "Meeting Scheduled", label: "Meeting Scheduled" },
    { value: "Meeting Completed", label: "Meeting Completed" },
    { value: "Meeting Cancelled", label: "Meeting Cancelled" },
  ];

  const [followersOptions, setFollowersOptions] = useState([]);

  const typeOptions = [
    { value: "Primary", label: "Primary" },
    { value: "Secondary", label: "Secondary" },
  ];

  const directOrAgetOptions = [
    { value: "Direct", label: "Direct" },
    { value: "Agent", label: "Agent" },
  ];

  useEffect(() => {
    const newOptions = users.map((user) => ({
      value: user._id,
      label: user.username,
    }));
    setFollowersOptions(newOptions);
  }, [users]);

  const [meeting, setMeeting] = useState({
    Subject: "",
    MeetingDate: "",
    Time: "",
    Priority: "",
    Lead: leadId,
    Assignees: "",
    Followers: "",
    Status: "",
    Comment: "",
    MeetingType: "",
    directoragnet: "",
    agentName: "",
    agentPhone: "",
    agentCompany: "",
    Developer: "",
    Location: "",
  });

  const handleSelectChange = (field, selectedOption) => {
    setMeeting((prevMeeting) => ({
      ...prevMeeting,
      [field]: selectedOption.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/Meeting/add", meeting);
      onClose();
      toast.success("Meeting Added successfully");
    } catch (error) {
      console.error("Error adding meeting:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.error || error.message;
        toast.error(`Failed to add meeting: ${errorMessage}`);
      } else {
        toast.error("An unexpected error occurred while adding the meeting.");
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
        <h4>Add Meeting</h4>
        <h5>{loading && <InlineLoader />}</h5>
        <div className="mt-4">
          <div>
            <div className="mb-4 text-left">
              <input
                className="css-13cymwt-control css-hlgwow css-1jqq78o-placeholder  css-19bb58m text-inherit bg-transparent opacity-100 w-full min-w-[2px] border-0 m-0 outline-none p-0"
                id="subject"
                onChange={(e) =>
                  setMeeting({ ...meeting, Subject: e.target.value })
                }
                type="text"
                placeholder="Subject"
              />
            </div>
            <div className="mb-4 text-left">
              <input
                className="css-13cymwt-control css-hlgwow css-1jqq78o-placeholder text-inherit bg-transparent opacity-100 w-full min-w-[2px] border-0 m-0 outline-none p-0"
                onChange={(e) => {
                  const dateTimeString = e.target.value;
                  const [date, time] = dateTimeString.split("T");

                  setMeeting((prevMeeting) => ({
                    ...prevMeeting,
                    MeetingDate: date,
                    Time: time,
                  }));
                }}
                type="datetime-local"
                placeholder="Meeting Date"
              />
            </div>
            <div className="mb-4 text-left">
              <SearchableSelect
                options={priorityOptions}
                onChange={(selectedOption) =>
                  handleSelectChange("Priority", selectedOption)
                }
                placeholder="Priority..."
              />
            </div>
          </div>
          <div className="mb-4 text-left">
            <SearchableSelect
              options={typeOptions}
              onChange={(selectedOption) =>
                handleSelectChange("MeetingType", selectedOption)
              }
              placeholder="Meeting Type..."
            />
          </div>
          {meeting.MeetingType === "Secondary" && (
            <div className="mb-4 text-left">
              <SearchableSelect
                options={directOrAgetOptions}
                onChange={(selectedOption) =>
                  handleSelectChange("directoragnet", selectedOption)
                }
                placeholder="Direct Or Agent To Agent..."
              />
            </div>
          )}
          {meeting.directoragnet === "Agent" && (
            <>
              <div className="mb-4 text-left">
                <input
                  className="css-13cymwt-control css-hlgwow css-1jqq78o-placeholder  css-19bb58m text-inherit bg-transparent opacity-100 w-full min-w-[2px] border-0 m-0 outline-none p-0"
                  onChange={(e) =>
                    setMeeting({ ...meeting, agentName: e.target.value })
                  }
                  type="text"
                  placeholder="Agent Name"
                />
              </div>
              <div className="mb-4 text-left">
                <input
                  className="css-13cymwt-control css-hlgwow css-1jqq78o-placeholder  css-19bb58m text-inherit bg-transparent opacity-100 w-full min-w-[2px] border-0 m-0 outline-none p-0"
                  onChange={(e) =>
                    setMeeting({ ...meeting, agentPhone: e.target.value })
                  }
                  type="text"
                  placeholder="Agent Phone"
                />
              </div>
              <div className="mb-4 text-left">
                <input
                  className="css-13cymwt-control css-hlgwow css-1jqq78o-placeholder  css-19bb58m text-inherit bg-transparent opacity-100 w-full min-w-[2px] border-0 m-0 outline-none p-0"
                  onChange={(e) =>
                    setMeeting({ ...meeting, agentCompany: e.target.value })
                  }
                  type="text"
                  placeholder="Agent Company"
                />
              </div>
            </>
          )}
          {meeting.MeetingType === "Primary" && (
            <>
              <div className="mb-4 text-left">
                <input
                  className="css-13cymwt-control css-hlgwow css-1jqq78o-placeholder  css-19bb58m text-inherit bg-transparent opacity-100 w-full min-w-[2px] border-0 m-0 outline-none p-0"
                  onChange={(e) =>
                    setMeeting({ ...meeting, Developer: e.target.value })
                  }
                  type="text"
                  placeholder="Developer"
                />
              </div>
              <div className="mb-4 text-left">
                <input
                  className="css-13cymwt-control css-hlgwow css-1jqq78o-placeholder  css-19bb58m text-inherit bg-transparent opacity-100 w-full min-w-[2px] border-0 m-0 outline-none p-0"
                  onChange={(e) =>
                    setMeeting({ ...meeting, Location: e.target.value })
                  }
                  type="text"
                  placeholder="Location"
                />
              </div>
            </>
          )}

          <div className="mb-4 text-left">
            <SearchableSelect
              options={followersOptions}
              onChange={(selectedOption) =>
                handleSelectChange("Followers", selectedOption)
              }
              placeholder="Follower..."
            />
          </div>
          <div className="mb-4 text-left">
            <SearchableSelect
              options={statusOptions}
              onChange={(selectedOption) =>
                handleSelectChange("Status", selectedOption)
              }
              placeholder="Status..."
            />
          </div>
          <div className="mb-4 text-left">
            <input
              className="css-13cymwt-control css-hlgwow css-1jqq78o-placeholder  css-19bb58m text-inherit bg-transparent opacity-100 w-full min-w-[2px] border-0 m-0 outline-none p-0"
              onChange={(e) =>
                setMeeting({ ...meeting, Comment: e.target.value })
              }
              type="text"
              placeholder="Meeting Comment"
            />
          </div>
          <div className="mb-4">
            <button
              className="bg-miles-600 text-white hover:bg-miles-800 w-full py-2 rounded-md disabled:bg-gray-400"
              onClick={onSubmit}
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingModal;
