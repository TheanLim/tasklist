import Markdown from 'markdown-to-jsx'; // Importing markdown-to-jsx
import TaskInputModal from './TaskInputModal';

const DOT_TAG = ".";

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

  const toggleDotTag = () => {
    // Check if the DOT_TAG is already in taskTags
    if (!taskTags.includes(DOT_TAG)) {
      taskTags.push(DOT_TAG);
    } else {
      // Remove existing DOT_TAG if it's already in taskTags
      taskTags = taskTags.filter(tag => tag !== DOT_TAG);
    }
    handleEditTask({
      id: taskId,
      title: taskTitle,
      details: taskDetails,
      tags: taskTags,
      status: taskStatus
    }, true);
  }

  const handleHotKey = (e) => {
    if (document.getElementById(taskId).open) return;
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
    if (e.key === 'e' || e.key === 'Enter') {
      // edit a task
      e.preventDefault();
      document.getElementById(taskId).click();
    }
    if (e.key === 'd') {
      // delete a task
      handleDelete([taskId])
    }
    if (e.key === 'g') {
      toggleDotTag();
    }
  };

  return (
    <div
      className='collapse collapse-plus bg-base-200 text-base-content'
      onDoubleClick={() => document.getElementById(taskId).click()}
      onKeyDown={handleHotKey}
    >
      <input type="radio" name="my-accordion-3" defaultChecked={isOpen} />
      <div className={`flex gap-x-3 collapse-title text-xl font-medium font-mono ${taskStatus === 'completed' ? 'line-through' : ''}`}>
        {taskTags.includes(".") && <button className='btn btn-xs btn-circle btn-info' />}
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