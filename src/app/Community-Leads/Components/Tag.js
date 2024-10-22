import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

export default function Tag({ tag, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(tag.isNew);
  const spanRef = useRef(null);

  useEffect(() => {
    if (isEditing && !tag.isDeleted && spanRef.current) {
      spanRef.current.focus();
      // Place cursor at the end of the text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(spanRef.current);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [isEditing]);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      spanRef.current.blur();
    }
  };

  function handleBlur() {
    return ({ target: { innerText } }) => {
      onChange(innerText);
      setIsEditing(false);
    };
  }

  return (
    <span
      onClick={handleClick}
      className={`group h-6 rounded-md p-1 truncate text-xs font-medium
        inline-flex items-center min-h-6 cursor-text ${
          tag.isNew
            ? "bg-green-100 text-green-700 group-focus-within:ring-green-500"
            : "bg-miles-50 text-miles-700 group-focus-within:ring-miles-500"
        } px-2 py-1 ring-1 ring-inset ring-miles-700/10
        ${isEditing ? "focus:ring-2 outline-none" : ""} ${
        tag.isDeleted ? "bg-red-100 line-through text-red-700" : ""
      }`}
    >
      <span
        ref={spanRef}
        contentEditable={isEditing && !tag.isDeleted}
        suppressContentEditableWarning={true}
        onCopy={(e) => {
          e.preventDefault();
          const selection = window.getSelection();
          const selectedText = selection ? selection.toString() : "";
          e.clipboardData.setData("text/plain", selectedText);
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = (e.clipboardData || window.clipboardData).getData(
            "text"
          );
          document.execCommand("insertText", false, text);
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur()}
        className={`outline-none`}
      >
        {tag.Tag}
      </span>
      {tag.isDeleted ? (
        <ArrowUturnLeftIcon
          onClick={(e) => {
            e.stopPropagation();
            onDelete(false);
          }}
          className="ml-2 !size-3 hidden text-center align-top rounded-full 
          group-hover:inline text-miles-500 hover:bg-miles-200 hover:text-miles-700"
        />
      ) : (
        <XMarkIcon
          onClick={(e) => {
            e.stopPropagation();
            onDelete(true);
          }}
          className="ml-2 !size-3 hidden text-center align-top rounded-full 
            group-hover:inline text-red-500 hover:bg-red-200 hover:text-red-700"
        />
      )}
    </span>
  );
}
