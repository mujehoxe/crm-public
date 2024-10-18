import styles from "@/app/Modal.module.css";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import ActivityLogs from "./ActivityLogs/ActivityLogs";
import Comments from "./Comments/Comments";
import Meetings from "./Meetings/Meetings";
import Reminders from "./Reminders/Reminders";

const InfoModal = ({ leadData, modalStates, onClose }) => {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tabId, e) => {
    setActiveTab(tabId);
    e.stopPropagation();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className="bg-white w-full mx-52 my-auto px-8 py-4 rounded-lg shadow-lg">
        <div className="flex w-full justify-between items-center">
          <p className="capitalize m-0 p-0 text-3xl font-Satoshi font-medium flex items-end gap-2">
            {leadData.Name}
            <span className="text-lg">({leadData.Phone})</span>
          </p>
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <XMarkIcon className="size-6" />
          </button>
        </div>
        <div className="mt-6 p-0">
          <div className="container">
            <div className="flex gap-2 mb-2">
              <button
                className={`text-gray-600 px-6 py-1 rounded-lg text-lg ${
                  activeTab === "tab1" ? "bg-gray-200" : "hover:bg-slate-100"
                }`}
                onClick={(e) => handleTabClick("tab1", e)}
              >
                Comments
              </button>
              <button
                className={`text-gray-600 px-6 py-1 rounded-lg text-lg ${
                  activeTab === "tab2" ? "bg-gray-200" : "hover:bg-slate-100"
                }`}
                onClick={(e) => handleTabClick("tab2", e)}
              >
                Reminders
              </button>
              <button
                className={`text-gray-600 px-6 py-1 rounded-lg text-lg ${
                  activeTab === "tab3" ? "bg-gray-200" : "hover:bg-slate-100"
                }`}
                onClick={(e) => handleTabClick("tab3", e)}
              >
                Meetings
              </button>
              <button
                className={`text-gray-600 px-6 py-1 rounded-lg text-lg ${
                  activeTab === "tab4" ? "bg-gray-200" : "hover:bg-slate-100"
                }`}
                onClick={(e) => handleTabClick("tab4", e)}
              >
                Activity Log
              </button>
            </div>
            {activeTab === "tab1" ? (
              <Comments modalStates={modalStates} leadData={leadData} />
            ) : (
              <div className="border rounded-lg p-4 h-[28rem] overflow-y-auto">
                {activeTab === "tab2" && (
                  <Reminders modalStates={modalStates} leadData={leadData} />
                )}
                {activeTab === "tab3" && (
                  <Meetings modalStates={modalStates} leadData={leadData} />
                )}
                {activeTab === "tab4" && <ActivityLogs leadData={leadData} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
