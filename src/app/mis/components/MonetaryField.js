import { TbDatabaseEdit } from "react-icons/tb";

export default function ({ row, index, field, filteredData, setFilteredData }) {
  return (
    <div className={`flex justify-between items-center`}>
      <p className="!mb-0">
        {row[field.value] !== null && row[field.value] !== undefined
          ? row[field.value].toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : ""}
      </p>
      {field.editButton && (
        <button className={`text-slate-900`} onClick={() => toggleModal(index)}>
          <TbDatabaseEdit className={`text-xl text-slate-500`} />
        </button>
      )}
    </div>
  );
}
