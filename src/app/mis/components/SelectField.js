export default function ({ row, index, field, filteredData, setFilteredData }) {
  return (
    <select
      className="w-[150px] h-8 p-1 rounded-md"
      onChange={(e) => {
        const newFilteredData = [...filteredData];
        newFilteredData[index][field.value] = e.target.value;
        setFilteredData(newFilteredData);
      }}
      defaultValue={row[field.value]}
    >
      <option>No Selection</option>
      {field.type.options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
