import axios from "axios";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Modal.module.css";
import SearchableSelect from "./dropdown";

const Excelmodal = ({ onClose, onParse }) => {
  const [StatusCount, setStatusCount] = useState([]);
  const [options1, setoptions1] = useState([]);
  const [SourceCount, setSourceCount] = useState([]);
  const [options2, setoptions2] = useState([]);
  const [excel, setexcel] = useState({
    file: null,
    data: null,
    LeadStatus: "",
    Source: "",
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result; // Read the file content
        setexcel((prevData) => ({
          ...prevData,
          file: fileContent, // Set the file content to the 'file' property
        }));
      };
      reader.readAsDataURL(file);
    },
  });

  const parseCSV = () => {
    if (!excel.file) {
      console.error("No file selected");
      return;
    }
    const csvData = excel.file.split(",")[1]; // Get the base64-encoded CSV data
    const decodedData = atob(csvData); // Decode base64 to CSV string
    const parsedData = Papa.parse(decodedData, { header: true }).data; // Parse CSV data
    setexcel((prevData) => ({
      ...prevData,
      data: parsedData,
    }));

    onParse(parsedData); // Pass parsed data to parent component
    onClose(); // Close the modal
  };

  const handleSubmit = async () => {
    try {
      if (!excel.file) {
        console.error("No file selected");
        return;
      }

      const imageData = excel.file.split(",")[1];
      const response = await axios.post("api/Lead/excel", {
        ...excel,
        file: imageData,
      });
      toast.success("Excel Upload successful");
      console.log(response.data);
      onClose();
    } catch (error) {
      toast.error("Error uploading files");
      console.error("Error uploading file:", error);
      // Handle error (e.g., show an error message)
    }
  };

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
    const newOptions1 = StatusCount.map((StatusCount) => ({
      value: StatusCount._id,
      label: StatusCount.Status,
    }));
    setoptions1(newOptions1);
  }, [StatusCount]);

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
    const newOptions2 = SourceCount.map((SourceCount) => ({
      value: SourceCount._id,
      label: SourceCount.Source,
    }));
    setoptions2(newOptions2);
  }, [SourceCount]);

  const handleSelectChange = (property, selectedOption) => {
    setexcel((prevLeads) => ({
      ...prevLeads,
      [property]: selectedOption.value,
    }));
  };

  return (
    <div
      className={`${styles.modalBackdrop} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}
    >
      <ToastContainer />

      <div
        className={`${styles.modalContent} bg-white rounded-lg p-6 shadow-lg max-w-lg w-full`}
      >
        {/* Close Button */}
        <span
          className={`${styles.closeButton} absolute top-4 right-4 text-2xl cursor-pointer`}
          onClick={onClose}
        >
          &times;
        </span>

        <h4 className="text-xl font-semibold mb-4">Upload CSV File</h4>

        <div className="card-body mt-4 space-y-6">
          {/* Status & Source Select */}
          <div className="flex space-x-4">
            <SearchableSelect
              className="relative w-full"
              options={options1}
              onChange={(selectedOption) =>
                handleSelectChange("LeadStatus", selectedOption)
              }
              placeholder="Status..."
            />
            <SearchableSelect
              className="relative w-full"
              options={options2}
              onChange={(selectedOption) =>
                handleSelectChange("Source", selectedOption)
              }
              placeholder="Source..."
            />
          </div>

          {/* CSV Upload Input */}
          <div
            {...getRootProps()}
            className="border border-gray-300 rounded-md p-4 cursor-pointer"
          >
            <input {...getInputProps()} />
            <p className="text-center text-gray-500">
              Drag 'n' drop a CSV file here, or click to select file
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-4">
            <button
              className="w-full px-6 py-1 text-white bg-miles-600 rounded-md hover:bg-miles-700 focus:outline-none focus:ring-2 focus:ring-miles-500 transition-all"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="w-full px-6 py-1 text-white bg-miles-600 rounded-md hover:bg-miles-700 focus:outline-none focus:ring-2 focus:ring-miles-500 transition-all"
              onClick={parseCSV}
            >
              Simulate Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Excelmodal;
