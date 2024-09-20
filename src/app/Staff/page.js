"use client";
import axios from "axios";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import DocumentModal from "../components/doument";
import RootLayout from "../components/layout";
import Modal from "./modal";
import {
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Pagination from "@/app/components/Pagination";
import { FaRegUserCircle } from "react-icons/fa";

export default function Staff() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPerPage, setUserPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  const toggleModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/staff/get");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDocumentModal = (e, userId) => {
    setIsDocumentModalOpen(!isDocumentModalOpen);
    setSelectedUserId(userId);
  };

  const indexOfLastUser = currentPage * userPerPage;
  const indexOfFirstUser = indexOfLastUser - userPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const deleteUser = async (e, userId) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure you want to delete this user?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) {
      return; // User canceled the deletion
    }
    try {
      await axios.delete(`/api/staff/delete/${userId}`);
      setUsers(currentUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("There was an error deleting the user!", error);
    }
  };

  return (
    <RootLayout>
      {isModalOpen && (
        <Modal
          users={users}
          setUsers={setUsers}
          userdata={selectedUser}
          onClose2={toggleModal}
        />
      )}{" "}
      {isDocumentModalOpen && (
        <DocumentModal
          isOpen={isDocumentModalOpen}
          onClose={toggleDocumentModal}
          savedUser={selectedUserId}
        />
      )}
      <div className="container mx-auto h-screen">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto w-full !min-w-[300px]">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Staff Members
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all staff members including their name, email, phone,
              role, and associated documents.
            </p>
          </div>
          <div className="sm:ml-16 w-[calc(100%-500px)] sm:flex-none">
            <div className="flex space-x-2">
              <div
                className="flex justify-between items-center rounded-md !border
								border-slate-300 text-lg focus:outline-none transition-all duration-200
								focus:shadow-md bg-white px-3 py-1 w-full"
              >
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                />
                <MagnifyingGlassIcon className="size-[18px]" />
              </div>
              <button
                className="btn text-nowrap btn-primary disabled:bg-gray-400"
                onClick={() => toggleModal()}
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
        <div className="border mb-6 rounded-lg overflow-hidden shadow border-gray-200">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pr-3 mt-2 text-left text-sm font-semibold text-gray-900 pl-4 sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 mt-2 text-left text-sm font-semibold text-gray-900"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 mt-2 text-left text-sm font-semibold text-gray-900"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 mt-2 text-left text-sm font-semibold text-gray-900"
                  >
                    Documents
                  </th>
                  <th scope="col" className="relative py-3.5 pr-4 sm:pr-6" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentUsers.map((user) => (
                  <tr className="hover:bg-gray-50" key={user._id}>
                    <td className="whitespace-nowrap py-4 pr-3 text-sm sm:pl-0">
                      <div className="flex pl-4 sm:pl-6 items-center">
                        <div className="size-10 bg-gray-200 group-hover:bg-miles-300 overflow-hidden rounded-full flex justify-center items-center">
                          {user.Avatar ? (
                            <img
                              className="size-10 object-cover"
                              src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${
                                user.Avatar
                              }`}
                              alt={"Avatar"}
                            />
                          ) : (
                            <FaRegUserCircle />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {user.username}
                          </div>
                          <div className="mt-1 text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.Phone}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.Role}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.documents ? (
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            className="rounded-md bg-miles-50 px-3 py-2 text-sm font-semibold text-miles-600 shadow-sm hover:bg-miles-100"
                            id={`dropdown-button-${user._id}`}
                            aria-expanded="true"
                            aria-haspopup="true"
                          >
                            Select
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500">No documents</span>
                      )}
                    </td>
                    <td>
                      <div className="relative flex py-4 h-full justify-around items-center pr-4 sm:pr-6	">
                        <div className="p-1 rounded-full text-miles-600 hover:text-miles-900 bg-miles-50 hover:bg-miles-200">
                          <ArrowUpTrayIcon
                            onClick={() => toggleDocumentModal(user._id)}
                            className="size-5 cursor-pointer"
                          />
                        </div>
                        <div className="p-1 rounded-full text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-200">
                          <PencilSquareIcon
                            onClick={() => toggleModal(user)}
                            className="size-5 cursor-pointer"
                          />
                        </div>
                        <div className="p-1 rounded-full text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-200">
                          <TrashIcon
                            onClick={(e) => deleteUser(e, user._id)}
                            className="size-5 cursor-pointer"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <span className="text-sm text-gray-700">
          Showing {}
          <b>
            {Math.min(userPerPage, filteredUsers.length)} user
            {filteredUsers.length !== 1 && "s"},{" "}
          </b>
          from {}
          {filteredUsers.length > 1 && (
            <>
              <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastUser, filteredUsers.length)}
              </span>{" "}
              of{" "}
            </>
          )}
          <span className="font-medium">{filteredUsers.length}</span> result
          {filteredUsers.length !== 1 && "s"}
        </span>

        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={Math.ceil(filteredUsers.length / userPerPage)}
        />
      </div>
    </RootLayout>
  );
}
