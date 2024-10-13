import { NumericFormat } from "react-number-format";

export default function ({ row, index, field, filteredData, setFilteredData }) {
  return (
    <div className="w-[200px]">
      <NumericFormat
        className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
        thousandSeparator=","
        value={field.type.name === "totalPercentComission" && eval(field.value)}
        disabled
      />
    </div>
  );
}
