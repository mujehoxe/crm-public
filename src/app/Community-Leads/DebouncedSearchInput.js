import { useCallback, useEffect, useRef, useState } from "react";

const DebouncedSearchInput = ({
  initialValue,
  onSearchChange,
  placeholder = "Search...",
  debounceTime = 300,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const debouncedSearchChange = useCallback(
    (value) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        onSearchChange(value);
      }, debounceTime);
    },
    [onSearchChange, debounceTime]
  );

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    debouncedSearchChange(value);
  };

  return (
    <input
      className="placeholder:text-opacity-50 outline-none w-full"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleInputChange}
    />
  );
};

export default DebouncedSearchInput;
