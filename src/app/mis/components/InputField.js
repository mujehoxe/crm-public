export default function ({ row, index, field, filteredData, setFilteredData }) {
  return (
    <input
      value={row[field.value]}
      className={`p-1 border-1 border-gray-800 rounded-md bg-[#F1F5F7]`}
      onChange={(e) => {
        const newFilteredData = [...filteredData];
        newFilteredData[index][field.value] = e.target.value;
        setFilteredData(newFilteredData);
      }}
      type="text"
    />
  );
}
