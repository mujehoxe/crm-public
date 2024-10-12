export default function RowFixedFields({ row, index }) {
  return (
    <td id="rowHeader" className={`!bg-[#F1F5F7] sticky left-0 z-[102] !mb-0`}>
      <div className="grid grid-cols-11 w-[480px] px-2 items-center">
        <p className="!mt-0 !mb-0 col-span-3">{index + 1}</p>
        <p className="truncate !mt-0 w-full text-nowrap col-span-4 !mb-0 overflow-x-hidden">
          {row?.Userid?.username}
          <br></br>
          {row?.Userid?.Phone}
        </p>
        <p className="!mt-0 text-wrap col-span-4 !mb-0">
          {row.Leadid?.Name}
          <br></br>
          <span className="font-semibold">Source: </span>
          {row.Leadid?.Source?.Source}
          <br></br>
          <span className="font-semibold">Added: </span>
          {row.Leadid?.timestamp}
        </p>
      </div>
    </td>
  );
}
