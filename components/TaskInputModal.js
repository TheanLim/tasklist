import { useEffect, useState } from 'react';

const TaskInputModal = ({ btnTxt, taskId, taskTitle, taskDetails, taskTags, taskStatus, handleEditTask }) => {
    const innerTaskId = taskId ? taskId : new Date().getTime();
    const innerTaskStatus = taskStatus ? taskStatus : 'pending';

    // State to hold the task being edited
    const [editedTask, setEditedTask] = useState({
        id: innerTaskId,
        title: taskTitle || "",
        details: taskDetails || "",
        tags: taskTags || [],
        status: innerTaskStatus
    });

    // useEffect to update the state when editing a task
    useEffect(() => {
        setEditedTask({
            id: innerTaskId,
            title: taskTitle || "",
            details: taskDetails || "",
            tags: taskTags || [],
            status: innerTaskStatus
        });
    }, [taskId, taskTitle, taskDetails, taskTags, taskStatus]); // Runs when task properties change

    const closeModal = () => {
        document.getElementById(innerTaskId).close();
    };

    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleSubmit(e);
            closeModal();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleEditTask(editedTask); // Call the edit task handler with the current edited task
        // Reset the form after submission
        setEditedTask({
            id: innerTaskId,
            title: "",
            details: "",
            tags: [],
            status: innerTaskStatus
        });
        closeModal();
    };

    return (
        <>
            <button className="btn btn-glass btn-sm btn-outline" onClick={() => document.getElementById(innerTaskId).showModal()}>{btnTxt}</button>
            <dialog id={innerTaskId} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">{taskTitle ? "Edit your task" : "Add a new task"}</h3>
                    <div className="modal-action">
                        <form method="dialog" className='space' onSubmit={handleSubmit}>
                            <textarea
                                value={editedTask.title}
                                placeholder='Task title'
                                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                required
                                className="textarea textarea-sm textarea-bordered w-full"
                                onKeyDown={handleKeyDown}
                            />
                            <textarea
                                value={editedTask.details}
                                placeholder='Task details (use - for lists)'
                                onChange={(e) => setEditedTask({ ...editedTask, details: e.target.value })}
                                className="textarea textarea-sm textarea-bordered w-full"
                                onKeyDown={handleKeyDown}
                            />
                            <input
                                type="text"
                                value={editedTask.tags.join(', ')} // Join tags to show them in the input
                                placeholder='Tags (comma-separated)'
                                onChange={(e) => setEditedTask({ ...editedTask, tags: e.target.value.split(',').map(tag => tag.trim()) })}
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
