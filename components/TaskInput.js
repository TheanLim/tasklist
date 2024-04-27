import React from 'react'

const TaskInput = ({addTask}) => {
  return (
    <form
        onSubmit={e => {
          e.preventDefault();
          const title = e.target.title.value;
          const tags = e.target.tags.value;
          addTask(title, tags);
          e.target.reset();
        }}
      >
        <input type="text" name="title" placeholder="Enter task name" required className="input input-sm input-bordered w-full max-w-xs"  />
        <input type="text" name="tags" placeholder="Enter tags (comma-separated)" className="input input-sm input-bordered w-full max-w-xs" />
        <button type="submit" style={{ display: "none" }}> Hidden Button to Add Task</button>
    </form>
  )
}

export default TaskInput