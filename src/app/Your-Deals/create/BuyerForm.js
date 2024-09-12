import React from 'react';
import SearchableSelect from "@/app/Leads/dropdown";

export default function BuyerForm({
	buyerData,
	onChange,
	handleFileChange,
	handleBuyerChange,
	index,
	yesNoOptions,
}) {
	const handleSelectChange = (buyerOneData, selectedOption2) => {
		setBuyerOneData((prevLeads) => ({
			...prevLeads,
			[buyerOneData]: selectedOption2.value,
		}));
	};

	const handleKeyDown = (event) => {
		event.preventDefault();
	};

	return (
		<div>
			<div className="flex flex-col">
				<div
					className="grid grid-cols-2 gap-x-5 gap-y-3 mt-4">
					<div className="">
						<label className="mr-2">Full name</label>
						<input
							disabled
							className="form-control"
							type="text"
							value={buyerData.buyername}
							onChange={handleBuyerChange('buyername')}
							placeholder="Buyer Cutomer Name"
						/>
					</div>
					<div className="">
						<label className="mr-2">Phone</label>
						<input
							disabled
							className="form-control"
							value={buyerData.buyerContact}
							type="number"
							onChange={handleBuyerChange('buyerContact')}
							placeholder="Contact Number"
						/>
					</div>
					<div className="">
						<label className="mr-2">Email</label>
						<input
							className="form-control"
							value={buyerData.buyerEmail}
							type="text"
							onChange={handleBuyerChange('buyerEmail')}
							placeholder="Email"
						/>
					</div>

					<div className="">
						<label className="mr-2">
							Date of Birth <span className="text-red-500">*</span>
						</label>
						<input
							className="form-control"
							type="date"
							onKeyDown={handleKeyDown}
							value={buyerData.buyerdob}
							onChange={handleBuyerChange('buyerdob')}
							placeholder="Date of Birth"
							max={new Date().toISOString().split("T")[0]} // Set max date to today's date
						/>
					</div>

					<div className="">
						<label className="mr-2">
							Passport Number <span className="text-red-500">*</span>
						</label>
						<input
							className="form-control"
							value={buyerData.buyerpassport}
							type="text"
							onChange={handleBuyerChange('buyerpassport')}
							placeholder="Passport Number"
						/>
					</div>

					<div className="">
						<label className="mr-2">
							Passport Expiry <span className="text-red-500">*</span>
						</label>
						<input
							className="form-control"
							type="date"
							value={buyerData.passportexpiry}
							onKeyDown={handleKeyDown}
							onChange={handleBuyerChange('passportexpiry')}
							placeholder="Emirates Expiry"
							min={new Date().toISOString().split("T")[0]} // Set max date to today's date
						/>
					</div>
					<div className="">
						<label className="mr-2">
							Nationality <span className="text-red-500">*</span>
						</label>
						<input
							className="form-control"
							value={buyerData.nationality}
							type="text"
							onChange={handleBuyerChange('nationality')}
							placeholder="Nationality"
						/>
					</div>
					<div className="">
						<label className="mr-2">
							UAE Resident/Non Resident <span className="text-red-500">*</span>
						</label>

						<SearchableSelect
							options={yesNoOptions}
							defaultValue={buyerData.Resident}
							onChange={(selectedOption) => handleSelectChange(index, selectedOption)}
						></SearchableSelect>
					</div>
					<div className="">
						<label className="mr-2">Emirates ID</label>
						<input
							disabled={
								buyerData.Resident === "No" ||
								!buyerData.Resident
							}
							value={buyerData.emiratesid}
							onChange={handleBuyerChange('emiratesid')}
							className="form-control"
							type="text"
							placeholder="Emirates ID"
						/>
					</div>
					<div className="">
						<label className="mr-2">Emirates Expiry</label>
						<input
							className="form-control"
							type="date"
							onKeyDown={handleKeyDown}
							disabled={
								buyerData.Resident === "No" ||
								!buyerData.Resident
							}
							value={buyerData.emiratesExpiry}
							onChange={handleBuyerChange('emiratesExpiry')}
							placeholder="Emirates Expiry"
							min={new Date().toISOString().split("T")[0]} // Set max date to today's date
						/>
					</div>

					<div className="col-span-2">
						<label className="mr-2">
							Buyer Address <span className="text-red-500">*</span>
						</label>
						<input
							className="form-control"
							type="text"
							value={buyerData.address}
							onChange={handleBuyerChange('address')}
							placeholder="Buyer Address"
						/>
					</div>
				</div>

				<div className="w-full mt-4">
					<div
						className="w-full flex items-center justify-between ">
						<p
							className="w-full relative overflow-hidden block text-xl font-bold">
							<span
								className='block relative after:content-[" "] align-baseline  after:absolute after:w-full after:h-2 after:border-t-4 after:ml-3 after:border-slate-400 after:top-[50%]'>
								Documents to Upload
							</span>
						</p>
					</div>
					<div
						className="w-full grid grid-cols-2 gap-x-5 gap-y-3">
						<div>
							<div className="flex  gap-3">
								<p
									className="block mb-0 text-lg font-medium  text-gray-900 leading-normal ">
									Buyer's Passport{" "}
									<span className="text-red-500">*</span>
								</p>
								<div>
									<div className="flex items-center gap-2 ">
										<div className="input-group">
											<div className="relative">
												<label
													htmlFor="emirateID"
													className="absolute cursor-pointer text-xl right-0 mx-auto my-auto"
												></label>
											</div>
											<p>Passport Front</p>

											<input
												onChange={(e) =>
													handleFileChange(
														'buyerIdentificationImages',
														0,
														0,
														e.target.files
													)
												}
												className="block  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
												aria-describedby="file_input_help"
												id="emirateID"
												title="Passport front"
												type="file"
											/>
										</div>
									</div>

									<div className="flex items-top gap-2 mt-2">
										<div className="input-group">
											<div className="relative">
												<label
													htmlFor="emirateID"
													className="absolute cursor-pointer text-xl right-0 mx-auto my-auto"
												></label>
											</div>

											<p>Passport Back</p>
											<input
												onChange={(e) =>
													handleFileChange(
														'buyerIdentificationImages',
														0,
														1,
														e.target.files
													)
												}
												className="block  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
												aria-describedby="file_input_help"
												id="emirateID"
												type="file"
												title="Passport Back"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						{buyerData.Resident === "" ||
						buyerData.Resident == "No" ? null : (
							<div>
								<div className="flex items-center gap-4">
									<p
										className="block text-lg mb-0 leading-normal font-medium text-gray-900">
										Emirates ID
									</p>
									<div>
										<div className="flex items-center gap-2">
											<div className="relative">
												<label
													htmlFor="emirateID"
													className="absolute cursor-pointer text-xl right-0 mx-auto my-auto"
												></label>
											</div>

											<input
												onChange={(e) =>
													handleFileChange(
														'buyerIdentificationImages',
														0,
														3,
														e.target.files
													)
												}
												className="block  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
												aria-describedby="file_input_help"
												id="emirateID"
												type="file"
												title="Emirate Id"
											/>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					<div
						className="flex items-center gap-4 w-[450px] justify-between mt-2">
						<p
							className=" text-lg !mb-0 leading-normal inline-block font-medium text-gray-900">
							Visa{" "}
							<span className={`text-red-500 inline-block`}>
                                  *
                                </span>
						</p>
						<div>
							<div className="flex items-center gap-2">
								<div className="relative">
									<label
										htmlFor="Visa"
										className="absolute cursor-pointer text-xl right-0 mx-auto my-auto"
									></label>
								</div>
								<input
									onChange={(e) =>
										handleFileChange(
											'buyerIdentificationImages',
											0,
											0,
											e.target.files
										)
									}
									title="Emirates ID"
									className="block  text-sm text-gray-900 border border-gray-300 cursor-pointer focus:outline-none"
									aria-describedby="file_input_help"
									id="Visa"
									type="file"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
;
