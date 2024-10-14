import { IoMdDownload, IoMdEye } from "react-icons/io";

export default function ({ row, index, field }) {
  return (
    <div className="flex w-full justify-around gap-2">
      <IoMdEye
        className="!m-0 !border-0 cursor-pointer"
        onClick={() => {
          showImage(field, index);
        }}
      />
      <IoMdDownload
        className="!m-0 !border-0 cursor-pointer"
        onClick={() => {
          handleDownload(
            path + row[field.value].split("kyc/").pop(),
            "file.pdf"
          );
        }}
      />
    </div>
  );
}
