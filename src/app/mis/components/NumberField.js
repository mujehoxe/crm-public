import { NumericFormat } from "react-number-format";

export default function ({ row, index, field, filteredData, setFilteredData }) {
  return (
    <NumericFormat
      value={row[field.value]}
      decimalPrecision={0}
      thousandSeparator=","
      className={`p-1 w-[100px] border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
      onChange={(e) => {
        const newValue = e.target.value.replace(/[^0-9]/g, "");
        if (newValue !== "") {
          const newFilteredData = [...filteredData];
          newFilteredData[index][field.value] = parseInt(newValue, 10);
          setFilteredData(newFilteredData);
        }
      }}
      onBlur={(e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (value === "") {
          const newFilteredData = [...filteredData];
          newFilteredData[index][field.value] = "";
          setFilteredData(newFilteredData);
        }
      }}
    />
  );
}
