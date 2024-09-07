import React, {useState, useEffect, useRef} from "react";
import styles from "../../Modal.module.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import SearchableSelect from "@/app/Leads/dropdown";

const BulkModal = ({
	onClose,
	selectedLeads,
	setBulkOperationMade,
	sourceOptions,
	statusOptions,
	users
}) => {
	const [loading, setLoading] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [selectedSource, setSelectedSource] = useState(null);
	const [selectedAssignee, setSelectedAssignee] = useState(null);
	const [description, setDescription] = useState("");
	const [isDescriptionDisabled, setIsDescriptionDisabled] = useState(false);

	const handleStatusChange = (selectedOption) => {
		setSelectedStatus(selectedOption);
	};

	const handleSourceChange = (selectedOption) => {
		setSelectedSource(selectedOption);
	};

	const handleAssigneeChange = (selectedOption) => {
		setSelectedAssignee(selectedOption);
	};

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const body = {
				leads: selectedLeads,
				status: selectedStatus,
				source: selectedSource,
				assignee: selectedAssignee,
			};

			description !== "" && (body.description = description);

			await axios.put("/api/Lead/bulk", body);
			setBulkOperationMade((prev) => !prev);
		} catch (error) {
			console.error("Error updating data:", error);
		} finally {
			setLoading(false);
			onClose();
		}
	};

	const checkRef = useRef(null);

	useEffect(() => {
		const handleIconClick = () => {
			setIsDescriptionDisabled(!isDescriptionDisabled);
		};

		const iconElement = checkRef.current;
		if (iconElement) {
			iconElement.addEventListener("click", handleIconClick);
			return () => {
				iconElement.removeEventListener("click", handleIconClick);
			};
		}
	}, [isDescriptionDisabled]);

	return (
		<div className={styles.modalBackdrop}>
			<div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={onClose}>
          &times;
        </span>
				<h4>Bulk Actions</h4>
				<h5>{loading ? "Processing..." : ""}</h5>
				<div className="card-body mt-4">
					<div>
						<div className="mb-4">
							<h5>Status</h5>
							<SearchableSelect
								options={statusOptions}
								defaultValue={
									selectedLeads.length === 1
										? selectedLeads[0].LeadStatus._id
										: undefined
								}
								placeholder="Change Status..."
								onChange={handleStatusChange}
							/>
						</div>
						<div className="mb-4">
							<h5>Source</h5>
							<SearchableSelect
								options={sourceOptions}
								placeholder="Change Source..."
								defaultValue={
									selectedLeads.length === 1
										? selectedLeads[0].Source._id
										: undefined
								}
								onChange={handleSourceChange}
							/>
						</div>
						<div className="mb-4">
							<h5>Assigned</h5>
							<SearchableSelect
								options={users}
								placeholder="Assigne..."
								onChange={handleAssigneeChange}
								defaultValue={
									selectedLeads.length === 1
										? selectedLeads[0].Assigned._id
										: undefined
								}
							/>
						</div>

						<div className="mb-4">
							<div className="flex items-center flex-row gap-2">
								<i
									ref={checkRef}
									className={`text-red text-center fa fa-check text-xs p-0.5 border-2 border-gray-600  ${
										isDescriptionDisabled
											? "text-transparent"
											: "text-gray-400 "
									}`}
								></i>
								<h5>Description</h5>
							</div>

							<p className="pl-6">Describe the change being made</p>
							{!isDescriptionDisabled && (
								<div class="pl-2 css-13cymwt-control">
                  <textarea
										placeholder="Description your changes"
										className="css-19bb58m css-1jqq78o-placeholder h-32 pt-1 text-gray-500"
										style={{
											color: "inherit",
											backgroundColor: "transparent",
											width: "100%",
											gridArea: "1 / 2",
											fontFamily: "inherit",
											minWidth: "2px",
											border: "none",
											margin: "0px",
											outline: "none",
											padding: "0px",
										}}
										onBlur={(e) => setDescription(e.target.value)}
									></textarea>
								</div>
							)}
						</div>

						<div className="mb-4">
							<button className="btn btn-primary w-100" onClick={handleSubmit}>
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BulkModal;
