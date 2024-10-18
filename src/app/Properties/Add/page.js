"use client";
import RootLayout from "@/app/components/layout";
import axios from "axios";
import React from "react";
import SearchableSelect from "../dropdown";

function Add() {
  const options1 = [
    { value: "Primary", label: "Primary" },
    { value: "Secondary", label: "Secondary" },
  ];

  const [Property, setProperty] = React.useState({
    Project: "",
    Developer: "",
    Location: "",
    Rate: "",
    Type: "",
    Bedroom: "",
    Bathroom: "",
    Area: "",
    Handover: "",
    Description: "",
    lDescription: "",
    Catalog: "",
    Agent: "",
  });
  const [buttonDisabled, SetButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/Property/add", Property);
      console.log("Property add success", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectChange = (property, selectedOption) => {
    setProperty((prevProperty) => ({
      ...prevProperty,
      [property]: selectedOption.value,
    }));
  };
  return (
    <RootLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="card-body mt-4 space-y-6">
          {/* Project */}
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
              type="text"
              value={Property.Project}
              onChange={(e) =>
                setProperty({ ...Property, Project: e.target.value })
              }
              placeholder="Project"
            />
          </div>

          {/* Developer */}
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
              type="text"
              value={Property.Developer}
              onChange={(e) =>
                setProperty({ ...Property, Developer: e.target.value })
              }
              placeholder="Developer"
            />
          </div>

          {/* Location */}
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
              type="tel"
              value={Property.Location}
              onChange={(e) =>
                setProperty({ ...Property, Location: e.target.value })
              }
              placeholder="Location"
            />
          </div>

          {/* Rate */}
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
              type="tel"
              value={Property.Rate}
              onChange={(e) =>
                setProperty({ ...Property, Rate: e.target.value })
              }
              placeholder="Rate - AED (Base Currency)"
            />
          </div>

          {/* Type */}
          <div>
            <SearchableSelect
              options={options1}
              onChange={(selectedOption) =>
                handleSelectChange("Type", selectedOption)
              }
              placeholder="Type..."
            />
          </div>

          {/* Bedroom */}
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
              type="email"
              value={Property.Bedroom}
              onChange={(e) =>
                setProperty({ ...Property, Bedroom: e.target.value })
              }
              placeholder="Bedroom"
            />
          </div>

          {/* Bathroom */}
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
              type="text"
              value={Property.Bathroom}
              onChange={(e) =>
                setProperty({ ...Property, Bathroom: e.target.value })
              }
              placeholder="Bathroom"
            />
          </div>

          {/* Area */}
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
              type="text"
              value={Property.Area}
              onChange={(e) =>
                setProperty({ ...Property, Area: e.target.value })
              }
              placeholder="Area (Sqft)"
            />
          </div>

          {/* Handover */}
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
              type="text"
              value={Property.Handover}
              onChange={(e) =>
                setProperty({ ...Property, Handover: e.target.value })
              }
              placeholder="Handover"
            />
          </div>

          {/* Description */}
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
              type="text"
              value={Property.Description}
              onChange={(e) =>
                setProperty({ ...Property, Description: e.target.value })
              }
              placeholder="Description"
            />
          </div>

          {/* Long Description */}
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
              type="text"
              value={Property.lDescription}
              onChange={(e) =>
                setProperty({ ...Property, lDescription: e.target.value })
              }
              placeholder="Long Description"
            />
          </div>

          {/* Catalog Link */}
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
              type="text"
              value={Property.Catalog}
              onChange={(e) =>
                setProperty({ ...Property, Catalog: e.target.value })
              }
              placeholder="Catalog link"
            />
          </div>

          {/* Agent */}
          <div>
            <input
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
              type="text"
              value={Property.Agent}
              onChange={(e) =>
                setProperty({ ...Property, Agent: e.target.value })
              }
              placeholder="Agent"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              className="w-full px-6 py-1 text-white bg-miles-600 rounded-md shadow-md hover:bg-miles-700 focus:ring-2 focus:ring-miles-500 focus:ring-offset-2 transition-all duration-150"
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

export default Add;
