"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function VisibleFieldsManagement({ fields }) {
  const [roles, setRoles] = useState([]);

  const [clientFields, setClientFields] = useState([]);
  const [clientInitialFields, setClientInitialFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);

  useEffect(() => {
    setClientFields(fields);
    setClientInitialFields(fields);
    setFilteredFields(fields);
  }, [fields]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles");

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        setRoles(data.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const newFilteredFields = clientFields.filter((field) =>
      field.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFields(newFilteredFields);
  }, [searchTerm]);

  const [saving, setSaving] = useState(false);

  const handleFieldVisibilityChange = (fieldName, role) => {
    const updatedFields = [...clientFields];
    const fieldIndex = updatedFields.findIndex(
      (field) => field.name === fieldName
    );

    if (fieldIndex !== -1) {
      const field = updatedFields[fieldIndex];

      const isVisible = field.visibleTo.some(
        (visibleRole) => visibleRole._id === role._id
      );
      const newVisibleTo = isVisible
        ? field.visibleTo.filter((visibleRole) => visibleRole._id !== role._id)
        : [...field.visibleTo, role];

      updatedFields[fieldIndex] = { ...field, visibleTo: newVisibleTo };

      setClientFields(updatedFields);
    }
  };

  const deepEqualFields = (fields1, fields2) => {
    if (fields1.length !== fields2.length) return false;

    for (let i = 0; i < fields1.length; i++) {
      const field1 = fields1[i];
      const field2 = fields2.find((f) => f.name === field1.name);

      if (!field2) return false;

      if (
        JSON.stringify(field1.visibleTo.sort()) !==
        JSON.stringify(field2.visibleTo.sort())
      ) {
        return false;
      }
    }

    return true;
  };

  const hasChanges = !deepEqualFields(clientFields, clientInitialFields);

  const handleSubmit = async () => {
    if (!hasChanges) {
      toast("No Changes Made");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/invoice/fields", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientFields }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to update invoice fields visibility"
        );
      }
      const data = await response.json();
      toast.success(
        data.message || "Invoice fields visibility updated successfully"
      );
      setClientInitialFields(clientFields);
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error(
        error.message || "Failed to update invoice fields visibility"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl mt-8 mb-2 font-bold text-gray-900">
        Visible Fields Management
      </h2>
      <div className="mb-6 overflow-x-auto shadow">
        <div className="inline-block min-w-full border border-gray-200 rounded-t-lg overflow-x-hidden align-middle max-h-[512px]">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-miles-500 to-miles-700 text-white">
              <tr>
                <th className="py-4 px-2 border-r border-gray-400 text-left text-sm font-semibold capitalize tracking-wider">
                  Field
                </th>
                {roles.map((role) => (
                  <th
                    key={role.name}
                    className="py-4 px-2 text-sm font-semibold text-center capitalize tracking-wider"
                  >
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200">
              {clientFields && clientFields.length > 0 ? (
                filteredFields.map((field, fieldIndex) => (
                  <tr
                    key={`${field.name}`}
                    className={`${
                      fieldIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="capitalize border-r border-gray-400 hover:bg-miles-100 transition-all text-nowrap py-4 px-2 text-sm text-gray-700 font-medium">
                      {field.name.replaceAll("_", " ")}
                    </td>
                    {roles.map((role) => (
                      <td
                        key={`${field.value}-${role.name}`}
                        className="group-hover:bg-miles-100 transition-all text-center"
                      >
                        <div className="inline-flex items-center">
                          <label className="flex items-center cursor-pointer relative">
                            <input
                              type="checkbox"
                              disabled={role === "superAdmin"}
                              checked={field.visibleTo
                                .map((v) => v._id)
                                .includes(role._id)}
                              onChange={() =>
                                handleFieldVisibilityChange(field.name, role)
                              }
                              className={`peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-gray-300 disabled:bg-gray-300 disabled:border-gray-300 ${
                                field.visibleTo
                                  .map((v) => v._id)
                                  .includes(role._id) !==
                                (clientInitialFields
                                  .find((f) => f._id === field._id)
                                  ?.visibleTo.some((v) => v._id === role._id) ||
                                  false)
                                  ? "bg-green-600 border-2 border-green-600"
                                  : field.visibleTo
                                      .map((v) => v._id)
                                      .includes(role._id)
                                  ? "checked:bg-miles-600 checked:border-miles-600"
                                  : ""
                              }`}
                            />
                            <span
                              className={`absolute text-white ${
                                field.visibleTo
                                  .map((v) => v._id)
                                  .includes(role._id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              } top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="1"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </label>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No fields available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex space-x-2">
          <div
            className="flex justify-between items-center rounded-md !border
								border-gray-300 text-md focus:outline-none transition-all duration-200
								focus:shadow-md bg-white px-3 py-0 w-full"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Fields..."
            />
            <MagnifyingGlassIcon className="size-[16px]" />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!hasChanges || saving}
          className={`
              px-6 py-1 bg-miles-600 disabled:bg-gray-300 text-white disabled:text-gray-400 rounded-md shadow-md hover:bg-miles-700 ${
                saving && "cursor-wait"
              } focus:ring-2 focus:ring-miles-500 focus:ring-offset-2 transition-all duration-150`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
