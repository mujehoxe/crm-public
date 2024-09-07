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
			className={`rounded-md p-1 max-w-[calc(100%-100px)] truncate text-xs font-medium
				inline-flex items-center bg-miles-50 px-2 py-1 text-miles-700 ring-1 ring-inset ring-miles-700/10
				${isEditing ? 'focus:ring-2 focus:ring-miles-500 outline-none' : ''}`}
		>
      {content}
    </span>);
};
