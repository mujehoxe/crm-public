import InlineLoader from "@/app/components/InlineLoader";
import SearchableSelect from "@/app/Leads/dropdown";
import axios from "axios";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

const BulkModal = ({
  onClose,
  selectedLeads,
  setSelectedLeads,
  setBulkOperationMade,
  sourceOptions,
  statusOptions,
  agents,
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
      onClose();
      setSelectedLeads([]);
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full overflow-y-auto">
        <button
          className="text-gray-500 hover:text-gray-700 absolute top-4 right-4"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          Bulk Actions
          {loading && <InlineLoader disableText={true} />}
        </h4>

        <div className="space-y-6">
          {/* Status Field */}
          <div>
            <h5 className="text-sm font-medium">Status</h5>
            <SearchableSelect
              options={statusOptions}
              defaultValue={
                selectedLeads.length === 1
                  ? selectedLeads[0].LeadStatus?._id
                  : undefined
              }
              placeholder="Change Status..."
              onChange={handleChange("status")}
              className="w-full"
            />
          </div>

          {/* Source Field */}
          <div>
            <h5 className="text-sm font-medium">Source</h5>
            <SearchableSelect
              options={sourceOptions}
              defaultValue={
                selectedLeads.length === 1
                  ? selectedLeads[0].Source._id
                  : undefined
              }
              placeholder="Change Source..."
              onChange={handleChange("source")}
              className="w-full"
            />
          </div>

          {/* Assigned Agent Field */}
          <div>
            <h5 className="text-sm font-medium">Assigned</h5>
            <SearchableSelect
              options={agents}
              placeholder="Assign..."
              onChange={handleChange("assignee")}
              defaultValue={
                selectedLeads.length === 1
                  ? selectedLeads[0].Assigned?._id
                  : undefined
              }
              className="w-full"
            />
          </div>

          {/* Description Field */}
          <div>
            <h5 className="text-sm font-medium">Description</h5>
            <p className="text-sm text-gray-500 mb-2">
              Describe the change being made
            </p>
            <textarea
              placeholder="Describe your changes"
              className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-miles-500"
              onBlur={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Clear Data Checkbox */}
          <div
            onClick={toggleBooleanField("clearData")}
            className="flex items-center gap-2 cursor-pointer select-none text-red-600"
          >
            <FaCheck
              className={`w-5 h-5 rounded border-2 ${
                bulkData.clearData
                  ? "bg-red-600 border-red-600 text-white"
                  : "border-gray-300 text-transparent"
              }`}
            />
            <span>Clear Data</span>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              className={`px-6 py-2 rounded-md shadow-md text-white transition-all duration-150 focus:ring-2 focus:ring-miles-500 focus:ring-offset-2 ${
                loading
                  ? "bg-gray-300 text-gray-400 cursor-wait"
                  : "bg-miles-600 hover:bg-miles-500"
              }`}
              onClick={handleSubmit}
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

export default BulkModal;
