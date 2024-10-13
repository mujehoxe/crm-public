import { NumericFormat } from "react-number-format";

export default function ({ row, index, field, filteredData, setFilteredData }) {
  return (
    <NumericFormat
      className={`p-1 w-[130px] border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
      value={parseFloat(String(row[field.value]).replace(/,/g, ""))
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      thousandSeparator=","
      onChange={(e) => {
        const newFilteredData = [...filteredData];
        newFilteredData[index] = {
          ...newFilteredData[index],
          [field.value]: e.target.value,
        };
        setFilteredData(newFilteredData);
      }}
    />
  );
}
