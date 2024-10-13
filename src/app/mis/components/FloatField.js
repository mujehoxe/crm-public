import { NumericFormat } from "react-number-format";

export default function ({ row, index, field, filteredData, setFilteredData }) {
  return (
    <NumericFormat
      value={row?.BUA}
      thousandSeparator=","
      className={`p-1 w-[130px] border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
      onChange={(e) => {
        const newFilteredData = [...filteredData];
        newFilteredData[index].BUA = e.target.value;
        setFilteredData(newFilteredData);
      }}
    />
  );
}
