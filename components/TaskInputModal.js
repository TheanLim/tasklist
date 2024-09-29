import { useEffect, useState } from 'react';
import AutoResizeTextArea from './AutoResizeTextArea';

const TaskInputModal = ({ btnTxt, taskId, taskTitle, taskDetails, taskTags, taskStatus, handleEditTask }) => {
    const innerTaskId = taskId ? taskId : new Date().getTime();
    const innerTaskStatus = taskStatus ? taskStatus : 'pending';

    const [editedTask, setEditedTask] = useState({
        id: innerTaskId,
        title: taskTitle || "",
        details: taskDetails || "",
        tags: taskTags || [],
        status: innerTaskStatus
    });

    useEffect(() => {
        setEditedTask({
            id: innerTaskId,
            title: taskTitle || "",
            details: taskDetails || "",
            tags: taskTags || [],
            status: innerTaskStatus
        });
    }, [taskId, taskTitle, taskDetails, taskTags, taskStatus]);

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
        handleEditTask(editedTask);
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
                            <AutoResizeTextArea
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
                                value={editedTask.tags.join(', ')}
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
