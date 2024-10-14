export default function ({ row, index, field, setFilteredData }) {
  return (
    <input
      value={row[field.value]}
      className={`p-1 border-1 border-gray-800 rounded-md bg-[#F1F5F7]`}
      onChange={(e) => {
        setFilteredData((prev) => {
          const newData = [...prev];
          newData[index][field.value] = e.target.value;
          return newData;
        });
      }}
      type="text"
    />
  );
}
