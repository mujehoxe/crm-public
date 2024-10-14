export default function ({ row }) {
  return (
    <div className={`flex justify-center items-center`}>
      <p className="!mb-0 w-[100px]">
        {row?.Comission} {row?.ComissionType}
      </p>
    </div>
  );
}
