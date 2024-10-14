"use client";
import RootLayout from "@/app/components/layout";
import { DatePicker, Select } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import moment from "moment/moment";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { RiUploadCloud2Fill } from "react-icons/ri";
import { SiGooglesheets } from "react-icons/si";
import { toast } from "react-toastify";
import "rsuite/dist/rsuite.min.css";
import ExcelModal from "../Leads/excelmodal";
import TokenDecoder from "../components/Cookies";
import InlineLoader from "../components/InlineLoader";
import Pagination from "../components/Pagination";
import BulkModal from "./Bulk/bulk";
import LeadCard from "./Components/LeadCard";
import InfoModal from "./EditModal/InfoModal";
import MeetingModal from "./EditModal/Meetings/MeetingModal";
import ReminderModal from "./EditModal/Reminders/ReminderModal";

export default function CommunityLeadsPage() {
  const [tagOptions, setTagOptions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const countOptions = [
    { value: "10", label: "Show 10 results" },
    { value: "50", label: "Show 50 results" },
    { value: "100 ", label: "Show 100 results" },
    { value: "300 ", label: "Show 300 results" },
    { value: "500 ", label: "Show 500 results" },
    { value: "1000 ", label: "Show 1000 results" },
  ];

  const [leadsData, setLeadsData] = useState({
    leads: [],
    selectedLeads: [],
    currentPage: 1,
    leadsPerPage: countOptions[0].value,
    totalLeads: 0,
    loading: false,
  });

  const getTotalPages = useCallback(
    () => Math.ceil(leadsData.totalLeads / leadsData.leadsPerPage),
    [leadsData.totalLeads, leadsData.leadsPerPage]
  );

  const [modalStates, setModalStates] = useState({
    isExcelModalOpen: false,
    isBulkModalOpen: false,
    meetingOpenForLead: 0,
    reminderOpenForLead: 0,
    setMeetingOpenForLead: (id) => {
      setModalStates({ ...modalStates, meetingOpenForLead: id });
    },
    setReminderOpenForLead: (id) => {
      setModalStates({ ...modalStates, reminderOpenForLead: id });
    },
  });

  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedUser: [],
    selectedStatus: [],
    selectedSource: [],
    selectedTag: [],
    date: [],
  });

  const [sourceOptions, setSourceOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const userData = TokenDecoder();
  const userid = userData ? userData.id : null;
  const userRole = userData ? userData.role : null;

  const handleSearchTermChange = ({ target: { value } }) => {
    setFilters({ ...filters, searchTerm: value });
    setLeadsData({ ...leadsData, currentPage: 1 });
  };

  const getBaseURL = () => {
    switch (userRole) {
      case "Admin":
      case "superAdmin":
        return `/api/Lead/get`;
      case "FOS":
        return `/api/Lead/FOS/${userid}`;
      case "BusinessHead":
        return `/api/Lead/hiearchy?role=BusinessHead&userid=${userid}`;
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
    params.append("page", leadsData.currentPage);
    params.append("limit", leadsData.leadsPerPage);

    filters.date && params.append("date", filters.date);
    filters.searchTerm && params.append("searchterm", filters.searchTerm);
    selectedAgents.length > 0 &&
      params.append("selectedValues", selectedAgents);
    selectedStatuses.length > 0 &&
      params.append("selectedValues2", selectedStatuses);
    selectedSources.length > 0 &&
      params.append("selectedValues3", selectedSources);
    selectedTags.length > 0 && params.append("selectedTag", selectedTags);

    return params.toString();
  };

  const fetchLeads = async () => {
    setLeadsData({ ...leadsData, loading: true });
    try {
      const url = getBaseURL();
      const params = getQueryParams();

      const separator = url.includes("?") ? "&" : "?";
      const response = await axios.get(`${url}${separator}${params}`);

      setLeadsData({
        ...leadsData,
        leads: response.data.data,
        totalLeads: response.data.totalLeads,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Error fetching leads:", error.message);
      setLeadsData({ ...leadsData, loading: false });
    }
  };

  const [bulkOperationMade, setBulkOperationMade] = useState(false);

  useEffect(() => {
    userRole && fetchLeads();
  }, [
    userRole,
    userid,
    selectedAgents,
    selectedStatuses,
    selectedSources,
    leadsData.leadsPerPage,
    leadsData.currentPage,
    filters.selectedTag,
    filters.date,
    filters.searchTerm,
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

  const toggleExcelModal = () => {
    setModalStates({
      ...modalStates,
      isExcelModalOpen: !modalStates.isExcelModalOpen,
    });
  };

  const toggleBulkModal = () => {
    setModalStates({
      ...modalStates,
      isBulkModalOpen: !modalStates.isBulkModalOpen,
    });
    console.log(modalStates.isBulkModalOpen);
  };

  const handleCardClick = (cardLead, e) => {
    e.stopPropagation();
    if (leadsData.selectedLeads.includes(cardLead)) {
      setLeadsData({
        ...leadsData,
        selectedLeads: leadsData.selectedLeads.filter(
          (lead) => lead._id !== cardLead._id
        ),
      });
    } else {
      setLeadsData({
        ...leadsData,
        selectedLeads: [...leadsData.selectedLeads, cardLead],
      });
    }
  };

  const handleSelectAll = () => {
    if (leadsData.selectedLeads.length === leadsData.leads.length) {
      setLeadsData({ ...leadsData, selectedLeads: [] });
    } else {
      setLeadsData({ ...leadsData, selectedLeads: leadsData.leads });
    }
  };

  function disabledDate(current) {
    return current && current > moment().endOf("day");
  }

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        let url = `/api/Status/get`;
        const response = await axios.get(url);
        const newStatusOptions = response.data.data.map((status) => ({
          value: status._id,
          label: status.Status,
        }));
        setStatusOptions(newStatusOptions);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await axios.get(`/api/Source/get`);
        const newSourceOptions = response.data.data.map((source) => ({
          value: source._id,
          label: source.Source,
        }));
        setSourceOptions(newSourceOptions);
      } catch (error) {
        console.error("Error fetching Source:", error);
      }
    };

    fetchSource();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        let url = `/api/tags/get`;
        const response = await axios.get(url);
        const tags = response.data.data.map((tag) => ({
          label: tag.Tag,
          value: tag._id,
        }));
        setTagOptions(tags);
      } catch (error) {
        console.error("Error fetching Tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleParse = (data) => {
    setParsedData(data);
  };

  const deleteSelectedLeads = async () => {
    try {
      await axios.delete(`/api/Lead/delete`, {
        data: { leadIds: leadsData.selectedLeads.map((lead) => lead._id) },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting leads:", error);
    }
  };

  const handleDealSubmission = () => {
    if (leadsData.selectedLeads.length === 1) {
      const leadId = leadsData.selectedLeads[0]
        ? leadsData.selectedLeads[0]._id.toString()
        : null;
      if (leadId) {
        window.location.href = `/Your-Deals/create?leadId=${leadId}`;
      } else {
        console.error("Lead ID is null.");
      }
    } else if (leadsData.selectedLeads.length > 1) {
      toast.error("You have selected more than 1 Lead");
    } else {
      toast.error("You Haven't Selected Any Lead");
    }
  };

  useEffect(() => {
    if (userRole) {
      const fetchAgents = async () => {
        try {
          const response = await axios.get("/api/staff/get");

          let filteredAgents = response.data.data;

          const username =
            response.data.data.find((user) => user._id === userid)?.username ||
            "Default Username";
          const defaultOption = { value: userid, label: username };
          filteredAgents = filteredAgents.filter((user) => user._id !== userid);

          const mappedAgents =
            filteredAgents.length > 0
              ? [
                  defaultOption,
                  ...filteredAgents.map((user) => ({
                    value: user._id,
                    label: user.username,
                  })),
                ]
              : [defaultOption];

          setAgents(mappedAgents);
        } catch (error) {
          console.error("Error fetching agents:", error);
        }
      };

      fetchAgents();
    }
  }, [userRole]);

  const handleAgentsChange = (selected) => {
    setFilters({ ...filters, selectedUser: selected });
    const selectedAgents = selected.map((user) => user);
    setSelectedAgents(selectedAgents);
  };

  const handleStatusChange = (selected) => {
    setFilters({ ...filters, selectedStatus: selected });
    const selectedStatuses = selected.map((status) => status);
    setSelectedStatuses(selectedStatuses);
  };

  const handleSourceChange = (selected) => {
    setFilters({ ...filters, selectedSource: selected });
    const selectedSources = selected.map((source) => source);
    setSelectedSources(selectedSources);
  };

  const handleTagChange = (selected) => {
    setFilters({ ...filters, selectedTag: selected });
    const selectedTags = selected.map((tags) => tags);
    setSelectedTags(selectedTags);
  };

  const handleDateChange = (date) => {
    if (date) {
      setFilters({ ...filters, date: [date[0].$d, date[1].$d] });
    } else {
      setFilters({ ...filters, date: null });
    }
  };

  const [edit, setEdit] = useState(0);
  const [activeModalLead, setActiveModalLead] = useState(null);

  const handleEditClick = useCallback((lead) => {
    setEdit(lead._id);
    setActiveModalLead(lead);
  }, []);

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

  const renderLeadCards = useCallback(
    (leads) =>
      leads.map((lead) => (
        <LeadCard
          key={lead._id}
          lead={lead}
          setCurrentPageLeads={(getCurrent) => {
            const leads = getCurrent(leadsData.leads);
            setLeadsData({
              ...leadsData,
              leads,
            });
          }}
          handleCardClick={handleCardClick}
          selectedLeads={leadsData.selectedLeads}
          onEditClick={() => handleEditClick(lead)}
          statusOptions={statusOptions}
          sourceOptions={sourceOptions}
        />
      )),
    [
      statusOptions,
      sourceOptions,
      leadsData,
      handleCardClick,
      handleEditClick,
      modalStates,
    ]
  );

  const renderLeadGrid = useMemo(() => {
    if (filters.searchTerm) {
      return leadsData.leads.length > 0 ? (
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 my-4 ml-0 pl-0"
        >
          {renderLeadCards(leadsData.leads)}
        </ul>
      ) : (
        <p>No leads found for the given search term.</p>
      );
    } else if (Array.isArray(leadsData.leads)) {
      return leadsData.leads.length > 0 ? (
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 my-4 ml-0 pl-0"
        >
          {renderLeadCards(leadsData.leads)}
        </ul>
      ) : (
        <p>No leads found.</p>
      );
    }
    return null;
  }, [filters.searchTerm, leadsData.leads, renderLeadCards]);

  const renderModals = useMemo(() => {
    return (
      <>
        {edit === activeModalLead?._id && (
          <>
            <InfoModal
              leadData={activeModalLead}
              modalStates={modalStates}
              onClose={() => {
                setEdit(0);
                setActiveModalLead(null);
              }}
            />
            {modalStates.meetingOpenForLead === activeModalLead._id && (
              <MeetingModal
                onClose={() => {
                  modalStates.setMeetingOpenForLead(0);
                }}
                leadId={activeModalLead._id}
              />
            )}
            {modalStates.reminderOpenForLead === activeModalLead._id && (
              <ReminderModal
                onClose={() => {
                  modalStates.setReminderOpenForLead(0);
                }}
                lead={activeModalLead._id}
              />
            )}
          </>
        )}

        {modalStates.isBulkModalOpen && leadsData.selectedLeads.length > 0 && (
          <BulkModal
            onClose={toggleBulkModal}
            selectedLeads={leadsData.selectedLeads}
            setSelectedLeads={(leads) => {
              setLeadsData({ ...leadsData, selectedLeads: leads });
            }}
            setBulkOperationMade={setBulkOperationMade}
            sourceOptions={sourceOptions}
            statusOptions={statusOptions}
            agents={agents}
          />
        )}

        {modalStates.isExcelModalOpen && (
          <ExcelModal onClose={toggleExcelModal} onParse={handleParse} />
        )}
      </>
    );
  }, [activeModalLead, edit, modalStates]);

  return (
    <RootLayout>
      {renderModals}
      <div className="container h-screen mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Leads</h1>
        <div className="w-full gap-y-2 tablet:grid tablet:grid-cols-6 mobile:flex mobile:flex-col mobile:justify-center tablet:items-center mobile:items-stretch mobile:gap-x-1 mt-2">
          <input
            className="rounded-md placeholder:text-[#837979] placeholder:text-opacity-50 col-span-full !border border-slate-300 text-lg focus:outline-none transition-all duration-200 focus:shadow-md bg-white px-3 py-1"
            placeholder="Search Leads..."
            value={filters.searchTerm}
            onChange={handleSearchTermChange}
          />
          <div className="tablet:col-span-full mobile:col-span-1 grid tablet:grid-cols-6 mobile:grid-cols-3 items-center h-full mobile:order-last mobile:mt-3 tablet:mt-0 tablet:order-1 gap-x-1">
            <div className="w-full h-full cursor-pointer">
              <DatePicker.RangePicker
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
                defaultValue={filters.selectedUser}
                onChange={handleAgentsChange}
                options={agents}
                maxTagCount="responsive"
                placeholder={"Agents"}
              />
            </div>

            <div className="w-full h-full cursor-pointer">
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%", height: "100%" }}
                defaultValue={filters.selectedStatus}
                onChange={handleStatusChange}
                options={statusOptions}
                placeholder={"Status"}
                maxTagCount="responsive"
              />
            </div>

            <div className="w-full h-full cursor-pointer">
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%", height: "100%" }}
                defaultValue={filters.selectedStatus}
                onChange={handleSourceChange}
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
                defaultValue={filters.selectedTag}
                onChange={handleTagChange}
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
                onChange={(selected) => {
                  setLeadsData({
                    ...leadsData,
                    leadsPerPage: parseInt(selected, 10),
                    currentPage: 1,
                  });
                }}
                options={countOptions}
                defaultValue={leadsData.leadsPerPage}
                placeholder={"Count"}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <button
            onClick={handleDealSubmission}
            className="rounded-md bg-miles-50 px-3 py-2 text-sm font-semibold text-miles-600 shadow-sm hover:bg-miles-100"
          >
            Submit Deal
          </button>
          <button
            onClick={toggleBulkModal}
            className="rounded-md bg-miles-50 px-3 py-2 text-sm font-semibold text-miles-600 shadow-sm hover:bg-miles-100"
          >
            Mapping
          </button>
          <button
            onClick={handleSelectAll}
            className="rounded-md bg-miles-50 px-3 py-2 text-sm font-semibold text-miles-600 shadow-sm hover:bg-miles-100"
          >
            Select All
          </button>
          {userRole !== "FOS" && leadsData.selectedLeads.length > 0 && (
            <button
              onClick={deleteSelectedLeads}
              className="rounded-md bg-miles-50 px-3 py-2 text-sm font-semibold text-miles-600 shadow-sm hover:bg-miles-100"
            >
              Delete Selected
            </button>
          )}
        </div>

        {leadsData.loading ? (
          <InlineLoader className="flex w-full mt-10 text-center text-miles-900 justify-center rounded-2xl bg-miles-100 items-center h-56" />
        ) : (
          getTotalPages() > 0 && (
            <>
              {renderLeadGrid}
              <span className="text-sm text-gray-700 mt-2">
                Showing {Math.min(leadsData.leadsPerPage, leadsData.totalLeads)}{" "}
                leads of {leadsData.totalLeads} total
              </span>
            </>
          )
        )}

        <div className="mt-auto">
          <Pagination
            currentPage={leadsData.currentPage}
            setCurrentPage={(pageNumber) =>
              setLeadsData({
                ...leadsData,
                currentPage: pageNumber,
              })
            }
            totalPages={getTotalPages()}
          />
        </div>

        <div ref={containerRef} className="fixed bottom-5 right-6 z-[999]">
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
              onClick={toggleExcelModal}
              animate={{ bottom: btnShow ? "120%" : 0 }}
              transition={{ duration: 0.4, type: "spring", delay: 0.2 }}
              className={`size-12 cursor-pointer bg-sky-300  text-2xl -z-10 flex items-center justify-center rounded-full absolute  `}
            >
              <RiUploadCloud2Fill />
            </motion.div>
            <motion.div
              onClick={fetchDataAndDownloadExcel}
              animate={{ right: btnShow ? "120%" : 0 }}
              transition={{ duration: 0.4, type: "spring" }}
              className={`size-12 bg-sky-300 cursor-pointer  text-2xl -z-10 flex items-center justify-center bottom-0 rounded-full absolute  `}
            >
              <SiGooglesheets />
            </motion.div>
            <motion.div
              animate={{
                right: btnShow ? "120%" : 0,
                bottom: btnShow ? "120%" : 0,
              }}
              transition={{ duration: 0.4, type: "spring", delay: 0.1 }}
              className={`size-12 bg-sky-300 cursor-pointer text-2xl -z-10 flex items-center justify-center rounded-full absolute  `}
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
      </div>
    </RootLayout>
  );
}
