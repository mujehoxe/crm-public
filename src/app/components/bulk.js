import React, { useState, useEffect, useRef } from "react";
import styles from "../Modal.module.css";
import axios from "axios";
import SearchableSelect from "../Leads/dropdown";
import "bootstrap/dist/css/bootstrap.css";
import TokenDecoder from "./Cookies";

const BulkModal = ({ onClose, selectedLeads, setBulkOperationMade }) => {
  const userdata = TokenDecoder();
  const userid = userdata ? userdata.id : null;
  const username = userdata ? userdata.name : null;
  const userrole = userdata ? userdata.role : null;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options3, setOptions3] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [options9, setOptions9] = useState([]);
  const [description, setDescription] = useState("");
  const [isDescriptionDisabled, setIsDescriptionDisabled] = useState(false);

  const options19 = [
    { value: "Admin", label: "Admin" },
    { value: "Marketing", label: "Marketing" },
    { value: "Manager", label: "Manager" },
    { value: "Finance", label: "Finance" },
    { value: "Operations", label: "Operations" },
    { value: "HR", label: "Human Resource" },
    { value: "BussinessHead", label: "Bussiness Head" },
    { value: "PNL", label: "PNL" },
    { value: "TL", label: "TL" },
    { value: "ATL", label: "ATL" },
    { value: "FOS", label: "FOS" },
  ];

  useEffect(() => {
    if (userrole !== null) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get("/api/staff/get");

          let filteredUsers = response.data.data;
          if (userrole == "BussinessHead") {
            const PNLUsers = response.data.data.filter(
              (user) => user.Role === "PNL" && user.PrentStaff === userid
            );
            const PNLIds = PNLUsers.map((user) => user._id);
            const tlUsers = response.data.data.filter(
              (user) => user.Role === "TL" && PNLIds.includes(user.PrentStaff)
            );
            const tlIds = tlUsers.map((user) => user._id);
            const atlUsers = response.data.data.filter(
              (user) => user.Role === "ATL" && tlIds.includes(user.PrentStaff)
            );
            const atlIds = atlUsers.map((user) => user._id);
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && atlIds.includes(user.PrentStaff)
            );
            filteredUsers = [...PNLUsers, ...tlUsers, ...atlUsers, ...fosUsers];
          } else if (userrole == "TL") {
            const atlUsers = response.data.data.filter(
              (user) => user.Role === "ATL" && user.PrentStaff === userid
            );
            const atlIds = atlUsers.map((user) => user._id);
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && atlIds.includes(user.PrentStaff)
            );
            filteredUsers = [...atlUsers, ...fosUsers];
          } else if (userrole == "PNL") {
            const tlUsers = response.data.data.filter(
              (user) => user.Role === "TL" && user.PrentStaff === userid
            );
            const tlIds = tlUsers.map((user) => user._id);
            const atlUsers = response.data.data.filter(
              (user) => user.Role === "ATL" && tlIds.includes(user.PrentStaff)
            );
            const atlIds = atlUsers.map((user) => user._id);
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && atlIds.includes(user.PrentStaff)
            );
            filteredUsers = [...tlUsers, ...atlUsers, ...fosUsers];
          } else if (userrole == "ATL") {
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && user.PrentStaff === userid
            );
            filteredUsers = [...fosUsers];
          } else if (userrole == "FOS") {
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && user._id === userid
            );
            filteredUsers = [...fosUsers];
          } else if (userrole == "Admin") {
            filteredUsers = response.data.data;
          } else if (userrole == "Operations") {
            filteredUsers = response.data.data;
          } else if (userrole == "Marketing") {
            filteredUsers = response.data.data;
          }
          filteredUsers = filteredUsers.filter(
            (user) => !["HR", "Finance", "SalesHead"].includes(user.Role)
          );

          const defaultOption = { value: userid, label: username };

          // Filter out the logged-in user if already present
          filteredUsers = filteredUsers.filter((user) => user._id !== userid);

          const mappedUsers =
            filteredUsers.length > 0
              ? [
                  defaultOption,
                  ...filteredUsers.map((user) => ({
                    value: user._id,
                    label: user.username,
                  })),
                ]
              : [defaultOption];

          setUsers(mappedUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }
  }, [userrole]);

  useEffect(() => {
    const newOptions = users.map((user) => ({
      value: user._id,
      label: user.username,
    }));
    setOptions9(newOptions);
  }, [users]);

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };

  const handleSourceChange = (selectedOption) => {
    setSelectedSource(selectedOption);
  };

  const handleAssigneeChange = (selectedOption) => {
    setSelectedAssignee(selectedOption);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const body = {
        leads: selectedLeads,
        status: selectedStatus,
        source: selectedSource,
        assignee: selectedAssignee,
      };

      description != "" && (body.description = description);

      const response = await axios.put("/api/Lead/bulk", body);
      setBulkOperationMade((prev) => !prev);
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };
  const [StatusCount, setStatusCount] = useState([]);
  const [options1, setoptions1] = useState([]);
  const [SourceCount, setSourceCount] = useState([]);
  const [options2, setoptions2] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        let url = `/api/Status/get`;
        const response = await axios.get(url);
        setStatusCount(response.data.data);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    const newOptions1 = StatusCount.map((StatusCount) => ({
      value: StatusCount._id,
      label: StatusCount.Status,
    }));
    setoptions1(newOptions1);
  }, [StatusCount]);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        let url = `/api/Source/get`;
        const response = await axios.get(url);
        setSourceCount(response.data.data);
      } catch (error) {
        console.error("Error fetching Source:", error);
      }
    };

    fetchSource();
  }, []);

  useEffect(() => {
    const newOptions2 = SourceCount.map((SourceCount) => ({
      value: SourceCount._id,
      label: SourceCount.Source,
    }));
    setoptions2(newOptions2);
  }, [SourceCount]);

  const checkRef = useRef(null);

  useEffect(() => {
    const handleIconClick = () => {
      setIsDescriptionDisabled(!isDescriptionDisabled);
    };

    const iconElement = checkRef.current;
    if (iconElement) {
      iconElement.addEventListener("click", handleIconClick);
      return () => {
        iconElement.removeEventListener("click", handleIconClick);
      };
    }
  }, [isDescriptionDisabled]);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={onClose}>
          &times;
        </span>
        <h4>Bulk Actions</h4>
        <h5>{loading ? "Processing..." : ""}</h5>
        <div className="card-body mt-4">
          <div>
            <div className="mb-4">
              <h5>Status</h5>
              <SearchableSelect
                options={options1}
                defaultValue={
                  selectedLeads.length == 1
                    ? selectedLeads[0].LeadStatus._id
                    : undefined
                }
                placeholder="Change Status..."
                onChange={handleStatusChange}
              />
            </div>
            <div className="mb-4">
              <h5>Source</h5>
              <SearchableSelect
                options={options2}
                placeholder="Change Source..."
                defaultValue={
                  selectedLeads.length == 1
                    ? selectedLeads[0].Source._id
                    : undefined
                }
                onChange={handleSourceChange}
              />
            </div>
            <div className="mb-4">
              <h5>Assigned</h5>
              <SearchableSelect
                options={users}
                placeholder="Assigne..."
                onChange={handleAssigneeChange}
                defaultValue={
                  selectedLeads.length == 1
                    ? selectedLeads[0].Assigned._id
                    : undefined
                }
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center flex-row gap-2">
                <i
                  ref={checkRef}
                  className={`text-red text-center fa fa-check text-xs p-0.5 border-2 border-gray-600  ${
                    isDescriptionDisabled
                      ? "text-transparent"
                      : "text-gray-400 "
                  }`}
                ></i>
                <h5>Description</h5>
              </div>

              <p className="pl-6">Describe the change being made</p>
              {!isDescriptionDisabled && (
                <div class="pl-2 css-13cymwt-control">
                  <textarea
                    placeholder="Description..."
                    className="css-19bb58m css-1jqq78o-placeholder h-32 pt-1 text-gray-500"
                    style={{
                      color: "inherit",
                      backgroundColor: "transparent",
                      width: "100%",
                      gridArea: "1 / 2",
                      fontFamily: "inherit",
                      minWidth: "2px",
                      border: "none",
                      margin: "0px",
                      outline: "none",
                      padding: "0px",
                    }}
                    onBlur={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>

            <div className="mb-4">
              <button className="btn btn-primary w-100" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkModal;
