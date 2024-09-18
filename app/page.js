'use client'
import { useState, useEffect, useContext } from 'react';
import Task from '../components/Task'
import TaskInputModal from '../components/TaskInputModal';
import { SearchContext } from '@/context/SearchContext';

const Home = () => {
  const { searchQuery } = useContext(SearchContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const sortTasks = (tasks)=>{
    sortTasks.sort((a, b) => b.latestUpdateTime - a.latestUpdateTime);
  }

  useEffect(() => {
    // Load tasks from localStorage on component mount
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  // Function to update tasks in state and local storage
  const updateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTasks = taskIds => {
    const updatedTasks = tasks.filter(task => !taskIds.includes(task.id));
    updateTasks(updatedTasks);
  };

  const handleEditOrNewTask = (editOrNewTask) => {
    const unaffectedTasks = tasks.filter(task => task.id !== editOrNewTask.id);
    editOrNewTask = {...editOrNewTask, latestUpdateTime: new Date().getTime()}
    updateTasks([...unaffectedTasks, editOrNewTask]);
  }

  // Function to filter tasks based on selected tag
  let filteredTasks = selectedTag
    ? tasks.filter(task => task.tags.includes(selectedTag))
    : tasks;

  // Function to filter tasks based on selected status
  filteredTasks = selectedStatus
  ? filteredTasks.filter(task => task.status === selectedStatus)
  : filteredTasks;

  // Filter tasks using task title/details based on the searchQuery
  // Consider here next time: https://github.com/TheanLim/mock-stackoverflow/blob/main/server/utils/question.js#L79
  if (searchQuery!= ""){
    filteredTasks = filteredTasks.filter(
      task => task.title.includes(searchQuery) || task.details.includes(searchQuery)
    )
  }

  return (
    <div className=' to-primary'>
      {/* Tag buttons */}
      <div className='flex gap-1 m-2'>
        <button className={`btn ${selectedTag === null ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setSelectedTag(null)}>All</button>
        {Object.entries(
          tasks
            .flatMap(task => task.tags)
            .reduce((tagCounts, tag) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              return tagCounts;
            }, {})
        )
          .sort((a, b) => b[1] - a[1]) // Sort by tag count in descending order
          .map(([tag, count]) => (
            <button 
              key={tag} 
              className={`btn ${selectedTag === tag ? 'btn-primary' : 'btn-ghost'} btn-sm`} 
              onClick={() => setSelectedTag(tag)}
            >
              {tag} ({count})
            </button>
          ))
        }
      </div>

      {/* Status buttons */}
      <div className='flex gap-1 m-2'>
        <button className={`btn ${selectedStatus === null ? 'btn-accent' : 'btn-ghost'} btn-sm`} onClick={() => setSelectedStatus(null)}>All</button>
        <button className={`btn ${selectedStatus === 'pending' ? 'btn-accent' : 'btn-ghost'} btn-sm`} onClick={() => setSelectedStatus('pending')}>Pending</button>
        <button className={`btn ${selectedStatus === 'completed' ? 'btn-accent' : 'btn-ghost'} btn-sm`} onClick={() => setSelectedStatus('completed')}>Completed</button>
      </div>

      <button className='btn btn-sm btn-error m-2' 
        onClick={() => {deleteTasks(filteredTasks.map(task => task.id))}}
      >
        Delete Tasks in View
      </button>


      {/* Task list */}
      <div className='flex items-center justify-center flex-wrap min-w-[18rem] max-w-4xl gap-2 p-4 mx-auto'>
        <div className='ml-auto sticky top-2 right-0 z-10'>
          <TaskInputModal btnTxt={'NEW TASK'}  handleEditTask={handleEditOrNewTask}/>
        </div>
        {filteredTasks.map(task => (
            <Task
              key={task.id}
              taskId={task.id}
              taskTitle={task.title}
              taskDetails={task.details}
              taskTags={task.tags}
              taskStatus={task.status}
              handleDelete={deleteTasks}
              handleClickTag={setSelectedTag}
              handleEditTask={handleEditOrNewTask}
            />
          ))}
      </div> 
    </div>     
  );
};

export default Home;