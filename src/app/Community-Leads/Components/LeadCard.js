import { CheckCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Select } from "antd";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaPhone, FaWhatsapp } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";
import { toast } from "react-toastify";
import TagsManager from "./TagManager";
import UpdateDescriptionInput from "./UpdateDescriptionInput";

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

  const [updateBody, setUpdateBody] = useState();
  const [submitions, setSubmitions] = useState(0);
  useEffect(() => {
    setUpdateBody({
      updateDescription: "",
    });
  }, [submitions]);

  const [isUpdateDescriptionInput, setIsUpdateDescriptionInput] =
    useState(false);

  useEffect(() => {
    if (updateBody && Object.keys(updateBody).length > 0) {
      const o = {};
      const n = {};

      Object.keys(updateBody)
        .filter((k) => k != "updateDescription")
        .forEach((k) => {
          o[k] = lead[k];
          n[k] = updateBody[k];
        });

      setIsUpdateDescriptionInput(JSON.stringify(n) !== JSON.stringify(o));
    }
  }, [updateBody, lead]);

  const [addingTag, setAddingTag] = useState({
    marketingtags: false,
    tags: false,
  });

  const [loading, setLoading] = useState(false);
  const [isDescriptionInput, setIsDescriptionInput] = useState(false);

  async function handleUpdateSubmit() {
    setLoading(true);
    try {
      const response = await axios.patch(
        `/api/Lead/update/${lead._id}`,
        updateBody
      );

      if (response.status === 200) {
        setIsUpdateDescriptionInput(false);
        setUpdateBody((prevState) => ({
          ...prevState,
          updateDescription: "",
        }));
        setCurrentPageLeads((prevLeads) =>
          prevLeads.map((prevLead) =>
            prevLead._id === lead._id ? response.data.data : prevLead
          )
        );
        setAddingTag({ marketingtags: false, tags: false });
        setSubmitions((prev) => prev + 1);

        toast.success("Lead updated successfully");
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (e) {
      console.error("Error updating lead:", e);
      toast.error(`An error occurred while updating the lead: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  function populateUpdateBodyTags(prevState, field, index) {
    if (!prevState[field]) {
      prevState[field] = lead[field];
      return;
    }
    if ((index = -1)) return;
    if (!prevState[field][index]) {
      prevState[field][index] = lead[field][index];
      return;
    }
    if (!prevState[field][index].Tag) {
      prevState[field][index].Tag = lead[field][index].Tag;
      return;
    }
  }

  function descriptionChanged(innerText) {
    setIsDescriptionInput(false);
    if ((lead.Description || "No Description") !== innerText) {
      updateBody.Description = innerText;
    }
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
        <div className="flex flex-col divide-y divide-gray-200 h-full">
          <div className="w-full items-center justify-between space-y-4 p-3">
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

          <div className="p-3 space-y-2">
            <div className="flex space-x-2">
              <Select
                mode="single"
                allowClear
                style={{ width: "150px" }}
                defaultValue={lead.LeadStatus?.Status}
                onClick={(e) => e.stopPropagation()}
                onChange={(_, option) =>
                  setUpdateBody({
                    ...updateBody,
                    LeadStatus: { ...lead.LeadStatus, Status: option.label },
                  })
                }
                options={statusOptions}
                placeholder={"Status"}
              />
              <Select
                mode="single"
                allowClear
                style={{ width: "150px" }}
                defaultValue={lead.Source?.Source}
                onClick={(e) => e.stopPropagation()}
                onChange={(_, option) =>
                  setUpdateBody({
                    ...updateBody,
                    Source: { ...lead.Source, Source: option.label },
                  })
                }
                options={sourceOptions}
                placeholder={"Source"}
              />
            </div>

            <div className="space-x-1 items-center">
              <span className="text-sm text-nowrap font-medium text-gray-500">
                Marketing Tags:
              </span>
              <TagsManager
                initialTags={lead.marketingtags}
                onTagsChanged={(newTags) => {
                  setUpdateBody({
                    ...updateBody,
                    marketingtags: newTags,
                  });
                }}
              />
            </div>

            <div className="space-x-1 items-center">
              <span className="text-sm text-nowrap font-medium text-gray-500">
                DLD Tags:
              </span>
              <TagsManager
                initialTags={lead.tags}
                onTagsChanged={(newTags) => {
                  setUpdateBody({
                    ...updateBody,
                    tags: newTags,
                  });
                }}
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
                  onClick={(e) => e.stopPropagation()}
                  className={`text-sm p-1 text-gray-900 w-full rounded-md min-h-[40px] line-clamp-2 ${
                    isDescriptionInput &&
                    "border-2 border-miles-300 outline-miles-400 px-1"
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
                    className="inline-flex items-center rounded-full bg-miles-50 px-2 py-1 text-xs font-medium text-miles-600 ring-1 ring-inset ring-miles-600/10"
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
                    className="inline-flex items-center rounded-full bg-miles-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10"
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
            <UpdateDescriptionInput
              isUpdateDescriptionInput={isUpdateDescriptionInput}
              loading={loading}
              setUpdateBody={setUpdateBody}
              handleUpdateSubmit={handleUpdateSubmit}
            />
          </AnimatePresence>
        </div>
      </div>
    </li>
  );
}
