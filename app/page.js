'use client'
import { SearchContext } from '@/context/SearchContext';
import { useContext, useEffect, useState } from 'react';
import Task from '../components/Task';
import TaskInputModal from '../components/TaskInputModal';
import useConfirm from '../components/UseConfirm';
import search from './search';

const Home = () => {
  const { searchQuery } = useContext(SearchContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [newTaskId, setNewTaskId] = useState(null);

  const [ConfirmDialogDeleteTask, confirmDeleteTask] = useConfirm(
    "Delete this task?",
    "You are about to delete this task. This action is irreversible",
  );

  const [ConfirmDialogDeleteTag, confirmDeleteTag] = useConfirm(
    "Delete this tag?",
    "You are about to remove this tag from every task. This action is irreversible",
  );

  const sortTasks = (tasks) => {
    sortTasks.sort((a, b) => b.latestUpdateTime - a.latestUpdateTime);
  }

  useEffect(() => {
    // Load tasks from localStorage on component mount
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);

    setNewTaskId(new Date().getTime());
  }, []);

  // Function to update tasks in state and local storage
  const updateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTasks = async (taskIds) => {
    const ok = await confirmDeleteTask();
    if (!ok) return;

    const updatedTasks = tasks.filter(task => !taskIds.includes(task.id));
    updateTasks(updatedTasks);
  };

  const handleEditOrNewTask = (editOrNewTask, maintainPosition) => {
    const taskIndex = tasks.findIndex(task => task.id === editOrNewTask.id);
    const unaffectedTasks = tasks.filter(task => task.id !== editOrNewTask.id);

    editOrNewTask = removeDuplicateTags(editOrNewTask);
    editOrNewTask = { ...editOrNewTask, latestUpdateTime: new Date().getTime() };

    // Put task back to where it was if maintainPosition
    // else append to the end
    const updatedTasks = maintainPosition && taskIndex !== -1
      ? [...unaffectedTasks.slice(0, taskIndex), editOrNewTask, ...unaffectedTasks.slice(taskIndex)]
      : [...unaffectedTasks, editOrNewTask];

    updateTasks(updatedTasks);
    setNewTaskId(new Date().getTime());
  };

  const removeDuplicateTags = (task) => {
    if (task.tags && Array.isArray(task.tags)) {
      task.tags = [...new Set(task.tags)];
    }
    return task;
  };

  const handleRemoveTag = async (tagToRemove) => {
    const ok = await confirmDeleteTag()
    if (!ok) return;

    const updatedTasks = tasks.map(task => ({
      ...task,
      tags: task.tags ? task.tags.filter(tag => tag !== tagToRemove) : []
    }));
    updateTasks(updatedTasks);
  };


  ///// FILTER TASKS ///////
  // Filter tasks using task title/details/tags based on the searchQuery
  let searchedTasks = tasks;
  if (searchQuery !== "") {
    searchedTasks = search(searchQuery, tasks);
  }

  // Function to filter tasks based on selected tag
  let filteredTasks = selectedTag
    ? searchedTasks.filter(task => task.tags?.includes(selectedTag))
    : searchedTasks;

  // Calculate the counts for each status
  const totalCount = filteredTasks.length;
  const pendingCount = filteredTasks.filter(task => task.status === 'pending').length;
  const completedCount = filteredTasks.filter(task => task.status === 'completed').length;

  // Function to filter tasks based on selected status
  filteredTasks = selectedStatus
    ? filteredTasks.filter(task => task.status === selectedStatus)
    : filteredTasks;
  ///// END FILTER TASKS ///////



  return (
    <div className='mx-10 my-10'>
      <ConfirmDialogDeleteTask />
      <ConfirmDialogDeleteTag />
      {/* Tag buttons */}
      <div className='flex gap-1 m-2'>
        <button
          className={`btn ${selectedTag === null ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          onClick={() => setSelectedTag(null)}
        >
          All
        </button>

        {Object.entries(
          searchedTasks
            .filter(task => task.tags && task.tags.length > 0)
            .flatMap(task => task.tags)
            .reduce((tagCounts, tag) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              return tagCounts;
            }, {})
        )
          .sort((a, b) => b[1] - a[1]) // Sort by tag count in descending order
          .map(([tag, count]) => (
            <div key={tag} className="relative group">
              <button
                className={`btn ${selectedTag === tag ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag} ({count})
              </button>

              {/* Cross button for removing tag */}
              <button
                className="absolute top-0 right-0 -mt-2 -mr-2 hidden group-hover:inline-block btn btn-xs btn-circle"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering tag selection
                  handleRemoveTag(tag);
                }}
              >
                ✕
              </button>
            </div>
          ))
        }
      </div>

      {/* Status buttons */}
      <div className='flex gap-1 m-2'>
        <button className={`btn ${selectedStatus === null ? 'btn-accent' : 'btn-ghost'} btn-sm`} onClick={() => setSelectedStatus(null)}>All ({totalCount})</button>
        <button className={`btn ${selectedStatus === 'pending' ? 'btn-accent' : 'btn-ghost'} btn-sm`} onClick={() => setSelectedStatus('pending')}>Pending ({pendingCount})</button>
        <button className={`btn ${selectedStatus === 'completed' ? 'btn-accent' : 'btn-ghost'} btn-sm`} onClick={() => setSelectedStatus('completed')}>Completed ({completedCount})</button>
      </div>

      <button className='btn btn-sm btn-error m-2'
        onClick={() => { deleteTasks(filteredTasks.map(task => task.id)) }}
      >
        Delete Tasks in View
      </button>


      {/* Task list */}
      <div className='flex items-center justify-center flex-wrap min-w-[18rem] max-w-4xl gap-2 p-4 mx-auto'>
        <div className='ml-auto sticky top-2 right-0 z-10'>
          <TaskInputModal taskId={newTaskId} btnTxt={'NEW TASK'} handleEditTask={handleEditOrNewTask} />
        </div>
        {filteredTasks.map((task, index) => (
          <Task
            key={task.id}
            taskId={task.id}
            taskTitle={task.title}
            taskDetails={task.details}
            taskTags={task.tags}
            taskStatus={task.status}
            selectedTag={selectedTag}
            handleDelete={deleteTasks}
            handleClickTag={setSelectedTag}
            handleEditTask={handleEditOrNewTask}
            isOpen={index === filteredTasks.length - 1} // Open only for the last item
          />
        ))}
      </div>
    </div>
  );
};

export default Home;