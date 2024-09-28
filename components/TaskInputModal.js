import { useState } from 'react';

const TaskInputModal = ({ btnTxt, taskId, taskTitle, taskDetails, taskTags, taskStatus, handleEditTask }) => {
    const innerTaskId = taskId ? taskId : new Date().getTime();
    const innerTaskStatus = taskStatus ? taskStatus : 'pending';
    const [editedTask, setEditedTask] = useState({
        id: innerTaskId,
        title: taskTitle,
        details: taskDetails,
        tags: taskTags,
        status: innerTaskStatus
    });

    const closeModal = () => {
        document.getElementById(innerTaskId).close();
    };

    const handleKeyDown = (e) => {
        // Check if Ctrl (or Cmd on Mac) and Enter are pressed
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleSubmit(e);
            closeModal(); // Close modal on Ctrl+Enter or Cmd+Enter
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleEditTask(editedTask); // Call the edit task handler with the current edited task
    };

    return (
        <>
            <button className="btn btn-glass btn-sm btn-outline" onClick={() => document.getElementById(innerTaskId).showModal()}>{btnTxt}</button>
            <dialog id={innerTaskId} className="modal">
                {/* Close by X or ESC */}
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    {/* Edit */}
                    <h3 className="font-bold text-lg">{taskTitle ? "Edit your task" : "Add a new task"}</h3>
                    <div className="modal-action">
                        <form method="dialog" className='space' onSubmit={(e) => {
                            handleSubmit(e);
                            closeModal(); // Close modal on regular submit
                        }}>
                            <textarea
                                value={editedTask && editedTask.title}
                                placeholder='Task title'
                                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                required
                                className="textarea textarea-sm textarea-bordered w-full"
                                onKeyDown={handleKeyDown} // Add this to capture Ctrl/Cmd + Enter
                            />
                            <textarea
                                value={editedTask && editedTask.details}
                                placeholder='Task details'
                                onChange={(e) => setEditedTask({ ...editedTask, details: e.target.value })}
                                className="textarea textarea-sm textarea-bordered w-full"
                                onKeyDown={handleKeyDown} // Add this to capture Ctrl/Cmd + Enter
                            />
                            <input
                                type="text"
                                value={editedTask && editedTask.tags}
                                placeholder='Tags (comma-separated)'
                                onChange={(e) => setEditedTask({ ...editedTask, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                className="input input-sm input-bordered w-full"
                                onKeyDown={handleKeyDown} // Add this to capture Ctrl/Cmd + Enter
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
