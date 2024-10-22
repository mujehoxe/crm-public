import { XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaRegUserCircle } from "react-icons/fa";
import DocumentModal from "../components/doument";
import InlineLoader from "../components/InlineLoader";
import SearchableSelect from "../Leads/dropdown";

const Modal = ({ users, setUsers, onClose2: onClose, userdata }) => {
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
    { value: "BusinessHead", label: "Business Head" },
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
          formData.Role === "BusinessHead" ||
          formData.Role === "Marketing"
        ) {
          filteredUsers = users.filter((user) => user.Role === "superAdmin");
        } else if (formData.Role === "Strategist") {
          filteredUsers = users.filter((user) => user.Role === "BusinessHead");
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-xl w-full overflow-y-auto">
            <button
              className="text-gray-500 hover:text-gray-700 cursor-pointer absolute top-4 right-4"
              onClick={onClose}
              aria-label="Close"
            >
              <XMarkIcon className="size-6" />
            </button>

            <h4 className="text-lg font-semibold mb-4">
              {userdata ? "Update Staff" : "Add Staff"}
              {loading && <InlineLoader disableText={true} />}
            </h4>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-miles-500 w-full"
                  type="text"
                  placeholder="Name"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
                <input
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-miles-500 w-full"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <input
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-miles-500 w-full"
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
                <input
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-miles-500 w-full"
                  type="tel"
                  placeholder="Phone"
                  value={formData.Phone}
                  onChange={(e) =>
                    setFormData({ ...formData, Phone: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchableSelect
                  options={roleOptions}
                  defaultValue={formData.Role}
                  onChange={(selectedOption) =>
                    handleSelectChange("Role", selectedOption)
                  }
                  autoComplete="new-role"
                  placeholder="Role..."
                  className="w-full"
                />

                {formData.Role && (
                  <SearchableSelect
                    options={parentStaffOptions}
                    defaultValue={formData.PrentStaff}
                    onChange={(selectedOption) =>
                      handleSelectChange("PrentStaff", selectedOption)
                    }
                    placeholder="Parent Staff..."
                    className="w-full"
                  />
                )}
              </div>

              <div
                {...getRootProps()}
                className="p-4 border-2 border-dashed border-gray-300 rounded-md flex justify-between items-center gap-4"
              >
                <input {...getInputProps()} />
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">Click to select or</p>
                  <p className="text-sm text-gray-600">
                    Drag and drop an image here
                  </p>
                  <ArrowUpTrayIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50">
                  {formData.filePreview ? (
                    <img
                      src={formData.filePreview}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <FaRegUserCircle className="w-full h-full text-gray-300" />
                  )}
                </div>
              </div>

              <input
                className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-miles-500 w-full"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <button
                className={`w-full py-2 px-4 text-white rounded-md transition ${
                  loading
                    ? "bg-miles-300 cursor-not-allowed"
                    : "bg-miles-600 hover:bg-miles-500"
                }`}
                onClick={userdata ? handleUpdate : handleSubmit}
                disabled={loading}
              >
                {userdata ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDocumentModalOpen && (
        <DocumentModal
          isOpen={isDocumentModalOpen}
          onClose={() => setIsDocumentModalOpen(false)}
          savedUser={userid}
        />
      )}
    </>
  );
};

export default Modal;
