import { forwardRef, useEffect, useRef } from 'react';

const AutoResizeTextArea = forwardRef(({ value, onChange, placeholder, onKeyDown, maxHeight }, ref) => {
    const textareaRef = useRef(null);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    useEffect(() => {
        if (ref) {
            ref.current = textareaRef.current;
        }
    }, [ref]);

    const handleFocus = () => {
        if (textareaRef.current) {
            const length = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(length, length); // Move cursor to the end
        }
    };

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            className="textarea textarea-sm textarea-bordered w-full resize-y"
            style={{ overflow: 'auto' }}
        />
    );
});

export default AutoResizeTextArea;
