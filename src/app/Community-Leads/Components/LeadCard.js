import React, { useEffect, useRef, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { FaPhone, FaWhatsapp } from "react-icons/fa6";
import { Select } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import UpdateDescriptionInput from "./UpdateDescriptionInput";
import EditableSpan from "@/app/Community-Leads/Components/EditableSpan";

export default function LeadCard({
  lead,
  setCurrentPageLeads,
  handleCardClick,
  selectedLeads,
  onEditClick,
  statusOptions,
  sourceOptions,
}) {
  const divRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setShowContact(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const detailsButtonClick = (e) => {
    e.stopPropagation();
    onEditClick(lead);
  };

  const [showContact, setShowContact] = useState(false);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: -0.5,
      },
    },
    exit: { x: 30 },
  };

  const listItem = {
    hidden: { x: 15 },
    show: { x: 0 },
  };

  const [updateBody, setUpdateBody] = useState({
    lead,
    Source: lead.Source._id,
    LeadStatus: lead.LeadStatus._id,
    Description: lead.Description,
    tags: lead.tags?.Tag,
    marketingtags: lead.marketingtags?.Tag,
    updateDescription: "",
  });

  const [isUpdateDescriptionInput, setIsUpdateDescriptionInput] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [isDescriptionInput, setIsDescriptionInput] = useState(false);

  async function handleUpdateSubmit() {
    setLoading(true);
    try {
      const response = await axios.patch(
        "/api/Lead/update/" + lead._id,
        updateBody
      );
      response.status === 200 &&
        (setIsUpdateDescriptionInput(false) ||
          setUpdateBody({
            ...updateBody,
            updateDescription: "",
          }) ||
          setCurrentPageLeads((prev) =>
            prev.map((prevLead) => {
              prevLead._id === lead._id ? response.data.data : lead;
            })
          ));
    } catch (e) {
      console.log(e);
      toast("An Error occurred while updating the lead: " + e.message);
    }
    setLoading(false);
  }

  function tagChange(innerText, field) {
    (lead[field]?.Tag || "No Tag") !== innerText
      ? setUpdateBody({
          ...updateBody,
          [field]: innerText,
        }) || setIsUpdateDescriptionInput(true)
      : setIsUpdateDescriptionInput(false);
  }

  function selectChange(option, field) {
    lead[field]?._id !== option?.value
      ? setUpdateBody({ ...updateBody, [field]: option?.value }) ||
        setIsUpdateDescriptionInput(true)
      : setIsUpdateDescriptionInput(false);
  }

  function descriptionChanged(innerText) {
    setIsDescriptionInput(false);
    (lead.Description || "No Description") !== innerText
      ? setUpdateBody({
          ...updateBody,
          Description: innerText,
        }) || setIsUpdateDescriptionInput(true)
      : setIsUpdateDescriptionInput(false);
  }

  return (
    <li className="shadow hover:shadow-lg rounded-lg">
      <div
        className={`relative select-none col-span-1
					rounded-lg bg-white p-0 h-full w-full border
					${selectedLeads.includes(lead) && "ring-2 ring-miles-400"}
				`}
        ref={divRef}
        onClick={(e) => handleCardClick(lead, e)}
      >
        {selectedLeads.includes(lead) && (
          <div className="absolute -top-2 -left-2 text-xl">
            <CheckCircleIcon className="text-miles-600 w-6 h-6" />
          </div>
        )}
        <div className="divide-y divide-gray-200">
          <div className="relative w-full items-center justify-between space-y-4 p-3">
            <h3 className="truncate text-base font-medium text-gray-900">
              {lead.Name}
            </h3>
            <div className="flex-shrink-0 flex items-center space-x-2">
              {lead?.Assigned ? (
                <>
                  <span className="text-sm text-nowrap text-gray-500 truncate">
                    Assigned to:{" "}
                    <span className="font-medium text-gray-900">
                      {lead?.Assigned.username}
                    </span>
                  </span>
                  {lead?.Assigned?.Avatar ? (
                    <img
                      className="h-6 w-6 rounded-full object-cover"
                      src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${
                        lead?.Assigned.Avatar
                      }`}
                      alt=""
                    />
                  ) : (
                    <FaRegUserCircle
                      className="h-6 w-6 text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                </>
              ) : (
                <span className="text-sm text-nowrap text-gray-500 truncate">
                  Not assigned to any agent
                </span>
              )}
            </div>
          </div>

          <div className="absloute bottom-0 top-auto p-3 space-y-2">
            <div className="flex space-x-2">
              <Select
                mode="single"
                allowClear
                style={{ width: "150px" }}
                defaultValue={lead.LeadStatus?.Status}
                onClick={(e) => e.stopPropagation()}
                onChange={(_, option) => selectChange(option, "LeadStatus")}
                options={statusOptions}
                option
                placeholder={"Status"}
              />
              <Select
                mode="single"
                allowClear
                style={{ width: "150px" }}
                defaultValue={lead.Source?.Source}
                onClick={(e) => e.stopPropagation()}
                onChange={(_, option) => selectChange(option, "Source")}
                options={sourceOptions}
                option
                placeholder={"Source"}
              />
            </div>
            <div className="flex space-x-1 items-center">
              <span className="text-sm font-medium text-gray-500">
                Marketing Tag:
              </span>
              <EditableSpan
                content={lead?.marketingtags?.Tag || "No Tag"}
                onBlur={(tag) => tagChange(tag, "marketingtags")}
              />
            </div>
            <div className="flex space-x-1 items-center">
              <span className="text-sm font-medium text-gray-500">
                DLD Tag:
              </span>
              <EditableSpan
                content={lead?.tags?.Tag || "No Tag"}
                onBlur={(tag) => tagChange(tag, "tags")}
              />
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">
                Description:
              </span>
              <div className="flex justify-between space-x-1 items-start">
                <span
                  contentEditable={isDescriptionInput && !loading}
                  onBlur={({ target: { innerText } }) => {
                    descriptionChanged(innerText);
                  }}
                  className={`text-sm text-gray-900 w-full rounded-md min-h-[40px] line-clamp-2 ${
                    isDescriptionInput && "border-2 border-gray-300 px-1"
                  }`}
                >
                  {lead.Description || "No Description"}
                </span>
                {!isDescriptionInput && (
                  <PencilIcon
                    className="min-w-6 min-h-6 w-6 h-6 text-miles-500 bg-miles-100 rounded-full p-1 cursor-pointer hover:bg-miles-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDescriptionInput(true);
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowContact(!showContact);
                  }}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg py-3 text-sm font-semibold text-gray-900"
                >
                  <FaPhone
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  Contact
                </button>
              </div>
              <div className="flex w-0 flex-1">
                <button
                  onClick={detailsButtonClick}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg py-3 text-sm font-semibold text-gray-900"
                >
                  <IoIosInformationCircle
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  Details
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showContact && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="flex items-center justify-center px-6 py-3 space-x-2"
              >
                <motion.div
                  variants={listItem}
                  className="flex items-center space-x-2"
                >
                  <a
                    href={`tel:${lead.Phone}`}
                    className="inline-flex items-center rounded-full bg-miles-50 px-2 py-1 text-xs font-medium text-miles-700 ring-1 ring-inset ring-miles-700/10"
                  >
                    <FaPhone className="mr-1" /> {lead.Phone}
                  </a>
                  {lead.AltPhone && (
                    <a
                      href={`tel:${lead.AltPhone}`}
                      className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10"
                    >
                      <FaPhone className="mr-1" /> {lead.AltPhone}
                    </a>
                  )}
                </motion.div>
                <motion.div
                  variants={listItem}
                  className="flex items-center space-x-2"
                >
                  <a
                    target="_blank"
                    href={`https://wa.me/${encodeURIComponent(
                      lead.Phone
                    )}?text=${encodeURIComponent("Your custom message here")}`}
                    className="inline-flex items-center rounded-full bg-miles-50 px-2 py-1 text-xs font-medium text-miles-700 ring-1 ring-inset ring-miles-700/10"
                  >
                    <FaWhatsapp className="mr-1" /> WhatsApp
                  </a>
                  {lead.AltPhone && (
                    <a
                      target="_blank"
                      href={`https://wa.me/${encodeURIComponent(
                        lead.AltPhone
                      )}?text=${encodeURIComponent(
                        "Your custom message here"
                      )}`}
                      className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10"
                    >
                      <FaWhatsapp className="mr-1" /> Alt WhatsApp
                    </a>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <UpdateDescriptionInput
            isUpdateDescriptionInput={isUpdateDescriptionInput}
            loading={loading}
            setUpdateBody={setUpdateBody}
            handleUpdateSubmit={handleUpdateSubmit}
          />
        </div>
      </div>
    </li>
  );
}
