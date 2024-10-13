import { areSanctionImagesAvailable } from "./utils";

export default function ({ row }) {
  return (
    <div className="w-[120px]">
      {areSanctionImagesAvailable(row) || row.approved != 53 ? (
        <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-yellow-600">
          Pending
        </p>
      ) : (
        <p className="px-1 text-sm py-2 mb-0 w-content bg-white rounded-full text-center text-green-400">
          Done
        </p>
      )}
    </div>
  );
}
