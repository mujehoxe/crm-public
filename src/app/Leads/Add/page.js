"use client";
import TokenDecoder from "@/app/components/Cookies";
import RootLayout from "@/app/components/layout";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchableSelect from "../dropdown";

function Add() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuspenseWrappde />
    </Suspense>
  );
}

function SuspenseWrappde() {
  const userdata = TokenDecoder();
  const userid = userdata ? userdata.id : null;
  const username = userdata ? userdata.name : null;
  const userrole = userdata ? userdata.role : null;
  const searchParams = useSearchParams();
  const [users, setUsers] = useState([]);
  const [options10, setoptions10] = useState([]);
  const [TagsCount, setTagsCount] = useState([]);
  const [StatusCount, setStatusCount] = useState([]);
  const [options1, setoptions1] = useState([]);
  const [SourceCount, setSourceCount] = useState([]);
  const [options2, setoptions2] = useState([]);
  const router = useRouter();

  const [options9, setOptions9] = useState([]);
  const options19 = [
    { value: "Admin", label: "Admin" },
    { value: "Marketing", label: "Marketing" },
    { value: "Manager", label: "Manager" },
    { value: "Finance", label: "Finance" },
    { value: "Operations", label: "Operations" },
    { value: "HR", label: "Human Resource" },
    { value: "BusinessHead", label: "Business Head" },
    { value: "PNL", label: "PNL" },
    { value: "TL", label: "TL" },
    { value: "ATL", label: "ATL" },
    { value: "FOS", label: "FOS" },
  ];

  useEffect(() => {
    if (userrole !== null) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get("/api/staff/get");
          console.log("User Data:", response.data.data);

          let filteredUsers = response.data.data;
          if (userrole == "BusinessHead") {
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
              !["HR", "Finance", "Manager", "SalesHead"].includes(user.Role)
          );

          const defaultOption = { value: userid, label: username };

          // Filter out the logged-in user if already present
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

          console.log("Mapped Users:", mappedUsers);

          setUsers(mappedUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }
  }, [userrole]);

  useEffect(() => {
    const newOptions = users.map((user) => ({
      value: user._id,
      label: user.username,
    }));
    setOptions9(newOptions);
  }, [users]);

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
    const fetchSource = async () => {
      try {
        let url = `/api/Source/get`;
        const response = await axios.get(url);
        setSourceCount(response.data.data);
      } catch (error) {
        console.error("Error fetching Source:", error);
      }
    };

    fetchSource();
  }, []);

  useEffect(() => {
    const newOptions1 = StatusCount.map((StatusCount) => ({
      value: StatusCount._id,
      label: StatusCount.Status,
    }));
    setoptions1(newOptions1);
  }, [StatusCount]);

  useEffect(() => {
    const newOptions2 = SourceCount.map((SourceCount) => ({
      value: SourceCount._id,
      label: SourceCount.Source,
    }));
    setoptions2(newOptions2);
  }, [SourceCount]);

  useEffect(() => {
    const newOptions = TagsCount.map((TagsCount) => ({
      value: TagsCount._id,
      label: TagsCount.Tag,
    }));
    setoptions10(newOptions);
  }, [TagsCount]);

  const leadpara = searchParams.get("lead");

  const options3 = [{ value: "Test@gmail.com", label: "Test Staff" }];
  const options4 = [
    { value: "Usa", label: "United State Of America" },
    { value: "India", label: "India" },
    { value: "Australia", label: "Australia" },
  ];
  const options5 = [
    { value: "Primary", label: "Primary" },
    { value: "Secondary", label: "Secondary" },
  ];
  const options8 = [
    { value: "Apartment", label: "Apartment " },
    { value: "Townhouse", label: "Townhouse " },
    { value: "Villas", label: "Villas " },
  ];
  const secondaryOptions = [
    { value: "PROPERTY FINDER", label: "PROPERTY FINDER" },
    { value: "BAYUT", label: "BAYUT" },
    { value: "DUBIZZLE", label: "DUBIZZLE" },
    { value: "SELF", label: "SELF" },
  ];

  const getSourceOptions = () => {
    if (Leads.typeprop === "Secondary") {
      return secondaryOptions;
    } else {
      return options2;
    }
  };

  const [Leads, setLead] = React.useState({
    LeadStatus: "",
    Source: "",
    Assigned: "",
    typeprop: "",
    Name: "",
    Score: "",
    Phone: "",
    AltPhone: "",
    Address: "",
    Email: "",
    City: "",
    Project: "",
    Budget: "",
    Country: "",
    Location: "",
    ZipCode: "",
    Type: "",
    Description: "",
    unitnumber: "",
    LeadType: leadpara,
    tags: "",
    marketingtags: "",
  });
  const [buttonDisabled, SetButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleSelectChange = (property, selectedOption) => {
    setLead((prevLeads) => ({
      ...prevLeads,
      [property]: selectedOption.value,
    }));
  };
  const onSubmit = async (event) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/Lead/add", Leads);
      console.log("Lead add success", response.data);
      toast.success("Upload successful");
      router.push("/Community-Leads");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RootLayout>
      <div className="pl-[138px] pr-8">
        <div className="card-body mt-24">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <SearchableSelect
                options={options1}
                onChange={(selectedOption) =>
                  handleSelectChange("LeadStatus", selectedOption)
                }
                placeholder="Status..."
              />

              {/* Source */}
              <SearchableSelect
                options={getSourceOptions()}
                onChange={(selectedOption) =>
                  handleSelectChange("Source", selectedOption)
                }
                placeholder="Source..."
              />

              <SearchableSelect
                options={users}
                onChange={(selectedOption) =>
                  handleSelectChange("Assigned", selectedOption)
                }
                placeholder="Assigned..."
              />

              <SearchableSelect
                options={options10}
                onChange={(selectedOption) =>
                  handleSelectChange("tags", selectedOption)
                }
                placeholder="DLD Tags..."
              />

              <SearchableSelect
                options={options10}
                onChange={(selectedOption) =>
                  handleSelectChange("marketingtags", selectedOption)
                }
                placeholder="Marketing Tags..."
              />

              <input
                className="form-input"
                type="text"
                value={Leads.Name}
                onChange={(e) => setLead({ ...Leads, Name: e.target.value })}
                placeholder="Name"
                required
              />

              <input
                className="form-input"
                type="tel"
                value={Leads.Phone}
                onChange={(e) => setLead({ ...Leads, Phone: e.target.value })}
                placeholder="Phone"
              />

              <input
                className="form-input"
                type="tel"
                value={Leads.AltPhone}
                onChange={(e) =>
                  setLead({ ...Leads, AltPhone: e.target.value })
                }
                placeholder="Alt Phone"
              />

              <input
                className="form-input"
                type="text"
                value={Leads.Address}
                onChange={(e) => setLead({ ...Leads, Address: e.target.value })}
                placeholder="Address"
              />

              <input
                className="form-input"
                type="email"
                value={Leads.Email}
                onChange={(e) => setLead({ ...Leads, Email: e.target.value })}
                placeholder="Email address"
              />

              <input
                className="form-input"
                type="text"
                value={Leads.City}
                onChange={(e) => setLead({ ...Leads, City: e.target.value })}
                placeholder="City"
              />

              <input
                className="form-input"
                type="text"
                value={Leads.Project}
                onChange={(e) => setLead({ ...Leads, Project: e.target.value })}
                placeholder="Project"
              />
              <NumericFormat
                value={parseFloat(String(Leads.Budget).replace(/,/g, ""))
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                placeholder="Budget/Investment Value..."
                onChange={(e) => setLead({ ...Leads, Budget: e.target.value })}
                className="form-input"
                allowLeadingZeros
                thousandSeparator=","
              />

              {/* Country */}
              <SearchableSelect
                options={options4}
                onChange={(selectedOption) =>
                  handleSelectChange("Country", selectedOption)
                }
                placeholder="Countries..."
              />

              {/* Preferred Location */}
              <input
                className="form-input"
                type="text"
                value={Leads.Location}
                onChange={(e) =>
                  setLead({ ...Leads, Location: e.target.value })
                }
                placeholder="Preferred Location"
              />

              {/* Zip Code */}
              <input
                className="form-input"
                type="text"
                value={Leads.ZipCode}
                onChange={(e) => setLead({ ...Leads, ZipCode: e.target.value })}
                placeholder="Zip Code"
              />

              {/* Type */}
              <SearchableSelect
                options={options8}
                onChange={(selectedOption) =>
                  handleSelectChange("Type", selectedOption)
                }
                placeholder="Type..."
              />

              {/* Property Type */}
              <SearchableSelect
                options={options5}
                onChange={(selectedOption) =>
                  handleSelectChange("typeprop", selectedOption)
                }
                placeholder="Property Type..."
              />

              {/* Unit Number */}
              <input
                className="form-input"
                type="text"
                value={Leads.unitnumber}
                onChange={(e) =>
                  setLead({ ...Leads, unitnumber: e.target.value })
                }
                placeholder="Unit Number"
              />

              {/* Description */}
              <textarea
                className="form-input"
                value={Leads.Description ?? Description}
                onChange={(e) =>
                  setLead({ ...Leads, Description: e.target.value })
                }
                rows="5"
                placeholder="Description"
              ></textarea>

              {/* Submit Button */}
              <div className="col-span-2">
                <button
                  className="w-full px-6 py-1 text-white bg-miles-600 rounded-md shadow-md hover:bg-miles-700 focus:ring-2 focus:ring-miles-500 focus:ring-offset-2 transition-all duration-150"
                  disabled={loading}
                  onClick={onSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

export default Add;
