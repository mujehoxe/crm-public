import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import { MdOutlineClose } from "react-icons/md";
import Meetings from "./Meetings/Meetings";
import ActivityLogs from "./ActivityLogs/ActivityLogs";
import Reminders from "./Reminders/Reminders";

const InfoModal = ({ leadData, modalStates, onClose }) => {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tabId, e) => {
    setActiveTab(tabId);
    e.stopPropagation();
  };

  return (
    <div
      className={
        "fixed top-0 left-0 w-full h-full flex justify-center items-start  bg-slate-700/30 z-[99]"
      }
    >
      <div className={`bg-white px-8 py-4 rounded-lg m-auto`}>
        <div className="flex w-full justify-between items-center">
          <p className="!mt-0 capitalize !mb-0 text-3xl font-Satoshi font-[500] flex items-end gap-2">
            {leadData.Name}
            <span className="text-lg">({leadData.Phone})</span>
          </p>
          <p
            className="text-4xl hover:text-red-500 !mt-0 !mb-0 cursor-pointer "
            onClick={onClose}
          >
            <MdOutlineClose />
          </p>
        </div>
        <div className="card-body mt-7 p-0">
          <div className="container">
            <div className="flex gap-3 mb-4">
              <button
                className={`text-gray-600 px-4 rounded-lg font-[500] font-Satoshi text-lg py-2 ${
                  activeTab === "tab1" ? "bg-gray-200" : "hover:bg-slate-100"
                }`}
                onClick={(e) => handleTabClick("tab1", e)}
              >
                Description
              </button>
              <button
                className={`text-gray-600 px-4 rounded-lg font-[500] font-Satoshi text-lg py-2 ${
                  activeTab === "tab2" ? "bg-gray-200" : "hover:bg-slate-100"
                }`}
                onClick={(e) => handleTabClick("tab2", e)}
              >
                Reminders
              </button>
              <button
                className={`text-gray-600 px-4 rounded-lg font-[500] font-Satoshi text-lg py-2 ${
                  activeTab === "tab3" ? "bg-gray-200" : "hover:bg-slate-100"
                }`}
                onClick={(e) => handleTabClick("tab3", e)}
              >
                Meetings
              </button>
              <button
                className={`text-gray-600 px-4 rounded-lg font-[500] font-Satoshi text-lg py-2 ${
                  activeTab === "tab4" ? "bg-gray-200" : "hover:bg-slate-100"
                }`}
                onClick={(e) => handleTabClick("tab4", e)}
              >
                Activity Log
              </button>
            </div>
            <div className="border rounded-lg p-4 h-[28rem] overflow-y-auto">
              {activeTab === "tab1" &&
                (leadData.Description ? (
                  <div> {leadData.Description} </div>
                ) : (
                  <div> No Description </div>
                ))}
              {activeTab === "tab2" && (
                <Reminders modalStates={modalStates} leadData={leadData} />
              )}
              {activeTab === "tab3" && (
                <Meetings modalStates={modalStates} leadData={leadData} />
              )}
              {activeTab === "tab4" && <ActivityLogs leadData={leadData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
