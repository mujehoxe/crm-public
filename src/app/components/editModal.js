import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import { MdOutlineClose } from "react-icons/md";
import moment from "moment/moment";
import LogDisplay from "./LogDisplay";
import Meetings from "./Meetings";

const EditModal = ({ leadData, onClose2, setMeetingId, setReminderId }) => {
  const [showModal, setShowModal] = useState(true);

  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tabId, e) => {
    setActiveTab(tabId);
    e.stopPropagation();
  };

  const [Reminders, setReminders] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (leadData._id) {
          const response = await axios.get(`/api/Reminder/get/${leadData._id}`);
          setReminders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    if (leadData._id) {
      fetchData();
    }
  }, [leadData._id]);

  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (leadData._id) {
          setLoading(true);
          const response = await axios.get(`/api/log/${leadData._id}`);
          setLogs(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    if (leadData._id) {
      fetchData();
    }
  }, [leadData._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (leadData._id) {
          const response = await axios.get(`/api/Meeting/get/${leadData._id}`);
          setMeetings(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    if (leadData._id) {
      fetchData();
    }
  }, [leadData._id]);

  return (
    <>
      {showModal && (
        <div
          className={
            "fixed top-0 left-0 w-full h-full flex justify-center items-start  bg-slate-700/30 z-[99]"
          }
        >
          <div className={`bg-white px-7 py-4 rounded-lg m-28`}>
            <div className="flex w-full justify-between items-center">
              <p className="!mt-0 capitalize !mb-0 text-3xl font-Satoshi font-[500] flex items-end gap-2">
                {leadData.Name}
                <span className="text-lg">({leadData.Phone})</span>
              </p>
              <p
                className="text-4xl hover:text-red-500 !mt-0 !mb-0 cursor-pointer "
                onClick={onClose2}
              >
                <MdOutlineClose />
              </p>
            </div>
            <div className="card-body mt-7 p-0">
              <div className="container">
                <div className="flex gap-3 mb-4">
                  <button
                    className={`text-gray-600 px-4 rounded-lg font-[500] font-Satoshi text-lg py-2 ${
                      activeTab === "tab1"
                        ? "bg-gray-200"
                        : "hover:bg-slate-100"
                    }`}
                    onClick={(e) => handleTabClick("tab1", e)}
                  >
                    Description
                  </button>
                  <button
                    className={`text-gray-600 px-4 rounded-lg font-[500] font-Satoshi text-lg py-2 ${
                      activeTab === "tab2"
                        ? "bg-gray-200"
                        : "hover:bg-slate-100"
                    }`}
                    onClick={(e) => handleTabClick("tab2", e)}
                  >
                    Reminders
                  </button>
                  <button
                    className={`text-gray-600 px-4 rounded-lg font-[500] font-Satoshi text-lg py-2 ${
                      activeTab === "tab3"
                        ? "bg-gray-200"
                        : "hover:bg-slate-100"
                    }`}
                    onClick={(e) => handleTabClick("tab3", e)}
                  >
                    Meetings
                  </button>
                  <button
                    className={`text-gray-600 px-4 rounded-lg font-[500] font-Satoshi text-lg py-2 ${
                      activeTab === "tab4"
                        ? "bg-gray-200"
                        : "hover:bg-slate-100"
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
                    <div className="flex flex-col justify-center gap-2 items-center">
                      <div className="w-full flex items-center gap-2">
                        <p className="text-lg font-[500] !mb-0 !mt-0">
                          Total Reminders{" "}
                        </p>{" "}
                        <div className="text-lg  !mb-0 !mt-0">
                          {Reminders.length}
                        </div>
                      </div>
                      {Reminders.length <= 0 ? (
                        <div className="">
                          <p className="text-2xl">No Reminder to show</p>
                        </div>
                      ) : (
                        <div className={`w-full flex flex-col gap-2`}>
                          {Reminders.map((reminder, index) => {
                            return (
                              <div
                                key={index}
                                className={`w-full bg-slate-50 rounded-md py-2 px-1`}
                              >
                                <div className="w-full justify-between flex gap-2 items-center">
                                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                                    {reminder.Assignees.username}
                                  </p>
                                  <p className="!mb-0 !mt-0 mr-2">
                                    {moment(reminder.DateTime).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </p>
                                </div>
                                <p className="!mb-0 !mt-0">
                                  {reminder.Comment}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setReminderId(leadData._id._id);
                        }}
                        className=" font-Satoshi text-lg !border-0 bg-gray-100 hover:!bg-gray-200 rounded-lg px-3 py-2 font-[400]"
                      >
                        Add Reminder
                      </button>
                    </div>
                  )}
                  {activeTab === "tab3" && (
                    <Meetings
                      meetings={leadData.meetings}
                      setMeetingId={setMeetingId}
                      leadData={leadData}
                    ></Meetings>
                  )}
                  {activeTab === "tab4" && (
                    <LogDisplay
                      loading={loading}
                      logs={logs}
                      leadData={leadData}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditModal;
