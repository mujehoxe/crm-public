"use client";
import SearchableSelect from "@/app/Leads/dropdown";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import FileSaver from "file-saver";
import moment from "moment/moment";
import { useCallback, useEffect, useState } from "react";
import { FaCheck, FaRegEdit } from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";
import { IoMdClose, IoMdDownload, IoMdEye } from "react-icons/io";
import { MdFileDownload } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import "rsuite/dist/rsuite.min.css";
import * as XLSX from "xlsx";
import TokenDecoder from "../components/Cookies";
import RootLayout from "../components/layout";
import Loader from "../components/Loader";
import PriceModal from "../components/priceModal";
import FieldTypeComponent from "./components/FieldTypeComponent";
import RowFixedFields from "./RowFixedFields";
import "./table.css";
import VisibleFieldsManagement from "./VisibleFieldsManagement";

function allDeals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTlModalOpen, setisTlIsModalOpen] = useState(false);
  const [myData, setMyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const path = "https://crm-milestonehomes.com/public/kyc/";
  const [agentFilter, setAgenFilter] = useState(null);
  const [kycFilter, setKycFilter] = useState("");
  const [userIndex, setUserIndex] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/invoice/get");
        setMyData(response.data.data);
        setFilteredData(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const exportFile = useCallback(
    (id) => {
      if (!filteredData || typeof filteredData !== "object") {
        console.error("Invalid or missing data.");
        return;
      }
      const urlPath = path;
      const buyerOnepassFront =
        urlPath + filteredData[id]?.passportFront?.split("kyc/").pop();
      const handleDownload = async () => {
        try {
          const front = await fetch(buyerOnepassFront).then((response) =>
            response.blob()
          );
          const back = await fetch(buyerOnepassFront).then((response) =>
            response.blob()
          );
          const eoi = await fetch(buyerOnepassFront).then((response) =>
            response.blob()
          );
          FileSaver.saveAs(front, "passfront.jpg");
          FileSaver.saveAs(back, "passback.jpg");
          FileSaver.saveAs(eoi, "eoi.jpg"); // Specify a file name for the downloaded image
        } catch (error) {
          console.error("Error downloading image:", error);
        }
      };

      const customHeadersMain = [
        { header: "#", width: 5, color: "#000000" },
        { header: "Agent", width: 30 },
        { header: "Lead Created Date", width: 20 },
        { header: "Lead Source", width: 20, color: "#FF0000" }, // Red color for 'Full Name'
        { header: "Buyer Full Name", width: 20 },
        { header: "Phone Number", width: 15 },
        { header: "Email Id", width: 20 },
        { header: "Birth Date", width: 15 },
        { header: "Passport Number", width: 30 },
        { header: "Passport Expiry", width: 30 },
        { header: "Nationality", width: 30 },
        { header: "UAE Resident/ Non Resident", width: 20 },
        { header: "Emirates Expiry", width: 25 },
        { header: "Address", width: 30 },
        { header: "EOI / Token Date", width: 30 },
        { header: "Closure Date", width: 30 },
        { header: "Booking Date", width: 30 },
        { header: "Expected Handover Date", width: 30 },
        { header: "Deal Status", width: 30 },
        { header: "Direct/Indirect Buyer/Tenant", width: 30 },
        { header: "Direct/Indirect Seller/Owner", width: 30 },
        { header: "Remarks", width: 30 },
        { header: "Property Type", width: 30 },
        { header: "Developer", width: 30 },
        { header: "No. of Bed", width: 30 },
        { header: "Size/BUA Sq/Ft", width: 30 },
        { header: "Plot Area in Sq.Ft", width: 30 },
        { header: "Plot Number", width: 30 },
        { header: "Deal Type", width: 30 },
        { header: "Sale/Rent", width: 30 },

        { header: "Ready / Offplan", width: 30 },
        { header: "Unit No.", width: 30 },
        { header: "Mode", width: 30 },
        { header: "Unit Complete Address", width: 30 },
        { header: "Unit Price", width: 30 },
        { header: "Comission %", width: 30 },
        { header: "Spot Cash", width: 30 },
        { header: "Gross Total Comission", width: 30 },
        { header: "VAT 5%", width: 30 },
        { header: "Total Comission including VAT", width: 30 },
        { header: "Loyalty Bonus", width: 30 },
        { header: "Net/Total Comission", width: 30 },
        { header: "MOU/Contract Signed", width: 30 },
        { header: "Invoice Number", width: 30 },
        { header: "Agent % Comission", width: 30 },
        { header: "Agent (AED) Comission", width: 30 },
        { header: "ATL % Comission", width: 30 },
        { header: "ATL (AED) Comission", width: 30 },
        { header: "TL %age Comission", width: 30 },
        { header: "	TL (AED) Comission", width: 30 },
        { header: "SM Comission %", width: 30 },
        { header: "	SM (AED) Comission", width: 30 },
        { header: "Total Agent %age Comission to Total Agent", width: 30 },
        { header: "	Total Agent Commission to Total Agent", width: 30 },
        { header: "BH %age Comission", width: 30 },
        { header: "BH Comission", width: 30 },
        {
          header: "Total Agents + BH %age Comission to Total Agent",
          width: 30,
        },
        {
          header: "	Total Commission to Agent + BH (AED)",
          width: 30,
        },
        { header: "%age Comission to Company", width: 30 },
        { header: "Comission to Company(AED)", width: 30 },
        { header: "Additional Comments", width: 30 },
        { header: "Comission Status to Agent", width: 30 },
        { header: "Sanction List", width: 30 },
        { header: "AML Remarks", width: 30 },
        { header: "Contract End Date", width: 30 },
        { header: "No. of Cheques", width: 30 },
        { header: "Security Deposits", width: 30 },
        { header: "TA", width: 30 },
        { header: "Full Comission", width: 30 },
        { header: "1st Claim", width: 30 },
        { header: "2nd Claim", width: 30 },
        { header: "3rd Claim", width: 30 },
        { header: "Comission Status", width: 30 },
        { header: "Cancelled Price", width: 30 },
        { header: "Dewa Premises", width: 30 },
        { header: "Contract Number", width: 30 },
        { header: "Title Deed Number", width: 30 },
        { header: "New Title Deed Number", width: 30 },
        { header: "External Agent", width: 30 },
      ];

      // Combine custom headers for both main data and additional buyers
      const customHeaders = customHeadersMain.map((header) => header.header);

      // Extract buyer data from filteredData
      const buyerData = filteredData[id]; // Modify this according to your data structure

      // Flatten the buyer data into an array
      const buyerRow = [
        1,
        buyerData?.Userid?.username,
        buyerData?.Userid?.Phone,
        moment(buyerData?.Leadid.timestamp).format("DD-MM-YY"),
        buyerData?.Leadid?.Source.Source,
        buyerData?.buyer.name,
        buyerData?.buyer.contact,
        buyerData?.buyer.email,
        buyerData?.buyer.dob,
        buyerData?.buyer.passport,
        buyerData?.buyer.passportExpiry,
        buyerData?.buyer.nationality,
        buyerData?.buyer.resident,
        buyerData?.buyer.emiratesid,
        buyerData?.buyer.address,
        buyerData?.EOI,
        buyerData?.Closure,
        buyerData?.Booking,
        buyerData?.Handover,
        buyerData?.dealStatus,
        buyerData?.directIndirectTenant,
        buyerData?.directIndirectOwner,
        buyerData?.remarks,

        buyerData?.Property,
        buyerData?.Developer ? buyerData?.Developer : buyerData?.othrDeveloper,
        buyerData?.Bed,
        buyerData?.BUA,
        buyerData?.PlotArea,
        buyerData?.Property == "Apartment" ? "N/A" : buyerData?.PlotNumber,
        buyerData?.dealType,
        buyerData?.saleRent,
        buyerData?.Ready,
        buyerData?.Unitaddress,
        buyerData?.mode,
        buyerData?.Unitaddress,
        buyerData?.Price,
        buyerData?.Comission + buyerData?.ComissionType,
        buyerData?.SpotCash,
        buyerData?.TotalComission,
        buyerData?.VAT,
        buyerData?.ComissionVAT,
        buyerData?.loyaltyBonus,
        parseFloat(buyerData?.netcom),
        "N/A",
        buyerData?.Invoicenumber,
        buyerData?.agentComissionPercent,
        (parseFloat(buyerData?.netcom) * buyerData?.agentComissionPercent) /
          100,
        buyerData?.atlComissionPercent,
        (parseFloat(buyerData?.netcom) * buyerData?.atlComissionPercent) / 100,
        buyerData?.tlComissionPercent,
        (parseFloat(buyerData?.netcom) * buyerData?.tlComissionPercent) / 100,
        buyerData?.smComissionPercent,
        (parseFloat(buyerData?.netcom) * buyerData?.smComissionPercent) / 100,
        buyerData?.tAgentPercentComissionToAgent,
        (parseFloat(buyerData?.netcom) *
          buyerData?.tAgentPercentComissionToAgent) /
          100,
        buyerData?.bhPercentComission,
        (parseFloat(buyerData?.netcom) * buyerData?.bhPercentComission) / 100,
        buyerData?.TbhPercentComissiontoAgent,
        (parseFloat(buyerData?.netcom) *
          buyerData?.TbhPercentComissiontoAgent) /
          100,
        buyerData?.comissiontoCompanyPercent,
        (parseFloat(buyerData?.netcom) * buyerData?.comissiontoCompanyPercent) /
          100,
        buyerData?.additionalComments,
        buyerData?.comissionStatustoAgent == 1 ? "Paid" : "Not Paid",
        buyerData?.approved == 53
          ? "Approved by Superadmin"
          : buyerData?.approved == 54
          ? "Rejected by Superadmin"
          : "Awaiting",
        buyerData?.approved == 50 ? "Approved" : "Pending",
        buyerData?.contractEndDate,
        buyerData?.cheques,
        buyerData?.securityDeposit,
        buyerData?.TA,
        parseFloat(buyerData?.netCom),
        buyerData?.claim1,
        buyerData?.claim2,
        buyerData?.claim3,
        buyerData?.fullComission == 1 ? "Completed" : "Not Complete",
        buyerData?.cancelledPrice,
        buyerData?.dewaPremises,
        buyerData?.contractNumber,
        buyerData?.titleNumber,
        buyerData?.newTitleDeedNumber,
        buyerData?.agentname,
      ];

      // Flatten the array data below buyerRow
      const additionalRows = (filteredData[id]?.additionalBuyers || []).map(
        (buyerOne, index) => [
          index + 2,
          buyerOne?.Userid?.username,
          buyerOne?.Userid?.Phone,
          moment(buyerOne?.Leadid.timestamp).format("DD-MM-YY"),
          buyerOne?.Leadid?.Source.Source,
          buyerOne?.buyer.name,
          buyerOne?.buyer.contact,
          buyerOnebuyerData?.buyer.email,
          buyerOne?.buyer.dob,
          buyerOne?.buyer.passport,
          buyerOne?.buyer.passportExpiry,
          buyerOne?.buyer.nationality,
          buyerOne?.buyer.resident,
          buyerOne?.buyer.emiratesid,
          buyerOne?.buyer.address,
        ]
      );

      // Create worksheet data array
      const worksheetData = [customHeaders, buyerRow, ...additionalRows];

      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Set column widths
      const colWidths = [];
      customHeadersMain.forEach((header) =>
        colWidths.push({ wch: header.width })
      );
      worksheet["!cols"] = colWidths;

      // Apply styles to header row
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { c: C, r: range.s.r };
        const cell = worksheet[XLSX.utils.encode_cell(cellAddress)];
        const headerIndex = C - range.s.c; // Index of the header in customHeadersMain array
        const header = customHeadersMain[headerIndex];

        // Apply header style
      }

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Create an Excel file
      XLSX.writeFile(workbook, "exported_data.xlsx");
      handleDownload();
    },
    [filteredData]
  );

  const agentNames = [
    { value: "superAdmin", label: "Super admin" },
    { value: "Admin", label: "Admin" },
    { value: "SalesHead", label: "Sales Head" },
    { value: "Manager", label: "Manager" },
    { value: "BusinessHead", label: "Business Head" },
    { value: "PNL", label: "PNL" },
    { value: "TL", label: "TL" },
    { value: "ATL", label: "ATL" },
    { value: "FOS", label: "FOS" },
  ];

  useEffect(() => {
    let filteredResult = myData;

    if (agentFilter) {
      filteredResult = filteredResult.filter(
        (agent) => agent.Userid.username === agentFilter
      );
    }

    if (kycFilter) {
      filteredResult = filteredResult.filter(
        (agent) => agent.kycStatus === kycFilter
      );
    }
    const filteredResultWithEdit = filteredResult.map((item) => ({
      ...item,
      edit: null,
      PlotArea: parseFloat(
        item.PlotArea?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      ),
    }));

    setFilteredData(filteredResultWithEdit);
  }, [agentFilter, kycFilter, myData]);

  const toggleModal = (index) => {
    setIsModalOpen(!isModalOpen);
    setUserIndex(index);
  };

  const [displayStates, setDisplayStates] = useState({
    eoiimage: { show: false, index: null },
    SPAmage: { show: false, index: null },
    bookingmage: { show: false, index: null },
  });

  const showImage = (type, index) => {
    if (type === "SPAmage") {
      if (filteredData[index]?.SPAmage != null) {
        setDisplayStates((prevState) => ({
          ...prevState,
          [type]: { show: true, index },
        }));
      }
    } else {
      setDisplayStates((prevState) => ({
        ...prevState,
        [type]: { show: true, index },
      }));
    }
  };

  const submit = async (data, id) => {
    try {
      const response = await axios.put(`/api/invoice/table/${id} `, {
        data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const [passFront, setpassFront] = useState(null);
  const [passBack, setpassBack] = useState(null);
  const [passFrontIndex, setPassFrontIndex] = useState(null);
  const [passBackIndex, setPassBackIndex] = useState(null);

  const handleDownload = async (apiUrl) => {
    const fileName = apiUrl.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = apiUrl;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  const showBuyerOnePassback = (index) => {
    setPassBackIndex(index);
    setpassBack(true);
  };
  const showBuyerOnePassfront = (index) => {
    setPassFrontIndex(index);
    setpassFront(true);
  };

  const [buyerFieldsCollapsed, setBuyerFieldsCollapsed] = useState(false);

  const userToken = TokenDecoder();

  const [fields, setFields] = useState([]);
  const [visibleFields, setVisibleFields] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/invoice/fields");

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        setFields(data.data);

        setVisibleFields(
          data.data.filter((f) =>
            f.visibleTo.map((r) => r.name).includes(userToken.role)
          )
        );
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    };

    userToken && fetchRoles();
  }, [userToken]);

  return (
    <RootLayout>
      {isModalOpen && (
        <PriceModal userData={filteredData[userIndex]} onClose2={toggleModal} />
      )}
      {isTlModalOpen && (
        <PriceModal userData={filteredData[userIndex]} onClose2={toggleModal} />
      )}

      {myData && myData.length > 0 ? (
        <div className="flex justify-end w-full !px-0">
          <div className="container mx-auto p-4 md:px-8 lg:px-16 xl:px-24">
            <div className="p-4 md:px-8 lg:px-16 xl:px-24">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">MIS</h1>
              {displayStates.eoiimage.show && (
                <div className="!flex !flex-col !w-[50%] !rounded-md !h-[80%] fixed items-end top-20 left-[30%] z-[150]">
                  <IoMdClose
                    className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                    onClick={() =>
                      setDisplayStates({
                        ...displayStates,
                        eoiimage: { show: false, index: null },
                      })
                    }
                  />
                  <embed
                    src={
                      path +
                      filteredData[displayStates.eoiimage.index].eoiimage
                        ?.split("kyc/")
                        .pop()
                    }
                    type="application/pdf"
                    className="w-full h-full"
                  />
                </div>
              )}

              {displayStates.SPAmage.show &&
                filteredData[displayStates.SPAmage.index].SPAmage && (
                  <div className="!flex !flex-col !w-[50%] !rounded-md !h-[80%] fixed items-end top-20 left-[30%] z-[150]">
                    <IoMdClose
                      className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                      onClick={() =>
                        setDisplayStates({
                          ...displayStates,
                          SPAmage: { show: false, index: null },
                        })
                      }
                    />
                    <embed
                      src={
                        path +
                        filteredData[
                          displayStates.SPAmage.index
                        ].SPAmage?.split("kyc/").pop()
                      }
                      type="application/pdf"
                      className="w-full h-full"
                    />
                  </div>
                )}

              {displayStates.bookingmage.show && (
                <div className="!flex !flex-col !w-[50%] !rounded-md !h-[80%] fixed items-end top-20 left-[30%] z-[150]">
                  <IoMdClose
                    className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                    onClick={() =>
                      setDisplayStates({
                        ...displayStates,
                        bookingmage: { show: false, index: null },
                      })
                    }
                  />
                  <embed
                    src={
                      path +
                      filteredData[displayStates.SPAmage.index]?.bookingmage
                        ?.split("kyc/")
                        .pop()
                    }
                    type="application/pdf"
                    className="w-full h-full"
                  />
                </div>
              )}

              {passFront && (
                <div className="!flex !flex-col !w-[80%] !rounded-md !h-[80%] fixed items-end top-20 left-[10%] z-10">
                  <IoMdClose
                    className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                    onClick={() => setpassFront(null)}
                  />
                  {filteredData[passFrontIndex]?.passportFront[0] == "/" ? (
                    <embed
                      src={
                        path +
                        filteredData[passFrontIndex]?.passportFront
                          ?.split("kyc/")
                          .pop()
                      }
                      type="application/pdf"
                      className="w-full h-full"
                    />
                  ) : (
                    <embed
                      src={filteredData[passFrontIndex]?.passportFront}
                      type="application/pdf"
                      className="w-full h-full"
                    />
                  )}
                </div>
              )}

              {passBack && (
                <div className="!flex !flex-col !w-[80%] !rounded-md !h-[80%] fixed items-end top-20 left-[10%] z-10">
                  <IoMdClose
                    className="!text-[2.3rem] cursor-pointer hover:bg-red-500 rounded-full p-1 bg-gray-300 !text-gray-900"
                    onClick={() => setpassBack(null)}
                  />
                  {filteredData[passBackIndex]?.passportBack[0] == "/" ? (
                    <embed
                      src={
                        path +
                        filteredData[passBackIndex]?.passportBack
                          ?.split("kyc/")
                          .pop()
                      }
                      type="application/pdf"
                      className="w-full h-full"
                    />
                  ) : (
                    <embed
                      src={filteredData[passBackIndex]?.passportFront}
                      type="application/pdf"
                      className="w-full h-full"
                    />
                  )}
                </div>
              )}

              <div className="flex  items-center gap-3 ">
                <div className={`relative z-[109]`}>
                  <SearchableSelect
                    options={agentNames}
                    onChange={(value) => setAgenFilter(value.label)}
                    placeholder={"Agent Name"}
                  ></SearchableSelect>
                </div>

                <div className={`relative z-[109]`}>
                  <SearchableSelect
                    options={[]}
                    onChange={(value) => setKycFilter(value.label)}
                    placeholder={"Select Team"}
                  ></SearchableSelect>
                </div>
              </div>

              <div className="overflow-x-auto overflow-hidden mt-3 border mb-6 rounded-lg shadow border-gray-200 max-h-[700px]">
                <table className="table-fixed min-w-full text-sm divide-y divide-gray-300">
                  <thead className="sticky top-0 z-10 text-white">
                    <tr className="text-md sticky py-2 z-[108] bg-gradient-to-r from-miles-500 to-miles-700 top-0 border-b border-slate-500">
                      <th
                        id="firstHeader"
                        className="sticky left-0 z-[108] bg-gradient-to-r from-miles-500 to-[#176090] py-2"
                      >
                        <div className="grid items-center px-2 grid-cols-11 w-[480px] ">
                          <p className="!mb-0 !mt-0 col-span-3">Serial No.</p>
                          <p className="!mb-0 !mt-0 col-span-4">Agent</p>
                          <p className="!mb-0 !mt-0 col-span-4">Lead</p>
                        </div>
                      </th>

                      <th
                        onClick={() =>
                          setBuyerFieldsCollapsed(!buyerFieldsCollapsed)
                        }
                        className={`cursor-pointer text-nowrap !px-1 py-2`}
                      >
                        <div
                          className={`flex justify-between items-center gap-3`}
                        >
                          Buyer
                          <ChevronRightIcon
                            className={`size-4 ${
                              buyerFieldsCollapsed ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </div>
                      </th>

                      {buyerFieldsCollapsed && (
                        <>
                          <th className="!px-1">Phone Number</th>
                          <th className="!px-1">Email Id</th>
                          <th className="!px-1">Birth Date</th>
                          <th className="!px-1">Passport</th>
                          <th className="!px-1">Nationality</th>
                          <th className="!px-1">UAE Resident</th>
                          <th className="!px-1">Emirates ID</th>
                          <th className="!px-1">Emirates Expiry</th>
                          <th className="!px-1">Address</th>
                        </>
                      )}

                      {visibleFields.map((field) => {
                        if (["_id", "buyer"].includes(field.name)) return;
                        return (
                          <th className="capitalize !px-1">{field.name}</th>
                        );
                      })}

                      <th
                        id="lastHeader"
                        className="!px-1 sticky right-0 text-center text-white !bg-red-500"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {filteredData.map((row, index) => (
                      <tr key={index} className="border-b border-slate-400">
                        <RowFixedFields row={row} index={index} />

                        <td scope="row">
                          <input
                            value={row?.buyer?.name}
                            className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                            onChange={(e) => {
                              setFilteredData((prev) => {
                                const newData = [...prev];
                                newData[index].buyer.name = e.target.value;
                                return newData;
                              });
                            }}
                          />
                          {row.additionalBuyers?.length > 0
                            ? row.additionalBuyers.map((addBuyers, id) => {
                                return (
                                  <div key={id} className={`mt-1`}>
                                    <input
                                      value={addBuyers?.buyer.name}
                                      onChange={(e) => {
                                        const newFilteredData = [
                                          ...filteredData,
                                        ];
                                        newFilteredData[index].additionalBuyers[
                                          id
                                        ].buyer.name = e.target.value;
                                        setFilteredData(newFilteredData);
                                      }}
                                      className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                    />
                                  </div>
                                );
                              })
                            : null}
                        </td>

                        {buyerFieldsCollapsed && (
                          <>
                            <td scope="row" className="">
                              <input
                                value={row?.buyer?.contact}
                                className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                onChange={(e) => {
                                  const newFilteredData = [...filteredData];
                                  newFilteredData[index].buyer.contact =
                                    e.target.value;
                                  setFilteredData(newFilteredData);
                                }}
                              />
                              {row.additionalBuyers?.length > 0 &&
                                row.additionalBuyers.map((addBuyers, id) => {
                                  return (
                                    <div key={id} className={`mt-1`}>
                                      <input
                                        value={addBuyers?.buyer.contact}
                                        onChange={(e) => {
                                          const newFilteredData = [
                                            ...filteredData,
                                          ];
                                          newFilteredData[
                                            index
                                          ].additionalBuyers[id].buyer.contact =
                                            e.target.value;
                                          setFilteredData(newFilteredData);
                                        }}
                                        className="p-1 disabled:!border-0 disabled:!bg-[#F1F5F7] "
                                      />
                                    </div>
                                  );
                                })}
                            </td>
                            <td scope="row" className="!px-1">
                              <input
                                value={row?.buyer?.email}
                                className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                onChange={(e) => {
                                  const newFilteredData = [...filteredData];
                                  newFilteredData[index].buyer.email =
                                    e.target.value;
                                  setFilteredData(newFilteredData);
                                }}
                              />
                              {row.additionalBuyers?.length > 0 &&
                                row.additionalBuyers.map((addBuyers, id) => {
                                  return (
                                    <div key={id} className={`mt-1`}>
                                      <input
                                        value={addBuyers?.buyer.email}
                                        onChange={(e) => {
                                          const newFilteredData = [
                                            ...filteredData,
                                          ];
                                          newFilteredData[
                                            index
                                          ].additionalBuyers[id].buyer.email =
                                            e.target.value;
                                          setFilteredData(newFilteredData);
                                        }}
                                        className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                      />
                                    </div>
                                  );
                                })}
                            </td>
                            <td scope="row" className="!px-1">
                              <input
                                value={row?.buyer?.dob}
                                onKeyDown={(e) => e.preventDefault()}
                                className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                max={new Date().toISOString().split("T")[0]}
                                type="date"
                                onChange={(e) => {
                                  const newFilteredData = [...filteredData];
                                  newFilteredData[index].buyer.dob =
                                    e.target.value;
                                  setFilteredData(newFilteredData);
                                }}
                              />
                              {row.additionalBuyers?.length > 0 &&
                                row.additionalBuyers.map((addBuyers, id) => {
                                  return (
                                    <div key={id} className={`mt-1`}>
                                      <input
                                        onKeyDown={(e) => e.preventDefault()}
                                        value={addBuyers?.buyer.dob}
                                        max={
                                          new Date().toISOString().split("T")[0]
                                        }
                                        type="date"
                                        onChange={(e) => {
                                          const newFilteredData = [
                                            ...filteredData,
                                          ];
                                          newFilteredData[
                                            index
                                          ].additionalBuyers[id].buyer.dob =
                                            e.target.value;
                                          setFilteredData(newFilteredData);
                                        }}
                                        className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                      />
                                    </div>
                                  );
                                })}
                            </td>
                            <td scope="row" className="!px-2">
                              <div className="flex items-center">
                                <input
                                  value={row?.buyer.passport}
                                  className={`p-1 w-auto border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                  onChange={(e) => {
                                    const newFilteredData = [...filteredData];
                                    newFilteredData[index].buyer.passport =
                                      e.target.value;
                                    setFilteredData(newFilteredData);
                                  }}
                                />
                                {row?.buyer.passportExpiry &&
                                new Date(row?.buyer.passportExpiry) <
                                  new Date() ? (
                                  <FaTimes className="text-red-600 ml-2" />
                                ) : (
                                  <FaCheck className="text-green-600 ml-2" />
                                )}
                              </div>

                              <div className="flex w-full justify-between">
                                <span className="font-semibold">Front:</span>
                                <div className="flex gap-1">
                                  <p className="!m-0 !border-0">
                                    <IoMdEye
                                      className="cursor-pointer"
                                      onClick={() => {
                                        showBuyerOnePassfront(index);
                                      }}
                                    />
                                  </p>
                                  <p
                                    className="!m-0 !border-0"
                                    onClick={() => {
                                      handleDownload(
                                        row.buyer.passportFront,
                                        "file.pdf"
                                      );
                                    }}
                                  >
                                    <IoMdDownload className="cursor-pointer" />
                                  </p>
                                </div>
                              </div>

                              <div className="flex w-full justify-between">
                                <span className="font-semibold">Back:</span>
                                <div className="flex gap-1">
                                  <p className="!m-0 !border-0">
                                    <IoMdEye
                                      className="cursor-pointer"
                                      onClick={() => {
                                        showBuyerOnePassback(index);
                                      }}
                                    />
                                  </p>
                                  <p
                                    className="!m-0 !border-0"
                                    onClick={() => {
                                      handleDownload(
                                        row.buyer.passportBack,
                                        "file.pdf"
                                      );
                                    }}
                                  >
                                    <IoMdDownload className="cursor-pointer" />
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td scope="row" className="!px-1 ">
                              <input
                                value={row?.buyer?.nationality}
                                className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                onChange={(e) => {
                                  const newFilteredData = [...filteredData];
                                  newFilteredData[index].buyer.nationality =
                                    e.target.value;
                                  setFilteredData(newFilteredData);
                                }}
                              />
                              {row.additionalBuyers?.length > 0
                                ? row.additionalBuyers.map((addBuyers, id) => {
                                    return (
                                      <div key={id} className={`mt-1`}>
                                        <input
                                          value={addBuyers?.buyer.nationality}
                                          onChange={(e) => {
                                            const newFilteredData = [
                                              ...filteredData,
                                            ];
                                            newFilteredData[
                                              index
                                            ].additionalBuyers[
                                              id
                                            ].buyer.nationality =
                                              e.target.value;
                                            setFilteredData(newFilteredData);
                                          }}
                                          className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                        />
                                      </div>
                                    );
                                  })
                                : null}
                            </td>
                            <td scope="row" className="!px-1 ">
                              <p className={`w-[100px] !mb-0`}>
                                {row?.buyer?.resident}
                              </p>
                              {row.additionalBuyers?.length > 0
                                ? row.additionalBuyers.map((addBuyers, id) => {
                                    return (
                                      <div key={id} className={`mt-1`}>
                                        <p className={`w-[100px] !mb-0`}>
                                          {addBuyers?.buyer.resident}
                                        </p>
                                      </div>
                                    );
                                  })
                                : null}
                            </td>
                            <td scope="row" className="!px-1 ">
                              <p className={`w-[100px] !mb-0`}>
                                {row?.buyer?.emiratesId
                                  ? row?.buyer?.emiratesId
                                  : "N/A"}
                              </p>
                              {row.additionalBuyers?.length > 0
                                ? row.additionalBuyers.map((addBuyers, id) => {
                                    return (
                                      <div key={id} className={`mt-1`}>
                                        <p className={`w-[100px] !mb-0`}>
                                          {addBuyers?.buyer.emiratesId
                                            ? addBuyers?.buyer.emiratesId
                                            : "N/A"}
                                        </p>
                                      </div>
                                    );
                                  })
                                : null}
                            </td>
                            <td scope="row" className="!px-1 ">
                              <input
                                className={`px-1 !mb-0 disabled:bg-slate-200`}
                                value={
                                  row?.buyer?.emiratesExpiry
                                    ? row?.buyer?.emiratesExpiry
                                    : "N/A"
                                }
                                type="date"
                                disabled
                              />
                              {row.additionalBuyers?.length > 0
                                ? row.additionalBuyers.map((addBuyers, id) => {
                                    return (
                                      <div key={id} className={`mt-1`}>
                                        <p className={`w-[200px] !mb-0`}>
                                          {addBuyers?.buyer.emiratesExpiry
                                            ? addBuyers?.buyer.emiratesExpiry
                                            : "N/A"}
                                        </p>
                                      </div>
                                    );
                                  })
                                : null}
                            </td>
                            <td scope="row" className="!px-1">
                              <input
                                value={row?.buyer?.address}
                                className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
                                onChange={(e) => {
                                  const newFilteredData = [...filteredData];
                                  newFilteredData[index].buyer.address =
                                    e.target.value;
                                  setFilteredData(newFilteredData);
                                }}
                              />
                              {row.additionalBuyers?.length > 0
                                ? row.additionalBuyers.map((addBuyers, id) => {
                                    return (
                                      <div key={id} className={`mt-1`}>
                                        <input
                                          value={addBuyers?.buyer.address}
                                          onChange={(e) => {
                                            const newFilteredData = [
                                              ...filteredData,
                                            ];
                                            newFilteredData[
                                              index
                                            ].additionalBuyers[
                                              id
                                            ].buyer.address = e.target.value;
                                            setFilteredData(newFilteredData);
                                          }}
                                          className="p-1 disabled:!border-0 disabled:!bg-[#F1F5F7]"
                                        />
                                      </div>
                                    );
                                  })
                                : null}
                            </td>
                          </>
                        )}

                        {visibleFields.map((field) => {
                          if (field.name === "buyer") return null;
                          return (
                            <td
                              key={field.name}
                              scope="row"
                              className="px-1 text-center"
                            >
                              <FieldTypeComponent
                                row={row}
                                index={index}
                                field={field}
                                filteredData={filteredData}
                                setFilteredData={setFilteredData}
                              />
                            </td>
                          );
                        })}

                        <td className="sticky right-0 z-10 !bg-[#F1F5F7] px-1">
                          <div
                            className={`flex item-center justify-around space-x-2 mx-1`}
                          >
                            <button
                              className="text-lg cursor-pointer inline-block"
                              onClick={() => {
                                const newFilteredData = [...filteredData];
                                newFilteredData[index].edit = true;
                                setFilteredData(newFilteredData);
                              }}
                            >
                              <FaRegEdit />
                            </button>

                            <button
                              className={`text-lg !inline-block ${
                                row.buyer?.name.length < 1 ||
                                row.buyer?.contact.length < 1 ||
                                row.buyer?.dob.length < 1 ||
                                row.buyer?.passport.length < 1 ||
                                row.buyer?.passportExpiry.length < 1 ||
                                row.buyer?.nationality.length < 1 ||
                                row.buyer?.address.length < 1 ||
                                row.Closure?.length < 1 ||
                                row.Booking?.length < 1
                                  ? "text-slate-300"
                                  : "text-green-300"
                              } `}
                              onClick={() => {
                                submit(row, row._id);
                                const newFilteredData = [...filteredData];
                                newFilteredData[index].edit = false;
                                setFilteredData(newFilteredData);
                              }}
                              disabled={
                                row.buyer?.name.length < 1 ||
                                row.buyer?.contact.length < 1 ||
                                row.buyer?.dob.length < 1 ||
                                row.buyer?.passport.length < 1 ||
                                row.buyer?.passportExpiry.length < 1 ||
                                row.buyer?.nationality.length < 1 ||
                                row.buyer?.address.length < 1 ||
                                row.Closure?.length < 1 ||
                                row.Booking?.length < 1
                              }
                            >
                              <ImCheckmark />
                            </button>
                            <button
                              className="text-lg cursor-pointer inline-block"
                              onClick={() => {
                                exportFile(index);
                              }}
                            >
                              <MdFileDownload />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <VisibleFieldsManagement fields={fields} />
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </RootLayout>
  );
}

export default allDeals;
