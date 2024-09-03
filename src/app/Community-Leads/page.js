"use client";
import RootLayout from "@/app/components/layout";
import { DatePicker, Select } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import moment from "moment/moment";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaPlus } from "react-icons/fa";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { RiUploadCloud2Fill } from "react-icons/ri";
import { SiGooglesheets } from "react-icons/si";
import { ToastContainer, toast } from "react-toastify";
import "rsuite/dist/rsuite.min.css";
import Excelmodal from "../Leads/excelmodal";
import TokenDecoder from "../components/Cookies";
import ReminderModal from "../components/Remindermodal";
import BulkModal from "./Bulk/bulk";
import LeadCard from "./LeadCard";
import EditModal from "./EditModal/EditModal";
import MeetingModal from "./EditModal/MeetingModal";

const { RangePicker } = DatePicker;

function Cold() {
  const [Leadss, setLeadss] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage, setleadsPerPage] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [leadid, setLeadId] = useState("");
  const [selectedTag, setSelectedTag] = useState([]);
  const [TagsCount, setTagsCount] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selecteduser, setselecteduser] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedValues2, setSelectedValues2] = useState([]);
  const [selectedValues3, setSelectedValues3] = useState([]);
  const [selectedValues4, setSelectedValues4] = useState([]);
  const [date, setDate] = useState([]);

  const [sourceOptions, setSourceOptions] = useState([]);
  const [SourceCount, setSourceCount] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [StatusCount, setStatusCount] = useState([]);

  const [Meeting, setMeetings] = useState([]);

  const userdata = TokenDecoder();
  const userid = userdata ? userdata.id : null;
  const userrole = userdata ? userdata.role : null;
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const fetchLead = async (pageNumber = 1) => {
    try {
      const url = getBaseURL();
      const params = getQueryParams();
      const response = await axios.get(`${url}?${params}`);
      const filteredLeads = filterLeads(response.data.data);
      setLeadss(filteredLeads);
      setTotalLeads(response.data.totalLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const getBaseURL = () => {
    switch (userrole) {
      case "Admin":
      case "superAdmin":
        return `/api/Lead/get`;
      case "FOS":
        return `/api/Lead/FOS/${userid}`;
      case "BussinessHead":
        return `/api/Lead/hiearchy?role=ATL&userid=${userid}`;
      case "PNL":
        return `/api/Lead/hiearchy?role=PNL&userid=${userid}`;
      case "TL":
        return `/api/Lead/hiearchy?role=TL&userid=${userid}`;
      case "ATL":
        return `/api/Lead/hiearchy?role=ATL&userid=${userid}`;
      default:
        throw new Error("Invalid user role");
    }
  };

  const getQueryParams = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage);
    params.append("limit", leadsPerPage);

    if (searchTerm) params.append("searchterm", searchTerm);
    if (selectedValues.length > 0)
      params.append("selectedValues", selectedValues);
    if (selectedValues2.length > 0)
      params.append("selectedValues2", selectedValues2);
    if (selectedValues3.length > 0)
      params.append("selectedValues3", selectedValues3);
    if (selectedValues4.length > 0)
      params.append("selectedTag", selectedValues4);
    if (date) params.append("date", date);

    return params.toString();
  };

  const filterLeads = (leads) => {
    return leads.filter(
      (lead) =>
        lead.Phone.toString() === searchTerm ||
        lead.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const [bulkOperationMade, setBulkOperationMade] = useState(false);

  useEffect(() => {
    fetchLead(currentPage);
  }, [
    userrole,
    userid,
    selectedTag,
    selectedValues,
    selectedValues2,
    selectedValues3,
    date,
    selectedTag,
    leadsPerPage,
    currentPage,
    searchTerm,
    bulkOperationMade,
  ]);

  const [btnShow, setBtnShow] = useState(false);

  const fetchDataAndDownloadExcel = async () => {
    try {
      const response = await axios.post(`/api/Lead/export/cold`);
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const [currentLeads, setCurrentLeads] = useState(
    Leadss.slice(indexOfFirstLead, indexOfLastLead)
  );

  const changePage = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await fetchLead(pageNumber);
  };

  const nextPage = () => {
    const totalPages = Math.ceil(totalLeads / leadsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openexcelmodal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const openbulkModal = () => {
    setIsModalOpen2(!isModalOpen2);
  };

  const handleCardClick = (cardLead, e) => {
    e.stopPropagation();
    if (selectedLeads.includes(cardLead)) {
      setSelectedLeads(
        selectedLeads.filter((lead) => lead._id !== cardLead._id)
      );
    } else {
      setSelectedLeads([...selectedLeads, cardLead]);
    }
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === currentLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(currentLeads);
    }
    setSelectAll(!selectAll);
  };

  function disabledDate(current) {
    return current && current > moment().endOf("day");
  }

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
    const newSourceOptions = SourceCount.map((SourceCount) => ({
      value: SourceCount._id,
      label: SourceCount.Source,
    }));
    setSourceOptions(newSourceOptions);
  }, [SourceCount]);

  useEffect(() => {
    const newStatusOptions = StatusCount.map((StatusCount) => ({
      value: StatusCount._id,
      label: StatusCount.Status,
    }));
    setStatusOptions(newStatusOptions);
  }, [StatusCount]);

  const [Reminders, setReminders] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (leadid) {
          const response = await axios.get(`/api/Reminder/get/${leadid}`);
          setReminders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    if (leadid) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await axios.get(`/api/Source/get`);
        setSourceCount(response.data.data);
      } catch (error) {
        console.error("Error fetching Source:", error);
      }
    };

    fetchSource();
  }, []);

  const handleParse = (data) => {
    setParsedData(data);
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        let url = `/api/tags/get`;
        const response = await axios.get(url);
        setTagsCount(response.data.data);
      } catch (error) {
        console.error("Error fetching Tags:", error);
      }
    };

    fetchTags();
  }, []);

  const tagOptions = TagsCount.map((tag) => ({
    label: tag.Tag,
    value: tag._id,
  }));

  const countOptions = [
    { value: "100", label: "100" },
    { value: "200", label: "200" },
    { value: "1000 ", label: "1000" },
  ];

  const leadcountf = (value) => {
    setCurrentPage(1);
    setleadsPerPage(parseInt(value, 10));
  };

  const deleteSelectedLeads = async () => {
    try {
      await axios.delete(`/api/Lead/delete`, {
        data: { leadIds: selectedLeads.map((lead) => lead._id) },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting leads:", error);
    }
  };

  const handleSubmission = () => {
    if (selectedLeads.length === 1) {
      const leadId = selectedLeads[0] ? selectedLeads[0]._id.toString() : null;
      if (leadId) {
        window.location.href = `/Your-Deals/create?leadId=${leadId}`;
      } else {
        console.error("Lead ID is null.");
      }
    } else if (selectedLeads.length > 1) {
      toast.error("You have selected more than 1 Lead");
    } else {
      // Handle the case where no lead is selected
      toast.error("You Haven't Selected Any Lead");
    }
  };

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
          }
          filteredUsers = filteredUsers.filter(
            (user) =>
              ![
                "HR",
                "Finance",
                "Manager",
                "Operations",
                "Marketing",
                "SalesHead",
              ].includes(user.Role)
          );

          const username =
            response.data.data.find((user) => user._id === userid)?.username ||
            "Default Username";
          const defaultOption = { value: userid, label: username };
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

  const handleUserChange = (selected) => {
    setselecteduser(selected, "users");
    const selectedValues = selected.map((user) => user);
    setSelectedValues(selectedValues);
  };

  const handlestatusChange = (selected) => {
    setSelectedStatus(selected);
    const selectedValues2 = selected.map((status) => status);
    setSelectedValues2(selectedValues2);
  };

  const handlesourceChange = (selected) => {
    setsource(selected);
    const selectedValues3 = selected.map((source) => source);
    setSelectedValues3(selectedValues3);
  };
  const handletagchage = (selected) => {
    setSelectedTag(selected);
    const selectedValues4 = selected.map((tags) => tags);
    setSelectedValues4(selectedValues4);
  };
  const handleDateChange = (date, datestring) => {
    if (date) {
      setDate([date[0].$d, date[1].$d]);
    } else {
      setDate(null);
    }
  };

  const [edit, setEdit] = useState(false);
  const toggleModal = (e) => {
    setEdit(!edit);
    e.stopPropagation();
  };

  const containerRef = useRef(null);
  const handleClickOutsideButton = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setBtnShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideButton);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideButton);
    };
  }, []);

  const [meetingModalOpenForLead, setMeetingModalOpenForLead] = useState(0);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);

  const renderLeadCards = useCallback(
    (leads) =>
      leads.map((currentLead) => (
        <React.Fragment key={currentLead._id}>
          <LeadCard
            statusOptions={statusOptions}
            sourceOptions={sourceOptions}
            currentLead={currentLead}
            currentLeads={currentLeads}
            setCurrentLeads={setCurrentLeads}
            handleCardClick={handleCardClick}
            selectedLeads={selectedLeads}
            setEdit={setEdit}
          />
          {renderModals(currentLead)}
        </React.Fragment>
      )),
    [
      statusOptions,
      sourceOptions,
      currentLeads,
      setCurrentLeads,
      handleCardClick,
      selectedLeads,
      setEdit,
    ]
  );

  const renderModals = useCallback(
    (lead) => {
      return (
        <>
          {edit === lead._id && (
            <EditModal
              leadData={lead}
              meetingModalOpenForLead={meetingModalOpenForLead}
              setMeetingModalOpenForLead={setMeetingModalOpenForLead}
              setReminderId={setReminderModalOpen}
              onClose={(e) => toggleModal(e)}
            />
          )}
          {meetingModalOpenForLead === lead._id && (
            <MeetingModal
              onClose={() => setMeetingModalOpenForLead(0)}
              leadId={lead._id}
            />
          )}
          {reminderModalOpen === lead._id && (
            <ReminderModal
              onClose={() => setReminderModalOpen(false)}
              lead={lead._id}
            />
          )}
        </>
      );
    },
    [
      edit,
      meetingModalOpenForLead,
      setMeetingModalOpenForLead,
      reminderModalOpen,
      setReminderModalOpen,
      toggleModal,
    ]
  );

  const renderLeadGrid = useMemo(() => {
    if (searchTerm) {
      return Leadss.length > 0 ? (
        renderLeadCards(Leadss)
      ) : (
        <p>No leads found for the given search term.</p>
      );
    } else if (Array.isArray(Leadss)) {
      return renderLeadCards(Leadss);
    }
    return null;
  }, [searchTerm, Leadss, renderLeadCards]);

  return (
    <RootLayout>
      <div className="flex justify-end  w-full mt-20   h-screen !px-0">
        <div className=" tablet:w-[calc(100%-100px)] flex flex-col ">
          {isModalOpen2 && (
            <BulkModal
              onClose={openbulkModal}
              selectedLeads={selectedLeads}
              setBulkOperationMade={setBulkOperationMade}
            />
          )}
          {isModalOpen && (
            <Excelmodal onClose={openexcelmodal} onParse={handleParse} />
          )}
          {isModalOpen && (
            <Excelmodal onClose={openexcelmodal} onParse={handleParse} />
          )}
          <div className="w-full px-4 py-4 ">
            <p className="font-Satoshi tablet:text-lg !mb-0 mobile:text-lg text-black font-bold">
              Leads
            </p>

            <div className="w-full tablet:grid tablet:grid-cols-6 mobile:flex mobile:flex-col mobile:justify-center tablet:items-center mobile:items-stretch mobile:gap-x-1 mt-2">
              <div className="tablet:col-span-4 mobile:col-span-1 grid tablet:grid-cols-6 mobile:grid-cols-3 items-center h-full mobile:order-last mobile:mt-3 tablet:mt-0 tablet:order-1 gap-x-1">
                <div className="w-full h-full cursor-pointer">
                  <RangePicker
                    format={"DD-MM-YYYY"}
                    style={{ width: "100%", height: "100%" }}
                    onChange={handleDateChange}
                    needConfirm
                    disabledDate={disabledDate}
                  />
                </div>

                <div className="w-full h-full cursor-pointer">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%", height: "100%" }}
                    defaultValue={selecteduser}
                    onChange={handleUserChange}
                    options={users}
                    maxTagCount="responsive"
                    placeholder={"Users"}
                  />
                </div>

                <div className="w-full h-full cursor-pointer">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%", height: "100%" }}
                    defaultValue={selectedStatus}
                    onChange={handlestatusChange}
                    options={statusOptions}
                    placeholder={"Status"}
                    maxTagCount="responsive"
                  />
                </div>

                <div className="w-full h-full cursor-pointer">
                  <Select
                    mode="multiple"
                    style={{ width: "100%", height: "100%" }}
                    allowClear
                    onChange={handlesourceChange}
                    options={sourceOptions}
                    placeholder={"Source"}
                    maxTagCount="responsive"
                  />
                </div>
                <div className="w-full h-full cursor-pointer">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%", height: "100%" }}
                    defaultValue={selectedTag}
                    onChange={handletagchage}
                    options={tagOptions}
                    placeholder={"Tags"}
                    maxTagCount="responsive"
                  />
                </div>
                <div className="w-full h-full cursor-pointer">
                  <Select
                    mode="single"
                    style={{ width: "100%", height: "100%" }}
                    allowClear
                    defaultValue={selectedTag}
                    onChange={(selectedOption) =>
                      leadcountf(selectedOption.value)
                    }
                    options={countOptions}
                    placeholder={"Count"}
                  />
                </div>
              </div>
              <input
                className="rounded-md tablet:col-span-2 !border border-slate-300 text-lg focus:outline-none transition-all duration-200 focus:shadow-md bg-white px-3 py-1"
                placeholder="Search Leads.."
                value={searchTerm}
                onChange={handleSearchTermChange}
              />
            </div>
            <div className="flex items-center tablet:w-2/5 mobile:w-full gap-2 mt-3">
              <button
                onClick={handleSubmission}
                className="bg-[#83D2FF] hover:bg-transparent hover:border-[#83D2FF] border-2 transition-all duration-300 rounded-md tablet:px-3  tablet:py-2 mobile:px-2  mobile:py-2 tablet:text-md `mobile:text-sm font-Satoshi font-bold"
              >
                Submit Deal
              </button>
              <button
                onClick={openbulkModal}
                className="bg-[#83D2FF] hover:bg-transparent hover:border-[#83D2FF] border-2 transition-all duration-300 rounded-md tablet:px-3  tablet:py-2 mobile:px-2  mobile:py-2 tablet:text-md `mobile:text-sm font-Satoshi font-bold"
              >
                Mapping
              </button>
              {selectedLeads.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="bg-[#83D2FF] hover:bg-transparent hover:border-[#83D2FF] border-2 transition-all duration-300 rounded-md tablet:px-3  tablet:py-2 mobile:px-2  mobile:py-2 tablet:text-md `mobile:text-sm font-Satoshi font-bold"
                >
                  Select All
                </button>
              )}

              {userrole !== "FOS" && (
                <>
                  {selectedLeads.length > 0 && (
                    <button
                      onClick={deleteSelectedLeads}
                      className="bg-[#83D2FF] hover:bg-transparent hover:border-[#83D2FF] border-2 transition-all duration-300 rounded-md tablet:px-3  tablet:py-2 mobile:px-2  mobile:py-2 tablet:text-md `mobile:text-sm font-Satoshi font-bold"
                    >
                      Delete All
                    </button>
                  )}
                </>
              )}
            </div>

            <p className="font-Satoshi tablet:text-md mobile:text-sm mt-3 text-black font-bold">
              Showing {leadsPerPage} cards of {totalLeads}{" "}
            </p>

            <div className="grid gap-x-4 gap-y-4 mobile:grid-cols-1 tablet:grid-cols-3 desktop:grid-cols-3">
              {renderLeadGrid}
            </div>

            <div ref={containerRef} className="fixed bottom-5 right-6 z-10">
              <div className={`relative rounded-full cursor-pointer`}>
                <motion.div
                  animate={{ rotate: btnShow ? 45 : 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  onClick={() => {
                    setBtnShow(!btnShow);
                  }}
                  className={`size-12 text-2xl font-bold flex items-center justify-center bg-black text-slate-100 cursor-pointer rounded-full`}
                >
                  <FaPlus />
                </motion.div>
                <motion.div
                  onClick={openexcelmodal}
                  animate={{ bottom: btnShow ? "120%" : 0 }}
                  transition={{ duration: 0.4, type: "spring", delay: 0.2 }}
                  className={`size-12 cursor-pointer bg-sky-300  text-2xl -z-[99] flex items-center justify-center rounded-full absolute  `}
                >
                  <RiUploadCloud2Fill />
                </motion.div>
                <motion.div
                  onClick={fetchDataAndDownloadExcel}
                  animate={{ right: btnShow ? "120%" : 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className={`size-12 bg-sky-300 cursor-pointer  text-2xl -z-[99] flex items-center justify-center bottom-0 rounded-full absolute  `}
                >
                  <SiGooglesheets />
                </motion.div>
                <motion.div
                  animate={{
                    right: btnShow ? "120%" : 0,
                    bottom: btnShow ? "120%" : 0,
                  }}
                  transition={{ duration: 0.4, type: "spring", delay: 0.1 }}
                  className={`size-12 bg-sky-300 cursor-pointer text-2xl -z-[99] flex items-center justify-center rounded-full absolute  `}
                >
                  <Link
                    href={{
                      pathname: "/Leads/Add",
                      query: { lead: "cold" },
                    }}
                  >
                    <HiOutlineDocumentAdd className="text-black" />
                  </Link>
                </motion.div>
              </div>
            </div>

            <div className="mt-10">
              <div
                className="dataTables_paginate paging_simple_numbers"
                id="datatable_paginate"
              >
                <ul className="pagination pagination-rounded flex flex-row justify-center">
                  {totalLeads != 0 && (
                    <>
                      <li
                        className={`paginate_button page-item previous ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                        id="datatable_previous"
                      >
                        <button onClick={prevPage} className="page-link">
                          <i className="fa fa-chevron-left" />
                        </button>
                      </li>
                      <div className="flex flex-row px-3 gap-1">
                        {Array.from(
                          { length: Math.ceil(totalLeads / leadsPerPage) },
                          (_, i) => (
                            <li
                              key={i}
                              className={`paginate_button page-item ${
                                currentPage === i + 1 ? "active" : ""
                              }`}
                            >
                              <button
                                onClick={() => setCurrentPage(i + 1)}
                                className="page-link"
                              >
                                {i + 1}
                              </button>
                            </li>
                          )
                        )}
                      </div>
                      <li
                        className={`paginate_button page-item next ${
                          currentPage === Math.ceil(totalLeads / leadsPerPage)
                            ? "disabled"
                            : ""
                        }`}
                        id="datatable_next"
                      >
                        <button onClick={nextPage} className="page-link">
                          {" "}
                          <i className="fa fa-chevron-right" />
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

export default Cold;
