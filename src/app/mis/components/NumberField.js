import { NumericFormat } from "react-number-format";

export default function ({ row, index, field, setFilteredData }) {
  return (
    <NumericFormat
      value={row[field.value]}
      decimalScale={0}
      allowNegative={false}
      className={`p-1 w-[100px] border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
      onChange={(e) => {
        setFilteredData((prev) => {
          const newData = [...prev];
          newData[index][field.value] = parseInt(e.target.value, 10);
          return newData;
        });
      }}
    />
  );
}
