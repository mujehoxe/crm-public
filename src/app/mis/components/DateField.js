export default function ({ row, index, field, setFilteredData }) {
  return (
    <div className="w-[130px]">
      {(!row[field.value] && field.type.alt && (
        <span className="text-green-600 uppercase font-medium">
          {field.type.alt}
        </span>
      )) || (
        <input
          value={row[field.value]}
          onKeyDown={(e) => e.preventDefault()}
          className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
          onChange={(e) => {
            setFilteredData((prev) => {
              const newData = [...prev];
              newData[index][field.value] = e.target.value;
              return newData;
            });
          }}
          type="date"
        />
      )}
    </div>
  );
}
