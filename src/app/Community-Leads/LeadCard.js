import React, {useEffect, useRef, useState} from "react";
import {FaRegUserCircle} from "react-icons/fa";
import {IoIosInformationCircle} from "react-icons/io";
import {AnimatePresence, motion} from "framer-motion";
import {FaPhone, FaWhatsapp} from "react-icons/fa6";
import {Select} from "antd";
import axios from "axios";
import {toast} from "react-toastify";
import {CheckIcon} from "@heroicons/react/24/outline";

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

	const handleEditButtonClick = (e) => {
		e.stopPropagation();
		onEditClick(lead);
	};

	const [showContact, setShowContact] = useState(false);
	const container = {
		hidden: {opacity: 0},
		show: {
			opacity: 1,
			transition: {
				staggerChildren: -0.5,
			},
		},
		exit: {x: 30},
	};

	const listItem = {
		hidden: {x: 15},
		show: {x: 0},
	};

	const [updateBody, setUpdateBody] = useState({
		lead,
		Source: lead.Source,
		LeadStatus: lead.LeadStatus,
		Description: lead.Description,
		tags: lead.tags,
		MarketingTags: lead.MarketingTags,
		updateDescription: "",
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
				setUpdateBody({...updateBody, updateDescription: ""}) ||
				setCurrentPageLeads((prev) =>
					prev.map((lead) => {
						lead._id === lead._id ? response.data.data : lead;
					})
				));
		} catch (e) {
			console.log(e);
			toast("An Error occurred while updating the lead: " + e.message);
		}
		setLoading(false);
	}

	function tagChange({target: {innerText}}, field) {
		if (
			innerText != "" &&
			innerText != "No Tag" &&
			innerText != lead?.marketingtags?.Tag
		) {
			setUpdateBody({...updateBody, [field]: innerText});
			setIsUpdateDescriptionInput(true);
		}
	}

	return (
		<li
			className={`relative col-span-1 divide-y divide-gray-200 h-min rounded-lg bg-white shadow hover:shadow-lg ${
				selectedLeads.includes(lead) ? "border-blue-400" : "hover:border-gray-400"
			}`}
			ref={divRef}
			onClick={(e) => handleCardClick(lead, e)}
		>
			{selectedLeads.includes(lead) && (
				<div className="absolute -top-2 -left-2 text-xl">
					<CheckIcon className="text-blue-600"/>
				</div>
			)}



			<div
				className="relative w-full items-center justify-between space-y-4 p-3">
				<h3
					className="truncate text-base font-medium text-gray-900">{lead.Name}</h3>
				<div className="flex-shrink-0 flex items-center space-x-2">
					<span
						className="text-sm  text-gray-500">Assigned to: <span
						className="font-medium">
							{lead?.Assigned?.username}
						</span>
					</span>
					{lead?.Assigned?.Avatar ? (
						<img className="h-6 w-6 rounded-full"
								 src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${lead?.Assigned.Avatar}`}
								 alt=""/>
					) : (
						<FaRegUserCircle className="h-6 w-6 text-gray-300"
														 aria-hidden="true"/>
					)}
				</div>
			</div>

			<div className="absloute bottom-0 top-auto p-3 space-y-2">
				<div className="flex space-x-2">
					<Select
						style={{width: '150px'}}
						value={lead.LeadStatus?.Status}
						onChange={(value, option) => {
							setUpdateBody({...updateBody, LeadStatus: option});
							// handleUpdateSubmit({ LeadStatus: option });
						}}
						options={statusOptions}
					/>
					<Select
						style={{width: '150px'}}
						value={lead.Source?.Source}
						onChange={(value, option) => {
							setUpdateBody({...updateBody, Source: option});
							// handleUpdateSubmit({ Source: option });
						}}
						options={sourceOptions}
					/>
				</div>
				<div className="flex space-x-1 items-center">
          <span
						className="text-sm font-medium text-gray-500">Marketing Tag:</span>
					<span
						onClick={(e) => {
							e.stopPropagation();
							setIsMarketingTagInput(true)
						}}
						onBlur={(e) => {
							setIsMarketingTagInput(false);
							// handleUpdateSubmit({ MarketingTags: { Tag: e.target.innerText } });
						}}
						contentEditable={isMarketingTagInput}
						className="text-sm text-gray-900 rounded-md p-1 max-w-[calc(100%-100px)] truncate bg-blue-100"
					>
            {lead?.marketingtags?.Tag || 'No Tag'}
          </span>
				</div>
				<div className="flex space-x-1 items-center">
					<span className="text-sm font-medium text-gray-500">DLD Tag:</span>
					<span
						onClick={(e) => {
							e.stopPropagation();
							setIsMarketingTagInput(true)
						}}
						onBlur={(e) => {
							setIsMarketingTagInput(false);
							// handleUpdateSubmit({ MarketingTags: { Tag: e.target.innerText } });
						}}
						contentEditable={isMarketingTagInput}
						className="text-sm text-gray-900 rounded-md p-1 max-w-[calc(100%-72px)] truncate bg-blue-100"
					>
            {lead?.tags?.Tag || 'No Tag'}
          </span>
				</div>
				<div className="space-y-1">
					<span
						className="text-sm font-medium text-gray-500">Description:</span>
					<span
						onClick={() => setIsDescriptionInput(true)}
						onBlur={(e) => {
							setIsDescriptionInput(false);
							if (e.target.innerText !== 'No Description' && e.target.innerText !== lead.Description) {
								// handleUpdateSubmit({ Description: e.target.innerText });
							}
						}}
						contentEditable={isDescriptionInput}
						className="mt-1 text-sm text-gray-900 rounded-md min-h-[40px] line-clamp-2"
					>
						{lead.Description || 'No Description'}
					</span>
				</div>
			</div>

			<div className="mt-auto">
				<div className="-mt-px flex divide-x divide-gray-200">
					<div className="flex w-0 flex-1">
						<button
							onClick={(e) => {
								e.stopPropagation();
								setShowContact(!showContact);
							}}
							className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-3 text-sm font-semibold text-gray-900"
						>
							<FaPhone className="h-5 w-5 text-gray-400" aria-hidden="true"/>
							Contact
						</button>
					</div>
					<div className="-ml-px flex w-0 flex-1">
						<button
							onClick={handleEditButtonClick}
							className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-3 text-sm font-semibold text-gray-900"
						>
							<IoIosInformationCircle className="h-5 w-5 text-gray-400"
																			aria-hidden="true"/>
							Edit
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
						<motion.div variants={listItem}
												className="flex items-center space-x-2">
							<a href={`tel:${lead.Phone}`}
								 className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
								<FaPhone className="mr-1"/> {lead.Phone}
							</a>
							{lead.AltPhone && (
								<a href={`tel:${lead.AltPhone}`}
									 className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
									<FaPhone className="mr-1"/> {lead.AltPhone}
								</a>
							)}
						</motion.div>
						<motion.div variants={listItem}
												className="flex items-center space-x-2">
							<a
								target="_blank"
								href={`https://wa.me/${encodeURIComponent(lead.Phone)}?text=${encodeURIComponent("Your custom message here")}`}
								className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10"
							>
								<FaWhatsapp className="mr-1"/> WhatsApp
							</a>
							{lead.AltPhone && (
								<a
									target="_blank"
									href={`https://wa.me/${encodeURIComponent(lead.AltPhone)}?text=${encodeURIComponent("Your custom message here")}`}
									className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10"
								>
									<FaWhatsapp className="mr-1"/> Alt WhatsApp
								</a>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</li>
	);
};