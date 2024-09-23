import SearchableSelect from "@/app/Leads/dropdown";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import styles from "../../Modal.module.css";

const BulkModal = ({
  onClose,
  selectedLeads,
  setBulkOperationMade,
  sourceOptions,
  statusOptions,
  users,
}) => {
  const [loading, setLoading] = useState(false);
  const [bulkData, setBulkData] = useState({
    status: null,
    source: null,
    assignee: null,
    description: "",
    clearData: false,
  });

  const handleChange = (field) => (value) => {
    setBulkData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleBooleanField = (field) => () => {
    setBulkData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const body = {
        leads: selectedLeads,
        status: bulkData.status,
        source: bulkData.source,
        assignee: bulkData.assignee,
        clearData: bulkData.clearData,
      };

      if (bulkData.description !== "") {
        body.description = bulkData.description;
      }

      await axios.put("/api/Lead/bulk", body);
      setBulkOperationMade((prev) => !prev);
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

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
                options={statusOptions}
                defaultValue={
                  selectedLeads.length === 1
                    ? selectedLeads[0].LeadStatus?._id
                    : undefined
                }
                placeholder="Change Status..."
                onChange={handleChange("status")}
              />
            </div>
            <div className="mb-4">
              <h5>Source</h5>
              <SearchableSelect
                options={sourceOptions}
                defaultValue={
                  selectedLeads.length === 1
                    ? selectedLeads[0].Source._id
                    : undefined
                }
                placeholder="Change Source..."
                onChange={handleChange("source")}
              />
            </div>
            <div className="mb-4">
              <h5>Assigned</h5>
              <SearchableSelect
                options={users}
                placeholder="Assign..."
                onChange={handleChange("assignee")}
                defaultValue={
                  selectedLeads.length === 1
                    ? selectedLeads[0].Assigned?._id
                    : undefined
                }
              />
            </div>

            <div className="mb-4">
              <h5 className="">Description</h5>
              <p className="">Describe the change being made</p>
              <div class="pl-2 css-13cymwt-control">
                <textarea
                  placeholder="Description your changes"
                  className="text-inherit bg-transparent w-full border-none m-0 p-0 h-32 outline-none pt-1 text-gray-500"
                  style={{
                    gridArea: "1 / 2",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                  onBlur={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div
              onClick={toggleBooleanField("clearData")}
              className="flex select-none flex-row cursor-pointer text-red-600 mb-4 items-center gap-2"
            >
              <FaCheck
                className={`w-4 h-4 rounded text-center text-xs border-2  ${
                  bulkData.clearData
                    ? "text-white bg-red-600 border-red-600"
                    : "text-transparent"
                }`}
              />
              <span className="p-0 m-0">Clear Data</span>
            </div>

            <div className="mb-4 text-right">
              <button
                className="bg-miles-600 text-white rounded px-6"
                onClick={handleSubmit}
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

export default BulkModal;
