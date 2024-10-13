export default function ({ row, index, field, filteredData, setFilteredData }) {
  return (
    <input
      disabled
      className={`p-1 border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
      value={
        row?.loyaltyBonus
          ? (parseFloat(row[field.value]) - parseFloat(row?.loyaltyBonus))
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : parseFloat(row[field.value])
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    />
  );
}
