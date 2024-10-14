export default function ({ row, index, field, setFilteredData }) {
  return (
    <select
      className="w-[150px] h-8 p-1 rounded-md"
      onChange={(e) => {
        setFilteredData((prev) => {
          const newData = [...prev];
          newData[index][field.value] = e.target.value;
          return newData;
        });
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
