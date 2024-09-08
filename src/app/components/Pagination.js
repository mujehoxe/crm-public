import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/24/solid";

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push("...");

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage === totalPages) start = totalPages - 2;
      if (currentPage === 1) end = 3;

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <nav className="flex flex-auto items-center justify-between bg-white border-t border-gray-200 px-4 sm:px-0">
      <div className="flex flex-1">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="inline-flex items-center border-t-2 border-transparent pr-1 py-4 text-sm font-medium text-gray-500 hover:border-miles-600 hover:text-miles-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLongLeftIcon
            aria-hidden="true"
            className="mr-3 h-5 w-5 text-gray-400"
          />
          Previous
        </button>
      </div>
      {totalPages > 0 && (
        <div className="hidden md:-mt-px md:flex">
          {getPageNumbers().map((pageNumber, index) =>
            pageNumber === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`inline-flex items-center border-t-2 p-4 text-sm font-medium ${
                  currentPage === pageNumber
                    ? "border-miles-500 text-miles-500 font-semibold bg-miles-500/20"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-miles-700"
                }`}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>
      )}
      <div className="-mt-px flex flex-1 justify-end">
        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center border-t-2 border-transparent pl-1 py-4 text-sm font-medium text-gray-500 hover:border-miles-600 hover:text-miles-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ArrowLongRightIcon
            aria-hidden="true"
            className="ml-3 h-5 w-5 text-gray-400"
          />
        </button>
      </div>
    </nav>
  );
}
