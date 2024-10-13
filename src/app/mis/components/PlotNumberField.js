export default function ({ row, index, field, filteredData, setFilteredData }) {
  return (
    <input
      value={row?.Property == "Apartment" ? "N/A" : row?.PlotNumber}
      className={`p-1 w-[100px] border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
      onChange={(e) => {
        const newFilteredData = [...filteredData];
        newFilteredData[index].PlotNumber = e.target.value;
        setFilteredData(newFilteredData);
      }}
      disabled={row.Property == "Apartment"}
    />
  );
}
