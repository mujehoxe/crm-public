export default function ({ row, index, field, setFilteredData }) {
  return (
    <input
      value={row?.Property == "Apartment" ? "N/A" : row?.PlotNumber}
      className={`p-1 w-[100px] border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
      onChange={(e) => {
        setFilteredData((prev) => {
          const newData = [...prev];
          newData[index][field.value] = e.target.value;
          return newData;
        });
      }}
      disabled={row.Property == "Apartment"}
    />
  );
}
