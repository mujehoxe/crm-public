import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaRegUserCircle } from "react-icons/fa";
import DocumentModal from "../components/doument";
import SearchableSelect from "../Leads/dropdown";
import styles from "../Modal.module.css";

const Modal = ({ users, setUsers, onClose2, userdata }) => {
  const [showModal, setShowModal] = useState(true);
  const [parentStaffOptions, setParentStaffOptions] = useState([]);
  const [userid, setuserid] = useState(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const roleOptions = [
    { value: "Individuals", label: "Individuals" },
    { value: "Admin", label: "Admin" },
    { value: "Marketing", label: "Marketing" },
    { value: "Manager", label: "Manager" },
    { value: "Employee", label: "Employee" },
    { value: "Finance", label: "Finance" },
    { value: "Operations", label: "Operations" },
    { value: "HR", label: "Human Resource" },
    { value: "BussinessHead", label: "Bussiness Head" },
    { value: "Strategist", label: "Strategist & Operations" },
    { value: "PNL", label: "PNL" },
    { value: "TL", label: "TL" },
    { value: "ATL", label: "ATL" },
    { value: "FOS", label: "FOS" },
  ];

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    personalemail: "",
    Phone: "",
    Role: "",
    password: "",
    file: null,
    filePreview: null,
    PrentStaff: "",
  });

  useEffect(() => {
    if (userdata)
      setFormData({
        username: userdata.username || "",
        email: userdata.email || "",
        personalemail: userdata.personalemail || "",
        Phone: userdata.Phone || "",
        Role: userdata.Role || "",
        password: userdata.password || "",
        file: userdata.Avatar || null,
        filePreview:
          (process.env.NEXT_PUBLIC_BASE_URL || "") + userdata.Avatar || null,
        PrentStaff: userdata.PrentStaff || "",
      });
  }, [userdata]);

  const handleSelectChange = (field, selectedOption) => {
    setFormData((prevrole) => ({
      ...prevrole,
      [field]: selectedOption?.value
        ? selectedOption?.value
        : selectedOption || "",
    }));
  };

  useEffect(() => {
    const filterUsers = async () => {
      try {
        let filteredUsers = [];

        if (formData.Role === "Admin" || formData.Role === "Individuals") {
          filteredUsers = users.filter((user) => user.Role === "superAdmin");
        } else if (
          formData.Role === "Finance" ||
          formData.Role === "Operations" ||
          formData.Role === "HR" ||
          formData.Role === "BussinessHead" ||
          formData.Role === "Marketing"
        ) {
          filteredUsers = users.filter((user) => user.Role === "superAdmin");
        } else if (formData.Role === "Strategist") {
          filteredUsers = users.filter((user) => user.Role === "BussinessHead");
        } else if (formData.Role === "Employee") {
          filteredUsers = users.filter((user) => user.Role === "Individuals");
        } else if (formData.Role === "Manager") {
          filteredUsers = users.filter((user) => user.Role === "Admin");
        } else {
          const selectedRoleIndex = roleOptions.findIndex(
            (option) => option.value === formData.Role
          );
          filteredUsers = users.filter((user) => {
            const userRoleIndex = roleOptions.findIndex(
              (option) => option.value === user.Role
            );
            return userRoleIndex === selectedRoleIndex - 1; // Show only users with roles one level above the selected role
          });
        }

        const mappedUsers = filteredUsers.map((user) => ({
          value: user._id,
          label: user.username,
        }));
        setParentStaffOptions(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (formData.Role) filterUsers();
  }, [formData.Role]);

  const [loading, setLoading] = useState(false);

  function imageInputChange(acceptedFiles) {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prevData) => ({
        ...prevData,
        file: file,
        filePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      imageInputChange(acceptedFiles);
    },
    onChange: (acceptedFiles) => {
      imageInputChange(acceptedFiles);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageData = formData.filePreview?.split(",")[1];
      const response = await axios.post("/api/staff/add", {
        ...formData,
        image: imageData,
        PrentStaff: formData.PrentStaff, // Use PrentStaff as the key
      });
      setuserid(response.data.savedUser._id);
      setShowModal(false); // Close the Modal
      setIsDocumentModalOpen(true);
      setUsers((prevUsers) => [...prevUsers, response.data.savedUser]);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let imageData;
      if (formData.filePreview) {
        imageData = formData.filePreview.split(",")[1];
      } else {
        imageData = userdata.Avatar;
      }

      const response = await axios.put(`/api/staff/update/${userdata._id}`, {
        ...formData,
        image: imageData,
        PrentStaff: formData.PrentStaff, // Use PrentStaff as the key
      });
      setuserid(response.data.savedUser._id);
      setShowModal(false); // Close the Modal
      setIsDocumentModalOpen(true);
      setUsers((prevUsers) => [...prevUsers, response.data.savedUser]); // Update the list of users
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent + " p-4 ml-20 max-h-screen"}>
            <span className={styles.closeButton} onClick={onClose2}>
              &times;
            </span>
            <h4>{userdata ? "Update Staff" : "Add Staff"}</h4>
            {loading && <h5>Processing...</h5>}
            <div className="card-body mt-4 p-0">
              <div className="">
                <div className="row">
                  <div className="mb-4 col-sm-12 col-xl-6">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Name"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-4 col-sm-12 col-xl-6">
                    <input
                      className="form-control"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-4 col-sm-12 col-xl-6">
                    <input
                      className="form-control"
                      type="email"
                      placeholder="Personal Email"
                      value={formData.personalemail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          personalemail: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-4 col-sm-12 col-xl-6">
                    <input
                      className="form-control"
                      type="tel"
                      placeholder="Phone"
                      value={formData.Phone}
                      onChange={(e) =>
                        setFormData({ ...formData, Phone: e.target.value })
                      }
                    />
                  </div>

                  <div className={`mb-4 ${formData.Role ? "col-6" : "col-12"}`}>
                    <SearchableSelect
                      options={roleOptions}
                      defaultValue={formData.Role}
                      onChange={(selectedOption) =>
                        handleSelectChange("Role", selectedOption)
                      }
                      autoComplete="new-role"
                      name={`${Math.random().toString(36).substr(2, 10)}`}
                      placeholder="Role..."
                    />
                  </div>
                  {formData.Role && formData.PrentStaff && (
                    <div className="mb-4 col-sm-12 col-xl-6">
                      <SearchableSelect
                        options={parentStaffOptions}
                        defaultValue={formData.PrentStaff}
                        onChange={(selectedOption) =>
                          handleSelectChange("PrentStaff", selectedOption)
                        }
                        placeholder="Parent Staff..."
                      />
                    </div>
                  )}

                  <div className="mb-4 col-12">
                    <div
                      className="input-group p-4 flex items-center justify-around gap-x-4 rounded-md border-2 border-miles-200 border-dashed"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <div className="my-auto flex flex-col space-y-2 items-center">
                        <span>Click to select or,</span>
                        <span>
                          Drag and drop an image here, or click to select image
                        </span>
                        <ArrowUpTrayIcon className="size-6" />
                      </div>
                      <div
                        className="size-40 my-auto object-cover overflow-hidden border-2 border-miles-100 bg-gray-50"
                        style={{ borderRadius: "9999px" }}
                      >
                        {formData.filePreview ? (
                          <img
                            src={formData.filePreview}
                            className="size-full object-cover rounded-full"
                            alt="Preview"
                          />
                        ) : (
                          <FaRegUserCircle className="size-full text-gray-300" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 col-12">
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>

                  <div className="">
                    {userdata ? (
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleUpdate}
                        disabled={loading}
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        {isDocumentModalOpen && (
          <DocumentModal
            isOpen={isDocumentModalOpen}
            onClose={() => setIsDocumentModalOpen(false)}
            savedUser={userid}
          />
        )}
      </div>
    </>
  );
};

export default Modal;
