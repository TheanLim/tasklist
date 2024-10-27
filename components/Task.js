import Markdown from 'markdown-to-jsx'; // Importing markdown-to-jsx
import TaskInputModal from './TaskInputModal';

const Task = ({ taskId, taskTitle, taskDetails, taskTags, taskStatus, selectedTag, handleDelete, handleClickTag, handleEditTask, isOpen }) => {

  const toggleComplete = () => {
    const newStatus = taskStatus === 'pending' ? 'completed' : 'pending';
    handleEditTask({
      id: taskId,
      title: taskTitle,
      details: taskDetails,
      tags: taskTags,
      status: newStatus
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'r') {
      // Simply refresh and move it down
      handleEditTask({
        id: taskId,
        title: taskTitle,
        details: taskDetails,
        tags: taskTags,
        status: taskStatus
      });
    }
    if (e.key === 'c') {
      // complete a task
      toggleComplete();
    }
    if (e.key === 'e') {
      // edit a task
      document.getElementById(taskId).showModal()
    }
    if (e.key === 'd') {
      // delete a task
      handleDelete([taskId])
    }
  };

  return (
    <div
      className='collapse collapse-plus bg-base-200 text-base-content'
      // onDoubleClick={toggleComplete}
      onKeyDown={handleKeyDown}
    >
      <input type="radio" name="my-accordion-3" defaultChecked={isOpen} />
      <div className={`collapse-title text-xl font-medium font-mono ${taskStatus === 'completed' ? 'line-through' : ''}`}>
        {taskTitle}
      </div>
      <div className="collapse-content">
        <div className='flex'>
          <div className='grow prose leading-tight'>
            <Markdown>{taskDetails}</Markdown>
          </div>
          <div className='ml-auto flex flex-col items-center'>
            <TaskInputModal
              btnTxt={'EDIT'}
              taskId={taskId}
              taskTitle={taskTitle}
              taskDetails={taskDetails}
              taskTags={taskTags}
              taskStatus={taskStatus}
              handleEditTask={handleEditTask} />
            <button
              onClick={() => handleDelete([taskId])}
              className="btn btn-circle btn-outline btn-sm btn-error my-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className='flex gap-2'>
          {taskTags && taskTags.length > 0 && taskTags.map(tag => (
            <button className="btn border-indigo-500 btn-xs rounded-full" key={tag} onClick={() => handleClickTag(selectedTag === tag ? null : tag)}>{tag}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Task