import axios from "axios";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Modal.module.css";

const DocumentModal = ({ isOpen, onClose, savedUser }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setSelectedFiles([...selectedFiles, ...acceptedFiles]);
    },
  });

  const handleRemoveFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };
  const handleUpload = async () => {
    try {
      setLoading(true);
      const promises = selectedFiles.map(async (file) => {
        const base64String = await fileToBase64(file);
        return { filename: file.name, data: base64String };
      });

      const fileContents = await Promise.all(promises);
      const response = await axios.post("/api/staff/document", {
        files: fileContents,
        userid: savedUser,
      });
      setSelectedFiles([]);
      toast.success("Upload successful");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error("Error uploading files");
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div>
      {isOpen && (
        <div className={styles.modalBackdrop}>
          <ToastContainer />
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={onClose}>
              &times;
            </span>
            <p className="text-center">
              {loading ? "processing" : "Add Documents"}
            </p>
            <div className="mt-4">
              <div>
                <div className="mb-4">
                  <div className="border rounded-md p-2" {...getRootProps()}>
                    <input {...getInputProps()} className="hidden" />
                    <div className="form-control text-gray-600">
                      Passport (Front & Back), Visa, Emirates ID, Passport Size
                      Photo, Attested Degree Certificate, Others
                    </div>
                  </div>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mb-4">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between mb-2"
                      >
                        <span>{file.name}</span>
                        <button
                          className="text-red-500 hover:text-red-700 font-medium text-sm"
                          onClick={() => handleRemoveFile(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mb-4">
                  <button
                    className="bg-miles-600 text-white hover:bg-miles-800 w-full py-2 rounded-md"
                    onClick={handleUpload}
                    disabled={loading || selectedFiles.length === 0}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentModal;
