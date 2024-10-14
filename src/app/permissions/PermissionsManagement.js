"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { toast } from "react-toastify";
import RootLayout from "../components/layout";

export default function PermissionsManagement({ initialModules, roles }) {
  const [modules, setModules] = useState(initialModules);
  const [clientInitialModules, setClientInitialModules] =
    useState(initialModules);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModules = Object.entries(modules).reduce(
    (acc, [moduleName, operations]) => {
      const filteredOperations = operations.filter((operation) =>
        operation.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredOperations.length > 0) {
        acc[moduleName] = filteredOperations;
      }
      return acc;
    },
    {}
  );

  const handlePermissionChange = (moduleName, operationName, role) => {
    setModules((prevModules) => ({
      ...prevModules,
      [moduleName]: prevModules[moduleName].map((operation) =>
        operation.name === operationName
          ? {
              ...operation,
              allowedRoles: operation.allowedRoles.includes(role)
                ? operation.allowedRoles.filter((r) => r !== role)
                : [...operation.allowedRoles, role],
            }
          : operation
      ),
    }));
  };

  const normalizeModules = (modules) => {
    const normalized = {};
    Object.keys(modules).forEach((moduleName) => {
      normalized[moduleName] = modules[moduleName].map((operation) => ({
        ...operation,
        allowedRoles: [...operation.allowedRoles].sort(),
      }));
    });
    return normalized;
  };

  const deepEqualModules = (modules1, modules2) => {
    const normalizedModules1 = normalizeModules(modules1);
    const normalizedModules2 = normalizeModules(modules2);

    const moduleNames1 = Object.keys(normalizedModules1);
    const moduleNames2 = Object.keys(normalizedModules2);

    if (moduleNames1.length !== moduleNames2.length) return false;

    for (const moduleName of moduleNames1) {
      if (!normalizedModules2[moduleName]) return false;

      const operations1 = normalizedModules1[moduleName];
      const operations2 = normalizedModules2[moduleName];

      if (operations1.length !== operations2.length) return false;

      for (let i = 0; i < operations1.length; i++) {
        if (operations1[i].name !== operations2[i].name) return false;
        if (
          operations1[i].allowedRoles.length !==
          operations2[i].allowedRoles.length
        )
          return false;
        for (let j = 0; j < operations1[i].allowedRoles.length; j++) {
          if (operations1[i].allowedRoles[j] !== operations2[i].allowedRoles[j])
            return false;
        }
      }
    }
    return true;
  };

  const hasChanges = !deepEqualModules(modules, clientInitialModules);

  const handleSubmit = async () => {
    if (!hasChanges) {
      toast("No Changes Made");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/permissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modules }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update permissions");
      }
      const data = await response.json();
      toast.success(data.message || "Permissions updated successfully");
      setClientInitialModules(modules);
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error(error.message || "Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RootLayout>
      <div className="container mx-auto p-4 md:px-8 lg:px-16 xl:px-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Permissions Management
        </h1>
        <div className="border mb-6 rounded-lg overflow-x-hidden shadow border-gray-200">
          <div className="inline-block min-w-full align-middle h-[512px]">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-miles-500 to-miles-700 text-white">
                <tr>
                  <th className="py-4 px-2 text-left text-sm font-semibold capitalize tracking-wider">
                    Module
                  </th>
                  <th className="py-4 z-10 px-2 border-r border-gray-400 text-left text-sm font-semibold capitalize tracking-wider">
                    Operation
                  </th>
                  {roles.map((role) => (
                    <th
                      key={role}
                      className="py-4 px-2 text-sm font-semibold text-center capitalize tracking-wider"
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {Object.entries(filteredModules).map(
                  ([moduleName, operations]) => (
                    <React.Fragment key={moduleName}>
                      {operations.map((operation, operationIndex) => (
                        <tr
                          key={`${moduleName}-${operation.name}`}
                          className={`${
                            operationIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          {operationIndex === 0 && (
                            <td
                              className="capitalize transition-all align-top py-4 px-2 text-sm text-gray-700 font-medium"
                              rowSpan={operations.length}
                            >
                              {moduleName.replaceAll("_", " ")}
                            </td>
                          )}
                          <td className="capitalize border-r border-gray-400 group-hover:bg-miles-100 transition-all text-nowrap py-4 px-2 text-sm text-gray-700 font-medium">
                            {operation.name.replaceAll("_", " ")}
                          </td>
                          {roles.map((role) => (
                            <td
                              key={`${moduleName}-${operation.name}-${role}`}
                              className="group-hover:bg-miles-100 transition-all text-center"
                            >
                              <div className="inline-flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                  <input
                                    type="checkbox"
                                    disabled={role === "superAdmin"}
                                    checked={operation.allowedRoles.includes(
                                      role
                                    )}
                                    onChange={() =>
                                      handlePermissionChange(
                                        moduleName,
                                        operation.name,
                                        role
                                      )
                                    }
                                    className={`${
                                      operation.allowedRoles.includes(role) ^
                                      clientInitialModules[moduleName]
                                        .find(
                                          (op) => op.name === operation.name
                                        )
                                        .allowedRoles.includes(role)
                                        ? " bg-green-600 border-2 border-green-600"
                                        : " checked:bg-miles-600 checked:border-miles-600"
                                    } peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 disabled:bg-gray-300 disabled:border-gray-300`}
                                  />
                                  <span
                                    className={`absolute text-white ${
                                      operation.allowedRoles.includes(role)
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
                      ))}
                    </React.Fragment>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex space-x-2">
            <div
              className="flex justify-between items-center rounded-md !border
								border-slate-300 text-md focus:outline-none transition-all duration-200
								focus:shadow-md bg-white px-3 py-0 w-full"
            >
              <input
                className="outline-none"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Operations..."
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
    </RootLayout>
  );
}
