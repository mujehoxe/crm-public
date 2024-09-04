import React, { useState, useEffect, useRef } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { FaPhone, FaWhatsapp } from "react-icons/fa6";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { Select } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import InlineLoader from "./InlineLoader";

const LeadCard = ({
  lead,
  setCurrentPageLeads,
  handleCardClick,
  selectedLeads,
  setEdit,
  statusOptions,
  sourceOptions,
}) => {
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
    Source: lead.Source,
    LeadStatus: lead.LeadStatus,
    Description: lead.Description,
    tags: lead.tags,
    MarketingTags: lead.MarketingTags,
    updateDescription: "",
    currentLead: lead,
  });

  const [loading, setLoading] = useState(false);
  const [isTagInput, setIsTagInput] = useState(false);
  const [isMarketingTagInput, setIsMarketingTagInput] = useState(false);
  const [isDescriptionInput, setIsDescriptionInput] = useState(false);
  const [isUpdateDescriptionInput, setIsUpdateDescriptionInput] =
    useState(false);

  async function handleUpdateSubmit() {
    setLoading(true);
    try {
      const response = await axios.patch(
        "/api/Lead/update/" + lead._id,
        updateBody
      );
      response.status === 200 &&
        (setIsUpdateDescriptionInput(false) ||
          setUpdateBody({ ...updateBody, updateDescription: "" }) ||
          setCurrentPageLeads((prev) =>
            prev.map((lead) => {
              lead._id == lead._id ? response.data.data : lead;
            })
          ));
    } catch (e) {
      console.log(e);
      toast("An Error occured while updating the lead: " + e.message);
    }
    setLoading(false);
  }

  function tagChange({ target: { innerText } }, field) {
    if (
      innerText != "" &&
      innerText != "No Tag" &&
      innerText != lead?.marketingtags?.Tag
    ) {
      setUpdateBody({ ...updateBody, [field]: innerText });
      setIsUpdateDescriptionInput(true);
    }
  }

  return (
    <div
      className={`rounded-md min-h-56 relative cursor-pointer px-3 border-2 bg-white group py-3 transition-all duration-300  ${
        selectedLeads.includes(lead) ? "border-blue-400" : "hover:!bg-blue-50"
      }  `}
      ref={divRef}
      onClick={(e) => handleCardClick(lead, e)}
    >
      {selectedLeads.includes(lead) && (
        <div className="absolute -top-2 -left-2 text-xl">
          <RiCheckboxCircleFill className="text-blue-600" />
        </div>
      )}
      <div className="flex items-center justify-between ">
        <div className={"flex items-center gap-2"}>
          <Select
            mode="single"
            allowClear
            style={{ width: "100%", height: "100%" }}
            onChange={(_, selectedOption) => {
              setUpdateBody({ ...updateBody, LeadStatus: selectedOption });
              setIsUpdateDescriptionInput(true);
            }}
            options={statusOptions}
            option
            placeholder={"Users"}
            defaultValue={lead.LeadStatus ? lead.LeadStatus?.Status : null}
          />

          {!showContact && (
            <Select
              mode="single"
              allowClear
              style={{ width: "100%", height: "100%" }}
              onChange={(_, selectedOption) => {
                setUpdateBody({ ...updateBody, Source: selectedOption });
                setIsUpdateDescriptionInput(true);
              }}
              options={sourceOptions}
              placeholder={"Users"}
              defaultValue={lead.Source ? lead.Source?.Source : null}
            />
          )}
        </div>

        <div className="flex items-center gap-2 text-xl">
          <div className="flex gap-2">
            <AnimatePresence mode="wait">
              {showContact ? (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ x: 0 }}
                    variants={listItem}
                    className="bg-blue-400 size-7 cursor-pointer flex justify-center items-center rounded-full"
                  >
                    <a href={`tel:${lead.Phone}`}>
                      <FaPhone className="text-sm" />
                    </a>
                  </motion.div>
                  {lead.AltPhone && (
                    <motion.div
                      animate={{ x: 0 }}
                      variants={listItem}
                      className="bg-red-400 text-white size-7 cursor-pointer flex justify-center items-center rounded-full"
                    >
                      <a href={`tel:${lead.AltPhone}`}>
                        <FaPhone className="text-sm" />
                      </a>
                    </motion.div>
                  )}
                  <motion.div
                    animate={{ x: 0 }}
                    variants={listItem}
                    className="bg-green-400 size-7 cursor-pointer rounded-full flex justify-center items-center"
                  >
                    <a
                      target="_blank"
                      href={`https://wa.me/${encodeURIComponent(
                        lead.Phone
                      )}?text=${encodeURIComponent(
                        "Your custom message here"
                      )}`}
                    >
                      <FaWhatsapp className="text-white" />
                    </a>
                  </motion.div>

                  {lead.AltPhone && (
                    <motion.div
                      animate={{ x: 0 }}
                      variants={listItem}
                      className="bg-red-400 text-white size-7 cursor-pointer flex justify-center items-center rounded-full"
                    >
                      <a
                        target="_blank"
                        href={`https://wa.me/${encodeURIComponent(
                          lead.AltPhone
                        )}?text=${encodeURIComponent(
                          "Your custom message here"
                        )}`}
                      >
                        <FaWhatsapp className="text-sm" />
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                ""
              )}
            </AnimatePresence>
            <div
              className="  size-8 bg-gray-200 group-hover:bg-blue-300 cursor-pointer rounded-full flex justify-center items-center"
              onClick={(e) => {
                setShowContact(!showContact);
                e.stopPropagation();
              }}
            >
              <IoIosArrowDropright
                className={`${showContact ? "rotate-180" : "rotate-0"}`}
              />
            </div>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setEdit(lead._id);
            }}
            className="size-8 bg-gray-200 group-hover:bg-blue-300 cursor-pointer rounded-full flex justify-center items-center"
          >
            <IoIosInformationCircle />
          </div>
          <div className="  size-8 bg-gray-200 group-hover:bg-blue-300 overflow-hidden cursor-pointer rounded-full flex justify-center items-center">
            {lead?.Assigned?.Avatar ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${
                  lead?.Assigned.Avatar
                }`}
              />
            ) : (
              <FaRegUserCircle />
            )}
          </div>
        </div>
      </div>
      <p className="text-lg font-Satoshi font-[700] mt-1">{lead.Name}</p>

      <div className="flex justify-start items-center gap-1 text-sm w-full ">
        <p className="!mb-0 !mt-0 col-span-1 text-[12px">Marketing Tag:</p>
        <p
          onClick={(e) => {
            e.stopPropagation();
            setIsMarketingTagInput(true);
          }}
          onBlur={(e) => tagChange(e, "MarketingTags")}
          contentEditable={isMarketingTagInput}
          className="rounded-full hover:bg-blue-400 z-50 bg-[#B3E5FC] px-2 font-Satoshi text-center font-[500] text-[10px] !mb-0 !mt-0"
        >
          {lead?.marketingtags?.Tag ? lead?.marketingtags?.Tag : "No Tag"}
        </p>
      </div>

      <div className="mt-1 flex justify-start items-center gap-1 text-sm w-full ">
        <p className="!mb-0 !mt-0 col-span-1 text-[12px">DLD Tag:</p>
        <p
          onClick={(e) => {
            e.stopPropagation();
            setIsTagInput(true);
          }}
          onBlur={(e) => tagChange(e, "tags")}
          contentEditable={isTagInput}
          className="rounded-full hover:bg-blue-400 z-50 bg-[#B3E5FC] px-2 font-Satoshi text-center font-[500] text-[10px] !mb-0 !mt-0"
        >
          {lead?.tags?.Tag ? lead?.tags?.Tag : "No Tag"}
        </p>
      </div>

      <div className="mt-2 flex flex-row justify-between items-start rounded-lg bg-gray-100 py-2 pl-1">
        <div
          contentEditable={isDescriptionInput && !loading}
          onBlur={({ target: { innerText } }) =>
            setIsDescriptionInput(false) ||
            (innerText != "No Description" &&
              innerText != updateBody.Description &&
              (setUpdateBody({ ...updateBody, Description: innerText }) ||
                setIsUpdateDescriptionInput(true)))
          }
          className={`line-clamp-2 w-full ${
            isDescriptionInput && "border-2 border-blue-400 rounded-sm"
          }`}
        >
          {lead.Description && lead.Description != ""
            ? lead.Description
            : "No Description"}
        </div>
        {!isDescriptionInput && (
          <i
            onClick={(e) => {
              e.stopPropagation();
              setIsDescriptionInput(true);
            }}
            className="fa fa-pen rounded-full p-1 bg-gray-200 hover:bg-blue-300 text-gray-700"
          ></i>
        )}
      </div>

      {isUpdateDescriptionInput && (
        <div className="mt-2 flex flex-row items-center align-middle gap-2">
          <input
            placeholder="Describe your changes"
            autoFocus={true}
            disabled={loading}
            className="absloute css-19bb58m css-1jqq78o-placeholder border-2 rounded-sm border-blue-300 p-1 inline w-min text-xs text-gray-500"
            style={{
              color: "inherit",
              backgroundColor: "transparent",
              width: "100%",
              gridArea: "1 / 2",
            }}
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) =>
              setUpdateBody({
                ...updateBody,
                updateDescription: e.target.value,
              })
            }
          ></input>
          {loading ? (
            <InlineLoader disableText={true} />
          ) : (
            <i
              onClick={handleUpdateSubmit}
              className="fa fa-check text-green-400 text-xs text-center m-0 p-0 align-baseline"
            ></i>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadCard;
