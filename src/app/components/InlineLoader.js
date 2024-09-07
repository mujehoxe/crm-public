function InlineLoader({ className, disableText }) {
  return (
    <div className={`inline-flex justify-center items-center ${className}`}>
      <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 4 5.373 4 12zm19.53 1.56L18 16.17V4h-.53a3 3 0 110 6z"
        ></path>
      </svg>
      {!disableText && <span className="ml-2">Loading...</span>}
    </div>
  );
}
export default InlineLoader;
