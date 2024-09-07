import {useEffect, useRef, useState} from "react";

export default function EditableSpan({content, onBlur}) {
	const [isEditing, setIsEditing] = useState(false);
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

	const handleClick = (e) => {
		e.stopPropagation();
		setIsEditing(true);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			spanRef.current.blur();
		}
	};

	return (<span
			ref={spanRef}
			onClick={handleClick}
			onBlur={({target: {innerText}}) => onBlur(innerText) || setIsEditing(false)}
			onKeyDown={handleKeyDown}
			contentEditable={isEditing}
			suppressContentEditableWarning={true}
			className={`text-sm text-gray-900 rounded-md p-1 inline-block max-w-[calc(100%-100px)] truncate bg-blue-100 ${isEditing ? 'focus:ring-2 focus:ring-blue-500 outline-none' : ''}`}
		>
      {content}
    </span>);
};
