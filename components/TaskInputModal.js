import { useEffect, useRef, useState } from 'react';
import AutoResizeTextArea from './AutoResizeTextArea';

const TaskInputModal = ({ btnTxt, taskId, taskTitle, taskDetails, taskTags, taskStatus, handleEditTask }) => {
    const firstTextAreaRef = useRef(null);

    const innerTaskStatus = taskStatus ? taskStatus : 'pending';

    const [editedTask, setEditedTask] = useState({
        id: taskId,
        title: taskTitle || "",
        details: taskDetails || "",
        tags: taskTags || [],
        status: innerTaskStatus
    });

    useEffect(() => {
        setEditedTask({
            id: taskId,
            title: taskTitle || "",
            details: taskDetails || "",
            tags: taskTags || [],
            status: innerTaskStatus
        });
    }, [taskId, taskTitle, taskDetails, taskTags, taskStatus]);

    const openModal = () => {
        document.getElementById(taskId).showModal();
        firstTextAreaRef.current.focus();
    }

    const closeModal = () => {
        document.getElementById(taskId).close();
    };

    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleSubmit(e);
            e.stopPropagation(); // prevent propagate hotkey "Enter" to reopen the modal
            closeModal();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Remove any empty tags
        const cleanTags = editedTask.tags.filter(tag => tag);
        handleEditTask({ ...editedTask, tags: cleanTags });
        closeModal();
    };

    function trimWithTrailingSpace(str) {
        // Trim leading and trailing spaces; don't allow tags with empty spaces
        const trimmed = str.trimStart().trimEnd();
        const hasTrailingSpace = str.endsWith(' ');
        // If there was a trailing space, add it back
        // But only allow one empty space as a delimiter
        return hasTrailingSpace ? trimmed + ' ' : trimmed;
    }

    // Return an array of tags
    const processTagsInput = (input) => {
        // Doesn't allow starting empty string
        if (!input || input[0] === " ") return [];
        return trimWithTrailingSpace(input).split(' ')
    };

    return (
        <>
            <button className="btn btn-glass btn-sm btn-outline" onClick={openModal}>{btnTxt}</button>
            <dialog
                id={taskId}
                className="modal"
                onClick={(e) => {
                    // Trigger only if the click is directly on the dialog background
                    // Prevent clicking this when click in the Text/Input Areas
                    if (e.target === e.currentTarget) {
                        openModal();
                    }
                }}
            >
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">{taskTitle ? "Edit your task" : "Add a new task"}</h3>
                    <div className="modal-action">
                        <form method="dialog" className='space' onSubmit={handleSubmit}>
                            <AutoResizeTextArea
                                ref={firstTextAreaRef}
                                value={editedTask.title}
                                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                placeholder='Task title'
                                onKeyDown={handleKeyDown}
                                maxHeight={200}
                            />
                            <AutoResizeTextArea
                                value={editedTask.details}
                                onChange={(e) => setEditedTask({ ...editedTask, details: e.target.value })}
                                placeholder='Task details'
                                onKeyDown={handleKeyDown}
                                maxHeight={200}
                            />
                            <input
                                type="text"
                                value={editedTask.tags.join(' ')}
                                placeholder='Tags (space-separated)'
                                onChange={(e) => setEditedTask({ ...editedTask, tags: processTagsInput(e.target.value) })}
                                className="input input-sm input-bordered w-full"
                                onKeyDown={handleKeyDown}
                            />
                            <div className='flex py-5'>
                                <button
                                    type="submit"
                                    className="btn btn-sm bottom-2 ml-auto"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default TaskInputModal;
