import { useEffect, useRef } from 'react';

const AutoResizeTextArea = ({ value, onChange, placeholder, onKeyDown, maxHeight }) => {
    const textareaRef = useRef(null);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height to auto to calculate the new height
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`; // Set height based on content or maxHeight
        }
    };

    useEffect(() => {
        adjustHeight(); // Adjust height on value change
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            className="textarea textarea-sm textarea-bordered w-full resize-y" // Allow vertical resizing
            style={{ overflow: 'auto' }}
        />
    );
};

export default AutoResizeTextArea;
