import { areSanctionImagesAvailable } from "./utils";

export default function ({ row }) {
  return (
    <div className="w-[120px]">
      {areSanctionImagesAvailable(row) ? (
        <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-green-400">
          Done
        </p>
      ) : row.approved == 53 ? (
        <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-green-400">
          Approved by Superadmin
        </p>
      ) : row.approved == 51 ? (
        <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-red-400">
          Rejected
        </p>
      ) : (
        <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-miles-400">
          Awaiting
        </p>
      )}
    </div>
  );
}
