export default function ({ row, index, field, setFilteredData }) {
  return (
    <div className="flex flex-col items-center gap-1 w-[130px]">
      <div className="flex items-center justify-start gap-1">
        <label className="!mb-0">Received?</label>
        <input
          className="p-1 disabled:!border-0 disabled:!bg-[#F1F5F7]"
          type="checkbox"
          checked={row[field.value] == 1}
          onChange={(e) => {
            setFilteredData((prev) => {
              const newData = [...prev];
              newData[index][field.value] = e.target.checked ? 1 : 0;
              return newData;
            });
          }}
        />
      </div>

      <div>
        {row[field.value] == 1 ? (
          <p className="!mb-0 bg-white text-green-500 !mt-0 text-center px-2 py-2 rounded-full">
            Paid
          </p>
        ) : (
          <p className="!mb-0 !mt-0 text-red-500 px-2 bg-white py-2 text-center rounded-full">
            Not Paid
          </p>
        )}
      </div>
    </div>
  );
}
