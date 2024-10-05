import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

export default function EditableSpan({ content, onBlur, onDelete, newTag }) {
  const [isEditing, setIsEditing] = useState(newTag);
  const [isDeleted, setIsDeleted] = useState(false);
  const spanRef = useRef(null);

  useEffect(() => {
    if (isEditing && spanRef.current) {
      spanRef.current.focus();
      // Place cursor at the end of the text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(spanRef.current);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [isEditing]);

  useEffect(() => {
    setIsDeleted(false);
    setIsEditing(newTag);
  }, [content, newTag]);

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

  return (
    <span
      ref={spanRef}
      onClick={handleClick}
      onBlur={({ target: { innerText } }) =>
        onBlur(innerText) || setIsEditing(false)
      }
      onKeyDown={handleKeyDown}
      contentEditable={isEditing && !isDeleted}
      suppressContentEditableWarning={true}
      className={`group h-6 rounded-md p-1 truncate text-xs font-medium
				inline-flex items-center min-h-6 ${
          newTag
            ? "bg-green-100 text-green-700 focus:ring-green-500"
            : "bg-miles-50 text-miles-700 focus:ring-miles-500"
        }  px-2 py-1 ring-1 ring-inset ring-miles-700/10
				${isEditing ? "focus:ring-2 outline-none" : ""} ${
        isDeleted && "bg-red-100 line-through text-red-700"
      }`}
    >
      <span className="cursor-text">{content}</span>
      <XMarkIcon
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
          setIsDeleted(true);
        }}
        className={`ml-2 !size-3 hidden text-center align-top rounded-full ${
          !isEditing && !newTag && "group-hover:inline"
        } text-red-500 hover:bg-red-200 hover:text-red-700`}
      />
    </span>
  );
}
